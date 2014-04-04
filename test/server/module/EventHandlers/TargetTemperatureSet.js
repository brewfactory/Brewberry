'use strict';
var PointTemperatureSet = require('../../../../module/EventHandlers/Temperature/PointTemperatureSet');

describe('EventHandlers:PointTemperatureSet', function () {

  it ('sets the Point temperature', function () {
    var data = {};
    data.pwm = 0;
    PWMSet(BrewHeaterPWMMock(mode), data);
    expect(mode.mode).to.be.eql('manual');
  });

});
