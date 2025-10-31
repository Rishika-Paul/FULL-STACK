const mongoose = require('mongoose');
const { Account } = require('./app'); // use the model from app.js

const mongoURI = 'mongodb+srv://rishikapaul335_db_user:Tizyg0z1alfjANt6@cluster0.kxquzlx.mongodb.net/productDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const demoAccounts = [
  { username: 'alice', balance: 1000 },
  { username: 'bob', balance: 500 },
  { username: 'charlie', balance: 300 }
];

(async () => {
  try {
    await Account.deleteMany({});
    await Account.insertMany(demoAccounts);
    console.log('✅ Accounts created successfully!');
    console.log('Accounts available:');
    demoAccounts.forEach(acc => console.log(`→ ${acc.username} (Balance: ₹${acc.balance})`));
  } catch (err) {
    console.error('Error while seeding accounts:', err);
  } finally {
    await mongoose.disconnect();
  }
})();
