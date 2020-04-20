const mongoose = require('mongoose');
const router = require('express').Router();
const Testimonies = mongoose.model('Testimonies');

router.post('/', (req, res, next) => {
    const { body } = req;

    if(!body.body) {
        return res.status(422).json({
            errors: {
                body: 'is required',
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

    if(!body.fingerprint) {
        return res.status(422).json({
            errors: {
                fingerprint: 'is required',
            },
        });
    }

    const finalTestimony = new Testimonies(body);
    return finalTestimony.save()
        .then(() => res.json({ testimony: finalTestimony.toJSON() }))
        .catch(next);
});

router.get('/', (req, res, next) => {
    return Testimonies.find()
        .sort({ createdAt: 'descending' })
        .then((testimonies) => res.json({ testimonies: testimonies.map(testimony => testimony.toJSON()) }))
        .catch(next);
});

router.param('id', (req, res, next, id) => {
    return Testimonies.findById(id, (err, testimony) => {
        if(err) {
            return res.sendStatus(404);
        } else if(testimony) {
            req.testimony = testimony;
            return next();
        }
    }).catch(next);
});

router.get('/:id', (req, res, next) => {
    return res.json({
        testimony: req.testimony.toJSON(),
    });
});

router.patch('/:id', (req, res, next) => {
    const { body } = req;

    if(typeof body.parent_id !== 'undefined') {
        req.testimony.parent_id = body.parent_id;
    }

    if(typeof body.author !== 'undefined') {
        req.testimony.author = body.author;
    }

    if(typeof body.body !== 'undefined') {
        req.testimony.body = body.body;
    }

    if(typeof body.is_private !== 'undefined') {
        req.testimony.is_private = body.is_private;
    }

    if(typeof body.fingerprint !== 'undefined') {
        req.testimony.fingerprint = body.fingerprint;
    }

    if(typeof body.upvotes !== 'undefined') {
        req.testimony.upvotes = body.upvotes;
    }

    if(typeof body.downvotes !== 'undefined') {
        req.testimony.downvotes = body.downvotes;
    }

    return req.testimony.save()
        .then(() => res.json({ testimony: req.testimony.toJSON() }))
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    return Testimonies.findByIdAndRemove(req.testimony._id)
        .then(() => res.sendStatus(200))
        .catch(next);
});

module.exports = router;