var ActualTemperatureSet = require('../../../../module/EventHandlers/Temperature/ActualTemperatureSet');

describe('EventHandlers:ActualTemperatureSet', function () {
  var BrewerMock = function (obj) {
    return {
      onTempUpdate: function (temp) {
        obj.temp = temp;
      },
      getActualBrew: function() {
        return {
          name: 'test'
        }
      }
    };
  };

  var SocketIOMock = function (obj) {
    return {
      onStatusChange: function (data) {
        obj.data = data;
      }
    };
  };

  var BrewHeaterPWMMock = function (obj) {
    return {
      getActualPWM: function () {
      }
    };
  };

  var dataMock = {
    temp: 0.2
  };

  it ('sets the temperature on the Brewer', function () {
    var data = {};
    var mock = {};
    ActualTemperatureSet(BrewerMock(mock), BrewHeaterPWMMock({}), SocketIOMock({}), dataMock);
    expect(mock.temp).to.be.eql(0.2);
  });

});