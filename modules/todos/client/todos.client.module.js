(function (app) {
  'use strict';

  app.registerModule('todos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('todos.services');
  app.registerModule('todos.routes', ['ui.router', 'core.routes', 'todos.services']);
}(ApplicationConfiguration));
