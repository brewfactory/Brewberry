/**
 * Provides routing for the express application
 *
 * @module routing
 **/

'use strict';

var
  Brewer = require('./../module/Brewer');


/**
 * Set Brew
 *
 * @method setPWM
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 */
module.exports.setBrew = function (req, res) {
  var name = req.param('name') || '',
    startTime = req.param('startTime') || new Date(),
    phases = req.param('phases') || [];

  // Set new Brew
  Brewer.setBrew(name, phases, startTime);

  res.json({
    status: 'ok'
  });
};


/**
 * Stop Brew
 *
 * @method stopBrew
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 */
module.exports.stopBrew = function (req, res) {
  Brewer.cancelBrew();

  res.json({
    status: 'ok'
  });
};


/**
 * Pause Brew
 *
 * @method pauseBrew
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 */
module.exports.pauseBrew = function (req, res) {
  var paused = Brewer.setPaused();

  Brewer.emitBrewChanged();

  res.json({
    status: 'ok',
    paused: paused
  });
};