import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import socketioJwt from 'socketio-jwt';

import apiRouter from './router';
import * as Games from './controllers/game_controller';
import User from './models/user_model';
import * as Chat from './controllers/chat_controller';

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
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  } else {
    res.header('Access-Control-Allow-Origin', 'http://mafia.surge.sh');
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
  socket.emit('connect');

  socket.on('join', (gameID) => {
    console.log(`joined game ${gameID}`);
    socket.join(gameID);
  });

  socket.on('updateStage', (params) => {
    console.log('updateStage');
    Games.updateStage(params.id, params.stage)
    .then((result) => {
      io.sockets.in(params.id).emit('fetchAll', null);
    }).catch((err) => { console.log(err); });
  });

  socket.on('disconnect', () => {
    console.log(`\t socket.io:: client disconnected ${socket.userid}`);
  });
});

// Chat socket workings
const chat = io
  .of('/chat')
  .on('connection', socketioJwt.authorize({
    secret: process.env.AUTH_SECRET,
    timeout: 15000,
  })).on('authenticated', (socket) => {
    let username = '';
    User.findById(socket.decoded_token.sub)
      .then((user) => {
        username = user.name;
        console.log(`${username} has authenticated and connected to chat`);

        socket.on('room', (room) => {
          console.log(`${username} joined room ${room}.`);
          socket.join(room);
          Chat.initChat(room);
          Chat.addToChat(room, {
            type: 'notice',
            text: `${username} joined chat.`,
          });
          chat.to(room).emit('newchat', Chat.returnChat(room));
        });

        socket.on('message', (msg) => {
          console.log(`message received from ${username} in ${msg.room}: ${msg.text}`);
          Chat.addToChat(msg.room, {
            type: 'message',
            sender: username,
            text: msg.text,
          });
          chat.to(msg.room).emit('newchat', Chat.returnChat(msg.room));
        });

        // let room know about disconnects too
        socket.on('disconnect', () => {
          console.log(`${username} has left the chat room.`);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
