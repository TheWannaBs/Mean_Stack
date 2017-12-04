'use strict';

describe('Userlogs E2E Tests:', function () {
  describe('Test Userlogs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userlogs');
      expect(element.all(by.repeater('userlog in userlogs')).count()).toEqual(0);
    });
  });
});
