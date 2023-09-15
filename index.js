const express = require('express');
require('dotenv').config();
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const blogRoute = require('./routes/blogRoute');
const errorHandler = require('./middlewares/errorMiddleware');
const PORT = 8000;
require('./db');

app.use(cors());
app.use(bodyparser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/auth', authRoute);
app.use('/blog', blogRoute);

app.get('/', (req, res) => {
  res.send('API is running!');
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
