/**
 * Handle events
 *
 * @module Event
 **/


'use strict';

var
  nconf = require('nconf'),

  Logger = require('./Logger'),
  LOG = __filename.split('/').pop(),

// modules
  BrewTemperature = require('./BrewTemperature'),
  BrewHeaterPWM = require('./BrewHeaterPWM'),
  Brewer = require('./Brewer'),
  Event = require('./Event');


/**
 * Initialize the Event module
 *
 * @method init
 */
exports.init = function (options) {
  var mode;

  options.mode = options.mode || 'dev';

  mode = options.mode;

  BrewTemperature.init({
    mode: mode,
    point: 10,
    hardware: nconf.get('temp:hardware')
  });

  BrewHeaterPWM.init({
    mode: mode,
    interval: nconf.get('controller:interval'),
    outputMinimum: nconf.get('controller:output:min'),
    outputMaximum: nconf.get('controller:output:max'),
    pins: [nconf.get('relay:1'), nconf.get('relay:2')]
  });

  Brewer.init();

  Event.init();

  Logger.info(LOG + ' is successfully initialized', LOG);
};
