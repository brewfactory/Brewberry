/**
 * On Phase changed
 *
 * @module PhaseChanged
 *
 * @requires Logger
 */
'use strict';

var Logger = require('../../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (BrewEmitter, data) {
  Logger.event('Phase changed', LOG, data);

  BrewEmitter.emit('phase:changed', data);
};