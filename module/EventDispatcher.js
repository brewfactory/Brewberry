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
  onManualSetPWM,
  onActualPWMChanged,
  onActualTemperatureChanged,
  onPointTemperatureChanged,
  onBrewChanged,
  onBrewPause,
  onBrewEnded,
  onPhaseChanged;


/**
 * Initialize the Event module
 *
 * @method init
 */
exports.init = function () {

  // SocketIO
  SocketIO.setManualPWMNotifier(onManualSetPWM);

  // Temperature
  BrewTemperature.setActualNotifier(onActualTemperatureChanged);
  BrewTemperature.setPointNotifier(onPointTemperatureChanged);

  // PIDController
  heaterPIDController = BrewHeaterPWM.getPIDController();

  // BrewHeaterPWM
  BrewHeaterPWM.setManualPWMNotifier(onActualPWMChanged);

  // Brewer
  Brewer.setBrewChangedNotifier(onBrewChanged);
  Brewer.setBrewPauseNotifier(onBrewPause);
  Brewer.setBrewEndedNotifier(onBrewEnded);
  Brewer.setPhaseChangedNotifier(onPhaseChanged);

  Logger.info(LOG + ' is successfully initialized', LOG);
};


/**
 * On set PWM manual
 *
 * @method onManualSetPWM
 * @param {Number} pwm PWM value
 */
onManualSetPWM = function (pwm) {

  // err: temp
  if (isNaN(pwm)) {
    return Logger.error('PWM is undefined or isNaN', LOG, pwm);
  }

  // err: Brew in progress
  if (Brewer.getProgress() === true) {
    return Logger.error('Can not set PWM manually during a Brew.', LOG, {
      brewProgress: Brewer.getProgress(),
      pwm: pwm
    });
  }

  Logger.event('PWM set manually', LOG, {pwm: pwm});

  PWMEmitter.emit('pwm:set:manual', { pwm: pwm });
};


/**
 * On actual PWM is changed
 *
 * @method onActualPWMChanged
 * @param {Number} pwm PWM value
 */
onActualPWMChanged = function (pwm) {

  // err: temp
  if (isNaN(pwm)) {
    return Logger.error('PWM is undefined or isNaN', LOG, pwm);
  }

  Logger.data('Actual PWM', LOG, {pwm: pwm});

  PWMEmitter.emit('pwm:set', { pwm: pwm });
};


/**
 * On actual temperature is changed
 *
 * @method onActualTemperatureChanged
 * @param {Number} temp Temperature
 */
onActualTemperatureChanged = function (temp) {

  // err: temp
  if (isNaN(temp)) {
    return Logger.error('Actual Temp is undefined or isNaN', LOG, temp);
  }

  Logger.data('Actual temperature', LOG, {temp: temp});

  TemperatureEmitter.emit('actualTemperature:set', { temp: temp });
};


/**
 * On point temperature is changed
 *
 * @method onPointTemperatureChanged
 * @param {Number} temp Temperature
 */
onPointTemperatureChanged = function (temp) {

  // err: temp
  if (isNaN(temp)) {
    return Logger.error('Point Temp is undefined or isNaN', LOG, temp);
  }

  Logger.event('Point temperature', LOG, {temp: temp});

  TemperatureEmitter.emit('pointTemperature:set', { temp: temp });
};


/**
 * On Brew ended
 *
 * @method onBrewEnded
 */
onBrewEnded = function () {
  Logger.event('Brew ended', LOG);

  BrewEmitter.emit('brew:ended');
};


/**
 * On Phase changed
 *
 * @method onPhaseChanged
 */
onPhaseChanged = function (data) {
  Logger.event('Phase changed', LOG, data);

  BrewEmitter.emit('phase:changed', data);
};


/**
 * On Brew pause
 *
 * @method onBrewPause
 */
onBrewPause = function (isPaused) {
  Logger.event('Brew pause', LOG, {
    isPaused: !!isPaused
  });

  BrewEmitter.emit('brew:pause', {
    isPaused: !!isPaused
  });
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