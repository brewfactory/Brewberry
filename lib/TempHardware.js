/**
 * Read temperature hardware
 *
 * Before start init the device:
 *  sudo modprobe w1-gpio
 *  sudo modprobe w1-therm
 *
 * Device exec sample:
 *  cat /sys/bus/w1/devices/28-0000048f07fd/w1_slave
 *
 * Output sample:
 *  b8 01 4b 46 7f ff 08 10 8a t=27500
 *
 * @module TempHardware
 **/

'use strict';

var
  Logger = require('./../module/Logger'),
  LOG = __filename.split('/').pop(),

  exec = require('child_process').exec,

  FakeTempHardware,
  TempHardware;

/**
 * This is the description for TempHardware
 *
 * @class TempHardware
 * @param {Object} options Initial config
 * @constructor
 */
TempHardware = function (options) {
  var _this = this;

  options = options || {};

  if (!options.onChanged) {
    return Logger.error('Temperature changed callback is undefined', LOG);
  }

  this.onChanged = options.onChanged;

  this._mode = options.mode || 'normal';
  this._interval = options.interval || 500;
  this._physicalInterval = options.physicalInterval || 500;

  if (!options.exec) {
    return Logger.error('Exec for hardware is undefined', LOG);
  }

  this._exec = options.exec;

  this._lastReadTime = new Date();
  this._lastOutput = null;

  // Start read
  this._interval = setInterval(function () {
    _this.readTemperature();
  }, this._interval);
};


/**
 * Convert the output
 *
 * @method convertOutputToTemp
 * @param {String} output
 * @return {Number} Temperature
 */
TempHardware.prototype.convertOutputToTemp = function (output) {
  var temp;

  output = output || '';

  temp = output.match(/[0-9]{5,}/) || [];
  return Number(temp[0]) / 1000;
};


/**
 * Read the temperature
 * Call the temperature changed function
 *
 * @method readTemperature
 */
TempHardware.prototype.readTemperature = function () {
  var _this = this;

  if (new Date().getTime() - this._lastReadTime.getTime() >= this._physicalInterval) {
    // read from the hw
    this.readHardware(function (err, output) {

      if (err) {
        return Logger.error('Hardware read error', LOG, err);
      }

      _this._lastReadTime = new Date();
      _this._lastOutput = output;
      _this.onChanged(_this.convertOutputToTemp(output));

    });

  } else {
    // read from the cache
    this.onChanged(this.convertOutputToTemp(this._lastOutput));
  }
};


/**
 * Read the hardware for the output
 *
 * @method readHardware
 * @param {Function} callback
 */
TempHardware.prototype.readHardware = function (callback) {

  if (this._mode === 'dev') {
    FakeTempHardware = require('./FakeTempHardware');
    return callback(null, FakeTempHardware.getOutput());
  }

  exec(this._exec, function (err, stdOut, stdErr) {

    // collect errors
    if (stdErr) {
      err = [err, stdErr];
    }

    callback(err, stdOut);
  });

};

module.exports = TempHardware;
