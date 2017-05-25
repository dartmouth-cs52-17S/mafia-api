import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http';
import uuid from 'uuid';
import dotenv from 'dotenv';
import apiRouter from './router';

dotenv.config({ silent: true });

// initialize
const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/mafia';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// enable/disable cross origin resource sharing if necessary
app.use(cors());

const setCustomHeaderFunc = (req, res, next) => {
  if (process.env.LOCAL) {
    res.header('Access-Control-Allow-Origin', 'localhost:8080');
  } else {
    res.header('Access-Control-Allow-Origin', 'mafia.surge.sh');
  }
  res.header('Access-Control-Allow-Credentials', true);
  next();
};

app.all('*', setCustomHeaderFunc);

app.set('view engine', 'ejs');
app.use(express.static('static'));
// enables static assets from folder static
app.set('views', path.join(__dirname, '../app/views'));
// this just allows us to render ejs from the ../app/views directory

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// prefix all our routes with /api
app.use('/api', apiRouter);


// default index route
app.get('/', (req, res) => {
  res.send('hello world, it\'s a mafia!');
});

app.get('/auth/facebook/callback', (req, res, next) => {
  res.redirect('/');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
if (process.env.SERVER) {
  app.listen(port);
}

if (process.env.SOCKET) {
  server.listen(process.env.PORT || 3000);
}

console.log(`listening on: ${port}`);

io.on('connection', (socket) => {
  socket.userID = uuid();
  socket.emit('connect', { id: socket.userID });
  console.log(`\t socket.io:: player ${socket.userID} connected`);

  socket.on('disconnect', () => {
    console.log(`\t socket.io:: client disconnected ${socket.userid}`);
  });
});

const chat = io
  .of('/chat')
  .on('connection', (socket) => {
    socket.userID = uuid();
    console.log(`UserID ${socket.userID} has joined the chat room.`);
    socket.emit('message', 'welcome to our chat!');
    chat.emit('message', `${socket.userID} has joined.`);

    socket.on('message', (msg) => {
      console.log(`message received: ${msg.text}`);
    });

    socket.on('disconnect', () => {
      console.log(`UserID ${socket.userID} has left the chat room.`);
    });
  });
