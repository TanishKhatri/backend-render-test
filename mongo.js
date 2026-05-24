const config = require('./utils/config');
const mongoose = require('mongoose');

const url = config.TEST_MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(url, { family: 4 });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'Let be what isnt',
  important: true,
});

note.save().then(() => {
  console.log('note saved');
  mongoose.connection.close();
});

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
});