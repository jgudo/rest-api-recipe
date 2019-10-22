const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .post('/v1/recipe/:id/comment', authenticate, async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!ObjectID.isValid(id) || !id) return res.status(400).send();

      const comment = new req.db.Comment({
        createdAt: new Date().getTime(),
        commentor: req.user._id,
        post: id,
        body: req.body.comment
      });
      await comment.save();
      await req.db.Recipe
        .findOneAndUpdate(id, {
          $push: {
            comments: comment
          }
        });
      
      res.status(200).send(comment.toJSONfor(req.db.User, req.user));
    } catch (e) {
      next(e);
    }
  });
