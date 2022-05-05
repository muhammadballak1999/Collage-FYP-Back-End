const router = require('express').Router();
const police_station = require('../controllers/police_station');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const { admin, police } = require('../utils/roles');
const photo = require('../middlewares/multer');

router.get('/police', verify_token, authorization([admin]), police_station.get);
router.get('/police/:id', verify_token, authorization([admin, police]), police_station.getOne);
router.post('/police', verify_token, authorization([admin]), photo.upload, police_station.create);
router.put('/police/:id', verify_token, authorization([admin, police]), photo.upload, police_station.update);
router.delete('/police/:id', verify_token, authorization([admin]), police_station.delete);

module.exports = router;