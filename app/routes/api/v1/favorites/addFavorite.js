const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .post('/v1/favorite/recipe/:id', authenticate, async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!ObjectID.isValid(id)) return res.status(400).send();

      const doc = await req.db.Recipe.findById(id);

      if (doc) {
        await req.user.favorite(id);
        const recipe = await doc.updateFavoriteCount(req.db.User);

        const populatedRecipe = await recipe.toJSONrecipe(req.user);
        console.log(populatedRecipe);

        res.status(200).send(populatedRecipe);
      } else {
        res.status(404).send();
      }

    } catch (e) {
      next(e);
    }
  });