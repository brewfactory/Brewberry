/**
 * BrewHeaterPWM
 * Control the PWM, depends on the temperature values
 *
 * @module Temp
 **/

'use strict';

var
  PIDController = require('liquid-pid'),
  nconf = require('nconf'),

  Logger = require('./Logger'),
  LOG = __filename.split('/').pop(),

  BrewTemperature = require('./BrewTemperature'),

  pwmOutput = 0,
  controlledPins = [],
  heaterPIDController,
  piBlaster,
  mode,
  pwmMode,

// external notifier
  onPWMChanged,

// privates
  controlPWM,
  setPins,

  // static
  PMAX;

/**
 * Initialize the module
 *
 * @method init
 * @param {Object} options
 */
exports.init = function (options) {
  options = options || {};

  options.mode = options.mode || 'normal';
  pwmMode = options.pwmMode || 'auto';
  controlledPins = options.pins || [];

  PMAX = nconf.get('brew:pmax');

  heaterPIDController = new PIDController({
    Kp: 25,
    Ki: 1000,
    Kd: 9,
    temp: {
      ref: BrewTemperature.getPoint(),
      Pmax: PMAX
    }
  });

  setInterval(controlPWM, 500);

  // mock
  if (options.mode === 'dev') {
    piBlaster = require('./../lib/FakePIBlaster');
  } else {
    piBlaster = require('pi-blaster.js');
  }

  mode = options.mode;

  // set pins to 0
  process.nextTick(function () {
    controlledPins.forEach(function (pin) {
      piBlaster.setPwm(pin, 0);
    });
  });

  Logger.info(LOG + ' is successfully initialized', LOG);
};


/**
 * Set setManualPWMNotifier
 *
 * @method setManualPWMNotifier
 * @param {Function} callback
 */
exports.setManualPWMNotifier = function (callback) {
  onPWMChanged = callback;
};


/**
 * Control PWM
 *
 * @method controlPWM
 */
controlPWM = function () {
  var
    pointTemperature = BrewTemperature.getPoint(),
    actualTemperature = BrewTemperature.getActual();

  if (isNaN(pointTemperature) || isNaN(actualTemperature)) {
    return;
  }

  // Manual mode
  if (pwmMode === 'manual') {

    if (mode === 'dev') {
      setPins();
    }

    return;
  }

  // Boiling
  if(pointTemperature >= 100) {
    pwmOutput = 1;    // 100%
  }

  // calculate the PWM output
  else {
    pwmOutput = heaterPIDController.calculate(actualTemperature);
    pwmOutput = Number(pwmOutput) / PMAX;
  }

  // Notify Event module
  if (typeof onPWMChanged === 'function') {
    onPWMChanged(pwmOutput);
  }

  // Set the output on the pins
  setPins();

};


/**
 * Set pins to output
 *
 * @method setPins
 */
setPins = function () {
  controlledPins.forEach(function (pin) {
    piBlaster.setPwm(pin, pwmOutput);
  });
};


/**
 * Get pidController
 *
 * @method getPIDController
 */
exports.getPIDController = function () {
  return heaterPIDController;
};


/**
 * Get actualPWM
 *
 * @method getActualPWM
 */
exports.getActualPWM = function () {
  return pwmOutput;
};


/**
 * Set pwm mode
 *
 * @method setPWMMode
 * @param {String} mode
 */
exports.setPWMMode = function (mode) {
  if (mode !== 'manual') {
    mode = 'auto';
  }

  pwmMode = mode;
};


/**
 * Set pwm output manually
 *
 * @method setPWMMode
 * @param {Number} output
 */
exports.setOutputManual = function (output) {

  // only in manual mode
  if (pwmMode !== 'manual') {
    return Logger.error('PWM mode is not equal with "manual"', LOG, {pwmMode: pwmMode});
  }

  output = output || 0;
  pwmOutput = Number(output);

  setPins();
};
