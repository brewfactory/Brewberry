/**
 *
 * @module: PWMSet
 *
 */
'use strict';
module.exports =  function (BrewHeaterPWM, data) {
  BrewHeaterPWM.setPWMMode('manual');
  BrewHeaterPWM.setOutputManual(data.pwm);
};