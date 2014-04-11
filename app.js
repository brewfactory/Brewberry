/**
 * Application root
 *
 * @module App
 **/

'use strict';

var
  express = require('express'),
  http = require('http'),
  path = require('path'),

  mongoose = require('mongoose'),
  nconf = require('nconf'),

  app = module.exports = express(),

  routeBrew = require('./routes/brew'),
  routeLog = require('./routes/log'),

  Brewer = require('./module/Brewer'),
  LogModel = require('./schema/Log'),


  Logger = require('./module/Logger'),
  LOG = __filename.split('/').pop(),

  SocketIO = require('./module/SocketIO'),
  BrewCore = require('./module/BrewCore'),

  MODE = 'production' === app.get('env') ? 'normal' : 'dev',

  server;


/* ********** region Configuration ********** */

if ('production' === app.get('env')) {
  nconf.file(path.join(__dirname, 'config/config.json'));
} else {
  nconf.file(path.join(__dirname, 'config/configDev.json'));
}

// init logger
Logger.init({
  consoleLevel: 'event',
  mode: MODE,
  logStatusFrequency: nconf.get('log:status:frequency')
});

// init database
mongoose.connect(nconf.get('mongo:connect'));

// config express
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.urlencoded());
app.use(express.json());
app.use(app.router);

// env
if ('production' === app.get('env')) {
  app.enable('view cache');
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use(express.static(path.join(__dirname, '.tmp')));

  nconf.set('production', true);
} else {
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.errorHandler());
}

/* ********** end region Configuration ********** */


/* ********** region routing ********** */

// brew
app.post('/brew', function (req, res, next) {
  routeBrew.setBrew(Brewer, req, res, next);
});
app.get('/brew/stop', function (req, res, next) {
  routeBrew.cancelBrew(Brewer, req, res, next);
});
app.get('/brew/pause', function (req, res, next) {
  routeBrew.pauseBrew(Brewer, req, res, next);
});

// logs
app.post('/logs', function(req, res, next) {
  routeLog.findOneBrewLog(LogModel, req, res, next);
});
app.get('/logs/brews', function (req, res, next) {
  routeLog.findBrewLogs(LogModel, res, res, next);
});

/* ********** end region routing ********** */


/* ********** region init ********** */

server = http.createServer(app).listen(app.get('port'), function () {
  Logger.info('Server is listening.', LOG, { port: app.get('port') });
});

SocketIO.init(server, {
  logLevel: 1,
  logStatusFrequency: 500
});

BrewCore.init({ mode: MODE });

/* ********** end region init ********** */
