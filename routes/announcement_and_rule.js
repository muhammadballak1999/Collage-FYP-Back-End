const router = require('express').Router();
const announcement_and_rule = require('../controllers/announcement_and_rule');
const { authorization } = require('../middlewares/authorization');
const verify_token = require('../middlewares/verify-token');
const photo = require('../middlewares/multer');
const { AnnouncementAndRuleValidators } =  require("../middlewares/Validator/index");
const Validator = require("../middlewares/Validator/validator");

router.get('/announcements-and-rules', verify_token, authorization(['admin','user']), announcement_and_rule.get);
router.get('/announcements-and-rules/:id', verify_token, authorization(['admin','user']), announcement_and_rule.getOne);
router.post('/announcements-and-rules', verify_token, authorization(['admin']), photo.upload, Validator(AnnouncementAndRuleValidators.create), announcement_and_rule.create);
router.put('/announcements-and-rules/:id', verify_token, authorization(['admin']), Validator(AnnouncementAndRuleValidators.update), photo.upload, announcement_and_rule.update);
router.delete('/announcements-and-rules/:id', verify_token, authorization(['admin']), announcement_and_rule.delete);

module.exports = router;