'use strict';

describe('Directive: Navigation', function () {
  beforeEach(module('brewpiApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-navigation></-navigation>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the Navigation directive');
  }));
});
