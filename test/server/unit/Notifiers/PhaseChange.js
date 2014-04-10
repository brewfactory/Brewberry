'use strict';
var PhaseChange = require('../../../../module/Notifiers/Phase/PhaseChange');
var BrewEmitterMock = require('../../helpers/EmitterMock');

describe('Notifiers:PhaseChange', function () {

  it ('notifies the BrewEmitter', function () {
    var obj = {};
    var data = {
      such: 'phasechange'
    };
    PhaseChange(BrewEmitterMock(obj), data);
    expect(obj.eventName).to.be.eql('phase:changed', data);
  });

});
