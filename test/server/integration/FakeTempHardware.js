'use strict';

var
  chai = require('chai'),
  expect = chai.expect,
  fakeTempHardware = require('../../../lib/FakeTempHardware');


/**
 * Convert output to temp
 *
 * @method tempFromOutput
 * @param {String} output
 * @return {Number} temperature
 */
function tempFromOutput (output) {
  return Number(output.replace('b8 01 4b 46 7f ff 08 10 8a t=', '')) / 1000;
}

/**
 * Mock heating for x minutes
 *
 * @method generateOutput
 * @param {Object} fakeTempHardware
 * @param {Number} input pwm
 * @param {Number} minutes
 */
function generateOutput(fakeTempHardware, input, minutes) {
  var date = new Date();
  date.setMinutes(date.getMinutes() + minutes);

  fakeTempHardware.generateOutput(input, date);
}

describe('Fake temp hardware', function () {
  describe('temperature', function () {
    var
      initTempOutput,
      initTemp;

    beforeEach(function () {
      initTempOutput = fakeTempHardware.getOutput();
      initTemp = tempFromOutput(initTempOutput);
    });


    // Generate output
    it('should generate output', function () {
      var
        output,
        temp;

      output = fakeTempHardware.getOutput();
      temp = tempFromOutput(output);

      expect(output).to.match(/b8 01 4b 46 7f ff 08 10 8a t=-?\d*(\.\d+)?$/);
      expect(temp).to.be.a('number');
    });


    // Hold temperature
    it('should hold', function () {
      var
        output,
        temp;

      // PWM 0% for 10 minutes
      generateOutput(fakeTempHardware, 0, 10);

      output = fakeTempHardware.getOutput();
      temp = tempFromOutput(output);

      expect(initTempOutput).to.equal(output);
      expect(temp).to.equal(temp);
    });


    // Raise temperature
    it('should raise', function () {
      var
        output,
        temp;

      // Heat: pwm 100% for 10 minutes
      generateOutput(fakeTempHardware, 1, 10);

      output = fakeTempHardware.getOutput();
      temp = tempFromOutput(output);

      expect(temp).to.be.above(initTemp);
    });
  });
});
