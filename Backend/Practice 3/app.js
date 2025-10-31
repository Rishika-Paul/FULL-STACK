const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
const mongoURI = 'mongodb+srv://rishikapaul335_db_user:Tizyg0z1alfjANt6@cluster0.kxquzlx.mongodb.net/productDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 }
});

const Account = mongoose.model('Account', accountSchema);

app.post('/transfer', async (req, res) => {
    const { from, to, amount } = req.body;

    if (!from || !to || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid transfer data' });
    }

    try {
        const sender = await Account.findOne({ username: from });
        const receiver = await Account.findOne({ username: to });

        if (!sender) return res.status(404).json({ error: 'Sender account not found' });
        if (!receiver) return res.status(404).json({ error: 'Receiver account not found' });
        if (sender.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        res.json({
            message: `Transferred ${amount} from ${from} to ${to}`,
            senderBalance: sender.balance,
            receiverBalance: receiver.balance
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});
app.use(express.static(__dirname));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { Account };
