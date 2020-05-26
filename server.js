const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
const cluster = require('cluster');
let workers = [];

const http = require('http');
const socketIO = require('socket.io');

const setupWorkerProcesses = () => {
    // to read number of cores on system
    let numCores = require('os').cpus().length;
    console.log('Master cluster setting up ' + numCores + ' workers');

    // iterate on number of cores need to be utilized by an application
    // current example will utilize all of them
    for(let i = 0; i < numCores; i++) {
        // creating workers and pushing reference in an array
        // these references can be used to receive messages from workers
        workers.push(cluster.fork());

        // to receive messages from worker process
        workers[i].on('message', function(message) {
            console.log(message);
        });
    }

    // process is clustered on a core and process id is assigned
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is listening');
    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length-1].on('message', function(message) {
            console.log(message);
        });
    });
};

const setUpExpress = () => {
    // IMPORT MODELS
    const articleModel = require('./models/Articles');
    const ExperienceModel = require('./models/Experiences');
    const EventModel = require('./models/Events');
    const ProjectModel = require('./models/Projects');
    const TestimonyModel = require('./models/Testimonies');
    const NotificationModel = require('./models/Notifications');

    //On définit notre objet express nommé app
    const app = express();
    app.use(cors());

    //Connexion à la base de donnée
    mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);
    mongoose
        .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/db", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
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
    app.use(require('morgan')('dev'));
    app.use(session({ secret: 'boutaleb', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

    //Définition du routeur
    const router = express.Router();
    app.use("/user", router);
    require(__dirname + "/controllers/userController")(router);
    app.use(require('./routes'));

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
    
    var server = http.createServer(app);
    var io = socketIO(server);

    //Définition et mise en place du port d'écoute
    const port = process.env.PORT || 8800;
    server.listen(port, () => console.log(`Listening on port ${port}`));

    const connections = [];
    io.on('connection', (socket) => {
        console.log('Connected to Socket : '+socket.id);
        connections.push(socket);
        socket.on('change color', (color) => {
            // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
            // we make use of the socket.emit method again with the argument given to use from the callback function above
            console.log('Color Changed to: ', color);
            io.sockets.emit('change color', color);
        });
        socket.on('disconnect', () => {
            console.log('Socket Disconnected : '+socket.id);
        });
    });
};

/**
 * Setup server either with clustering or without it
 * @param isClusterRequired
 * @constructor
 *
 **/

const setupServer = (isClusterRequired) => {

    // if it is a master process then call setting up worker process
    if(isClusterRequired && cluster.isMaster) {
        setupWorkerProcesses();
    } else {
        // to setup server configurations and share port address for incoming requests
        setUpExpress();
    }
};

setupServer(true);