'use strict';

var route = require('../../../../routes/brew');
var ResponseMock = require('../../helpers/ResponseMock');
var BrewerMock = require('../../helpers/BrewerMock');

describe('Routes:brew', function () {
  describe('when sets a brew', function () {

    it('configures the Brew module', function () {
      var req = {
        param: function() {
          return 'test';
        }
      };
      var obj = {};
      route.setBrew(BrewerMock(obj), req, ResponseMock({}));
      expect(obj.name).to.be.eql('test');
      expect(obj.phase).to.be.eql('test');
      expect(obj.startTime).to.be.eql('test');
    });

    it('responds with a JSON', function () {
      var req = {
        param: function() {}
      };
      var obj = {};
      route.setBrew(BrewerMock({}), req, ResponseMock(obj));
      expect(obj.data).to.be.eql({
        status:'ok'
      });
    });

  });

  describe('when cancels a brew', function () {

    it('cancels', function() {
      var obj = {};
      route.cancelBrew(BrewerMock(obj), null, ResponseMock({}));
      expect(obj.canceled).to.be.eql(true);
    });

    it('responds with a JSON', function () {
      var obj = {};
      route.cancelBrew(BrewerMock({}), null, ResponseMock(obj));
      expect(obj.data).to.be.eql({
        status: 'ok'
      });
    });

  });

  describe('when pauses a brew', function () {

    it('pauses', function () {
      var obj = {};
      route.pauseBrew(BrewerMock(obj), null, ResponseMock({}));
      expect(obj.paused).to.be.eql(true);
    });

    it('responds with a JSON', function () {
      var obj = {};
      route.pauseBrew(BrewerMock({}), null, ResponseMock(obj));
      expect(obj.data).to.be.eql({
        status: 'ok',
        paused: true
      });
    });

  });
});
