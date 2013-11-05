describe("qing common", function () {

    beforeEach(module("qing"));

    it("should define qing common module", function () {
        expect(angular.module('qing')).toBeDefined();
    });
});