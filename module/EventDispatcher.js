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
  onManualSetPWM = require('./Notifiers/PWM/ManualSetPWM'),
  onActualPWMChanged = require('./Notifiers/PWM/ActualPWMChanged'),
  onActualTemperatureChanged = require('./Notifiers/Temperature/ActualTemperatureChanged'),
  onPointTemperatureChanged = require('./Notifiers/Temperature/PointTemperatureChanged'),
  onBrewChanged = require('./Notifiers/Brew/BrewChanged'),
  onBrewPaused = require('./Notifiers/Brew/BrewPaused'),
  onBrewEnded = require('./Notifiers/Brew/BrewEnded'),
  onPhaseChanged = require('./Notifiers/Phase/PhaseChange'),

// event handlers
  onPointTemperatureSet = require('./EventHandlers/Temperature/PointTemperatureSet');


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
  Brewer.setBrewChangedNotifier(function (brew) {
    onBrewChanged(BrewEmitter, brew);
  });
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

TemperatureEmitter.on('pointTemperature:set', function (data) {
  onPointTemperatureSet(heaterPIDController, data);
});

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