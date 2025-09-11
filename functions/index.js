const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { FirebaseFunctionsRateLimiter } = require("firebase-functions-rate-limiter");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const nodemailer = require("nodemailer");
const resumeData = require("./resumeData");

// Load configuration (if exists)
let config = {};
try {
    config = require("./config");
} catch (error) {
    // Use default values if config file doesn't exist
    config = {
        projectId: process.env.GCP_PROJECT || 'your-project-id',
        email: {
            smtpHost: 'smtp.zoho.com',
            smtpPort: 465,
            useSSL: true,
            recipients: {
                primary: 'your-primary-email@domain.com',
                cc: 'your-cc-email@domain.com'
            }
        },
        secrets: {
            emailCredentials: 'email-credentials',
            emailPassword: 'email-password'
        }
    };
}

admin.initializeApp();
const db = admin.firestore();
const secretClient = new SecretManagerServiceClient();

const pageViewLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
        name: "page_view_limiter",
        maxCalls: 20,
        periodSeconds: 60,
    },
    db
);

const feedbackLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
        name: "feedback_limiter",
        maxCalls: 5,
        periodSeconds: 60,
    },
    db
);

const jobAnalyzerLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
        name: "job_analyzer_limiter",
        maxCalls: 10,
        periodSeconds: 60,
    },
    db
);

const contactFormLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend(
    {
        name: "contact_form_limiter",
        maxCalls: 3,
        periodSeconds: 60,
    },
    db
);

// Helper functions for mathematically significant numbers
const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i = i + 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    if (num <= 1) return false;
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i * i !== num) {
                sum += num / i;
            }
        }
    }
    return sum === num;
};

const isFibonacci = (num) => {
    let a = 0, b = 1;
    while (b < num) {
        let temp = b;
        b = a + b;
        a = temp;
    }
    return b === num;
};

const getMathematicalMessage = (num) => {
    if (isPrime(num)) {
        return `Congratulations! Your visit is the ${num}th, which is a prime number!`;
    }
    if (isPerfect(num)) {
        return `Wow! Your visit is the ${num}th, a perfect number!`;
    }
    if (isFibonacci(num)) {
        return `Fantastic! Your visit is the ${num}th, a Fibonacci number!`;
    }
    return null;
};

// Email helper functions
const getSecret = async (secretName) => {
    try {
        const [version] = await secretClient.accessSecretVersion({
            name: `projects/${config.projectId}/secrets/${secretName}/versions/latest`,
        });
        return version.payload.data.toString();
    } catch (error) {
        console.error(`Error accessing secret ${secretName}:`, error);
        throw error;
    }
};

