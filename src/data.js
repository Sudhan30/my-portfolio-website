import { Code, Zap, Database, Cloud, Brain, BarChart, GitBranch, Briefcase, Lightbulb, Settings, Cpu } from 'lucide-react';

export const skills = [
    { category: 'Programming', icon: Code, skills: ['Python', 'Scala', 'Java'] },
    { category: 'BI/ETL/Reporting Tools', icon: BarChart, skills: ['Tableau', 'Power BI', 'Looker', 'SAP Business Objects', 'IBM Cognos'] },
    { category: 'Big Data', icon: Zap, skills: ['Spark', 'Hadoop', 'Hive', 'Flink', 'Kafka', 'Airflow', 'NiFi', 'Trino/Presto', 'Apache Iceberg', 'Hudi'] },
    { category: 'Data Science Skills', icon: Brain, skills: ['Regression Techniques', 'Neural Networks', 'ANOVA', 'Hypothesis Testing', 'Time Series Analysis', 'Data Mining', 'Data Visualization', 'Predictive Analytics', 'Deep Learning', 'Computer Vision'] },
    { category: 'Databases', icon: Database, skills: ['Presto', 'Cosmos DB', 'Microsoft SQL Server', 'MySQL', 'Oracle', 'Teradata', 'MongoDB'] },
    { category: 'Cloud Technologies', icon: Cloud, skills: ['Google Cloud Platform', 'BigQuery', 'DataProc', 'Google Cloud Storage (GCS)', 'Cloud SQL', 'Firestore', 'AWS', 'Azure'] },
    { category: 'CI/CD Automation', icon: GitBranch, skills: ['GitHub Actions', 'FluxCD (GitOps)'] },
    { category: 'DevOps & Infrastructure', icon: Settings, skills: ['Kubernetes (k3s, GKE)', 'Docker', 'Helm', 'Prometheus', 'Grafana', 'OpenTelemetry', 'Cloudflare', 'Kustomize', 'YAML', 'Git', 'Linux'] },
    { category: 'Machine Learning / AI', icon: Cpu, skills: ['TensorFlow', 'PyTorch', 'scikit-learn', 'Hugging Face', 'MLflow', 'Feature Engineering & Feature Stores', 'Model Serving (FastAPI/Flask)', 'Computer Vision', 'Generative AI Workflows'] },
];

