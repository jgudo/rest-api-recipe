const mongoose = require('mongoose');

const Recipe = mongoose.model('Recipe', {
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  description: {
    type: String,
    default: ''
  },
  recipes: {
    type: String,
    default: ''
  },
  created: {
    type: Number,
    required: true
  },
  creatorName: {
    required: true,
    type: String
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = { Recipe };
