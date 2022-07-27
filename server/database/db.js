require('dotenv').config();
const mongoose = require('mongoose');

exports.connectDb = () => {
    mongoose.connect(process.env.MONGO_URL, 
    { useNewUrlParser: true })
    .catch(err => console.log({dbError: err}));

    return mongoose.connection
};