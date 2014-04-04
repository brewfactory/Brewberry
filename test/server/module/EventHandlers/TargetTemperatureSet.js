'use strict';
var TargetTemperatureSet = require('../../../../module/EventHandlers/Temperature/TargetTemperatureSet');

describe('EventHandlers:PointTemperatureSet', function () {

  var heaterPIDControllerMock = function (obj) {
    return {
      setPoint: function (temp) {
        obj.temp = temp;
      }
    };
  };

  it ('sets the Target temperature', function () {
    var data = {};
    var ret = {};
    data.temp = 3;
    TargetTemperatureSet(heaterPIDControllerMock(ret), data)
    expect(ret.temp).to.be.eql(3);
  });

});
