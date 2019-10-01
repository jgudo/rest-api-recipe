const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .patch('/recipe/:id', authenticate, async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(400).send();
    }

    try {
      const result = await req.db.Recipe.findOneAndUpdate({ 
        _id: id,
        _creator: req.user._id
      }, {
        $set: req.body
      },
      {
        new: true
      });

      if (!result) res.status(404).send();

      res.status(200).send({ result });
    } catch (e) {
      console.log(e);
      res.status(400).send();
      next(e);
    }
  });