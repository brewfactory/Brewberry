'use strict';

module.exports = function (obj) {
  return {
    getActualPWM: function () {
      return 60;
    },
    setPWMMode: function (mode) {
      obj.mode = mode;
    },
    setOutputManual: function(output) {
      obj.output = output;
    }
  };
};