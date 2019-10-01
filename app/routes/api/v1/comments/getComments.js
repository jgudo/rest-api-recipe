const Router = require('express').Router;
const { ObjectID } = require('mongodb');
const { authenticate } = require('../../../../middlewares/authenticate');

module.exports = Router({ mergeParams: true })
  .get('/v1/recipe/:id/comments', authenticate, async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!ObjectID.isValid(id)) return res.status(400).send();

      const comments = await req.db.Comment
        .find({ post: id })
        .populate({
          path: 'commentor',
          select: 'fullname username email'
        })
        .sort('-createdAt')
      
      if (comments) {
        res.status(200).send(comments);
      } else {
        res.status(404).send();
      }
    } catch (e) {
      next(e);
    }
  });
