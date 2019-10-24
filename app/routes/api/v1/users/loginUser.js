const Router = require('express').Router;

module.exports = Router({ mergeParams: true })
  .post('/v1/user/login', async (req, res, next) => {
    try {
      const user = await req.db.User.findCredential(req.body.email, req.body.password);
      const token = await user.generateAuthToken();


      res.header('x-auth', token).send({ 
        user: {
          _id: user._id,
          fullname: user.fullname, 
          email: user.email,
        },
        token 
      });
    } catch (e) {
      res.status(400).send(e);
      next(e);
    }
  });