'use strict';

describe('Controller: MainCtrl', function () {
  var $scope;
  var socket = {
    on: function () {
    },
    emit: function (name, data) {
      socketLastEmit = { name: name, data: data };
    }
  };
  var ActualBrewService = {
    actualBrew: {
      name: null,
      phases: [],
      startTime: null,
      paused: false
    },

    onUpdate: function () {
    },
    getActual: function () {
      return this.actualBrew;
    }
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

  it('should watch start hour', function () {
    var startHour = '11:13';
    var date = new Date();

    date.setHours(startHour.split(':')[0]);
    date.setMinutes(startHour.split(':')[1]);
    date.setSeconds(0);
    date.setMilliseconds(0);

    $scope.brew.startHour = startHour;

    $scope.$digest();

    expect($scope.brew.startTime.getTime()).to.be.equal(date.getTime());
  });
});
