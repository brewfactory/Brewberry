'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('brewpiApp'));

  var
    LogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LogCtrl = $controller('LogCtrl', {
      $scope: scope
    });
  }));


  // TODO: implement
  it('options should be set', function () {
    expect(scope.options.pwm.scaleSteps).to.be.equal(10);
  });
});
