'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('./config/passport').initialized;
const fileUpload = require('express-fileupload');

// Configure mongoose
require('./config/mongoose');

// Build routes
const indexRoutes = require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const permissionRoutes = require('./routes/permission.routes');
const roleRoutes = require('./routes/role.routes');
const tripRoutes = require('./routes/trip.routes');
const checklistRoutes = require('./routes/checklist.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const photoRoutes = require('./routes/photo.routes');
const galleryRoutes = require('./routes/gallery.routes');
const contestRoutes = require('./routes/contest.routes');

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
app.use(fileUpload({safeFileNames: true, preserveExtension: 4}));

// Associate routes
app.use('/', indexRoutes);
app.use('/api/user', userRoutes);
app.use('/api/permission', permissionRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/photo', photoRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contest', contestRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('URI Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res) {
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
