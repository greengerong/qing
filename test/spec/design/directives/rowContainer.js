'use strict';

describe('Directive: rowContainer', function () {

    // load the directive's module
    beforeEach(module('qing'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it("should define qing common module", function () {
        expect(angular.module('qing')).toBeDefined();
    });

    xit('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<row-container></row-container>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('this is the rowContainer directive');
    }));
});
