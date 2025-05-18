const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          index: true
     },

     event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
          required: true
     },

     amount: { type: Number, required: true },

     // 'yes' or 'no'
     selection: {
          type: String,
          enum: ['yes', 'no'],
          required: true
     },

     // Market price at the time of the trade
     price: { type: Number, required: true },

     // Status of trade
     status: {
          type: String,
          enum: ['pending', 'won', 'lost'],
          default: 'pending'
     },

     // Payout status
     paidOut: {
          type: Boolean,
          default: false
     }

}, { timestamps: true });

TradeSchema.index({ user: 1 });
TradeSchema.index({ event: 1 });
TradeSchema.index({ status: 1 });
TradeSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Trade', TradeSchema);
