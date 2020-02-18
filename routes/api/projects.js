const mongoose = require('mongoose');
const router = require('express').Router();
const Projects = mongoose.model('Projects');

router.post('/', (req, res, next) => {
  const { body } = req;

  if(!body.title) {
    return res.status(422).json({
      errors: {
        title: 'is required',
      },
    });
  }

  if(!body.image) {
    return res.status(422).json({
      errors: {
        image: 'is required',
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

  const finalProject = new Projects(body);
  return finalProject.save()
    .then(() => res.json({ project: finalProject.toJSON() }))
    .catch(next);
});

router.get('/', (req, res, next) => {
  return Projects.find()
    .sort({ createdAt: 'descending' })
    .then((projects) => res.json({ projects: projects.map(project => project.toJSON()) }))
    .catch(next);
});

router.param('id', (req, res, next, id) => {
  return Projects.findById(id, (err, project) => {
    if(err) {
      return res.sendStatus(404);
    } else if(project) {
      req.project = project;
      return next();
    }
  }).catch(next);
});

router.get('/:id', (req, res, next) => {
  return res.json({
    project: req.project.toJSON(),
  });
});

router.patch('/:id', (req, res, next) => {
  const { body } = req;

  if(typeof body.title !== 'undefined') {
    req.project.title = body.title;
  }

  if(typeof body.author !== 'undefined') {
    req.project.author = body.author;
  }

  if(typeof body.image !== 'undefined') {
    req.project.image = body.image;
  }

  if(typeof body.tag !== 'undefined') {
    req.project.tag = body.tag;
  }

  if(typeof body.comment !== 'undefined') {
    req.project.comment = body.comment;
  }

  if(typeof body.upvotes !== 'undefined') {
    req.project.upvotes = body.upvotes;
  }

  if(typeof body.downvotes !== 'undefined') {
    req.project.downvotes = body.downvotes;
  }

  if(typeof body.view !== 'undefined') {
    req.project.view = body.view;
  }
  return req.project.save()
    .then(() => res.json({ project: req.project.toJSON() }))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  return Projects.findByIdAndRemove(req.project._id)
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;