const sendEmail = async (contactData) => {
    try {
        // Get email credentials from Secret Manager
        const [email, password] = await Promise.all([
            getSecret(config.secrets.emailCredentials),
            getSecret(config.secrets.emailPassword)
        ]);

        // Create transporter
        const transporter = nodemailer.createTransporter({
            host: config.email.smtpHost,
            port: config.email.smtpPort,
            secure: config.email.useSSL,
            auth: {
                user: email,
                pass: password
            }
        });

        // Email content
        const mailOptions = {
            from: email,
            to: config.email.recipients.primary,
            cc: config.email.recipients.cc,
            subject: `Portfolio Contact: ${contactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${contactData.name}</p>
                        <p><strong>Email:</strong> ${contactData.email}</p>
                        <p><strong>Subject:</strong> ${contactData.subject}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
                            ${contactData.message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">
                        This message was sent from your portfolio website contact form.
                    </p>
                </div>
            `
        };

        // Send email
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

exports.pageView = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            await pageViewLimiter.rejectOnQuotaExceededOrRecordUsage(req.ip);

            const docRef = db.collection('pageViews').doc('counter');
            let newCount;
            let message = null;

            const doc = await docRef.get();
            if (!doc.exists) {
                newCount = 1;
            } else {
                newCount = doc.data().count + 1;
            }

            message = getMathematicalMessage(newCount);

            await docRef.set({ count: newCount });

            res.status(200).send({ count: newCount, message: message });
        } catch (error) {
            if (error instanceof functions.https.HttpsError) {
                res.status(429).send(error.message);
            } else {
                console.error('Error updating page view count:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

// This is the actual Cloud Function code
exports.submitFeedback = functions.https.onRequest(async (req, res) => {
    // This handles the CORS preflight requests
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        try {
            await feedbackLimiter.rejectOnQuotaExceededOrRecordUsage(req.ip);

            const { name, email, feedback, rating } = req.body;

            if (!feedback) {
                return res.status(400).send('Feedback message is required.');
            }

            const feedbackEntry = {
                name: name || 'Anonymous',
                email: email || '',
                feedback,
                rating: rating || 0,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            };

            // This adds the data to the 'feedbackCollect' collection
            await db.collection('feedbackCollect').add(feedbackEntry);

            res.status(200).send({ message: 'Feedback submitted successfully.' });

        } catch (error) {
            if (error instanceof functions.https.HttpsError) {
                res.status(429).send(error.message);
            } else {
                console.error('Error submitting feedback:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

// Contact Form Submission Function
exports.submitContactForm = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        try {
            await contactFormLimiter.rejectOnQuotaExceededOrRecordUsage(req.ip);

            const { name, email, subject, message } = req.body;

            if (!name || !email || !subject || !message) {
                return res.status(400).send('All fields are required.');
            }

            const contactEntry = {
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim(),
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                ip: req.ip
            };

            // Store in Firestore
            await db.collection('contactSubmissions').add(contactEntry);

            // Send email notification
            try {
                await sendEmail(contactEntry);
                console.log('Contact form submission and email sent:', contactEntry);
            } catch (emailError) {
                console.error('Email sending failed, but form was saved:', emailError);
                // Don't fail the request if email fails, form is still saved
            }

            res.status(200).send({ message: 'Message sent successfully!' });

        } catch (error) {
            if (error instanceof functions.https.HttpsError) {
                res.status(429).send(error.message);
            } else {
                console.error('Error submitting contact form:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

// Job Description Analyzer Function
exports.analyzeJobDescription = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        try {
            await jobAnalyzerLimiter.rejectOnQuotaExceededOrRecordUsage(req.ip);

            const { jobDescription } = req.body;

            if (!jobDescription || !jobDescription.trim()) {
                return res.status(400).send('Job description is required.');
            }

            // Analyze the job description using resume-based intelligence
            const analysis = analyzeJobDescriptionWithResume(jobDescription);

            // Store the analysis in Firestore for tracking
            const analysisEntry = {
                jobDescription: jobDescription.substring(0, 1000), // Limit length for storage
                analysis,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                ip: req.ip
            };

            await db.collection('jobAnalyses').add(analysisEntry);

            res.status(200).send(analysis);

        } catch (error) {
            if (error instanceof functions.https.HttpsError) {
                res.status(429).send(error.message);
            } else {
                console.error('Error analyzing job description:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    });
});

// Intelligent Resume-based Job Description Analysis
function analyzeJobDescriptionWithResume(jobDescription) {
    const description = jobDescription.toLowerCase();
    
    // Calculate interest score based on resume data
    let interestScore = 0;
    let skillsScore = 0;
    const matchedSkills = [];
    const matchedInterests = [];
    const matchedDisinterests = [];
    
    // Check for technical skills match
    Object.values(resumeData.technicalSkills).flat().forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (description.includes(skillLower)) {
            skillsScore += 1;
            matchedSkills.push(skill);
        }
    });
    
    // Check for interests alignment
    resumeData.interests.forEach(interest => {
        const interestLower = interest.toLowerCase();
        if (description.includes(interestLower)) {
            interestScore += 2; // Higher weight for interests
            matchedInterests.push(interest);
        }
    });
    
    // Check for disinterests (negative scoring)
    resumeData.disinterests.forEach(disinterest => {
        const disinterestLower = disinterest.toLowerCase();
        if (description.includes(disinterestLower)) {
            interestScore -= 3; // Higher negative weight for disinterests
            matchedDisinterests.push(disinterest);
        }
    });
    
    // Check for location preferences
    const locationScore = checkLocationPreferences(description);
    interestScore += locationScore;
    
    // Check for salary requirements
    const salaryScore = checkSalaryRequirements(description);
    interestScore += salaryScore;
    
    // Check for seniority level
    const seniorKeywords = ['senior', 'lead', 'principal', 'architect', 'staff', 'director'];
    const juniorKeywords = ['junior', 'entry', 'intern', 'trainee', 'associate'];
    
    let seniorityScore = 0;
    seniorKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
            seniorityScore += 2;
        }
    });
    
    juniorKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
            seniorityScore -= 2;
        }
    });
    
    interestScore += seniorityScore;
    
    // Check for domain alignment
    const dataEngineeringKeywords = [
        'data engineer', 'data engineering', 'etl', 'data pipeline', 'data warehouse',
        'big data', 'data architecture', 'data infrastructure', 'data platform'
    ];
    
    let domainScore = 0;
    dataEngineeringKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
            domainScore += 3; // High weight for domain alignment
        }
    });
    
    interestScore += domainScore;
    
    // Determine final scores
    const finalInterestScore = Math.max(0, Math.min(10, interestScore));
    const finalSkillsScore = Math.max(0, Math.min(10, skillsScore));
    
    const isInterested = finalInterestScore >= 6;
    const skillsMatch = finalSkillsScore >= 4;
    
    // Generate intelligent reasoning based on analysis
    const qualificationReasons = generateIntelligentQualificationReasons(matchedSkills, matchedInterests, domainScore, seniorityScore, locationScore, salaryScore);
    const disinterestReasons = generateIntelligentDisinterestReasons(matchedDisinterests, seniorityScore, domainScore, locationScore, salaryScore);
    
    return {
        isInterested,
        skillsMatch,
        interestScore: finalInterestScore,
        skillsScore: finalSkillsScore,
        qualificationReasons,
        disinterestReasons
    };
}

// Fallback static analysis function
function analyzeJobDescriptionStatic(jobDescription) {
    const description = jobDescription.toLowerCase();
    
    // Define keywords and patterns for interest analysis
    const interestKeywords = [
        'data engineer', 'data engineering', 'etl', 'data pipeline', 'data warehouse',
        'big data', 'spark', 'hadoop', 'kafka', 'airflow', 'python', 'sql',
        'cloud', 'aws', 'gcp', 'azure', 'machine learning', 'ml', 'ai',
        'senior', 'lead', 'principal', 'architect', 'scalable', 'distributed',
        'real-time', 'streaming', 'analytics', 'business intelligence', 'bi'
    ];

    const disinterestKeywords = [
        'frontend', 'react', 'angular', 'vue', 'javascript', 'css', 'html',
        'ui/ux', 'designer', 'marketing', 'sales', 'hr', 'recruiter',
        'junior', 'intern', 'entry level', 'no experience', 'trainee',
        'customer service', 'support', 'admin', 'clerical'
    ];

    // Define skills keywords
    const skillsKeywords = [
        'python', 'sql', 'spark', 'hadoop', 'kafka', 'airflow', 'docker',
        'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'jenkins',
        'git', 'linux', 'bash', 'pandas', 'numpy', 'scikit-learn',
        'tensorflow', 'pytorch', 'postgresql', 'mysql', 'mongodb',
        'redis', 'elasticsearch', 'tableau', 'power bi', 'looker'
    ];

    // Calculate interest score
    let interestScore = 0;
    interestKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
            interestScore += 1;
        }
    });

    disinterestKeywords.forEach(keyword => {
        if (description.includes(keyword)) {
            interestScore -= 1;
        }
    });

    // Calculate skills match score
    let skillsScore = 0;
    skillsKeywords.forEach(skill => {
        if (description.includes(skill)) {
            skillsScore += 1;
        }
    });

    // Determine interest level
    const isInterested = interestScore > 2;
    const skillsMatch = skillsScore > 3;

    // Generate reasoning
    const qualificationReasons = generateQualificationReasons(description, skillsScore);
    const disinterestReasons = generateDisinterestReasons(description, interestScore);

    return {
        isInterested,
        skillsMatch,
        interestScore,
        skillsScore,
        qualificationReasons,
        disinterestReasons
    };
}

