/**
 * Brewing module
 * manage phases
 *
 * @module Brewer
 **/

'use strict';

var
  schedule = require('node-schedule'),

  Logger = require('./Logger'),
  LOG = __filename.split('/').pop(),

// dependencies
  BrewTemperature = require('./BrewTemperature'),

  _actualBrew,
  _prevPhase,
  _actualPhase,

// external notifiers
  onBrewChangedNotifier,
  onBrewEndedNotifier,
  onBrewPauseNotifier,
  onPhaseChangedNotifier,

// internal notifiers
  onBrewPause,
  onBrewChanged,
  onBrewEnded,
  onPhaseChanged,

// private fns
  resetActualBrew,
  brewChanged,
  endBrew,
  startNextPhase,
  activateActualPhase,

  BOILING_TOLERATED_TEMP = 99;


/**
 * Initialize
 *
 * @method init
 */
exports.init = function () {
  resetActualBrew();

  Logger.info('Brewer is successfully initialized', LOG);
};


/**
 * Set Brew changed notifier
 * set from EventDispatcher
 *
 * @method setBrewChangedNotifier
 * @param {Function} notifierFn
 */
exports.setBrewChangedNotifier = function (notifierFn) {
  if (typeof notifierFn !== 'function') {
    return Logger.error('onBrewChangedNotifier should be a function', LOG);
  }
  onBrewChangedNotifier = notifierFn;
};


/**
 * Set Brew ended notifier
 * set from EventDispatcher
 *
 * @method setBrewEndedNotifier
 * @param {Function} notifierFn
 */
exports.setBrewEndedNotifier = function (notifierFn) {
  if (typeof notifierFn !== 'function') {
    return Logger.error('onBrewEndedNotifier should be a function', LOG);
  }
  onBrewEndedNotifier = notifierFn;
};


/**
 * Set Phase changed notifier
 * set from EventDispatcher
 *
 * @method setPhaseChangedNotifier
 * @param {Function} notifierFn
 */
exports.setPhaseChangedNotifier = function (notifierFn) {
  if (typeof notifierFn !== 'function') {
    return Logger.error('onPhaseEndedNotifier should be a function', LOG);
  }
  onPhaseChangedNotifier = notifierFn;
};


/**
 * Set Brew pause notifier
 * set from EventDispatcher
 *
 * @method setBrewPauseNotifier
 * @param {Function} notifierFn
 */
exports.setBrewPauseNotifier = function (notifierFn) {
  if (typeof notifierFn !== 'function') {
    return Logger.error('setBrewPauseNotifier should be a function', LOG);
  }
  onBrewPauseNotifier = notifierFn;
};


/**
 * On brew pause
 * internal notifier
 * call external notifier
 *
 * @method onBrewPause
 * @param {Boolean} isPaused
 */
onBrewPause = function (isPaused) {
  if (typeof onBrewPauseNotifier === 'function') {
    onBrewPauseNotifier(isPaused);
  }
};


/**
 * On brew changed
 * internal notifier
 * call external notifier
 *
 * @method onBrewChanged
 * @param {Object} pureActualBrew
 */
onBrewChanged = function (pureActualBrew) {
  if (typeof onBrewChangedNotifier === 'function') {
    onBrewChangedNotifier(pureActualBrew);
  }
};


/**
 * On phase changed
 * internal notifier
 * call external notifier
 *
 * @method onPhaseChanged
 */
onPhaseChanged = function (data) {
  if (typeof onPhaseChangedNotifier === 'function') {
    onPhaseChangedNotifier(data);
  }
};


/**
 * On brew ended
 * internal notifier
 * call external notifier
 *
 * @method onBrewPause
 */
onBrewEnded = function () {
  if (typeof onBrewEndedNotifier === 'function') {
    onBrewEndedNotifier();
  }
};


/**
 * Get Brew progress
 *
 * @method getProgress
 * @return {Boolean}
 */
exports.getProgress = function () {
  return _actualBrew && _actualBrew.inProgress;
};


/**
 * Cancel brew
 *
 * @method cancelBrew
 */
exports.cancelBrew = function () {
  endBrew();
};


