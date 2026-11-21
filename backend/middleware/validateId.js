const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

/** @type {import('express').RequestHandler} */
module.exports = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new AppError(400, 'Invalid note id'));
  }
  next();
};