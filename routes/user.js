const router = require('express').Router();
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


router.post('/user', user.createUser);
router.get('/user', user.getUsers);

module.exports = router;