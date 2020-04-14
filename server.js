const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

// IMPORT MODELS
require('./models/Articles');
require('./models/Experiences');
require('./models/Events');
require('./models/Projects');

//On définit notre objet express nommé app
const app = express();

//Connexion à la base de donnée
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/db")
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((e) => {
        console.log("Error while DB connecting");
        console.log(e);
    });
mongoose.set('debug', true);

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(require('morgan')('dev'));
app.use(session({ secret: 'boutaleb', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

//Définition du routeur
const router = express.Router();
app.use("/user", router);
require(__dirname + "/controllers/userController")(router);
app.use(require('./routes'));

//Définition et mise en place du port d'écoute
const port = process.env.PORT || 8800;
app.listen(port, () => console.log(`Listening on port ${port}`));

/*Adds the react production build to serve react requests*/
app.use(express.static(path.join(__dirname, "./client/build")));

/*React root*/
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}