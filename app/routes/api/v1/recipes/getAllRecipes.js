const Router = require('express').Router;

module.exports = Router({mergeParams: true})
  .get('/v1/recipes/all', async (req, res, next) => {
    try {
      const recipes = await req.db.Recipe.find(req.query);
      res.status(200).send(recipes);
    } catch(error) {
      next(error);
    }
  });
  