/**
 * Socket.IO
 *
 * @module SocketIO
 **/

'use strict';

var
  socketIO = require('socket.io'),
  Logger = require('./Logger'),
  Brewer = require('./Brewer'),
  LOG = __filename.split('/').pop(),
  io,
  lastStatusSent = new Date(),

// event notifiers
  onManualSetPWMNotifier,

// private fns
  onSocketConnection,
  onManualSetPWM,

  STATUS_FREQ;


/**
 * Initialize the Socket.io module
 *
 * @method init
 */
exports.init = function (server, options) {
  options = options || {};
  options.logLevel = options.logLevel || 1;
  STATUS_FREQ = options.logStatusFrequency || 500;

  if (!server) {
    return Logger.error('Server is undefined', LOG);
  }

  io = socketIO.listen(server);
  io.set('log level', options.logLevel);
  io.sockets.on('connection', onSocketConnection);

  Logger.info(LOG + ' is successfully initialized', LOG);
};


/**
 * On status changed from EventDispatcher
 *
 * @method onStatusChange
 */
exports.onStatusChange = function (data) {
  var diff = new Date().getTime() - lastStatusSent.getTime();
  if (diff >= STATUS_FREQ) {
    io.sockets.emit('status', {
      temp: data.temp,
      pwm: data.pwm
    });

    lastStatusSent = new Date();
  }
};


/**
 * Set Manual PWM notifier
 *
 * @method setManualPWMNotifier
 */
exports.setManualPWMNotifier = function (callback) {
  onManualSetPWMNotifier = callback;
};


/**
 * On Socket Connect
 * Register incoming events
 *
 * @method onSocketConnection
 */
onSocketConnection = function (socket) {
  socket.on('pwm:set:manual', onManualSetPWM);

  /// init for new user
  Brewer.emitBrewChanged();
};


/**
 * Emit actual Brew to every connected clients
 *
 * @method emitActualBrew
 */
exports.emitActualBrew = function (actualBrew) {

  if (!io) {
    return;
  }

  io.sockets.emit('actual:brew', actualBrew);
};


/**
 * Emit phase changed
 *
 * @method emitPhaseChanged
 */
exports.emitPhaseChanged = function (data) {

  if (!io) {
    return;
  }

  io.sockets.emit('phase:changed', data);
};


/**
 * On set PWM event
 *
 * @method onSetPWM
 */
onManualSetPWM = function (data) {
  var pwmValue;

  data = data || {};

  if (isNaN(data.pwm)) {
    return Logger.error('PWM value is undefined or isNaN', { data: data });
  }

  pwmValue = data.pwm / 100;

  if (typeof  onManualSetPWMNotifier === 'function') {
    onManualSetPWMNotifier(pwmValue);
  }
};

if (process.env.NODE_ENV === 'test') {
  exports.onManualSetPWM = onManualSetPWM;
  exports.onSocketConnection = onSocketConnection;
}
