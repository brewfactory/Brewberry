/**
 * Socket.IO
 *
 * @module SocketIO
 **/

'use strict';

var Logger = require('./Logger');
var LOG = __filename.split('/').pop();
var io = {};
var lastStatusSent = new Date();
// event notifiers
var onManualSetPWMNotifier;

// private fns
var onSocketConnection;
var onManualSetPWM;

var STATUS_FREQ = {
  value: 0
};
var Brewer;


/**
 * Initialize the Socket.io module
 *
 * @method init
 */
exports.init = function (_io, options) {
  Brewer = options.Brewer;
  io = _io;
  options = options || {};
  STATUS_FREQ.value = options.logStatusFrequency || 500;

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
  if (diff >= STATUS_FREQ.value) {
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
  exports.io = io;
  exports.STATUS_FREQ = STATUS_FREQ;
}