/**
 * Reset actual brew
 *
 * @method resetActualBrew
 */
resetActualBrew = function () {

  // Cancel jobs
  if (_actualBrew && _actualBrew.jobs) {
    _actualBrew.jobs.forEach(function (job) {
      job.cancel();
    });
  }

  // Reset actual brew
  _actualBrew = {
    name: null,
    startTime: null,
    jobs: [],
    phases: [],
    inProgress: false,
    paused: false
  };

  // Reset phase (actual, previous)
  _actualPhase = null;
  _prevPhase = null;

  // Emit brew ended
  onBrewEnded();

  brewChanged();
};


/**
 * End actual brew
 *
 * @method endBrew
 */
endBrew = function () {

  // log
  Logger.info('Brew ended', LOG, {
    name: _actualBrew.name,
    date: new Date()
  });

  // Reset
  resetActualBrew();

  // Set point temp
  BrewTemperature.setPointToInactive();

  // Emit brew change
  brewChanged();
};


/**
 * Emit brew change
 *
 * @method brewChanged
 */
exports.emitBrewChanged = brewChanged = function () {
  var pureActualBrew = {
    name: _actualBrew.name,
    startTime: _actualBrew.startTime,
    inProgress: _actualBrew.inProgress,
    paused: _actualBrew.paused,
    phases: _actualBrew.phases.map(function (phase) {
      return {
        min: phase.min,
        temp: phase.temp,
        jobEnd: phase.jobEnd || null,
        inProgress: phase.inProgress,
        tempReached: phase.tempReached
      };
    })
  };

  // Notify EventDispatcher module
  onBrewChanged(pureActualBrew);

};


/**
 * Set paused state
 * Pause the actual phase and save the state for restore
 * Restore paused state
 *
 * @method resetActualBrew
 * @return {Boolean} state of actual brew
 */
exports.setPaused = function () {
  var pauseDiff;

  _actualBrew.paused = !_actualBrew.paused;

  // event
  onBrewPause(_actualBrew.paused);

  // Temp didn't be reached
  if (_actualPhase.inProgress === true && _actualPhase.tempReached === false) {
    if (_actualBrew.paused === true) {

      Logger.info('Paused', LOG, {
        name: _actualBrew.name,
        holdTemp: BrewTemperature.getActual()
      });

      BrewTemperature.setPoint(BrewTemperature.getActual());
    } else {

      Logger.info('Resumed', LOG, {
        name: _actualBrew.name
      });

      BrewTemperature.setPoint(_actualPhase.temp);
    }
  }

  // Temp was reached
  else if (_actualPhase.inProgress === true && _actualPhase.tempReached === true) {
    if (_actualBrew.paused) {
      _actualPhase.pausedAt = new Date();
      _actualPhase.job.cancel();

      // Hold actual temp
      BrewTemperature.setPoint(BrewTemperature.getActual());

      // log
      Logger.info('Paused', LOG, {
        name: _actualBrew.name
      });

    } else {
      pauseDiff = new Date().getTime() - _actualPhase.pausedAt.getTime();

      _actualPhase.jobEnd.setTime(_actualPhase.jobEnd.getTime() + pauseDiff);
      _actualPhase.job = schedule.scheduleJob(_actualPhase.jobEnd, startNextPhase);
      _actualBrew.jobs.push(_actualPhase.job);

      // Restore point temperature
      BrewTemperature.setPoint(_actualPhase.temp);

      // log
      Logger.info('Resumed', LOG, {
        name: _actualBrew.name,
        wait: pauseDiff
      });
    }
  }

  return _actualBrew.paused;
};


/**
 * Set new brew
 *
 * @method setBrew
 * @param {String} name
 * @param {Array} phases
 * @param {Date} startTime as Date str
 */