function generateQualificationReasons(description, skillsScore) {
    const reasons = [];
    
    if (description.includes('python')) {
        reasons.push('• Strong Python expertise with 5+ years of experience in data engineering');
    }
    if (description.includes('sql')) {
        reasons.push('• Advanced SQL skills for complex data transformations and analytics');
    }
    if (description.includes('spark') || description.includes('hadoop')) {
        reasons.push('• Extensive experience with big data technologies (Spark, Hadoop)');
    }
    if (description.includes('aws') || description.includes('gcp') || description.includes('azure')) {
        reasons.push('• Cloud platform expertise with hands-on experience in AWS/GCP/Azure');
    }
    if (description.includes('etl') || description.includes('data pipeline')) {
        reasons.push('• Proven track record in building scalable ETL pipelines and data architectures');
    }
    if (description.includes('senior') || description.includes('lead')) {
        reasons.push('• Senior-level experience with leadership and mentoring capabilities');
    }
    if (description.includes('machine learning') || description.includes('ml')) {
        reasons.push('• Experience with machine learning workflows and MLOps practices');
    }
    
    if (reasons.length === 0) {
        reasons.push('• Strong foundation in data engineering principles and best practices');
        reasons.push('• Adaptable and quick learner with proven ability to master new technologies');
    }
    
    return reasons.join('\n');
}

