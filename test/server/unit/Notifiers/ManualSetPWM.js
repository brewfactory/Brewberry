'use strict';
var ManualSetPWM = require('../../../../module/Notifiers/PWM/ManualSetPWM');
var PWMEmitterMock = require('../../helpers/EmitterMock');

describe('Notifiers:ManualSetPWM', function () {

  describe('when brew is not in progress', function () {
    it ('notifies the BrewEmitter', function () {
      var obj = {};
      var data = 3;
      ManualSetPWM(PWMEmitterMock(obj), false, data);
      expect(obj.eventName).to.be.eql('pwm:set:manual');
      expect(obj.data).to.be.eql({pwm:data});
    });
  });

  describe('when brew is in progress', function () {
    it ('fails silently, logs it', function () {
      var obj = {};
      var data = 3;
      ManualSetPWM(PWMEmitterMock(obj), true, data);
    });
  });

});
