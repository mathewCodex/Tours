const AppError = require("./../UTILS/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};
//
const handleJWTError = () => new AppError('Invalid Token.Please login again',401);

const  handleJWTExpiredError = () => new AppError("Your Token has Expired!Please login again",401)
//
const handleDuplicateFieldsDB = (err) => {
  //regExp matching
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}.Please use another value.`;

  return new AppError(message, 400);
};

//
const handleValidationErrorDB = (err) => {
  //looping over the element of an object
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data.${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err,req, res) => { 
  //A) API
  if(req.originalUrl.startsWith('/api')){
 return res
   .status(err.statusCode)

   .json({
     status: err.status,
     error: err,
     message: err.message,
     stack: err.stack,
   });
  }
    //B Rendered website
    return res.status(err.statusCode).render('error',{
      title:"Something went wrong",
      msg: err.message
    })
  
 
};
const sendErrorProd = (err,req, res) => {
  //A) ..API
  if(req.originalUrl.startsWith('/api')){
    //A operational trusted error: send message to client
  if (err.isOperational) {
   return  res
      .status(err.statusCode)

      .json({
        status: err.status,

        message: err.message,
      });
  } 
  //sending generic message
    console.error("Error 🌪", err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
  
    //B)rendered website
    //A Operational trusted error: send mesage to client
    if (err.isOperational) {
return res.status(err.statusCode).render("error", {
          title: "Something went wrong",
          msg:  err.message,
        });
      
    } 
    //BProgramming or other operational error
      console.error("Error 🌪", err);
     return  res.status(err.statusCode).render('error',{
        title: "Something went wrong",
        msg: 'Please try again '
      })
    
  

};

module.exports = //error handling middleware...
  (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    //implementing a development and production error handler

    if (process.env.NODE_ENV === "development") {
      sendErrorDev(err,req, res);
    } else if (process.env.NODE_ENV === "production") {

      let error = { ...err };
      error.message = err.message;
      //sending meaningfull error message
      if (error.name === "CastError") error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === "ValidationError")
        error = handleValidationErrorDB(error);
      if(error.name === 'jsonWebTokenError') error = handleJWTError();
      if(error.name  === 'TokenExpiredError') error = handleJWTExpiredError();

      sendErrorProd(error,req, res);
      // sendErrorProd(error,res)
    }
  };
