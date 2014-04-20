/**
 * Application root
 *
 * @module App
 **/

'use strict';

/* ********** region Configuration ********** */


var express = require('express');
var http = require('http');
var path = require('path');

var mongoose = require('mongoose');
var nconf = require('nconf');

var app = module.exports = express();

var routeBrew = require('./routes/brew');
var routeLog = require('./routes/log');

var Brewer = require('./module/Brewer');
var LogModel = require('./schema/Log');

var Logger = require('./module/Logger');
var LOG = __filename.split('/').pop();

var socketIO = require('socket.io');
var SocketIO = require('./module/SocketIO');

var BrewCore = require('./module/BrewCore');

var MODE = 'production' === app.get('env') ? 'normal' : 'dev';

var io;
var server;

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

io = socketIO.listen(server);
io.set('log level', 1);

SocketIO.init(io, {
  logStatusFrequency: 500,
  Brewer: Brewer
});

BrewCore.init({ mode: MODE });

/* ********** end region init ********** */
