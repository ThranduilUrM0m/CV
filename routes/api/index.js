const router = require('express').Router();

router.use('/articles', require('./articles'));
router.use('/experiences', require('./experiences'));
router.use('/events', require('./events'));
router.use('/projects', require('./projects'));

module.exports = router;