const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(express.json());

// Add your Supabase credentials here
const supabase = createClient(
  'https://dljpzzlzxtbxfonwpinn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanB6emx6eHRieGZvbndwaW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTAzMTIsImV4cCI6MjA3ODAyNjMxMn0.I6o3QCGk38emhXU-PX3Ymv2YoreZj_IG_-OP7HZrfzY'
);

app.get('/api/ogads-postback', async (req, res) => {
    console.log('📨 OGAds Postback Received:', req.query);
    
    const { offer_id, amount, transaction_id, user_id, status } = req.query;
    
    console.log('Offer ID:', offer_id);
    console.log('Amount:', amount);
    console.log('User ID:', user_id);
    console.log('Status:', status);

    // Only credit if offer is completed
    if (status === 'completed' && user_id && amount) {
        try {
            // Update user's pending balance in Supabase
            const { data, error } = await supabase
                .from('user_balances')
                .update({
                    pending_balance: supabase.rpc('increment', { x: parseFloat(amount) })
                })
                .eq('user_id', user_id);

            if (error) {
                console.error('❌ Database error:', error);
            } else {
                console.log('✅ User credited successfully:', user_id, amount);
            }
        } catch (error) {
            console.error('❌ Error crediting user:', error);
        }
    }
    
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Postback server running on port ${PORT}`);
});
