const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required in the Account"],
      index: true, // Index for faster queries on user field
    },

    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status must be either ACTIVE, FROZEN, or CLOSED",
      },
      default: "ACTIVE",
    },

    currency: {
      type: String,
      required: [true, "Currency is required in the Account"],
      default: "INR",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

accountSchema.index({ user: 1, status: 1 }); // Create an index on the user and status fields for faster lookups.

accountSchema.methods.getBalance = async function () { // Method to calculate the balance of the account using aggregate pipeline to sum DEBIT and CREDIT entries from the ledger. Then, it returns the balance by subtracting total DEBIT from total CREDIT. If there are no ledger entries, it returns 0 as the balance.

  const balanceData = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },

        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] },
      },
    },
  ]);

  if (balanceData.length === 0) {
    return 0; // No ledger entries, balance is 0
  }
  return balanceData[0].balance;
};


const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
