const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 12,
    unique: true,
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
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// preverve 'this' with regular functions
UserSchema.methods.generateAuthToken = function() {
  const access = 'auth';
  const token = jwt.sign({ _id: this._id.toHexString(), access }, process.env.JWT_SECRET).toString();

  this.tokens.push({ token, access });
  return this.save().then(() => token);
}

UserSchema.statics.findToken = function(token) {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    return this.findOne({
      _id: user._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  } catch (e) {
    return Promise.reject();
  }
}

UserSchema.statics.findCredential = function(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) return Promise.reject();

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, match) => {
          if (match) resolve(user);
          else reject();
        })
      });
    })
    .catch(e => console.log(e));
}

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    })
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
