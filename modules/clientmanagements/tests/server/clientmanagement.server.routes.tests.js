'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Clientmanagement = mongoose.model('Clientmanagement'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  clientmanagement;

/**
 * Clientmanagement routes tests
 */
describe('Clientmanagement CRUD tests', function () {

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

    // Save a user to the test db and create new Clientmanagement
    user.save(function () {
      clientmanagement = {
        name: 'Clientmanagement name'
      };

      done();
    });
  });

  it('should be able to save a Clientmanagement if logged in', function (done) {
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

        // Save a new Clientmanagement
        agent.post('/api/clientmanagements')
          .send(clientmanagement)
          .expect(200)
          .end(function (clientmanagementSaveErr, clientmanagementSaveRes) {
            // Handle Clientmanagement save error
            if (clientmanagementSaveErr) {
              return done(clientmanagementSaveErr);
            }

            // Get a list of Clientmanagements
            agent.get('/api/clientmanagements')
              .end(function (clientmanagementsGetErr, clientmanagementsGetRes) {
                // Handle Clientmanagements save error
                if (clientmanagementsGetErr) {
                  return done(clientmanagementsGetErr);
                }

                // Get Clientmanagements list
                var clientmanagements = clientmanagementsGetRes.body;

                // Set assertions
                (clientmanagements[0].user._id).should.equal(userId);
                (clientmanagements[0].name).should.match('Clientmanagement name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Clientmanagement if not logged in', function (done) {
    agent.post('/api/clientmanagements')
      .send(clientmanagement)
      .expect(403)
      .end(function (clientmanagementSaveErr, clientmanagementSaveRes) {
        // Call the assertion callback
        done(clientmanagementSaveErr);
      });
  });

  it('should not be able to save an Clientmanagement if no name is provided', function (done) {
    // Invalidate name field
    clientmanagement.name = '';

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

        // Save a new Clientmanagement
        agent.post('/api/clientmanagements')
          .send(clientmanagement)
          .expect(400)
          .end(function (clientmanagementSaveErr, clientmanagementSaveRes) {
            // Set message assertion
            (clientmanagementSaveRes.body.message).should.match('Please fill Clientmanagement name');

            // Handle Clientmanagement save error
            done(clientmanagementSaveErr);
          });
      });
  });

  it('should be able to update an Clientmanagement if signed in', function (done) {
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

        // Save a new Clientmanagement
        agent.post('/api/clientmanagements')
          .send(clientmanagement)
          .expect(200)
          .end(function (clientmanagementSaveErr, clientmanagementSaveRes) {
            // Handle Clientmanagement save error
            if (clientmanagementSaveErr) {
              return done(clientmanagementSaveErr);
            }

            // Update Clientmanagement name
            clientmanagement.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Clientmanagement
            agent.put('/api/clientmanagements/' + clientmanagementSaveRes.body._id)
              .send(clientmanagement)
              .expect(200)
              .end(function (clientmanagementUpdateErr, clientmanagementUpdateRes) {
                // Handle Clientmanagement update error
                if (clientmanagementUpdateErr) {
                  return done(clientmanagementUpdateErr);
                }

                // Set assertions
                (clientmanagementUpdateRes.body._id).should.equal(clientmanagementSaveRes.body._id);
                (clientmanagementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Clientmanagements if not signed in', function (done) {
    // Create new Clientmanagement model instance
    var clientmanagementObj = new Clientmanagement(clientmanagement);

    // Save the clientmanagement
    clientmanagementObj.save(function () {
      // Request Clientmanagements
      request(app).get('/api/clientmanagements')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Clientmanagement if not signed in', function (done) {
    // Create new Clientmanagement model instance
    var clientmanagementObj = new Clientmanagement(clientmanagement);

    // Save the Clientmanagement
    clientmanagementObj.save(function () {
      request(app).get('/api/clientmanagements/' + clientmanagementObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', clientmanagement.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Clientmanagement with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/clientmanagements/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Clientmanagement is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Clientmanagement which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Clientmanagement
    request(app).get('/api/clientmanagements/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Clientmanagement with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Clientmanagement if signed in', function (done) {
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

        // Save a new Clientmanagement
        agent.post('/api/clientmanagements')
          .send(clientmanagement)
          .expect(200)
          .end(function (clientmanagementSaveErr, clientmanagementSaveRes) {
            // Handle Clientmanagement save error
            if (clientmanagementSaveErr) {
              return done(clientmanagementSaveErr);
            }

            // Delete an existing Clientmanagement
            agent.delete('/api/clientmanagements/' + clientmanagementSaveRes.body._id)
              .send(clientmanagement)
              .expect(200)
              .end(function (clientmanagementDeleteErr, clientmanagementDeleteRes) {
                // Handle clientmanagement error error
                if (clientmanagementDeleteErr) {
                  return done(clientmanagementDeleteErr);
                }

                // Set assertions
                (clientmanagementDeleteRes.body._id).should.equal(clientmanagementSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Clientmanagement if not signed in', function (done) {
    // Set Clientmanagement user
    clientmanagement.user = user;

    // Create new Clientmanagement model instance
    var clientmanagementObj = new Clientmanagement(clientmanagement);

    // Save the Clientmanagement
    clientmanagementObj.save(function () {
      // Try deleting Clientmanagement
      request(app).delete('/api/clientmanagements/' + clientmanagementObj._id)
        .expect(403)
        .end(function (clientmanagementDeleteErr, clientmanagementDeleteRes) {
          // Set message assertion
          (clientmanagementDeleteRes.body.message).should.match('User is not authorized');

          // Handle Clientmanagement error error
          done(clientmanagementDeleteErr);
        });

    });
  });

  it('should be able to get a single Clientmanagement that has an orphaned user reference', function (done) {
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

          // Save a new Clientmanagement
          agent.post('/api/clientmanagements')
            .send(clientmanagement)
            .expect(200)
            .end(function (clientmanagementSaveErr, clientmanagementSaveRes) {
              // Handle Clientmanagement save error
              if (clientmanagementSaveErr) {
                return done(clientmanagementSaveErr);
              }

              // Set assertions on new Clientmanagement
              (clientmanagementSaveRes.body.name).should.equal(clientmanagement.name);
              should.exist(clientmanagementSaveRes.body.user);
              should.equal(clientmanagementSaveRes.body.user._id, orphanId);

              // force the Clientmanagement to have an orphaned user reference
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

                    // Get the Clientmanagement
                    agent.get('/api/clientmanagements/' + clientmanagementSaveRes.body._id)
                      .expect(200)
                      .end(function (clientmanagementInfoErr, clientmanagementInfoRes) {
                        // Handle Clientmanagement error
                        if (clientmanagementInfoErr) {
                          return done(clientmanagementInfoErr);
                        }

                        // Set assertions
                        (clientmanagementInfoRes.body._id).should.equal(clientmanagementSaveRes.body._id);
                        (clientmanagementInfoRes.body.name).should.equal(clientmanagement.name);
                        should.equal(clientmanagementInfoRes.body.user, undefined);

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
      Clientmanagement.remove().exec(done);
    });
  });
});
