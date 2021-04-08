const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`;
  return new AppError(message, 400);
}

const handleValidationErrDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')} `;
  return new AppError(message, 400);
}

const handleJWTError = () => 
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => 
new AppError('Your token has expired, please log in again.', 401);

const sendErrDev = (err, req, res) => {
  //a) API
  if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
    //b) RENDERED WEBSITE
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
}

const sendErrProd = (err, req, res) => {
  //a) API
  if(req.originalUrl.startsWith('/api')){
    //trusted errors
    if(err.isOperational){
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    //Programming or other error, don't leak details to client
    }
    //log to console
    // eslint-disable-next-line no-console
    console.error('ERROR!', err);

    //send response to client
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  } 
  
  //RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
}

module.exports = (err, req, res, next) => {
   
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development'){
      sendErrDev(err, req, res);
      
    }else if(process.env.NODE_ENV === 'production'){
      let error = { ...err };
      error.name = err.name;
      error.message = err.message; 

      if(error.name === 'CastError') {
        error = handleCastErrorDB(error);
      }
      if(error.code === 11000){
        error = handleDuplicateFieldsDB(error);
      }
      if(error.name === 'ValidationError'){
        error = handleValidationErrDB(error);
      }
      if(error.name === 'JsonWebTokenError') {
        error = handleJWTError();
      }
      if(error.name === 'TokenExpiredError') {
        error = handleJWTExpiredError();
      }
      sendErrProd(error, req, res);
    }
}
