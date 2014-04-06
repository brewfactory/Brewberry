var Logger = require('../../module/Logger');

Logger.init({
  consoleLevel: 'silent'
});

global.expect = require('chai').expect;