function generateDisinterestReasons(description, interestScore) {
    const reasons = [];
    
    if (description.includes('frontend') || description.includes('react') || description.includes('angular')) {
        reasons.push('• Role focuses on frontend development, which is outside my core expertise');
    }
    if (description.includes('junior') || description.includes('entry level')) {
        reasons.push('• Position is for junior/entry level, seeking more senior opportunities');
    }
    if (description.includes('marketing') || description.includes('sales')) {
        reasons.push('• Role is in marketing/sales domain, not aligned with technical data engineering focus');
    }
    if (description.includes('ui/ux') || description.includes('designer')) {
        reasons.push('• Position requires UI/UX design skills, which is not my area of specialization');
    }
    if (description.includes('customer service') || description.includes('support')) {
        reasons.push('• Role involves customer service/support, seeking technical engineering positions');
    }
    
    if (reasons.length === 0 && interestScore <= 0) {
        reasons.push('• Job requirements do not align with my data engineering specialization');
        reasons.push('• Seeking roles that leverage my technical expertise in data platforms and analytics');
    }
    
    return reasons.length > 0 ? reasons.join('\n') : '• Role appears to be a good fit based on the job description';
}

// Generate intelligent qualification reasons based on resume analysis
function generateIntelligentQualificationReasons(matchedSkills, matchedInterests, domainScore, seniorityScore, locationScore, salaryScore) {
    const reasons = [];
    
    // Skills-based reasons
    if (matchedSkills.length > 0) {
        reasons.push(`• Strong technical expertise in: ${matchedSkills.slice(0, 5).join(', ')}`);
    }
    
    // Domain alignment
    if (domainScore > 0) {
        reasons.push('• Perfect domain alignment with data engineering specialization');
        reasons.push('• Extensive experience in building scalable data solutions and ETL pipelines');
    }
    
    // Seniority level
    if (seniorityScore > 0) {
        reasons.push('• Senior-level experience with leadership and mentoring capabilities');
        reasons.push('• Proven track record in architecting large-scale data systems');
    }
    
    // Interest alignment
    if (matchedInterests.length > 0) {
        reasons.push(`• High interest in: ${matchedInterests.slice(0, 3).join(', ')}`);
    }
    
    // Location alignment
    if (locationScore > 0) {
        reasons.push('• Position is in preferred San Francisco Bay Area location');
    }
    
    // Salary alignment
    if (salaryScore > 0) {
        reasons.push('• Compensation meets minimum requirements (Base ≥ $170k, Total ≥ $250k)');
    }
    
    // General qualifications
    reasons.push('• 5+ years of hands-on experience in data engineering');
    reasons.push('• Strong foundation in cloud platforms (AWS, GCP, Azure)');
    reasons.push('• Experience with modern data stack and best practices');
    
    return reasons.join('\n');
}

