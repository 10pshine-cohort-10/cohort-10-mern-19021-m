const AppError = require('../utils/AppError');

/**
 * Checks req.body against a zod schema.
 * @param {import('zod').ZodType} schema
 * @returns {import('express').RequestHandler}
 */
module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new AppError(400, result.error.issues[0].message));
  }
  req.body = result.data;
  next();
};