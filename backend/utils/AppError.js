class AppError extends Error {
  /**
   * @param {number} status
   * @param {string} message
   */
  constructor(status, message) {
    super(message);
    /** @type {number} */
    this.status = status;
  }
}

module.exports = AppError;