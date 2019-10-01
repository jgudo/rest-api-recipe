const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .delete('/recipe/:id', authenticate, async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(400).send();
    }

    try {
      const result = await req.db.Recipe.findOneAndDelete({ _id: id, _creator: req.user._id });
      if (!result) res.status(404).send();

      res.status(200).send(result);
    } catch (e) {
      res.status(400).send();
      next(e)
    }
  });
