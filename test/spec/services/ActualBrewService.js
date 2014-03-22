'use strict';

describe('Service: ActualBrewService', function () {

  // load the service's module
  beforeEach(module('brewpiApp'));

  // instantiate service
  var ActualBrewService;
  beforeEach(inject(function (_ActualBrewService_) {
    ActualBrewService = _ActualBrewService_;
  }));

  it('should do something', function () {
    expect(!!ActualBrewService).toBe(true);
  });

});
