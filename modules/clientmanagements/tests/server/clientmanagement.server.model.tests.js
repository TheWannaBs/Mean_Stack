'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Clientmanagement = mongoose.model('Clientmanagement');

/**
 * Globals
 */
var user,
  clientmanagement;

/**
 * Unit tests
 */
describe('Clientmanagement Model Unit Tests:', function() {
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
      clientmanagement = new Clientmanagement({
        name: 'Clientmanagement Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return clientmanagement.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      clientmanagement.name = '';

      return clientmanagement.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Clientmanagement.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
