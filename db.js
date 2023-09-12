const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log('connected to mongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to mongoDB', err);
  });
