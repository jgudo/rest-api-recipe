const Router = require('express').Router;

module.exports = Router({mergeParams: true})
  .get('/v1/recipes',  async (req, res, next) => {
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
          path: 'creator'
        }, {
          path: 'likers',
          select: 'fullname username'
        }, {
          path: 'comments',
          populate: { 
            path: 'commentor' 
          }
        }])
        .skip((resultPerPage * page) - resultPerPage)
        .limit(resultPerPage)

      if (recipes.length !== 0) {
        const result = recipes.map((recipe) => {
          return recipe.toJSONfor(req.db.User, recipe.creator);
        });

        res.status(200).send(result);
      } else {
        res.status(404).send({ status: 404, message: 'No recipes found' });
      }
    } catch (e) {
      res.status(400).json(e);
      next(e);
    }
  });
  
