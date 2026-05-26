const notesRouter = require('express').Router();
const { response } = require('express');
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 });
  res.json(notes);
});

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findById(body.userId);

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  user.save();
  res.status(201).json(savedNote);
});

notesRouter.delete('/:id' , async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body;

  console.log(req);
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        return res.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        res.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;