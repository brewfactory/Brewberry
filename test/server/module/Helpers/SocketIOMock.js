'use strict';
module.exports = function (obj) {
  return {
    onStatusChange: function (data) {
      obj.data = data;
    }
  };
};
