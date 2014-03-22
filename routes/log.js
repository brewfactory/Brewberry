/**
 * Provides routing for the express application
 *
 * @module routing
 **/

'use strict';

var
  Logger = require('./../module/Logger');

/**
 * Find brew logs
 *
 * @method findBrewLogs
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 * @param {Function} next Express Function
 */
module.exports.findBrewLogs = function (req, res, next) {
  Logger.findBrews(function (err, result) {

    // err
    if (err) {
      return next(err);
    }

    res.json(result);
  });
};


/**
 * Find one brew log
 *
 * @method findBrewLogs
 * @param {Object} req Express Object
 * @param {Object} res Express Object
 * @param {Function} next Express Function
 */
module.exports.findOneBrewLog = function (req, res, next) {
  var brew = req.param('brew');

  // err: brew
  if (!brew) {
    return next(new Error('Undefined brew'));
  }

  Logger.findOneBrew(brew, function (err, result) {

    // err
    if (err) {
      return next(err);
    }

    res.json(result);
  });
};
