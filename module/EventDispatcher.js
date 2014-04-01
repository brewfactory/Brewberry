/**
 * Handle events
 *
 * @module Event
 **/

'use strict';

var
  events = require('events'),

  Logger = require('./Logger'),
  LOG = __filename.split('/').pop(),

// emitters
  PWMEmitter = new events.EventEmitter(),
  TemperatureEmitter = new events.EventEmitter(),
  BrewEmitter = new events.EventEmitter(),

// modules
  Brewer = require('./Brewer'),
  BrewHeaterPWM = require('./BrewHeaterPWM'),
  BrewTemperature = require('./BrewTemperature'),
  SocketIO = require('./SocketIO'),

// instances
  heaterPIDController,

// private notifiers
  onManualSetPWM = require('./EventHandlers/ManualSetPWM'),
  onActualPWMChanged = require('./EventHandlers/ActualPWMChanged'),
  onActualTemperatureChanged = require('./EventHandlers/ActualTemperatureChanged'),
  onPointTemperatureChanged = require('./EventHandlers/PointTemperatureChanged'),
  onBrewChanged,
  onBrewPaused = require('./EventHandlers/BrewPaused'),
  onBrewEnded = require('./EventHandlers/BrewEnded'),
  onPhaseChanged = require('./EventHandlers/PhaseChange');


/**
 * Initialize the Event module
 *
 * @method init
 */
exports.init = function () {

  // SocketIO
  SocketIO.setManualPWMNotifier(function (pwm) {
    onManualSetPWM(PWMEmitter, Brewer.getProgress(), pwm);
  });

  // Temperature
  BrewTemperature.setActualNotifier(function (pwm) {
    onActualTemperatureChanged(TemperatureEmitter, pwm);
  });
  BrewTemperature.setPointNotifier(function (temp){
    onPointTemperatureChanged(TemperatureEmitter, temp);
  });

  // PIDController
  heaterPIDController = BrewHeaterPWM.getPIDController();

  // BrewHeaterPWM
  BrewHeaterPWM.setManualPWMNotifier(function (pwm) {
    onActualPWMChanged(PWMEmitter, pwm);
  });

  // Brewer
  Brewer.setBrewChangedNotifier(onBrewChanged);
  Brewer.setBrewPauseNotifier(function (isPaused) {
    onBrewPaused(BrewEmitter, isPaused);
  });
  Brewer.setBrewEndedNotifier(function () {
    onBrewEnded(BrewEmitter);
  });
  Brewer.setPhaseChangedNotifier(function (data) {
    onPhaseChanged(BrewEmitter, data);
  });

  Logger.info(LOG + ' is successfully initialized', LOG);
};

/**
 * On Brew changed
 *
 * @method onBrewChanged
 */
onBrewChanged = function (brew) {
  Logger.event('Brew changed', LOG, { brew: brew });

  BrewEmitter.emit('brew:changed', { brew: brew });
};


/**
 * PID Controller: set new point
 *
 */
TemperatureEmitter.on('pointTemperature:set', function (data) {
  var temp = data.temp;

  heaterPIDController.setPoint(temp);
});


/**
 * Status changed
 *
 */
TemperatureEmitter.on('actualTemperature:set', function (data) {
  var temp = data.temp;

  // Brewer
  Brewer.onTempUpdate(temp);

  // Log status (to MongoDB)
  if(Brewer.getActualBrew().name) {
    Logger.status(temp, BrewHeaterPWM.getActualPWM(), Brewer.getActualBrew().name);
  }

  // emit status to the client
  SocketIO.onStatusChange({
    temp: temp,
    pwm: BrewHeaterPWM.getActualPWM()
  });
});


/**
 * PWM setted manually
 *
 */
PWMEmitter.on('pwm:set:manual', function (data) {
  BrewHeaterPWM.setPWMMode('manual');
  BrewHeaterPWM.setOutputManual(data.pwm);
});


/**
 * Brew changed
 *
 */
BrewEmitter.on('brew:changed', function (data) {
  SocketIO.emitActualBrew(data.brew);
});


/**
 * Brew Phase changed
 *
 */
BrewEmitter.on('phase:changed', function (data) {
  SocketIO.emitPhaseChanged(data);
});