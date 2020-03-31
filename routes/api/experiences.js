const mongoose = require('mongoose');
const router = require('express').Router();
const Experiences = mongoose.model('Experiences');

router.post('/', (req, res, next) => {
  const { body } = req;
  
  if(!body.title) {
    return res.status(422).json({
      errors: {
        title: 'is required',
      },
    });
  }
  
  if(!body.brand) {
    return res.status(422).json({
      errors: {
        brand: 'is required',
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
  
  if(!body.date_start) {
    return res.status(422).json({
      errors: {
        date_start: 'is required',
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

  const finalProject = new Experiences(body);
  return finalProject.save()
    .then(() => res.json({ experience: finalProject.toJSON() }))
    .catch(next);
});

router.get('/', (req, res, next) => {
  return Experiences.find()
    .sort({ createdAt: 'descending' })
    .then((experiences) => res.json({ experiences: experiences.map(experience => experience.toJSON()) }))
    .catch(next);
});

router.param('id', (req, res, next, id) => {
  return Experiences.findById(id, (err, experience) => {
    if(err) {
      return res.sendStatus(404);
    } else if(experience) {
      req.experience = experience;
      return next();
    }
  }).catch(next);
});

router.get('/:id', (req, res, next) => {
  return res.json({
    experience: req.experience.toJSON(),
  });
});

router.patch('/:id', (req, res, next) => {
  const { body } = req;

  if(typeof body.title !== 'undefined') {
    req.experience.title = body.title;
  }

  if(typeof body.brand !== 'undefined') {
    req.experience.brand = body.brand;
  }

  if(typeof body.description !== 'undefined') {
    req.experience.description = body.description;
  }

  if(typeof body.date_start !== 'undefined') {
    req.experience.date_start = body.date_start;
  }

  if(typeof body._days !== 'undefined') {
    req.event._days = body._days;
  }
  return req.experience.save()
    .then(() => res.json({ experience: req.experience.toJSON() }))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  return Experiences.findByIdAndRemove(req.experience._id)
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;