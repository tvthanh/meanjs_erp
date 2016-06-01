// Todos service used to communicate Todos REST endpoints
(function () {
  'use strict';

  angular
    .module('todos')
    .factory('TodosService', TodosService);

  TodosService.$inject = ['$resource'];

  function TodosService($resource) {
    return $resource('api/todos/:todoId', {
      todoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
