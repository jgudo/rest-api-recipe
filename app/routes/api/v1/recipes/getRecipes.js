const Router = require('express').Router;

module.exports = Router({mergeParams: true})
  .get('/v1/recipes',  async (req, res, next) => {
    const resultPerPage = 20;
    const page = req.query.page || 1;
    const { name, description, recipe } = req.query.filter;
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
        .skip((resultPerPage * page) - resultPerPage)
        .limit(resultPerPage)

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
  
