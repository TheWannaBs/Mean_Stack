'use strict';

describe('Clientmanagements E2E Tests:', function () {
  describe('Test Clientmanagements page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/clientmanagements');
      expect(element.all(by.repeater('clientmanagement in clientmanagements')).count()).toEqual(0);
    });
  });
});
