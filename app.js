'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('./config/passport').initialized;

// Configure mongoose
require('./config/mongoose');

// Build routes
const index = require('./routes/index');
const usersRoutes = require('./routes/users');
const permissionsRoutes = require('./routes/permissions');
const rolesRoutes = require('./routes/roles');

// Build app
const app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport);

// Associate routes
app.use('/', index);
app.use('/api/user', usersRoutes);
app.use('/api/permission', permissionsRoutes);
app.use('/api/role', rolesRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  const isDevEnv = req.app.get('env') === 'dev';

  if (req.isApi) {
    return res
      .status(err.status || 500)
      .json(isDevEnv ? err : {message: 'An error has occurred'});
  }

  res.locals.message = err.message;
  res.locals.error = isDevEnv ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
