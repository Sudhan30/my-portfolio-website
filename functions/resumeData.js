// Structured resume data for LLM context
const resumeData = {
    personalInfo: {
        name: "Sudharsana Rajasekaran",
        title: "Staff Data Engineer",
        experience: "5+ years",
        location: "San Francisco Bay Area",
        preferredLocation: "San Francisco Bay Area",
        salaryRequirements: {
            baseSalary: 170000,
            totalCompensation: 250000
        }
    },
    
    summary: "Experienced Staff Data Engineer with 5+ years of expertise in building scalable data solutions, ETL pipelines, and driving business insights. Passionate about leveraging big data technologies to solve complex business problems and optimize data workflows.",
    
    technicalSkills: {
        programming: ["Python", "SQL", "Bash", "JavaScript"],
        bigData: ["Apache Spark", "Hadoop", "Kafka", "Airflow", "DBeaver"],
        cloud: ["AWS", "Google Cloud Platform", "Azure"],
        databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"],
        tools: ["Docker", "Kubernetes", "Terraform", "Jenkins", "Git"],
        analytics: ["Tableau", "Power BI", "Looker"],
        ml: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch"]
    },
    
    experience: [
        {
            title: "Staff Data Engineer",
            company: "Current Role",
            duration: "Recent",
            keyProjects: [
                "Built scalable ETL pipelines processing millions of records daily",
                "Implemented real-time data streaming solutions using Kafka and Spark",
                "Designed and optimized data warehouse architectures",
                "Led cross-functional teams in data migration projects",
                "Developed automated data quality monitoring systems"
            ],
            technologies: ["Python", "Spark", "Kafka", "AWS", "PostgreSQL", "Airflow"]
        }
    ],
    
    interests: [
        "Data Engineering",
        "Big Data Technologies", 
        "Cloud Platforms",
        "Machine Learning",
        "Real-time Analytics",
        "Data Architecture",
        "ETL/ELT Pipelines",
        "Senior/Lead Roles",
        "Technical Leadership",
        "Scalable Systems"
    ],
    
    disinterests: [
        "Frontend Development (React, Angular, Vue)",
        "UI/UX Design",
        "Marketing Roles",
        "Sales Positions",
        "Junior/Entry Level",
        "Intern Roles",
        "Customer Service",
        "Administrative Tasks",
        "Non-technical Roles",
        "Jobs Outside San Francisco Bay Area",
        "Base Salary Less Than $170k",
        "Total Compensation Less Than $250k",
        "Full Remote Jobs"
    ],
    
    careerGoals: [
        "Lead data engineering teams",
        "Architect large-scale data solutions",
        "Mentor junior engineers",
        "Work with cutting-edge data technologies",
        "Drive data strategy and best practices"
    ]
};

module.exports = resumeData;
