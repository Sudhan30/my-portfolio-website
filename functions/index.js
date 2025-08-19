const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { FirebaseFunctionsRateLimiter } = require("firebase-functions-rate-limiter");

admin.initializeApp();
const db = admin.firestore();

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

            const { name, email, feedback } = req.body;

            if (!feedback) {
                return res.status(400).send('Feedback message is required.');
            }

            const feedbackEntry = {
                name: name || '',
                email: email || '',
                feedback,
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