'use strict';
var BrewChanged = require('../../../../module/Notifiers/Brew/BrewChanged');
var BrewEmitterMock = require('../../helpers/EmitterMock');

describe('Notifiers:BrewChanged', function () {

  it ('notifies the BrewEmitter', function () {
    var obj = {};
    var data = {
      test: 'such brew'
    };
    BrewChanged(BrewEmitterMock(obj), data);
    expect(obj.eventName).to.be.eql('brew:changed');
    expect(obj.data).to.be.eql({brew:data});
  });

});
