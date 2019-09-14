const mongoose = require('mongoose');

const Recipe = mongoose.model('Recipe', {
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  created: {
    type: Number,
    required: true
  }
});

module.exports = { Recipe };
