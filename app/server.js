import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import apiRouter from './router';

// initialize
const app = express();

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/mafia';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// enable/disable cross origin resource sharing if necessary
app.use(cors());

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

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
