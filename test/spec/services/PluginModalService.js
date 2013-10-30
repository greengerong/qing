'use strict';

describe('Service: PluginModalService', function () {

  // load the service's module
  beforeEach(module('qingApp'));

  // instantiate service
  var PluginModalService;
  beforeEach(inject(function (_PluginModalService_) {
    PluginModalService = _PluginModalService_;
  }));

  it('should do something', function () {
    expect(!!PluginModalService).toBe(true);
  });

});
