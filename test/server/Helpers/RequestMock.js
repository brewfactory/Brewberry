'use strict';

module.exports = function (obj) {
  return {
    json: function(data) {
      obj.data = data;
    }
  };
};
