const express = require('express');
require('dotenv').config();
const app = express();

const bodyparser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = 8000;
require('./db');

app.use(cors());
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
