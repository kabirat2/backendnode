const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case 400:
      res.json({
        Title: "Validation Err",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 401:
      res.json({
        Title: "Unauthorised",
        message: err.message,
        stackTrace: err.stack,
      });
    case 403:
      res.json({
        Title: "Forbiden",
        message: err.message,
        stackTrace: err.stack,
      });
    case 404:
      res.json({
        Title: "NON FOUND",
        message: err.message,
        stackTrace: err.stack,
      });
      case 500 : 
      res.json({ Title : "Server Error",  message : err.message, stackTrace : err.stack})
    default:
      break;
  }
};

module.exports = ErrorHandler;
