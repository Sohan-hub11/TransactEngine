const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'From Account must be associated with the Transaction'],
    index: true, // Index for faster queries on fromAccount field
  },

  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'To Account must be associated with the Transaction'],
    index: true, // Index for faster queries on toAccount field
  },

  status: {
    type: String,
    enum: {
      values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      message: 'Status must be one of PENDING, COMPLETED, FAILED, or REVERSED'
    },
    default: 'PENDING'
  },

  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0, 'Transaction amount must be a positive number']
  },

  idempotencyKey: {
    type: String,
    required: [true, 'Idempotency key is required for the transaction'],
    unique: true, // Ensure idempotency key is unique to prevent duplicate transactions
    index: true // Index for faster queries on idempotencyKey field
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});


const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;