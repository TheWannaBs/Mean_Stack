'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Inventorymanagement = mongoose.model('Inventorymanagement');

/**
 * Globals
 */
var user,
  inventorymanagement;

/**
 * Unit tests
 */
describe('Inventorymanagement Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      inventorymanagement = new Inventorymanagement({
        name: 'Inventorymanagement Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return inventorymanagement.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      inventorymanagement.name = '';

      return inventorymanagement.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Inventorymanagement.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
