const Router = require('express').Router;

module.exports = Router({ mergeParams: true })
  .post('/v1/user', async (req, res, next) => {
    const user = new req.db.User({
      fullname: req.body.fullname,
      email: req.body.email,
      dateJoined: new Date().getTime(),
      password: req.body.password
    });

    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send({ 
        fullname: user.fullname, 
        email: user.email,
        token 
      });
      // res.status(200).send('User successfully saved');
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
