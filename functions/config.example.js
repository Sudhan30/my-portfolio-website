// Example configuration file for email setup
// Copy this file to config.js and update with your actual values
// DO NOT commit config.js to version control

module.exports = {
    // Your Google Cloud Project ID
    projectId: 'your-project-id',
    
    // Email configuration
    email: {
        // SMTP host for your email provider
        // Common providers:
        // - Gmail: smtp.gmail.com
        // - Outlook: smtp-mail.outlook.com
        // - Zoho: smtp.zoho.com
        // - Yahoo: smtp.mail.yahoo.com
        smtpHost: 'smtp.zoho.com',
        
        // SMTP port (usually 465 for SSL or 587 for TLS)
        smtpPort: 465,
        
        // Whether to use SSL (true for port 465, false for port 587)
        useSSL: true,
        
        // Note: Recipient email addresses are now stored in Google Secret Manager
        // as 'email-recipient-primary' and 'email-recipient-cc' secrets
    },
    
    // Secret names in Google Secret Manager
    secrets: {
        emailCredentials: 'email-credentials',
        emailPassword: 'email-password'
    }
};
