const Router = require('express').Router;
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .delete('/v1/user/token', authenticate, async (req, res, next) => {
    try {
      await req.user.removeToken(req.token);
      res.status(200).send();
    } catch (e) {
      res.status(400).send();
      next(e);
    }
  });