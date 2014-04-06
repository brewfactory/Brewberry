'use strict';
var ActualPWMChanged = require('../../../../module/Notifiers/PWM/ActualPWMChanged');
var PWMEmitterMock = require('../Helpers/EmitterMock');

describe('Notifiers:ActualPWMChanged', function () {

  it ('notifies the BrewEmitter', function () {
    var obj = {};
    var data = 3;
    ActualPWMChanged(PWMEmitterMock(obj), data);
    expect(obj.eventName).to.be.eql('pwm:set');
    expect(obj.data).to.be.eql({pwm:data});
  });

});
