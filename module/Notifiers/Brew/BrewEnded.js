/**
 * On Brew ended
 *
 * @module BrewEnded
 *
 * @requires Logger
 */
'use strict';

var Logger = require('../../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (BrewEmitter) {
  Logger.event('Brew ended', LOG);

  BrewEmitter.emit('brew:ended');
};