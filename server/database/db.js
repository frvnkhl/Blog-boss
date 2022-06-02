require('dotenv').config();
const mongoose = require('mongoose');

exports.connectDb = () => {
    mongoose.connect(`mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@blog-boss.d13ba.mongodb.net/?retryWrites=true&w=majority`, 
    { useNewUrlParser: true })
    .catch(err => console.log({dbError: err}));

    return mongoose.connection
}
