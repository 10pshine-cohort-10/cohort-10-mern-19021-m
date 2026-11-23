const sanitizeHtml = require('sanitize-html');
const Note = require('../models/Note');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * @typedef {import('../validators/noteValidator').CreateNoteInput} CreateNoteInput
 * @typedef {import('../validators/noteValidator').UpdateNoteInput} UpdateNoteInput
 * @typedef {import('../validators/noteValidator').ListNotesQuery} ListNotesQuery
 */

/**
 * @param {string} text
 * @returns {string}
 */
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


/**
 * @template {{ content?: string }} T
 * @param {T} input
 * @returns {T}
 */
const cleanContent = (input) =>
  input.content === undefined ? input : { ...input, content: sanitizeHtml(input.content) };

/**
 * @param {string} userId
 * @param {ListNotesQuery} query
 */
exports.listNotes = async (userId, { search, page, limit }) => {
  const filter = { user: userId };
  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ title: pattern }, { content: pattern }];
  }

  const [items, total] = await Promise.all([
    Note.find(filter)
      .sort({ updatedAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Note.countDocuments(filter),
  ]);

  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
};

/**
 * @param {string} userId
 * @param {string} noteId
 */
exports.getNote = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new AppError(404, 'Note not found');
  }
  return note;
};

/**
 * @param {string} userId
 * @param {CreateNoteInput} input
 */
exports.createNote = async (userId, input) => {
  const note = await Note.create({ ...cleanContent(input), user: userId });
  logger.info({ userId, noteId: note._id }, 'Note created');
  return note;
};

/**
 * @param {string} userId
 * @param {string} noteId
 * @param {UpdateNoteInput} input
 */
exports.updateNote = async (userId, noteId, input) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    cleanContent(input),
    { returnDocument: 'after', runValidators: true }
  );
  if (!note) {
    throw new AppError(404, 'Note not found');
  }
  logger.info({ userId, noteId }, 'Note updated');
  return note;
};

/**
 * @param {string} userId
 * @param {string} noteId
 */
exports.deleteNote = async (userId, noteId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  if (!note) {
    throw new AppError(404, 'Note not found');
  }
  logger.info({ userId, noteId }, 'Note deleted');
};