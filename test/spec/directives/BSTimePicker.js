'use strict';

describe('Directive: BSTimePicker', function () {
  beforeEach(module('brewpiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-b-s-time-picker></-b-s-time-picker>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the BSTimePicker directive');
  }));
});
