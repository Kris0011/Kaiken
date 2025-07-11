const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
     username: {
          type: String,
          required: true,
          unique: true,
          index: true
     },

     email: {
          type: String,
          required: true,
          unique: true
     },

     password: {
          type: String,
          required: true
     },

     role: {
          type: String,
          enum: ['admin', 'user'],
          default: 'user'
     },

     walletBalance: { type: Number, default: 1000 }
}, { timestamps: true });

UserSchema.index({ username: 1 });

module.exports = mongoose.model('User', UserSchema);
