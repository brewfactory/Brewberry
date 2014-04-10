'use strict';
var TargetTemperatureChanged = require('../../../../module/Notifiers/Temperature/TargetTemperatureChanged');
var TempEmitterMock = require('../../helpers/EmitterMock');

describe('Notifiers:TargetTemperatureChanged', function () {

  it ('notifies the BrewEmitter', function () {
    var obj = {};
    var data = 3;
    TargetTemperatureChanged(TempEmitterMock(obj), data);
    expect(obj.eventName).to.be.eql('targetTemperature:set');
    expect(obj.data).to.be.eql({temp:data});
  });

});
