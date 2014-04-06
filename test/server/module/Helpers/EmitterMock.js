'use strict';
module.exports = function (obj) {
  return {
    emit: function(eventName, data) {
      obj.eventName = eventName;
      obj.data = data;
    }
  };
};
