const mongoose = require('mongoose');
const router = require('express').Router();
const Letters = mongoose.model('Letters');

router.post('/', (req, res, next) => {
    const { body } = req;

    if(!body._from) {
        return res.status(422).json({
        errors: {
            _form: 'is required',
        },
        });
    }

    if(!body._to) {
        return res.status(422).json({
        errors: {
            _to: 'is required',
        },
        });
    }

    if(!body._body) {
        return res.status(422).json({
        errors: {
            _body: 'is required',
        },
        });
    }

    const finalLetter = new Letters(body);
    return finalLetter.save()
        .then(() => res.json({ letter: finalLetter.toJSON() }))
        .catch(next);
});

router.get('/', (req, res, next) => {
    return Letters.find()
        .sort({ createdAt: 'descending' })
        .then((letters) => res.json({ letters: letters.map(letter => letter.toJSON()) }))
        .catch(next);
});

router.param('id', (req, res, next, id) => {
    return Letters.findById(id, (err, letter) => {
        if(err) {
            return res.sendStatus(404);
        } else if(letter) {
            req.letter = letter;
            return next();
        }
    }).catch(next);
});

router.get('/:id', (req, res, next) => {
    return res.json({
        letter: req.letter.toJSON(),
    });
});

router.patch('/:id', (req, res, next) => {
    const { body } = req;

    if(typeof body._from !== 'undefined') {
        req.letter._from = body._from;
    }

    if(typeof body._to !== 'undefined') {
        req.letter._to = body._to;
    }

    if(typeof body._body !== 'undefined') {
        req.letter._body = body._body;
    }
    
    return req.letter.save()
        .then(() => res.json({ letter: req.letter.toJSON() }))
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    return Letters.findByIdAndRemove(req.letter._id)
        .then(() => res.sendStatus(200))
        .catch(next);
});

module.exports = router;