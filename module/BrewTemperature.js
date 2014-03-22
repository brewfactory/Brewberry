/**
 * Brew Temperature
 * Read the temperature from the hardware
 *
 * @module BrewTemperature
 **/

'use strict';

var
  TempHardware = require('./../lib/TempHardware'),
  brewTempHardware,

  actualTemperature,
  pointTemperature,

// external notifiers
  onActualChangedNotifier,
  onPointChangedNotifier,

// private fns
  setActual,

// logger
  Logger = require('./Logger'),
  LOG = __filename.split('/').pop(),

// statics
  INACTIVE_POINT = 5;


/**
 * Initialize the module
 *
 * @method init
 */
exports.init = function (options) {
  options = options || {};

  // Err: temp hardware is required (unix file read)
  if(!options.hardware) {
    Logger.error('Hardware is required', LOG);
    throw new Error('Hardware is required');
  }

  options.mode = options.mode || 'normal';
  exports.setPoint(options.point || INACTIVE_POINT);

  // Initialize temperature hardware
  brewTempHardware = new TempHardware({
    mode: options.mode,
    interval: 500,
    physicalInterval: 1000,
    exec: 'cat ' + options.hardware,
    onChanged: setActual
  });

  Logger.info(LOG + ' is successfully initialized', LOG);
};


/**
 * Set setActualNotifier
 *
 * @method setActualNotifier
 * @param {Function} callback
 */
exports.setActualNotifier = function (callback) {
  onActualChangedNotifier = callback;
};


/**
 * Set setPointNotifier
 *
 * @method setPointNotifier
 * @param {Function} callback
 */
exports.setPointNotifier = function (callback) {
  onPointChangedNotifier = callback;
};


/**
 * Set the actual temperature
 *
 * @method setActual
 * @param {Number} temperature
 * @return {Number} Temperature
 */
setActual = function (temperature) {
  actualTemperature = Number(temperature);

  // Notify Event module
  if (typeof onActualChangedNotifier === 'function' && !isNaN(actualTemperature)) {
    onActualChangedNotifier(actualTemperature);
  }

  return actualTemperature;
};


/**
 * Get the actual temperature
 *
 * @method getActual
 * @return {Number} Temperature
 */
exports.getActual = function () {
  return actualTemperature;
};


/**
 * Set the point temperature
 *
 * @method setPoint
 * @param {Number} temperature
 * @return {Number} Temperature
 */
exports.setPoint = function (temperature) {
  pointTemperature = Number(temperature);

  // Log
  Logger.silly('Set point temperature', LOG, {
    temp: temperature
  });

  // Notify Event module
  if (typeof onPointChangedNotifier === 'function' && !isNaN(pointTemperature)) {
    onPointChangedNotifier(pointTemperature);
  }

  return pointTemperature;
};


/**
 * Set point off
 *
 * @method setPointToInactive
 */
exports.setPointToInactive = function () {

  // Log
  Logger.silly('Set point temperature to Inactive', LOG);

  exports.setPoint(INACTIVE_POINT);
};


/**
 * Get the point temperature
 *
 * @method getPoint
 * @return {Number} Temperature
 */
exports.getPoint = function () {
  return pointTemperature;
};
