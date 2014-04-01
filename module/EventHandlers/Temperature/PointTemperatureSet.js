/**
 * PID Controller: set new point
 *
 * @module: ActualTemperatureSet
 *
 */
module.exports = function (heaterPIDController, data) {
  var temp = data.temp;

  heaterPIDController.setPoint(temp);
};