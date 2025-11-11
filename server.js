const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/ogads-postback', (req, res) => {
    console.log('📨 OGAds Postback Received:', req.query);
    const { offer_id, amount, transaction_id, user_id, status } = req.query;
    console.log('Offer ID:', offer_id);
    console.log('Amount:', amount);
    console.log('User ID:', user_id);
    console.log('Status:', status);
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Postback server running on port ${PORT}`);
});