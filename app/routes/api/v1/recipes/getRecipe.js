const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
.get('/v1/recipe/:id', authenticate, async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  try {
    const recipe = await Recipe.findOne({ _id: id, creator: req.user._id });

    if (!recipe) return res.status(404).send();

    const populatedRecipe = await recipe.toJSONrecipe(req.user);

    res.status(200).send(populatedRecipe);
  } catch (e) {
    res.status(400).send();
    next(e);
  }
});
