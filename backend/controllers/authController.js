const authService = require('../services/authService');

exports.signup = async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(201).json(result);
};

exports.login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};