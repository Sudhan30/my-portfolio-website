const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

const db = admin.firestore();

exports.submitFeedback = functions.https.onRequest((req, res) => {
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

            await db.collection('feedback').add(feedbackEntry);

            res.status(200).send({ message: 'Feedback submitted successfully.' });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});
