const noteService = require('../services/noteService');
const AppError = require('../utils/AppError');
const { listQuerySchema } = require('../validators/noteValidator');

/** @type {import('express').RequestHandler} */
exports.list = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.issues[0].message));
    }
    const result = await noteService.listNotes(req.userId, parsed.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/** @type {import('express').RequestHandler} */
exports.get = async (req, res, next) => {
  try {
    const note = await noteService.getNote(req.userId, req.params.id);
    res.json(note);
  } catch (err) {
    next(err);
  }
};

/** @type {import('express').RequestHandler} */
exports.create = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.userId, req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

/** @type {import('express').RequestHandler} */
exports.update = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(req.userId, req.params.id, req.body);
    res.json(note);
  } catch (err) {
    next(err);
  }
};

/** @type {import('express').RequestHandler} */
exports.remove = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};