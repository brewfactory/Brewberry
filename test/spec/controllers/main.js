'use strict';

describe('Controller: MainCtrl', function () {
  var $scope;
  var socket = {
    on: function () {},
    emit: function (name, data) { socketLastEmit = { name: name, data: data }; }
  };
  var ActualBrewService = {
    onUpdate: function () {}
  };
  var socketLastEmit;

  // load the controller's module
  beforeEach(module('brewpiApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    $controller('MainCtrl', {
      $scope: $scope,
      socket: socket,
      ActualBrewService: ActualBrewService
    });
  }));


  // Tests
  it('$scope should be initialized', function () {
    expect($scope.phasesDuration).to.be.equal(0);

    expect($scope.temp.value).to.be.equal(0);

    expect($scope.pwm.value).to.be.equal(0);
    expect($scope.pwm.actual).to.be.equal(0);

    expect($scope.newPhase.min).to.be.equal(0);
    expect($scope.newPhase.temp).to.be.equal(0);
  });

  it('set pwm should emit the actual pwm', function () {
    $scope.pwm.value = 0.87;

    $scope.setPwm();
    expect(socketLastEmit.name).to.be.equal('pwm:set:manual');
    expect(socketLastEmit.data.pwm).to.be.equal($scope.pwm.value);
  });
});
