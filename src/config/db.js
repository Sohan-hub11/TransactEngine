const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected Server to MongoDB Successfully');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1); //exiting from server if there is an error in connecting to database.
    });

}

module.exports = connectDB;