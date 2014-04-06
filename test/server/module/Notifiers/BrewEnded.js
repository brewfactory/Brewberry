'use strict';
var BrewEnded = require('../../../../module/Notifiers/Brew/BrewEnded');
var BrewEmitterMock = require('../Helpers/EmitterMock');

describe('Notifiers:BrewEnded', function () {

  it ('notifies the BrewEmitter', function () {
    var obj = {};
    BrewEnded(BrewEmitterMock(obj));
    expect(obj.eventName).to.be.eql('brew:ended');
  });

});
