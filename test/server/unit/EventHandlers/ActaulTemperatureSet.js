'use strict';

var ActualTemperatureSet = require('../../../../module/EventHandlers/Temperature/ActualTemperatureSet');
var BrewerMock = require('../../helper/BrewerMock');
var BrewHeaterPWMMock = require('../../helper/BrewHeaterPWMMock');

var SocketIOModuleMock = function (obj) {
  return {
    onStatusChange: function (data) {
      obj.data = data;
    }
  };
};

describe('EventHandlers:ActualTemperatureSet', function () {

  var dataMock = {
    temp: 0.2
  };

  it ('sets the temperature on the Brewer', function () {
    var mock = {};
    ActualTemperatureSet(BrewerMock(mock), BrewHeaterPWMMock({}), SocketIOModuleMock({}), dataMock);
    expect(mock.temp).to.be.eql(0.2);
  });

  it ('notifies SocketIO', function () {
    var mock = {};
    ActualTemperatureSet(BrewerMock({}), BrewHeaterPWMMock({}), SocketIOModuleMock(mock), dataMock);
    expect(mock.data).to.be.eql({
      temp: 0.2,
      pwm: 60
    });
  });

});