// Generate intelligent disinterest reasons based on resume analysis
function generateIntelligentDisinterestReasons(matchedDisinterests, seniorityScore, domainScore, locationScore, salaryScore) {
    const reasons = [];
    
    // Disinterest matches
    if (matchedDisinterests.length > 0) {
        reasons.push(`• Role involves areas outside core expertise: ${matchedDisinterests.slice(0, 3).join(', ')}`);
    }
    
    // Seniority mismatch
    if (seniorityScore < 0) {
        reasons.push('• Position is for junior/entry level, seeking senior opportunities');
        reasons.push('• Looking for roles that leverage 5+ years of experience');
    }
    
    // Domain mismatch
    if (domainScore === 0) {
        reasons.push('• Role is not in data engineering domain');
        reasons.push('• Seeking positions that align with technical data expertise');
    }
    
    // Location mismatch
    if (locationScore < 0) {
        if (locationScore === -4) {
            reasons.push('• Position is fully remote, prefer San Francisco Bay Area locations');
        } else {
            reasons.push('• Position is outside preferred San Francisco Bay Area location');
        }
    }
    
    // Salary mismatch
    if (salaryScore < 0) {
        reasons.push('• Compensation below minimum requirements (Base < $170k, Total < $250k)');
        reasons.push('• Seeking roles that match senior-level compensation expectations');
    }
    
    // Default if no specific disinterests
    if (reasons.length === 0) {
        reasons.push('• Role appears to be a good fit based on the analysis');
    }
    
    return reasons.join('\n');
}

// Check location preferences
function checkLocationPreferences(description) {
    const preferredLocation = resumeData.personalInfo.preferredLocation.toLowerCase();
    const descriptionLower = description.toLowerCase();
    
    // Check for San Francisco Bay Area keywords
    const bayAreaKeywords = [
        'san francisco', 'sf', 'bay area', 'silicon valley', 'palo alto', 
        'mountain view', 'sunnyvale', 'cupertino', 'san jose', 'fremont',
        'hayward', 'oakland', 'berkeley', 'san mateo', 'redwood city'
    ];
    
    const remoteKeywords = [
        'remote', 'work from home', 'wfh', 'distributed', 'virtual',
        'anywhere', 'global', 'worldwide'
    ];
    
    // Check for Bay Area location
    const hasBayArea = bayAreaKeywords.some(keyword => descriptionLower.includes(keyword));
    const hasRemote = remoteKeywords.some(keyword => descriptionLower.includes(keyword));
    
    if (hasBayArea) {
        return 2; // Positive score for Bay Area
    } else if (hasRemote) {
        return -4; // Strong negative score for remote-only
    } else {
        return -2; // Negative score for other locations
    }
}

// Check salary requirements
function checkSalaryRequirements(description) {
    const descriptionLower = description.toLowerCase();
    const baseSalary = resumeData.personalInfo.salaryRequirements.baseSalary;
    const totalComp = resumeData.personalInfo.salaryRequirements.totalCompensation;
    
    // Extract salary information from job description
    const salaryPatterns = [
        /\$(\d{1,3}(?:,\d{3})*(?:k|000)?)/g,
        /(\d{1,3}(?:,\d{3})*(?:k|000)?)\s*(?:base|salary|compensation)/g,
        /base\s*(?:salary)?\s*\$?(\d{1,3}(?:,\d{3})*(?:k|000)?)/g
    ];
    
    let foundSalaries = [];
    salaryPatterns.forEach(pattern => {
        const matches = descriptionLower.match(pattern);
        if (matches) {
            foundSalaries = foundSalaries.concat(matches);
        }
    });
    
    if (foundSalaries.length === 0) {
        return 0; // No salary info, neutral
    }
    
    // Parse and check salaries
    let hasGoodSalary = false;
    foundSalaries.forEach(salary => {
        const numericValue = parseSalary(salary);
        if (numericValue >= baseSalary) {
            hasGoodSalary = true;
        }
    });
    
    return hasGoodSalary ? 1 : -3; // Positive for good salary, negative for low salary
}

// Parse salary string to numeric value
function parseSalary(salaryStr) {
    const cleanStr = salaryStr.replace(/[$,]/g, '').toLowerCase();
    
    if (cleanStr.includes('k')) {
        return parseInt(cleanStr.replace('k', '')) * 1000;
    } else if (cleanStr.includes('000')) {
        return parseInt(cleanStr.replace('000', '')) * 1000;
    } else {
        return parseInt(cleanStr) || 0;
    }
}