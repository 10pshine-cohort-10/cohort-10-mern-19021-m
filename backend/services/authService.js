const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * @typedef {import('../validators/authValidator').SignupInput} SignupInput
 * @typedef {import('../validators/authValidator').LoginInput} LoginInput
 * @typedef {{ _id: import('mongoose').Types.ObjectId, name: string, email: string }} UserDoc
 * @typedef {{ id: import('mongoose').Types.ObjectId, name: string, email: string }} PublicUser
 * @typedef {{ token: string, user: PublicUser }} AuthResult
 */


const dummyHash = bcrypt.hashSync('dummy-password', 10);

/**
 * @param {UserDoc} user
 * @returns {string}
 */
const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

/**
 * @param {UserDoc} user
 * @returns {PublicUser}
 */
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

/**
 * @param {SignupInput} input
 * @returns {Promise<AuthResult>}
 */
exports.signup = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(409, 'Email is already registered');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  logger.info({ userId: user._id }, 'User signed up');
  return { token: signToken(user), user: publicUser(user) };
};

/**
 * @param {LoginInput} input
 * @returns {Promise<AuthResult>}
 */
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  const valid = await bcrypt.compare(password, user ? user.password : dummyHash);

  if (!user || !valid) {
    logger.warn('Failed login attempt');
    throw new AppError(401, 'Invalid email or password');
  }

  logger.info({ userId: user._id }, 'User logged in');
  return { token: signToken(user), user: publicUser(user) };
};