'use strict';

describe('Inventorymanagements E2E Tests:', function () {
  describe('Test Inventorymanagements page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/inventorymanagements');
      expect(element.all(by.repeater('inventorymanagement in inventorymanagements')).count()).toEqual(0);
    });
  });
});
