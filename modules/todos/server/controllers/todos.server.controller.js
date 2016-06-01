'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Todo = mongoose.model('Todo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Todo
 */
exports.create = function(req, res) {
  var todo = new Todo(req.body);
  todo.user = req.user;

  todo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(todo);
    }
  });
};

/**
 * Show the current Todo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var todo = req.todo ? req.todo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // todo.isCurrentUserOwner = req.user && todo.user && todo.user._id.toString() === req.user._id.toString() ? true : false;
  todo.isCurrentUserOwner = !!(req.user && todo.user && todo.user._id.toString() === req.user._id.toString());

  res.jsonp(todo);
};

/**
 * Update a Todo
 */
exports.update = function(req, res) {
  var todo = req.todo;

  todo = _.extend(todo, req.body);

  todo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(todo);
    }
  });
};

/**
 * Delete an Todo
 */
exports.delete = function(req, res) {
  var todo = req.todo;

  todo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(todo);
    }
  });
};

/**
 * List of Todos
 */
exports.list = function(req, res) {
  Todo.find().sort('-created').populate('user', 'displayName').exec(function(err, todos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(todos);
    }
  });
};

/**
 * Todo middleware
 */
exports.todoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Todo is invalid'
    });
  }

  Todo.findById(id).populate('user', 'displayName').exec(function (err, todo) {
    if (err) {
      return next(err);
    } else if (!todo) {
      return res.status(404).send({
        message: 'No Todo with that identifier has been found'
      });
    }
    req.todo = todo;
    next();
  });
};
