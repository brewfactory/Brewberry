'use strict';

var route = require('../../../../routes/log');
var ResponseMock = require('../../helper/ResponseMock');



describe('Routes:log', function () {
  describe('findBrewLogs', function() {
    it('can be called', function () {
      var LogModelMock = {
        findBrews: function() {}
      };
      route.findBrewLogs(LogModelMock, null, ResponseMock({}));
    });
  });

  describe('findOneBrewLog', function() {
    it('can be called', function () {
      var LogModelMock = {
        findOneBrew: function() {}
      };
      var reqMock = {
        param: function () {
          return 1;
        }
      };
      route.findOneBrewLog(LogModelMock, reqMock, ResponseMock({}));
    });
  });
});
