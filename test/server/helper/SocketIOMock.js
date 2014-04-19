'use strict';
module.exports = function (obj) {
  return {
    sockets: {
      on: function (_event, _data) {
        obj.on = {};
        obj.on.data = _data;
        obj.on.event = _event;
      },
      emit: function (_event, _data) {
        obj.emit = {};
        obj.emit.data = _data;
        obj.emit.event = _event;
      }
    }
  };
};
