const mongoose = require('mongoose');

/**
 * @typedef {Object} UserFields
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/** @type {import('mongoose').Schema<UserFields>} */

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);