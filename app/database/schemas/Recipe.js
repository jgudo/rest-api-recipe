const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
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
  recipes: [String],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  liked: {
    type: Boolean,
    default: false,
    required: true
  },
  created: {
    type: Number,
    required: true
  },
  creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

RecipeSchema.methods.like = function(id) {
  if (this.likers.indexOf(id) === -1) {
    this.likers.push(id);
    this.likes = this.likers.length;
  } else {
    this.likers.pull(id);
    this.likes = this.likers.length;
  }

  return this.save();
}

RecipeSchema.methods.updateLikesCount = function() {
  return this.count('likers').then(function(count) {
    this.likes = count;

    return this.save();
  })
}

RecipeSchema.methods.isLiked = function(id) {
  return this.likers.some(likerId => id.toString() === likerId.toString());
}

RecipeSchema.methods.toJSONfor = function(User, user) {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    recipes: this.recipes,
    comments: [],
    likers: [],
    likes: this.likers.length,
    commentsCount: this.comments.length,
    liked: this.isLiked(user._id) ? true : false,
    created: this.created,
    creator: User.toProfileJSON(user) 
  };
}

module.exports = RecipeSchema;
