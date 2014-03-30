/**
 * Fake Temp Hardware
 * Emulate the hardware
 *
 * @module FakeTempHardware
 **/

'use strict';

var
  Logger = require('./../module/Logger'),
  LOG = __filename.split('/').pop(),

  OUTPUT_SKELETON = 'b8 01 4b 46 7f ff 08 10 8a t=',

  cWater = 4183.2,                                      // Heat capacity J/(kg*°C)
  m = 40.0,                                             // Weigh of the water (kg)
  Ta = 20,                                              // Temperature of the environment (your room, etc.) (°C)
  Rth = 0.024,                                          // Thermal conductivity, total thermal resistance between
  deltaT,                                               // Delta temperature
  T0 = 20,                                              // Start temperature of the water (°C)
  Takt = T0,                                            // Actual temperature of the water (°C)
  dt,

// private fns
  init;


/**
 * Initialize the Event module
 *
 * @method init
 */
init = function () {
  Logger.debug('FakeTempHardware initialized', LOG, {temp: Takt });
};


/**
 * Generate output
 *
 * @method generateOutput
 * @param {Number} Pactual Value of PID output
 * @param {Date} date
 */
exports.generateOutput = function (Pactual, date) {
  var deltaTime = date || new Date();
  deltaTime = deltaTime.getTime();

  if(dt) {
    deltaTime = deltaTime - dt.getTime();
    deltaTime /= 1000;

    Pactual *= 4000;

    // Delta Temperature in the k. step
    deltaT = (Pactual - (Takt - Ta) / Rth) * deltaTime / (cWater * m);
    Takt += deltaT;
  }

  dt = new Date();
};


/**
 * GetOutput
 * Same interface as the real module
 *
 * @method getOutput
 * @return {String} Output
 */
exports.getOutput = function () {
  return OUTPUT_SKELETON + (Takt * 1000);
};


init();

