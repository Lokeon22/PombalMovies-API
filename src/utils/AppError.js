class AppError {
  message;
  statusCoded;

  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCoded = statusCode;
  }
}

module.exports = AppError;
