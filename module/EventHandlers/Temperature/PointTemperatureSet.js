/**
 * PID Controller: set new point
 *
 * @module: PointTemperatureSet
 *
 */
'use strict';

module.exports = function (heaterPIDController, data) {
  var temp = data.temp;

  heaterPIDController.setPoint(temp);
};