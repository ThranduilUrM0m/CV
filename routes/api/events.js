const mongoose = require('mongoose');
const router = require('express').Router();
const Events = mongoose.model('Events');

router.post('/', (req, res, next) => {
  const { body } = req;

  if(!body._name) {
    return res.status(422).json({
      errors: {
        _name: 'is required',
      },
    });
  }

  if(!body._date_start) {
    return res.status(422).json({
      errors: {
        _date_start: 'is required',
      },
    });
  }

  if(!body._days) {
    return res.status(422).json({
      errors: {
        _days: 'is required',
      },
    });
  }

  if(!body._type) {
    return res.status(422).json({
      errors: {
        _type: 'is required',
      },
    });
  }

  const finalEvent = new Events(body);
  return finalEvent.save()
    .then(() => res.json({ event: finalEvent.toJSON() }))
    .catch(next);
});

router.get('/', (req, res, next) => {
  return Events.find()
    .sort({ createdAt: 'descending' })
    .then((events) => res.json({ events: events.map(event => event.toJSON()) }))
    .catch(next);
});

router.param('id', (req, res, next, id) => {
  return Events.findById(id, (err, event) => {
    if(err) {
      return res.sendStatus(404);
    } else if(event) {
      req.event = event;
      return next();
    }
  }).catch(next);
});

router.get('/:id', (req, res, next) => {
  return res.json({
    event: req.event.toJSON(),
  });
});

router.patch('/:id', (req, res, next) => {
  const { body } = req;

  if(typeof body._name !== 'undefined') {
    req.event._name = body._name;
  }

  if(typeof body._date_start !== 'undefined') {
    req.event._date_start = body._date_start;
  }

  if(typeof body._days !== 'undefined') {
    req.event._days = body._days;
  }

  if(typeof body._type !== 'undefined') {
    req.event._type = body._type;
  }

  return req.event.save()
    .then(() => res.json({ event: req.event.toJSON() }))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  return Events.findByIdAndRemove(req.event._id)
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;