'use strict';

var SocketIO = require('../../../module/SocketIO');
var SocketIOMock = require('../helper/SocketIOMock');
var http = require('http');
var socketio = require('socket.io');
var io = socketio.listen(http.createServer());


describe.only('SocketIO\'s', function () {

  describe('init', function () {
    it('initializes the module with defaults', function () {
      SocketIO.init(io);
      expect(SocketIO.io).to.be.ok;
      expect(SocketIO.STATUS_FREQ.value).to.be.eql(500);
    });
  });

  describe('onStatusChange', function () {
    it('emits new status', function () {
      var obj = {};
      var data = {
        temp: 30,
        pwm: 0.3
      };
      SocketIO.init(SocketIOMock(obj));
      SocketIO.STATUS_FREQ.value = 0;
      SocketIO.onStatusChange(data);
      expect(obj.emit.data.temp).to.be.eql(30);
      expect(obj.emit.data.pwm).to.be.eql(0.3);
      expect(obj.emit.event).to.be.eql('status');
    });
  });

  describe('onSocketConnection', function () {
    it('registers an event handler');
    it('notifies the brewer');
  });

  describe('emitActualBrew', function () {
    it('emits', function () {
      var obj = {};
      var data = {
        test: 'such brew'
      };
      SocketIO.init(SocketIOMock(obj));
      SocketIO.emitActualBrew(data);
      expect(obj.emit.event).to.be.eql('actual:brew');
      expect(obj.emit.data).to.be.eql(data);
    });
  });

  describe('emitPhaseChanged', function () {
    it('emits phase changed event', function () {
      var obj = {};
      var data = {
        test: 'such brew'
      };
      SocketIO.init(SocketIOMock(obj));
      SocketIO.emitPhaseChanged(data);
      expect(obj.emit.event).to.be.eql('phase:changed');
      expect(obj.emit.data).to.be.eql(data);
    });
  });

  describe('onManualSetPWM', function () {
    it('calls onManualSetPWMNotifier');
  });

});