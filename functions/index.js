const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// This initializes the Admin SDK and connects to Firestore
admin.initializeApp();
const db = admin.firestore();

// This is the actual Cloud Function code
exports.submitFeedback = (req, res) => {
    // This handles the CORS preflight requests
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        try {
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

            // This adds the data to the 'feedback' collection in Firestore
            await db.collection('feedbackCollect').add(feedbackEntry);

            res.status(200).send({ message: 'Feedback submitted successfully.' });

        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).send('Internal Server Error');
        }
    });
};