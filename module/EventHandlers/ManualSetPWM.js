/**
 * On set PWM manual
 *
 * @module ManualSetPWM
 * @param {EventEmitter} PWMEmitter
 * @param {Boolean} isBrewing
 * @param {Number} pwm PWM value
 *
 * @requires Logger
 */

var Logger = require('../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (PWMEmitter, isBrewing, pwm) {

  // err: temp
  if (isNaN(pwm)) {
    return Logger.error('PWM is undefined or isNaN', LOG, pwm);
  }

  // err: Brew in progress
  if (isBrewing) {
    return Logger.error('Can not set PWM manually during a Brew.', LOG, {
      brewProgress: Brewer.getProgress(),
      pwm: pwm
    });
  }

  Logger.event('PWM set manually', LOG, {pwm: pwm});

  PWMEmitter.emit('pwm:set:manual', { pwm: pwm });
};
