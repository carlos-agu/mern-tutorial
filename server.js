const express = require("express");
const mongoose = require("mongoose");
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

/************* Conexion a MongoDB de mLab ***********/
const db = require("./config/keys").mongoURI;
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
/*****************************************************/

//Passport middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//Como esta app se subira a Heroku, debemos asignar el puerto de esta forma
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port: ${port}`));