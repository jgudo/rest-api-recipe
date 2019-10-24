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
  favorited: {
    type: Boolean,
    default: false
  },
  favoritesCount: {
    type: Number,
    default: 0
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

RecipeSchema.methods.updateFavoriteCount = function(user) {
  return user.countDocuments({
    favorites: {
      $in: [this._id]
    }
  }).then((count) => {
    console.log(count);
    this.favoritesCount = count;
    return this.save();
  });
};

RecipeSchema.methods.isLiked = function(id) {
  return this.likers.some((likerId) => {
    if (typeof likerId === 'string') {
      return id.toString() === likerId.toString() ? true : false;
    } else {
      return id.toString() === likerId._id.toString() ? true : false;
    }
  });
}

RecipeSchema.methods.toJSONrecipe = async function(user) {
  this.liked = this.isLiked(user._id);
  this.favorited = user.isFavorite(this._id);

  return await this.populate([{
    path: 'creator',
    select: 'fullname username email'
  }, {
    path: 'likers',
    select: 'fullname username email'
  }, {
    path: 'comments',
    populate: { 
      path: 'commentor',
      select: 'fullname username email'
    }
  }]).execPopulate();
}

module.exports = RecipeSchema;
