/**
 * On Brew changed
 *
 * @module BrewChanged
 */
'use strict';

var Logger = require('../../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (BrewEmitter, brew) {
  Logger.event('Brew changed', LOG, { brew: brew });

  BrewEmitter.emit('brew:changed', { brew: brew });
};