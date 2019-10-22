const Router = require('express').Router;
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .get('/v1/user/:username', authenticate, async (req, res, next) => {
    try {
      const username = req.params.username;
      const user = await req.db.User.findOne({ username });

      if (!user) return res.status(404).send();

      res.status(200).send(req.db.User.toProfileJSON(user));
    } catch (e) {
      next(e);
    }
  });