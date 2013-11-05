describe("qing product", function () {

    beforeEach(module("qing"));

    it("should define qing product module", function () {
        expect(angular.module('qing')).toBeDefined();
    });
});