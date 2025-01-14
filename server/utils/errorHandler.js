class ErrorResponse extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.data = data;
  }
}

const errorHandler = (err, req, res, next) => {
  let { statusCode, message, status, data } = err;

  if (!statusCode) statusCode = 500;
  if (!status) status = "error";
  if (!message) message = "Internal Server Error";

  res.status(statusCode).json({
    statusCode,
    status,
    message,
    data,
  });
};

module.exports = { ErrorResponse, errorHandler };
