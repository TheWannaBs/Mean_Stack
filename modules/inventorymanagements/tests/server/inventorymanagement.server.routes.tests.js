'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Inventorymanagement = mongoose.model('Inventorymanagement'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  inventorymanagement;

/**
 * Inventorymanagement routes tests
 */
describe('Inventorymanagement CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Inventorymanagement
    user.save(function () {
      inventorymanagement = {
        name: 'Inventorymanagement name'
      };

      done();
    });
  });

  it('should be able to save a Inventorymanagement if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inventorymanagement
        agent.post('/api/inventorymanagements')
          .send(inventorymanagement)
          .expect(200)
          .end(function (inventorymanagementSaveErr, inventorymanagementSaveRes) {
            // Handle Inventorymanagement save error
            if (inventorymanagementSaveErr) {
              return done(inventorymanagementSaveErr);
            }

            // Get a list of Inventorymanagements
            agent.get('/api/inventorymanagements')
              .end(function (inventorymanagementsGetErr, inventorymanagementsGetRes) {
                // Handle Inventorymanagements save error
                if (inventorymanagementsGetErr) {
                  return done(inventorymanagementsGetErr);
                }

                // Get Inventorymanagements list
                var inventorymanagements = inventorymanagementsGetRes.body;

                // Set assertions
                (inventorymanagements[0].user._id).should.equal(userId);
                (inventorymanagements[0].name).should.match('Inventorymanagement name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Inventorymanagement if not logged in', function (done) {
    agent.post('/api/inventorymanagements')
      .send(inventorymanagement)
      .expect(403)
      .end(function (inventorymanagementSaveErr, inventorymanagementSaveRes) {
        // Call the assertion callback
        done(inventorymanagementSaveErr);
      });
  });

  it('should not be able to save an Inventorymanagement if no name is provided', function (done) {
    // Invalidate name field
    inventorymanagement.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inventorymanagement
        agent.post('/api/inventorymanagements')
          .send(inventorymanagement)
          .expect(400)
          .end(function (inventorymanagementSaveErr, inventorymanagementSaveRes) {
            // Set message assertion
            (inventorymanagementSaveRes.body.message).should.match('Please fill Inventorymanagement name');

            // Handle Inventorymanagement save error
            done(inventorymanagementSaveErr);
          });
      });
  });

  it('should be able to update an Inventorymanagement if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inventorymanagement
        agent.post('/api/inventorymanagements')
          .send(inventorymanagement)
          .expect(200)
          .end(function (inventorymanagementSaveErr, inventorymanagementSaveRes) {
            // Handle Inventorymanagement save error
            if (inventorymanagementSaveErr) {
              return done(inventorymanagementSaveErr);
            }

            // Update Inventorymanagement name
            inventorymanagement.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Inventorymanagement
            agent.put('/api/inventorymanagements/' + inventorymanagementSaveRes.body._id)
              .send(inventorymanagement)
              .expect(200)
              .end(function (inventorymanagementUpdateErr, inventorymanagementUpdateRes) {
                // Handle Inventorymanagement update error
                if (inventorymanagementUpdateErr) {
                  return done(inventorymanagementUpdateErr);
                }

                // Set assertions
                (inventorymanagementUpdateRes.body._id).should.equal(inventorymanagementSaveRes.body._id);
                (inventorymanagementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Inventorymanagements if not signed in', function (done) {
    // Create new Inventorymanagement model instance
    var inventorymanagementObj = new Inventorymanagement(inventorymanagement);

    // Save the inventorymanagement
    inventorymanagementObj.save(function () {
      // Request Inventorymanagements
      request(app).get('/api/inventorymanagements')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Inventorymanagement if not signed in', function (done) {
    // Create new Inventorymanagement model instance
    var inventorymanagementObj = new Inventorymanagement(inventorymanagement);

    // Save the Inventorymanagement
    inventorymanagementObj.save(function () {
      request(app).get('/api/inventorymanagements/' + inventorymanagementObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', inventorymanagement.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Inventorymanagement with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/inventorymanagements/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Inventorymanagement is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Inventorymanagement which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Inventorymanagement
    request(app).get('/api/inventorymanagements/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Inventorymanagement with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Inventorymanagement if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inventorymanagement
        agent.post('/api/inventorymanagements')
          .send(inventorymanagement)
          .expect(200)
          .end(function (inventorymanagementSaveErr, inventorymanagementSaveRes) {
            // Handle Inventorymanagement save error
            if (inventorymanagementSaveErr) {
              return done(inventorymanagementSaveErr);
            }

            // Delete an existing Inventorymanagement
            agent.delete('/api/inventorymanagements/' + inventorymanagementSaveRes.body._id)
              .send(inventorymanagement)
              .expect(200)
              .end(function (inventorymanagementDeleteErr, inventorymanagementDeleteRes) {
                // Handle inventorymanagement error error
                if (inventorymanagementDeleteErr) {
                  return done(inventorymanagementDeleteErr);
                }

                // Set assertions
                (inventorymanagementDeleteRes.body._id).should.equal(inventorymanagementSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Inventorymanagement if not signed in', function (done) {
    // Set Inventorymanagement user
    inventorymanagement.user = user;

    // Create new Inventorymanagement model instance
    var inventorymanagementObj = new Inventorymanagement(inventorymanagement);

    // Save the Inventorymanagement
    inventorymanagementObj.save(function () {
      // Try deleting Inventorymanagement
      request(app).delete('/api/inventorymanagements/' + inventorymanagementObj._id)
        .expect(403)
        .end(function (inventorymanagementDeleteErr, inventorymanagementDeleteRes) {
          // Set message assertion
          (inventorymanagementDeleteRes.body.message).should.match('User is not authorized');

          // Handle Inventorymanagement error error
          done(inventorymanagementDeleteErr);
        });

    });
  });

  it('should be able to get a single Inventorymanagement that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Inventorymanagement
          agent.post('/api/inventorymanagements')
            .send(inventorymanagement)
            .expect(200)
            .end(function (inventorymanagementSaveErr, inventorymanagementSaveRes) {
              // Handle Inventorymanagement save error
              if (inventorymanagementSaveErr) {
                return done(inventorymanagementSaveErr);
              }

              // Set assertions on new Inventorymanagement
              (inventorymanagementSaveRes.body.name).should.equal(inventorymanagement.name);
              should.exist(inventorymanagementSaveRes.body.user);
              should.equal(inventorymanagementSaveRes.body.user._id, orphanId);

              // force the Inventorymanagement to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Inventorymanagement
                    agent.get('/api/inventorymanagements/' + inventorymanagementSaveRes.body._id)
                      .expect(200)
                      .end(function (inventorymanagementInfoErr, inventorymanagementInfoRes) {
                        // Handle Inventorymanagement error
                        if (inventorymanagementInfoErr) {
                          return done(inventorymanagementInfoErr);
                        }

                        // Set assertions
                        (inventorymanagementInfoRes.body._id).should.equal(inventorymanagementSaveRes.body._id);
                        (inventorymanagementInfoRes.body.name).should.equal(inventorymanagement.name);
                        should.equal(inventorymanagementInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Inventorymanagement.remove().exec(done);
    });
  });
});
