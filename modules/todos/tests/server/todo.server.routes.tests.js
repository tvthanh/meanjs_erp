'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Todo = mongoose.model('Todo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  todo;

/**
 * Todo routes tests
 */
describe('Todo CRUD tests', function () {

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

    // Save a user to the test db and create new Todo
    user.save(function () {
      todo = {
        name: 'Todo name'
      };

      done();
    });
  });

  it('should be able to save a Todo if logged in', function (done) {
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

        // Save a new Todo
        agent.post('/api/todos')
          .send(todo)
          .expect(200)
          .end(function (todoSaveErr, todoSaveRes) {
            // Handle Todo save error
            if (todoSaveErr) {
              return done(todoSaveErr);
            }

            // Get a list of Todos
            agent.get('/api/todos')
              .end(function (todosGetErr, todosGetRes) {
                // Handle Todo save error
                if (todosGetErr) {
                  return done(todosGetErr);
                }

                // Get Todos list
                var todos = todosGetRes.body;

                // Set assertions
                (todos[0].user._id).should.equal(userId);
                (todos[0].name).should.match('Todo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Todo if not logged in', function (done) {
    agent.post('/api/todos')
      .send(todo)
      .expect(403)
      .end(function (todoSaveErr, todoSaveRes) {
        // Call the assertion callback
        done(todoSaveErr);
      });
  });

  it('should not be able to save an Todo if no name is provided', function (done) {
    // Invalidate name field
    todo.name = '';

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

        // Save a new Todo
        agent.post('/api/todos')
          .send(todo)
          .expect(400)
          .end(function (todoSaveErr, todoSaveRes) {
            // Set message assertion
            (todoSaveRes.body.message).should.match('Please fill Todo name');

            // Handle Todo save error
            done(todoSaveErr);
          });
      });
  });

  it('should be able to update an Todo if signed in', function (done) {
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

        // Save a new Todo
        agent.post('/api/todos')
          .send(todo)
          .expect(200)
          .end(function (todoSaveErr, todoSaveRes) {
            // Handle Todo save error
            if (todoSaveErr) {
              return done(todoSaveErr);
            }

            // Update Todo name
            todo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Todo
            agent.put('/api/todos/' + todoSaveRes.body._id)
              .send(todo)
              .expect(200)
              .end(function (todoUpdateErr, todoUpdateRes) {
                // Handle Todo update error
                if (todoUpdateErr) {
                  return done(todoUpdateErr);
                }

                // Set assertions
                (todoUpdateRes.body._id).should.equal(todoSaveRes.body._id);
                (todoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Todos if not signed in', function (done) {
    // Create new Todo model instance
    var todoObj = new Todo(todo);

    // Save the todo
    todoObj.save(function () {
      // Request Todos
      request(app).get('/api/todos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Todo if not signed in', function (done) {
    // Create new Todo model instance
    var todoObj = new Todo(todo);

    // Save the Todo
    todoObj.save(function () {
      request(app).get('/api/todos/' + todoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', todo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Todo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/todos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Todo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Todo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Todo
    request(app).get('/api/todos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Todo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Todo if signed in', function (done) {
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

        // Save a new Todo
        agent.post('/api/todos')
          .send(todo)
          .expect(200)
          .end(function (todoSaveErr, todoSaveRes) {
            // Handle Todo save error
            if (todoSaveErr) {
              return done(todoSaveErr);
            }

            // Delete an existing Todo
            agent.delete('/api/todos/' + todoSaveRes.body._id)
              .send(todo)
              .expect(200)
              .end(function (todoDeleteErr, todoDeleteRes) {
                // Handle todo error error
                if (todoDeleteErr) {
                  return done(todoDeleteErr);
                }

                // Set assertions
                (todoDeleteRes.body._id).should.equal(todoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Todo if not signed in', function (done) {
    // Set Todo user
    todo.user = user;

    // Create new Todo model instance
    var todoObj = new Todo(todo);

    // Save the Todo
    todoObj.save(function () {
      // Try deleting Todo
      request(app).delete('/api/todos/' + todoObj._id)
        .expect(403)
        .end(function (todoDeleteErr, todoDeleteRes) {
          // Set message assertion
          (todoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Todo error error
          done(todoDeleteErr);
        });

    });
  });

  it('should be able to get a single Todo that has an orphaned user reference', function (done) {
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

          // Save a new Todo
          agent.post('/api/todos')
            .send(todo)
            .expect(200)
            .end(function (todoSaveErr, todoSaveRes) {
              // Handle Todo save error
              if (todoSaveErr) {
                return done(todoSaveErr);
              }

              // Set assertions on new Todo
              (todoSaveRes.body.name).should.equal(todo.name);
              should.exist(todoSaveRes.body.user);
              should.equal(todoSaveRes.body.user._id, orphanId);

              // force the Todo to have an orphaned user reference
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

                    // Get the Todo
                    agent.get('/api/todos/' + todoSaveRes.body._id)
                      .expect(200)
                      .end(function (todoInfoErr, todoInfoRes) {
                        // Handle Todo error
                        if (todoInfoErr) {
                          return done(todoInfoErr);
                        }

                        // Set assertions
                        (todoInfoRes.body._id).should.equal(todoSaveRes.body._id);
                        (todoInfoRes.body.name).should.equal(todo.name);
                        should.equal(todoInfoRes.body.user, undefined);

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
      Todo.remove().exec(done);
    });
  });
});
