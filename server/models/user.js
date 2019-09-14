const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 12,
    validate: {
      validator: (email) => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(email);
      },
      message: '{VALUE} is invalid.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
