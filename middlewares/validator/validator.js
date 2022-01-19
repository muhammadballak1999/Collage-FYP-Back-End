const AppError = require('../../utils/appError');
const validator = (schema) => {
  return (req,res,next) => {
    const validationResult = schema.unknown(true).validate(req);
    if (validationResult.error){
      throw new AppError(validationResult.error.message,400)
    }
    next();
  };
};
module.exports = validator;