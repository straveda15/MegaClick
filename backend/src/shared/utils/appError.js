class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.httpStatus = statusCode || 500;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
