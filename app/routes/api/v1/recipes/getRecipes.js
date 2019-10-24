const Router = require('express').Router;
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({mergeParams: true})
  .get('/v1/recipes', authenticate, async (req, res, next) => {
    const resultPerPage = 20;
    const { name, description, recipe, page = 1 } = req.query.filter;
    const query = {};

    if (name) {
      query.name = {
        $regex: new RegExp(name, 'ig')
      }
    } else if (description) {
      query.description = {
        $regex: new RegExp(description, 'ig')
      }
    } else if (recipe) {
      
    }

    try {
      console.log(req.query);
      const recipes = await req.db.Recipe
        .find(query)
        .populate([{
          path: 'creator',
          select: 'fullname username email'
        }, {
          path: 'likers',
          select: 'fullname username email'
        }, {
          path: 'comments',
          populate: { 
            path: 'commentor',
            select: 'fullname username email'
          }
        }])
        .skip((resultPerPage * page) - resultPerPage)
        .limit(resultPerPage)

      if (recipes.length === 0) {
        return res.status(404).send({ status: 404, message: 'No recipes found' });
      }

      recipes.forEach((recipe) => {
        recipe.liked = recipe.isLiked(req.user._id);
        recipe.favorited = req.user.isFavorite(recipe._id);
      });

      res.status(200).send(recipes);
    } catch (e) {
      res.status(400).json(e);
      next(e);
    }
  });
  
