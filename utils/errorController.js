module.exports = (error, req, res, next) => {
    res.status(error.statusCode || 500).send({
            success: false,
            message: error.message,
            stack: error.stack
    });
  }