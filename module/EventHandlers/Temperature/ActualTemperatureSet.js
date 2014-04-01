/**
 * PID Controller: set new point
 *
 * @module: ActualTemperatureSet
 *
 */

var Logger = require('../../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (Brewer, BrewHeaterPWM, SocketIO, data) {
  var temp = data.temp;

  // Brewer
  Brewer.onTempUpdate(temp);

  // Log status (to MongoDB)
  if(Brewer.getActualBrew().name) {
    Logger.status(temp, BrewHeaterPWM.getActualPWM(), Brewer.getActualBrew().name);
  }

  // emit status to the client
  SocketIO.onStatusChange({
    temp: temp,
    pwm: BrewHeaterPWM.getActualPWM()
  });
};