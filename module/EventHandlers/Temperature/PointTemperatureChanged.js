/**
 * On point temperature is changed
 *
 * @module PointTemperatureChanged
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
    return Logger.error('Point Temp is undefined or isNaN', LOG, temp);
  }

  Logger.event('Point temperature', LOG, {temp: temp});

  TemperatureEmitter.emit('pointTemperature:set', { temp: temp });
};
