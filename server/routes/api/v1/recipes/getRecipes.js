const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({mergeParams: true})
  .get('/v1/recipes', authenticate, async (req, res, next) => {
    if (req.query._id) {
      if (!ObjectID.isValid(req.query._id)) {
        return res.status(404).send();
      }
    }
    
    try {
      const recipes = await req.db.Recipe.find({ 
        _creator: req.user._id,
        ...req.query
      });

      if (recipes.length !== 0) {
        res.status(200).send(recipes);
      } else {
        res.status(404).send({ status: 404, message: 'No recipes found' });
      }
    } catch (e) {
      res.status(400).json(e);
      next(e);
    }
  });
  
