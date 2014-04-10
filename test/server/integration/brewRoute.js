'use strict';

var route = require('../../../routes/brew');
var responseMock = require('../helpers/responseMock');

describe('Routes:brew', function () {
  describe('when sets a brew', function () {
    it('configures the Brew module', function () {

    });
    it('responds with a JSON', function () {
      var req = {
        param: function() {}
      };
      var Brewer = {
        setBrew: function() {}
      };
      var obj = {};
      route.setBrew(Brewer, req, responseMock(obj));
      expect(obj.data).to.be.eql({
        status:'ok'
      });
    });
  });

  describe('when cancels a brew', function () {
    it('cancels');
    it('responds with a JSON');
  });

  describe('when pauses a brew', function () {
    it('pauses');
    it('responds with a JSON');
  });
});
