const Router = require('express').Router;

module.exports = Router({ mergeParams: true })
  .get('/v1/users',  async (req, res, next) => {
    try {
      const user = await req.db.User.find();

      if (!user) return res.status(404).send();

      res.status(200).send(user);
    } catch (e) {
      next(e);
    }
  });