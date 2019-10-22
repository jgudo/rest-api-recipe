const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .post('/v1/like/recipe/:id', authenticate, async (req, res, next) => {
    try {
      const id = req.params.id;
      const uid = req.user._id;

      if (!ObjectID.isValid(id)) return res.status(400).send();

      const doc = await req.db.Recipe.findById(id);
      const recipe = await doc.like(uid);

      res.status(200).send(recipe.toJSONfor(req.db.User, req.user));
    } catch (e) {
      next(e);
    }
  });