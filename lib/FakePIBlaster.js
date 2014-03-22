/**
 * Fake PI Blaster
 * Emulate the hardware
 *
 * @module fake-pi-blaster
 **/

'use strict';

var
  Logger = require('./../module/Logger'),
  LOG = __filename.split('/').pop(),

  FakeTempHardware = require('./FakeTempHardware'),

// private fns
  init;


/**
 * Initialize the Event module
 *
 * @method init
 */
init = function () {
  Logger.debug('Fake pi-blaster initialized', LOG);
};


/**
 * Set PWM
 * Same interface as the real module
 *
 * @method setPwm
 */
exports.setPwm = function (pin, pwmValue) {
  FakeTempHardware.generateOutput(pwmValue);

  Logger.silly('Set fake pin', LOG, {pin: pin, value: pwmValue});
  return null;
};


init();
