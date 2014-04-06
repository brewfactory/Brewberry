'use strict';
var BrewPaused = require('../../../../module/Notifiers/Brew/BrewPaused');
var BrewEmitterMock = require('../Helpers/BrewEmitterMock');

describe('Notifiers:BrewPaused', function () {

  describe('when brewing is paused', function() {
    it ('notifies the BrewEmitter', function () {
      var obj = {};
      BrewPaused(BrewEmitterMock(obj), true);
      expect(obj.eventName).to.be.eql('brew:paused');
      expect(obj.data).to.be.eql({isPaused: true});
    });
  });

  describe('when brewing is not paused', function() {
    it ('notifies the BrewEmitter', function () {
      var obj = {};
      BrewPaused(BrewEmitterMock(obj), false);
      expect(obj.eventName).to.be.eql('brew:paused');
      expect(obj.data).to.be.eql({isPaused: false});
    });
  });

});
