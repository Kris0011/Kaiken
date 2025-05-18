const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
     name: { type: String, required: true },
     description: { type: String, required: true },
     startTime: { type: Date, required: true },
     image: { type: String, default: null },
     // odds: { type: Object, required: true },

     // Market price
     currentYesPrice: { type: Number, default: 0.5 }, // 50% YES, 50% NO by default

     // Volume for both sides
     totalYesVolume: { type: Number, default: 0 },
     totalNoVolume: { type: Number, default: 0 },

     // Event lifecycle
     status: {
          type: String,
          enum: ['upcoming', 'live', 'resolved'],
          default: 'upcoming'
     },

     // Outcome: 'yes' | 'no'
     winningOutcome: { type: String, enum: ['yes', 'no', null], default: null }

}, { timestamps: true });

EventSchema.index({ status: 1 });
EventSchema.index({ name: 1 });

module.exports = mongoose.model('Event', EventSchema);
