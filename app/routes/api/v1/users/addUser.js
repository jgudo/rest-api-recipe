const Router = require('express').Router;

module.exports = Router({ mergeParams: true })
  .post('/v1/user', async (req, res, next) => {
    const user = new req.db.User({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      dateJoined: new Date().getTime(),
      password: req.body.password
    });

    try {
      await user.save();
      const token = await user.generateAuthToken();
      return res.header('x-auth', token).send(user.toAuthJSON(token));
    } catch (e) {
      switch (e.code) {
        case 11000:
          res.status(400).send({
            status: 400,
            message: 'Email already exists, try another one.'
          });
          break;
        default: 
          res.status(400).send({
            status: 400,
            message: e.errmsg ? e.errmsg : e.message
          });
          break;
      }
      next(e);
    }
  });
