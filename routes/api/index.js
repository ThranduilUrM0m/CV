const router = require('express').Router();

router.use('/articles', require('./articles'));
router.use('/experiences', require('./experiences'));
router.use('/events', require('./events'));
router.use('/projects', require('./projects'));
router.use('/testimonies', require('./testimonies'));
router.use('/notifications', require('./notifications'));

module.exports = router;