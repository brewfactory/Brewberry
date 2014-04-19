'use strict';

var SocketIO = require('../../../module/SocketIO');

describe.only('SocketIO\'s', function () {

  describe('init', function () {
    it('initializes the module');
  });

  describe('onStatusChange', function () {
    it('emits new status');
  });

  describe('setManualPWMNotifier', function () {
    it('sets the callback');
  });

  describe('onSocketConnection', function () {
    it('registers an event handler');
    it('notifies the brewer');
  });

  describe('emitActualBrew', function () {
    it('notifies the brewer');
  });

  describe('emitPhaseChanged', function () {
    it('returns if no socketio server is set');
    it('emits phase changed event');
  });

  describe('onManualSetPWM', function () {
    it('calls onManualSetPWMNotifier');
  });

});