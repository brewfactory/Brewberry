/**
 * PID Controller: set new point
 *
 * @module: ActualTemperatureSet
 *
 */

'use strict';

var Logger = require('../../Logger');

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