export const experiences = [
    {
        title: 'Senior Data Engineer',
        company: 'Walmart Global Tech, Sunnyvale',
        duration: 'March 2022 - Present',
        icon: Briefcase,
        projects: [
            {
                name: 'Automated Data Pipelines & Customer Data Marts',
                description: 'Spearheaded the identification and integration of valuable data sources, architecting and implementing automated data pipelines utilizing Spark, Scala, and Airflow, enriching customer-specific data marts to serve diverse business needs.',
                impact: 'Improved data accessibility and insights for various business functions.'
            },
            {
                name: 'Affiliate Data Pipeline for Walmart Business',
                description: 'Independently designed, built, and deployed an affiliate data pipeline for Walmart Business.',
                impact: 'Resulted in 4.9M new user visits and a $5.4M increase in GMV within the first year of production.'
            },
            {
                name: 'Real-time Fraud Prevention Pipeline',
                description: 'Engineered a real-time data pipeline incorporating advanced validation mechanisms to detect and prevent fraudulent sign-up activity.',
                impact: 'Resulted in $30,000 in average daily savings.'
            },
            {
                name: 'Walmart Business & Salesforce Integration',
                description: 'Orchestrated the consolidation of multifaceted Walmart Business (WMB) customer data, synchronizing customer information with Salesforce to provide a unified, comprehensive view.',
                impact: 'Facilitated informed decision-making for the WMB sales team and streamlined operational efficiency.'
            },
            {
                name: 'Customer Events & Profiles Analysis',
                description: 'Conducted in-depth analysis and reporting on customer events and profiles, offering strategic recommendations for site enhancements and contributing to root cause analysis efforts.',
                impact: 'Supported business and product initiatives, leading to data-driven improvements.'
            },
            {
                name: 'NiFi/Spark Data Pipelines for Revenue Growth',
                description: 'Delivered $1M+ in new monthly revenue by implementing NiFi/Spark data pipelines to integrate Walmart Business and Salesforce systems.',
                impact: 'Enabled automated customer communication for new and expanding business opportunities, capturing high-value, GMV-driving contracts.'
            }
        ]
    },
    {
        title: 'Business Intelligence Engineer',
        company: 'Google (Contractor), Sunnyvale',
        duration: 'August 2020 - March 2022',
        icon: Lightbulb,
        projects: [
            {
                name: 'BI Solution for Google Data Center Supply Chain',
                description: 'Built and managed a BI solution to visualize purchase orders and vendor invoices for worldwide Google Data Center supply chain operations.',
                impact: 'Provided critical visibility into supply chain financials.'
            },
            {
                name: 'Python Script Optimization (HDFS to Google Sheets)',
                description: 'Optimized a Python script to run 10x faster, used across Google to load data from HDFS to Google Sheets.',
                impact: 'Significantly improved data loading efficiency.'
            },
            {
                name: 'Python ETL Framework for Data Center Planning',
                description: 'Implemented a Python ETL framework to automate the process of extracting and cleansing data from 700+ data collection sheets into a BI Dashboard.',
                impact: 'Helped visualize and plan new data center construction operations.'
            },
            {
                name: 'Data Analysis for Infrastructure Optimization',
                description: 'Performed various Data Analysis using SQL and Python.',
                impact: 'Optimized and improved the efficiency of Google Data Center infrastructure and operations.'
            },
            {
                name: 'Tableau Dashboards for Self-Service Reports',
                description: 'Built Tableau Dashboards to create self-service reports for various stakeholders.',
                impact: 'Empowered stakeholders to make strategic business decisions independently.'
            },
            {
                name: 'Data Object & Report Migration',
                description: 'Facilitated the migration of 13 data objects, retrofitted 48 reports & 40+ data tables, and enabling integration of 4 boundary systems.',
                impact: 'Ensured seamless transition and continued data availability.'
            }
        ]
    },
    {
        title: 'Data Analyst Intern',
        company: 'Ericsson, Plano, Texas',
        duration: 'September 2019 - May 2020',
        icon: Briefcase,
        projects: [
            {
                name: 'Automated Analytical Reports',
                description: 'Extracted data from various sites and automated analytical reports to manage 11 teams.',
                impact: 'Saved 12-15 hours per week in manual reporting efforts.'
            },
            {
                name: 'Analytics Platform for Business Recommendations',
                description: 'Designed and implemented analytics platform to provide recommendations to strategic business specific to Ericsson North America.',
                impact: 'Enabled data-driven strategic decision-making.'
            },
            {
                name: 'Network Performance Data Transformation',
                description: 'Transformed network performance data utilizing open-source datasets and provided performance metric insights for customers.',
                impact: 'Optimized network product and maintenance based on performance data.'
            },
            {
                name: 'Web Scraping & Data Integration',
                description: 'Extracted data from third-party websites by Web scraping, web crawling and integrated it with existing tower data in the data lake.',
                impact: 'Avoided data discrepancies and thereby saving revenue.'
            },
            {
                name: 'TensorFlow Models for 5G Implementations',
                description: 'Deployed TensorFlow models to detect and identify cars, objects, and poles for 5G implementations.',
                impact: 'Enhanced capabilities for 5G infrastructure development.'
            },
            {
                name: 'Image Auto-Labeling with Feature Matching',
                description: 'Enforced auto labeling of images by using Feature matching technique.',
                impact: 'Saved manual effort hours by 50%.'
            }
        ]
    },
    {
        title: 'Business Intelligence Consultant',
        company: 'Cognizant Technology Solutions, Chennai',
        duration: 'June 2014 - June 2018',
        icon: Briefcase,
        projects: [
            {
                name: 'Use Case Scenarios & Database Queries',
                description: 'Designed use case scenarios, complex database queries and test plans for generating business insights across various clients such as automobile, pharmaceutical, retail and entertainment.',
                impact: 'Provided foundational insights for diverse client needs.'
            },
            {
                name: 'SQL ETL Framework for Chat Helpdesk',
                description: 'Built an SQL ETL framework to parse unstructured data into a data table that can be better visualized on a dashboard.',
                impact: 'Improved the chat helpdesk system overall ticket resolution count by approximately 30%.'
            },
            {
                name: 'Client & Development Team Coordination',
                description: 'Coordinated with clients and development teams to translate business requirements into strategic solutions.',
                impact: 'Ensured alignment between business needs and technical implementation.'
            },
            {
                name: 'Business Automation & Contract Initiation',
                description: 'Initiated contracts with clients and identified opportunities to develop and automate existing business.',
                impact: 'Drove new business opportunities and operational efficiencies.'
            },
            {
                name: 'Team Leadership & BI Reporting',
                description: 'Led a team of 10 developers for a project of $5M and delivered month-over-month BI reports and dashboards.',
                impact: 'Successfully managed large-scale BI projects and reporting cycles.'
            },
            {
                name: 'Mobile Dashboards & SAP BO Migration',
                description: 'Conceptualized and created three mobile dashboards and facilitated the migration of SAP BO reports to new versions.',
                impact: 'Enhanced mobile accessibility of insights and modernized reporting infrastructure.'
            }
        ]
    }
];
