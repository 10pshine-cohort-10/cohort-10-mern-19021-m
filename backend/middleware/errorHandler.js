const logger = require('../utils/logger');

/** @type {import('express').ErrorRequestHandler} */
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;


  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON request body';
  }
  if (err.code === 11000) {
    status = 409;
    message = 'Email is already registered';
  }
  if (status >= 500) {
    message = 'Internal server error';
  }

  const log = req.log || logger;
  if (status >= 500) {
    log.error({ err }, 'Request failed');
  } else {
    log.warn({ status, message }, 'Request rejected');
  }

  res.status(status).json({ message });
};