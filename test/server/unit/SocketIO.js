'use strict';

var SocketIO = require('../../../module/SocketIO');
var SocketIOMock = require('../helper/SocketIOMock');
var BrewerMock = require('../helper/BrewerMock');
var http = require('http');
var socketio = require('socket.io');
var io = socketio.listen(http.createServer());


describe('SocketIO\'s', function () {

  describe('init', function () {
    it('initializes the module with defaults', function () {
      SocketIO.init(io, {
        Brewer: BrewerMock({})
      });
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
      SocketIO.init(SocketIOMock(obj), {
        Brewer: BrewerMock({})
      });
      SocketIO.STATUS_FREQ.value = 0;
      SocketIO.onStatusChange(data);
      expect(obj.emit.data.temp).to.be.eql(30);
      expect(obj.emit.data.pwm).to.be.eql(0.3);
      expect(obj.emit.event).to.be.eql('status');
    });
  });

  describe('onSocketConnection', function () {
    it('registers an event handler', function () {
      var obj = {};
      SocketIO.init(SocketIOMock(obj), {
        Brewer: BrewerMock({})
      });
      SocketIO.onSocketConnection({
        on: function(name) {
          obj.eventName = name;
        }
      });
      expect(obj.eventName).to.be.eql('pwm:set:manual');
    });
    it('notifies the brewer', function () {
      var obj = {};
      SocketIO.init(SocketIOMock(obj), {
        Brewer: BrewerMock(obj)
      });
      SocketIO.onSocketConnection({
        on: function() {}
      });
      expect(obj.emitChanged).to.be.eql(true);
    });
  });

  describe('emitActualBrew', function () {
    it('emits', function () {
      var obj = {};
      var data = {
        test: 'such brew'
      };
      SocketIO.init(SocketIOMock(obj), {
        Brewer: BrewerMock({})
      });
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
      SocketIO.init(SocketIOMock(obj), {
        Brewer: BrewerMock({})
      });
      SocketIO.emitPhaseChanged(data);
      expect(obj.emit.event).to.be.eql('phase:changed');
      expect(obj.emit.data).to.be.eql(data);
    });
  });

  describe('onManualSetPWM', function () {
    it('calls onManualSetPWMNotifier', function () {
      var obj = {};
      var data = {
        pwm: 0.3
      };
      var notifier = function (data) {
        obj.data = data;
      };
      SocketIO.init(SocketIOMock(obj), {
        Brewer: BrewerMock({})
      });
      SocketIO.setManualPWMNotifier(notifier);
      SocketIO.onManualSetPWM(data);
      expect(obj.data).to.be.eql(data.pwm / 100);
    });
  });

});
