/**
 * On Brew ended
 *
 * @module BrewEnded
 */
module.exports = function (BrewEmitter) {
  Logger.event('Brew ended', LOG);

  BrewEmitter.emit('brew:ended');
};