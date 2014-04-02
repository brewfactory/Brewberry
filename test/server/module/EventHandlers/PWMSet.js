'use strict';
var PWMSet = require('../../../../module/EventHandlers/PWM/PWMSet');

describe('EventHandlers:PWMSet', function () {
  var BrewHeaterPWMMock = function (obj) {
    return {
      setPWMMode: function (mode) {
        obj.mode = mode;
      },
      setOutputManual: function(output) {
        obj.output = output;
      }
    };
  };

  it ('sets the PWM mode to manual', function () {
    var data = {};
    var mode = {};
    data.pwm = 0;
    PWMSet(BrewHeaterPWMMock(mode), data);
    expect(mode.mode).to.be.eql('manual');
  });

  it ('sets the output', function () {
    var data = {};
    var mode = {};
    data.pwm = 0.5;
    PWMSet(BrewHeaterPWMMock(mode), data);
    expect(mode.output).to.be.eql(0.5);
  });
});