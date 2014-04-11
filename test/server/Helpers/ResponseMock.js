'use strict';

module.exports = function (obj) {
  return {
    json: function(data) {
      console.log(data)
      obj.data = data;
    }
  };
};
