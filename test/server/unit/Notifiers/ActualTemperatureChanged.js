'use strict';
var ActualTemperatureChanged = require('../../../../module/Notifiers/Temperature/ActualTemperatureChanged');
var TempEmitterMock = require('../../helpers/EmitterMock');

describe('Notifiers:ActualTemperatureChanged', function () {

  it ('notifies the BrewEmitter', function () {
    var obj = {};
    var data = 3;
    ActualTemperatureChanged(TempEmitterMock(obj), data);
    expect(obj.eventName).to.be.eql('actualTemperature:set');
    expect(obj.data).to.be.eql({temp:data});
  });

});
