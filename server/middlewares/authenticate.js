const { User } = require('../models/user');

const authenticate = async (req, res, next) => {
  const token = req.header('x-auth');

  try {
    const user = await User.findToken(token);

    if (!user) return Promise.reject();

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send();
  }
};

module.exports = { authenticate };
