'use strict';

describe('Service: LogService', function () {

  // load the service's module
  beforeEach(module('brewpiApp'));

  // instantiate service
  var LogService;
  beforeEach(inject(function (_LogService_) {
    LogService = _LogService_;
  }));

  it('should do something', function () {
    expect(!!LogService).toBe(true);
  });

});
