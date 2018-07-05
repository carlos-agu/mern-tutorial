const express = require("express");
const mongoose = require("mongoose");
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

/************* Conexion a MongoDB de mLab ***********/
const db = require("./config/keys").mongoURI;
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
/*****************************************************/

app.get("/", (req, res) => res.send("Hello DevConnector"));

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//Como esta app se subira a Heroku, debemos asignar el puerto de esta forma
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port: ${port}`));