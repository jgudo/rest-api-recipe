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

      if (doc) {
        const recipe = await doc.like(uid);
        const populateRecipe = await recipe.toJSONrecipe(req.user);

        res.status(200).send(populateRecipe);
      } else {
        res.status(404).send();
      }

    } catch (e) {
      next(e);
    }
  });