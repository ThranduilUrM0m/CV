const router = require('express').Router();

router.use('/articles', require('./articles'));
router.use('/letters', require('./letters'));
router.use('/events', require('./events'));
router.use('/projects', require('./projects'));

module.exports = router;