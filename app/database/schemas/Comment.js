const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  createdAt: {
    type: Number,
    required: true
  },
  commentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true });

CommentSchema.methods.toJSONfor = function(User, user) {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    commentor: User.toProfileJSON(user)
  };
};

module.exports = CommentSchema;
