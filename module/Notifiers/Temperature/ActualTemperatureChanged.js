/**
 * On actual temperature is changed
 *
 * @module ActualTemperatureChanged
 * @param {EventEmitter} TemperatureEmitter
 * @param {Number} temp Temperature
 *
 * @requires Logger
 */

var Logger = require('../../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (TemperatureEmitter, temp) {

  // err: temp
  if (isNaN(temp)) {
    return Logger.error('Actual Temp is undefined or isNaN', LOG, temp);
  }

  Logger.data('Actual temperature', LOG, {temp: temp});

  TemperatureEmitter.emit('actualTemperature:set', { temp: temp });
};
