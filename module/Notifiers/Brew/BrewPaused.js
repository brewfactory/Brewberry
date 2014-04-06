/**
 * On Brew pause
 *
 * @module BrewPaused
 *
 * @requires Logger
 */
'use strict';

var Logger = require('../../Logger');
var LOG = __filename.split('/').pop();

module.exports = function (BrewEmitter, isPaused) {
  Logger.event('Brew pause', LOG, {
    isPaused: !!isPaused
  });

  BrewEmitter.emit('brew:paused', {
    isPaused: !!isPaused
  });
};