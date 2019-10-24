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
  username: {
    type: String,
    minlength: 8,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    maxlength: 40,
    minlength: 4,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  dateJoined: {
    type: Number,
    required: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
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
}, { timestamps: true });

// preverve 'this' with regular functions
UserSchema.methods.generateAuthToken = function() {
  const access = 'auth';

  const token = jwt.sign({ 
    _id: this._id.toHexString(), 
    access
  }, process.env.JWT_SECRET, {
    expiresIn: 86400
  }).toString();

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

UserSchema.statics.toProfileJSON = function(user) {
  return {
    _id: user._id,
    username: user.username,
    fullname: user.fullname,
    email: user.email
  }
}

UserSchema.statics.findCredential = function(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) return Promise.reject();

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, match) => {
          if (match) {
            resolve(user);
          }
          else {
            reject(err);
          }
        })
      });
    })
    .catch((e) => {
      console.log(e, 'ERROR TANGA');
      return Promise.reject();
    });
}


UserSchema.methods.removeToken = function(token) {
  return this.updateOne({
    $pull: {
      tokens: { token }
    }
  });
};

UserSchema.methods.toAuthJSON = function(token) {
	return {
		user: {
			fullname: this.fullname,
			email: this.email,
      id: this._id,
      username: this.username
		},
		token
	};
}

UserSchema.methods.favorite = function(id){
  if(this.favorites.indexOf(id) === -1){
      this.favorites.push(id);
  } else {
    this.favorites.pull(id);
  }
  return this.save();
};

UserSchema.methods.isFavorite = function(id){
  return this.favorites.some(function(favoriteId){
      return id.toString() === favoriteId.toString() ? true : false;
  });
};

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

// const User = mongoose.model('User', UserSchema);

module.exports = UserSchema;
