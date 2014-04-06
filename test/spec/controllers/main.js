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

  var BrewService = {
    data: null,
    save: function (data) { this.data = data; }
  };

  // load the controller's module
  beforeEach(module('brewpiApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    $controller('MainCtrl', {
      $scope: $scope,
      socket: socket,
      ActualBrewService: ActualBrewService,
      BrewService: BrewService
    });

    BrewService.data = null;
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

  it('should synchronize the actual brew', function () {
    $scope.brew = {
      name: 'Test name',
      startTime: new Date(),
      phases: [{ min: 2, temp: 44 }, { min: 23, temp: 24 }]
    };

    $scope.synchronize();

    expect(BrewService.data).to.have.deep.property('name', $scope.brew.name);
    expect(BrewService.data).to.have.deep.property('startTime', $scope.brew.startTime);
    expect(BrewService.data).to.have.deep.property('phases[0].min', $scope.brew.phases[0].min);
    expect(BrewService.data).to.have.deep.property('phases[0].temp', $scope.brew.phases[0].temp);
    expect(BrewService.data).to.have.deep.property('phases[1].min', $scope.brew.phases[1].min);
    expect(BrewService.data).to.have.deep.property('phases[1].temp', $scope.brew.phases[1].temp);
  });

  it('should remove the first phase', function () {
    $scope.brew.name = 'Test name';
    $scope.brew.startTime = new Date();
    $scope.brew.phases = [{ min: 2, temp: 44 }, { min: 23, temp: 24 }];

    $scope.removePhase(0);

    expect($scope.brew.phases.length).to.be.equal(1);
    expect($scope.brew).to.have.deep.property('phases[0].min', 23);
    expect($scope.brew).to.have.deep.property('phases[0].temp', 24);
  });

  it('should add a new phase', function () {
    $scope.newPhase = {
      min: 1,
      temp: 2
    };

    $scope.brew.phases = [];

    $scope.addPhase();

    expect($scope.brew.phases.length).to.be.equal(1);
    expect($scope.brew).to.have.deep.property('phases[0].min', 1);
    expect($scope.brew).to.have.deep.property('phases[0].temp', 2);

    // Reset new phase
    expect($scope.newPhase.min).to.be.equal(0);
    expect($scope.newPhase.temp).to.be.equal(0);
  });
});
