const Blog = require('../models/blogModel');

const checkOwnerShip = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }
    if (blog.owner.toString() !== req.userId) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action',
      });
    }

    req.blog = blog;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkOwnerShip;
