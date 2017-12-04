'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userlog = mongoose.model('Userlog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userlog;

/**
 * Userlog routes tests
 */
describe('Userlog CRUD tests', function () {

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

    // Save a user to the test db and create new Userlog
    user.save(function () {
      userlog = {
        name: 'Userlog name'
      };

      done();
    });
  });

  it('should be able to save a Userlog if logged in', function (done) {
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

        // Save a new Userlog
        agent.post('/api/userlogs')
          .send(userlog)
          .expect(200)
          .end(function (userlogSaveErr, userlogSaveRes) {
            // Handle Userlog save error
            if (userlogSaveErr) {
              return done(userlogSaveErr);
            }

            // Get a list of Userlogs
            agent.get('/api/userlogs')
              .end(function (userlogsGetErr, userlogsGetRes) {
                // Handle Userlogs save error
                if (userlogsGetErr) {
                  return done(userlogsGetErr);
                }

                // Get Userlogs list
                var userlogs = userlogsGetRes.body;

                // Set assertions
                (userlogs[0].user._id).should.equal(userId);
                (userlogs[0].name).should.match('Userlog name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userlog if not logged in', function (done) {
    agent.post('/api/userlogs')
      .send(userlog)
      .expect(403)
      .end(function (userlogSaveErr, userlogSaveRes) {
        // Call the assertion callback
        done(userlogSaveErr);
      });
  });

  it('should not be able to save an Userlog if no name is provided', function (done) {
    // Invalidate name field
    userlog.name = '';

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

        // Save a new Userlog
        agent.post('/api/userlogs')
          .send(userlog)
          .expect(400)
          .end(function (userlogSaveErr, userlogSaveRes) {
            // Set message assertion
            (userlogSaveRes.body.message).should.match('Please fill Userlog name');

            // Handle Userlog save error
            done(userlogSaveErr);
          });
      });
  });

  it('should be able to update an Userlog if signed in', function (done) {
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

        // Save a new Userlog
        agent.post('/api/userlogs')
          .send(userlog)
          .expect(200)
          .end(function (userlogSaveErr, userlogSaveRes) {
            // Handle Userlog save error
            if (userlogSaveErr) {
              return done(userlogSaveErr);
            }

            // Update Userlog name
            userlog.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userlog
            agent.put('/api/userlogs/' + userlogSaveRes.body._id)
              .send(userlog)
              .expect(200)
              .end(function (userlogUpdateErr, userlogUpdateRes) {
                // Handle Userlog update error
                if (userlogUpdateErr) {
                  return done(userlogUpdateErr);
                }

                // Set assertions
                (userlogUpdateRes.body._id).should.equal(userlogSaveRes.body._id);
                (userlogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userlogs if not signed in', function (done) {
    // Create new Userlog model instance
    var userlogObj = new Userlog(userlog);

    // Save the userlog
    userlogObj.save(function () {
      // Request Userlogs
      request(app).get('/api/userlogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userlog if not signed in', function (done) {
    // Create new Userlog model instance
    var userlogObj = new Userlog(userlog);

    // Save the Userlog
    userlogObj.save(function () {
      request(app).get('/api/userlogs/' + userlogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userlog.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userlog with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userlogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userlog is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userlog which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userlog
    request(app).get('/api/userlogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userlog with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userlog if signed in', function (done) {
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

        // Save a new Userlog
        agent.post('/api/userlogs')
          .send(userlog)
          .expect(200)
          .end(function (userlogSaveErr, userlogSaveRes) {
            // Handle Userlog save error
            if (userlogSaveErr) {
              return done(userlogSaveErr);
            }

            // Delete an existing Userlog
            agent.delete('/api/userlogs/' + userlogSaveRes.body._id)
              .send(userlog)
              .expect(200)
              .end(function (userlogDeleteErr, userlogDeleteRes) {
                // Handle userlog error error
                if (userlogDeleteErr) {
                  return done(userlogDeleteErr);
                }

                // Set assertions
                (userlogDeleteRes.body._id).should.equal(userlogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userlog if not signed in', function (done) {
    // Set Userlog user
    userlog.user = user;

    // Create new Userlog model instance
    var userlogObj = new Userlog(userlog);

    // Save the Userlog
    userlogObj.save(function () {
      // Try deleting Userlog
      request(app).delete('/api/userlogs/' + userlogObj._id)
        .expect(403)
        .end(function (userlogDeleteErr, userlogDeleteRes) {
          // Set message assertion
          (userlogDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userlog error error
          done(userlogDeleteErr);
        });

    });
  });

  it('should be able to get a single Userlog that has an orphaned user reference', function (done) {
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

          // Save a new Userlog
          agent.post('/api/userlogs')
            .send(userlog)
            .expect(200)
            .end(function (userlogSaveErr, userlogSaveRes) {
              // Handle Userlog save error
              if (userlogSaveErr) {
                return done(userlogSaveErr);
              }

              // Set assertions on new Userlog
              (userlogSaveRes.body.name).should.equal(userlog.name);
              should.exist(userlogSaveRes.body.user);
              should.equal(userlogSaveRes.body.user._id, orphanId);

              // force the Userlog to have an orphaned user reference
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

                    // Get the Userlog
                    agent.get('/api/userlogs/' + userlogSaveRes.body._id)
                      .expect(200)
                      .end(function (userlogInfoErr, userlogInfoRes) {
                        // Handle Userlog error
                        if (userlogInfoErr) {
                          return done(userlogInfoErr);
                        }

                        // Set assertions
                        (userlogInfoRes.body._id).should.equal(userlogSaveRes.body._id);
                        (userlogInfoRes.body.name).should.equal(userlog.name);
                        should.equal(userlogInfoRes.body.user, undefined);

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
      Userlog.remove().exec(done);
    });
  });
});
