const express = require('express');
require('dotenv').config();
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const blogRoute = require('./routes/blogRoute');
const imageUploadRoute = require('./routes/imageUploadRoute');
const errorHandler = require('./middlewares/errorMiddleware');
const PORT = 8000;
require('./db');

const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(bodyparser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/auth', authRoute);
app.use('/blog', blogRoute);
app.use('/image', imageUploadRoute);

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.get('/blogcategories', async (req, res) => {
  const blogcategories = [
    'Technology',
    'Sports',
    'Entertainment',
    'Politics',
    'Science',
    'Health',
    'Business',
    'Travel',
    'Education',
    'Automobile',
    'Fashion',
    'Food',
    'Lifestyle',
    'Others',
  ];

  res.status(200).json({
    message: 'Blog Categories',
    categories: blogcategories,
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
