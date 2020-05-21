const mongoose = require('mongoose');
const router = require('express').Router();
const Notifications = mongoose.model('Notifications');

router.post('/', (req, res, next) => {
    const { body } = req;

    if(!body.type) {
        return res.status(422).json({
            errors: {
                type: 'is required',
            },
        });
    }

    if(!body.description) {
        return res.status(422).json({
            errors: {
                description: 'is required',
            },
        });
    }

    if(!body.author) {
        return res.status(422).json({
            errors: {
                author: 'is required',
            },
        });
    }

    const finalNotification = new Notifications(body);
    return finalNotification.save()
        .then(() => res.json({ notification: finalNotification.toJSON() }))
        .catch(next);
});

router.get('/', (req, res, next) => {
    return Notifications.find()
        .sort({ createdAt: 'descending' })
        .then((notifications) => res.json({ notifications: notifications.map(notification => notification.toJSON()) }))
        .catch(next);
});

router.param('id', (req, res, next, id) => {
    return Notifications.findById(id, (err, notification) => {
        if(err) {
            return res.sendStatus(404);
        } else if(notification) {
            req.notification = notification;
            return next();
        }
    }).catch(next);
});

router.get('/:id', (req, res, next) => {
    return res.json({
        notification: req.notification.toJSON(),
    });
});

router.delete('/:id', (req, res, next) => {
    return Notifications.findByIdAndRemove(req.notification._id)
        .then(() => res.sendStatus(200))
        .catch(next);
});

module.exports = router;