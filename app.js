var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');

var indexRouter = require('./routes/index');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017/Blog';
// var dev_db_url = 'mongodb+srv://Admin:75tofATiF9UNWcJ6@cluster0-qldfs.mongodb.net/blog_database?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
const option = {
    socketTimeoutMS: 90000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(mongoDB, option).then(function(){
    //connected successfully
    console.log('Successfully connected to database');
}).catch(err => console.error('Something went wrong', err));

// view engine setup
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'posts')]);
app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, 'views');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression()); // Compress all routes

app.use('/', indexRouter); // Add index Route to middleware chain

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, 'Wrong page, please go back to the Homepage.'));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
