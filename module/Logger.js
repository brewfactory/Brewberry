/**
 * Handle events
 *
 * @module Logger
 **/

'use strict';

var
  winston = require('winston'),

  Log = require('./../schema/Log'),
  LOG = __filename.split('/').pop(),
  Logger,

  lastStatusReport = new Date(),
  lastWaitingReports = [],

  IS_PRODUCTION = false,
  LOG_STATUS_FREQUENCY;


/**
 * Initialize the module
 *
 * @method init
 * @param {Object} options
 */
exports.init = function (options) {
  var config = {
    levels: {
      silly: 0,
      verbose: 1,
      data: 2,
      event: 3,
      info: 4,
      warn: 5,
      debug: 6,
      error: 7
    },
    colors: {
      silly: 'white',
      verbose: 'green',
      data: 'grey',
      event: 'grey',
      info: 'cyan',
      warn: 'yellow',
      debug: 'blue',
      error: 'red'
    }
  };

  options = options || {};
  options.consoleLevel = options.consoleLevel || 'info';
  options.mode = options.mode || 'normal';
  LOG_STATUS_FREQUENCY = options.logStatusFrequency || 30000;

  IS_PRODUCTION = options.mode === 'normal';

  Logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        level: options.consoleLevel
      })
    ],
    levels: config.levels,
    colors: config.colors
  });

  Logger.info(LOG + ' is successfully initialized', LOG, {
    mode: options.mode,
    isProduction: IS_PRODUCTION
  });
};


/**
 * Log level: silly
 *
 * @method silly
 */
exports.silly = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.silly.apply(Logger, args);
};


/**
 * Log level: verbose
 *
 * @method verbosel
 */
exports.verbose = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.verbose.apply(Logger, args);
};


/**
 * Log level: event
 *
 * @method event
 */
exports.event = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.event.apply(Logger, args);
};



/**
 * Log level: info
 *
 * @method info
 */
exports.info = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.info.apply(Logger, args);
};


/**
 * Log level: data
 *
 * @method data
 */
exports.data = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.data.apply(Logger, args);
};


/**
 * Log level: warn
 *
 * @method warn
 */
exports.warn = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.warn.apply(Logger, args);
};


/**
 * Log level: debug
 *
 * @method debug
 */
exports.debug = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.debug.apply(Logger, args);
};


/**
 * Log level: error
 *
 * @method error
 */
exports.error = function () {
  var args = Array.prototype.slice.call(arguments);
  Logger.error.apply(Logger, args);
};


/**
 * Wait for reaching the point temperature
 *
 * params:
 * frequency
 * msg
 * component
 * additional
 *
 */
exports.wait = function () {
  var
    now = new Date(),
    args = Array.prototype.slice.call(arguments),
    frequency = args.shift(),
    msg = args[0];

  if (!lastWaitingReports[msg] || (now.getTime() - lastWaitingReports[msg].getTime() >= frequency)) {
    lastWaitingReports[msg] = now;
    exports.silly.call(this, args);
  }
};


/**
 * Status of the system
 * save to database with mongoose
 *
 * @method status
 * @param {Number} temperature
 * @param {Number} pwm
 * @param {String} name
 */
exports.status = function (temperature, pwm, name) {
  var now = new Date(),
    logAdd,
    log;

  if (now.getTime() - lastStatusReport.getTime() >= LOG_STATUS_FREQUENCY) {
    lastStatusReport = new Date();

    // additional
    logAdd = {
      level: 'status',
      message: 'update',
      add: {
        name: name,
        temp: temperature,
        pwm: pwm
      }
    };

    if (IS_PRODUCTION === true) {

      log = new Log(logAdd);

      log.save(function save(err) {
        if (err) {
          exports.error('Log save error', 'Logger', err);
        }
      });

    } else {
      exports.info('status', 'logger', logAdd);
    }

  }
};


/**
 * Find previous brews
 *
 * @method findBrews
 * @param {Function} callback
 */
exports.findBrews = function (callback) {
  Log.aggregate({
    $match: {
      'date': {
        '$ne': null
      },
      level: 'status'
    }
  }, {
    $group: {
      _id: { day: { $dayOfYear: '$date' }, name: '$add.name' },
      from: { $min: '$date' },
      to: { $max: '$date' }
    }
  }, {
    $project: {
      name: '$add.name',
      from: '$from',
      to: '$to'
    }
  }, function (err, logs) {

    var
      response = [],
      i;

    // err
    if (err) {
      return callback(err);
    }

    for (i in logs) {
      response.push({
        name: logs[i]._id.name,
        from: logs[i].from,
        to: logs[i].to
      });
    }

    return callback(null, response);
  });
};


/**
 * Find one brew
 *
 * @method findBrews
 * @param {Object} brew
 * @param {Function} callback
 */
exports.findOneBrew = function (brew, callback) {

  brew.from = new Date(brew.from);
  brew.to = new Date(brew.to);

  Log
    .where('level', 'status')
    .where('add.name', brew.name)
    .where('date')
    .gte(brew.from)
    .lte(brew.to)
    .select('add.temp add.pwm date')
    .sort('date')
    .exec(callback);
};

