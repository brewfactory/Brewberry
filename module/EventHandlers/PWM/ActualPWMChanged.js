/**
 * On actual PWM is changed
 *
 * @module ActualPWMChanged
 * @param {EventEmitter} PWMEmitter
 * @param {Number} pwm PWM value
 *
 * @requires Logger
 */

var Logger = require('../../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (PWMEmitter, pwm) {

  // err: temp
  if (isNaN(pwm)) {
    return Logger.error('PWM is undefined or isNaN', LOG, pwm);
  }

  Logger.data('Actual PWM', LOG, {pwm: pwm});

  PWMEmitter.emit('pwm:set', { pwm: pwm });
};
