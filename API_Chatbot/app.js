var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
const corsOptions = {
  origin: true,
  credentials: true
}
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Startup = require('./classes/startup.js');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/interface_admin');
var discordRouter = require('./routes/interface_discord');
var comRouter = require('./routes/interface_com');

var app = express();
app.options('*', cors(corsOptions));

// view engine setup
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/discord', discordRouter);
app.use('/chat', comRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log(process.env.ERASE_LOCAL_DB_ON_STARTUP);

const startupInstance = new Startup();
startupInstance.starting().then(console.log('.env rules set'));

module.exports = app;
