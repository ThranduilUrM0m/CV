//Définition des modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Connexion à la base de donnée
mongoose
    .connect( process.env.MONGODB_URI || "mongodb://localhost/db")
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((e) => {
        console.log("Error while DB connecting");
        console.log(e);
    });

//On définit notre objet express nommé app
const app = express();

//Body Parser
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

//Définition des CORS
app.use(function(req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

//Définition du routeur
const router = express.Router();
app.use("/user", router);
require(__dirname + "/controllers/userController")(router);

//Définition et mise en place du port d'écoute
const port = process.env.PORT || 8800;
app.listen(port, () => console.log(`Listening on port ${port}`));

/*Adds the react production build to serve react requests*/
app.use(express.static(path.join(__dirname, "./client/build")));

/*React root*/
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "./client/build/index.html"));
});