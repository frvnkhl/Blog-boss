require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const db = require('./database/db');
const userRoutes = require('./routes/userRoutes');

//app config
const app = express();
const port = process.env.PORT || 6299;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, PATCH, DELETE'
}));
app.use(passport.initialize());
app.use(express.json());
app.use((err, req, res, next) => {
    return res.json({ errorMessage: err.message });
});

//db connection
db.connectDb();

//routes
app.get('/', (req, res) => {
    res.send('App is working!')
});
app.use('/user', userRoutes);

//listen
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});