exports.setBrew = function (name, phases, startTime) {

  // cancel earlier
  endBrew();

  // set actual
  _actualBrew.name = name;
  _actualBrew.phases = phases;
  _actualBrew.startTime = new Date(startTime);

  // Set default phases
  _actualBrew.phases = _actualBrew.phases.map(function (phase) {
    phase.inProgress = false;
    phase.tempReached = false;

    return phase;
  });

  Logger.info('set brew', LOG, {
    name: _actualBrew.name,
    phases: _actualBrew.phases,
    startTime: _actualBrew.startTime
  });

  if (_actualBrew.startTime <= new Date()) {
    startNextPhase();
  } else {
    _actualBrew.jobs.push(schedule.scheduleJob(_actualBrew.startTime, startNextPhase));
  }

  // Emit brew change
  brewChanged();
};


/**
 * Get actual brew
 *
 * @method getActualBrew
 */
exports.getActualBrew = function () {
  return _actualBrew;
};


/**
 * Start the next phase
 *
 * @method startNextPhase
 */
startNextPhase = function () {
  var
    actualIdx = _actualBrew.phases.indexOf(_actualPhase),
    phasesLength = _actualBrew.phases.length;

  _actualBrew.inProgress = true;

  if (_actualPhase) {
    _prevPhase = _actualPhase;
    _prevPhase.inProgress = false;
    _prevPhase.job.cancel();
    _prevPhase.job = null;

    onPhaseChanged({ status: 'ended' });

    Logger.info('stop phase', LOG, {phase: _prevPhase});
  }

  // start new phase
  if (phasesLength - 1 > actualIdx) {
    _actualPhase = _actualBrew.phases[actualIdx + 1];
    _actualPhase.tempReached = false;
    _actualPhase.inProgress = true;

    // Set point temperature
    BrewTemperature.setPoint(_actualPhase.temp);

    // log
    Logger.info('start phase', LOG, _actualPhase);

    // Emit brew change
    brewChanged();
  }

  // no more phase left
  else {
    // End brew
    endBrew();
  }
};


/**
 * Called from external by the EventDispatcher module
 * Fires when temperature updated
 *
 * @method onTempUpdate
 */
exports.onTempUpdate = function (temp) {
  var
    isHeating,
    isCooling,
    isBoiling;

  // prev phase temp
  if (!_prevPhase) {
    _prevPhase = _prevPhase || {};
    _prevPhase.temp = temp;
  }

  // actual phase
  if (!_actualBrew.paused && _actualPhase && !_actualPhase.tempReached) {

    // Log wait
    Logger.wait(5000, 'temp waiting', LOG, {
      actualTemp: temp,
      waitForTemp: _actualPhase.temp
    });

    isHeating = _prevPhase.temp <= _actualPhase.temp;
    isCooling = _prevPhase.temp >= _actualPhase.temp;
    isBoiling = 100 === _actualPhase.temp;

    // Heating
    if (temp >= _actualPhase.temp && isHeating) {
      Logger.info('Temp reached for the phase', LOG, {mode: 'heating'});

      activateActualPhase();
    }

    // Heating: Boiling
    else if (isBoiling && temp >= BOILING_TOLERATED_TEMP && isHeating) {
      Logger.info('Temp reached for the phase', LOG, {mode: 'heating'});

      activateActualPhase();
    } else if (temp < _actualPhase.temp && isHeating) {
      Logger.silly('Heating necessary to reach the phase temp', LOG, {mode: 'heating'});
    }

    // Wait for cool
    else if (temp <= _actualPhase.temp && isCooling) {
      Logger.info('Temp reached for the phase', LOG, {mode: 'cooling'});

      activateActualPhase();
    } else if (temp > _actualPhase.temp && isCooling) {
      Logger.silly('Cooling necessary to reach the phase temp', LOG, {mode: 'cooling'});
    }

  }

};


/**
 * Set the actual phase to the active phase
 *
 * @method activateActualPhase
 */
activateActualPhase = function () {

  // Change state of the actual phase
  _actualPhase.tempReached = true;

  // Log
  Logger.info('activate phase', LOG, _actualPhase);

  // schedule phase end trigger
  _actualPhase.jobEnd = new Date();
  _actualPhase.jobEnd.setMinutes(_actualPhase.jobEnd.getMinutes() + _actualPhase.min);
  _actualPhase.job = schedule.scheduleJob(_actualPhase.jobEnd, startNextPhase);
  _actualBrew.jobs.push(_actualPhase.job);

  brewChanged();
};
