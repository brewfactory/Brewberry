/**
 * PID Controller: set new point
 *
 * @module: PointTemperatureSet
 *
 */
module.exports = function (heaterPIDController, data) {
  var temp = data.temp;

  heaterPIDController.setPoint(temp);
};