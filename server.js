const axios = require('axios');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const cluster = require('cluster');

const http = require('http');
const socket_io = require('socket.io');

let workers = [];

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

    var db = mongoose.connection;
    db.on('error', ()=> {console.log( '---Gethyl FAILED to connect to mongoose')});
    db.once('open', () => {console.log( '+++Gethyl connected to mongoose')});

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

    //Définition et mise en place du port d'écoute
    const port = process.env.PORT || 8800;
    server.listen(port, () => console.log(`Listening on port ${port}`));

    const io = socket_io();
    const connections = [];
    const types = [
        'HOME_PAGE_LOADED',
        'NOTIFICATION_PAGE_LOADED',
        'PROJECT_PAGE_LOADED',
        'TESTIMONY_PAGE_LOADED',
        'USER_PAGE_LOADED',
        'SET_EDIT',
        'SET_EDIT_PROJECT',
        'SET_EDIT_TESTIMONY',
        'SET_EDIT_USER'
    ]

    io.attach(server);
    io.on('connection', function(socket){
        connections.push(socket);

        socket.on('action', (action) => {
            if(!types.includes(action.type)) {
                connections.forEach(connectedSocket => {
                    if (connectedSocket !== socket) {
                        db.collection("notifications").find({}).toArray(function(err, docs){
                            connectedSocket.emit('action', { type:'NOTIFICATION_PAGE_LOADED', data: { notifications: docs} });
                        });
                        db.collection("testimonies").find({}).toArray(function(err, docs){
                            connectedSocket.emit('action', { type:'TESTIMONY_PAGE_LOADED', data: { testimonies: docs} });
                        });
                        db.collection("articles").find({}).toArray(function(err, docs){
                            connectedSocket.emit('action', { type:'HOME_PAGE_LOADED', data: { articles: docs} });
                        });
                        db.collection("projects").find({}).toArray(function(err, docs){
                            connectedSocket.emit('action', { type:'PROJECT_PAGE_LOADED', data: { projects: docs} });
                        });
                    }
                });
            }
        });
        //I GOTTA WATCH FOR WHEN A USER HAS BEEN UPDATED, TO SEND AN EMIT WITH FUNCTION get_users()
        
        socket.on('disconnect', () => {
            const index = connections.indexOf(socket);
            connections.splice(index, 1);
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