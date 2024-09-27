const midtransClient = require('midtrans-client');
require("dotenv").config();

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
});

const createMidtransTransaction = async (req, res) => {
        console.log('Request Body:', req.body);
        console.log('MIDTRANS_SERVER_KEY:', process.env.MIDTRANS_SERVER_KEY); 
    const { orderId, grossAmount, firstName, lastName, email, phone } = req.body;
    const parameter = {
        "transaction_details": {
            "order_id": orderId,
            "gross_amount": grossAmount
        },
        "credit_card": {
            "secure": true
        },
        "customer_details": {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "phone": phone
        }
    };
    try {
        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;
        console.log('transactionToken:', transactionToken);
        res.status(200).json({ success: true, transactionToken });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ success: false, message: 'Failed to create transaction', error });
    }
};

module.exports = { createMidtransTransaction };
