'use strict';
module.exports = function (obj) {
  return {
    onTempUpdate: function (temp) {
      obj.temp = temp;
    },
    getActualBrew: function() {
      return {
        name: 'test'
      };
    }
  };
};
