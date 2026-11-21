const mongoose = require('mongoose');

/** @returns {Promise<void>} */
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;