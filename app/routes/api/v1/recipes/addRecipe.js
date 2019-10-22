const Router = require('express').Router;
const { authenticate } = require('../../../../middlewares/authenticate'); 

module.exports = Router({ mergeParams: true })
  .post('/v1/recipe', authenticate, async (req, res, next) => {
    try {
      const recipe = new req.db.Recipe({
        name: req.body.name,
        description: req.body.description,
        recipes: req.body.recipes,
        created: new Date().getTime(),
        creator: req.user._id
      });  
      const doc = await recipe.save();

      res.status(200).send(doc.toJSONfor(req.db.User, req.user));
    } catch (e) {
      next(e);
    }
  });
