const mongoose = require('mongoose');

/**
 * @typedef {Object} NoteFields
 * @property {import('mongoose').Types.ObjectId} user
 * @property {string} title
 * @property {string} content
 */

/** @type {import('mongoose').Schema<NoteFields>} */
const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        /** @type {(value: string) => boolean} */
        validator: (value) => Array.from(value).length <= 100,
        message: 'Title must be at most 100 characters',
      },
    },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);