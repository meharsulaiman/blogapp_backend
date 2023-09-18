const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/checkAuth');
const Blog = require('../models/blogModel');
const User = require('../models/userSchema');
const checkOwnerShip = require('../middlewares/checkOwnerShip');

router.get('/test', checkAuth, async (req, res) => {
  res.send({ userId: req.userId });
});

router.post('/', checkAuth, async (req, res, next) => {
  try {
    const { title, description, image, paragraphs, category } = req.body;
    const blog = await Blog.create({
      title,
      description,
      image,
      paragraphs,
      owner: req.userId,
      category,
    });

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.blogs.push(blog._id);
    await user.save();

    res.status(201).json({
      message: 'Blog post created successfully',
      blog,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }
    res.status(200).json({
      blog,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', checkAuth, checkOwnerShip, async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      message: 'Blog updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', checkAuth, checkOwnerShip, async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const blogIndex = user.blogs.indexOf(req.params.id);
    if (blogIndex !== -1) {
      user.blogs.splice(blogIndex, 1);
      await user.save();
    }

    res.status(200).json({
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const search = req.body.search || '';
    const page = parseInt(req.body.page) || 1;
    const perPage = 2;

    const searchQuery = new RegExp(search, 'i');

    const totaBlogs = await Blog.countDocuments({ title: searchQuery });
    const totalPages = Math.ceil(totaBlogs / perPage);

    if (page < 1 || page > totalPages) {
      return res.status(404).json({
        message: 'Page not found',
      });
    }

    const skip = (page - 1) * perPage;

    const blogs = await Blog.find({ title: searchQuery })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      blogs,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
