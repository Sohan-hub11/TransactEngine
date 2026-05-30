const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required in the Account'],
    index: true, // Index for faster queries on user field
  },

  status: {
    type: String,
    enum: {
      values: ['ACTIVE', 'FROZEN', 'CLOSED'],
      message: 'Status must be either ACTIVE, FROZEN, or CLOSED',
    },
    default: 'ACTIVE',
  },

  currency: {
    type: String,
    required: [true, 'Currency is required in the Account'],
    default: 'INR',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

accountSchema.index({ user: 1, status: 1 }); // Create an index on the user and status fields for faster lookups.

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;