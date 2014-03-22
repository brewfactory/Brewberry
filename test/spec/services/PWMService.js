'use strict';

describe('Service: PWMService', function () {

  // load the service's module
  beforeEach(module('brewpiApp'));

  // instantiate service
  var PWMService;
  beforeEach(inject(function (_PWMService_) {
    PWMService = _PWMService_;
  }));

  it('should do something', function () {
    expect(!!PWMService).toBe(true);
  });

});
