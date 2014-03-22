'use strict';

describe('Controller: LogCtrl', function () {

  // load the controller's module
  beforeEach(module('brewpiApp'));

  var LogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LogCtrl = $controller('LogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
