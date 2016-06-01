(function () {
  'use strict';

  angular
    .module('todos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('todos', {
        abstract: true,
        url: '/todos',
        template: '<ui-view/>'
      })
      .state('todos.list', {
        url: '',
        templateUrl: 'modules/todos/client/views/list-todos.client.view.html',
        controller: 'TodosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Todos List'
        }
      })
      .state('todos.create', {
        url: '/create',
        templateUrl: 'modules/todos/client/views/form-todo.client.view.html',
        controller: 'TodosController',
        controllerAs: 'vm',
        resolve: {
          todoResolve: newTodo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Todos Create'
        }
      })
      .state('todos.edit', {
        url: '/:todoId/edit',
        templateUrl: 'modules/todos/client/views/form-todo.client.view.html',
        controller: 'TodosController',
        controllerAs: 'vm',
        resolve: {
          todoResolve: getTodo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Todo {{ todoResolve.name }}'
        }
      })
      .state('todos.view', {
        url: '/:todoId',
        templateUrl: 'modules/todos/client/views/view-todo.client.view.html',
        controller: 'TodosController',
        controllerAs: 'vm',
        resolve: {
          todoResolve: getTodo
        },
        data: {
          pageTitle: 'Todo {{ articleResolve.name }}'
        }
      });
  }

  getTodo.$inject = ['$stateParams', 'TodosService'];

  function getTodo($stateParams, TodosService) {
    return TodosService.get({
      todoId: $stateParams.todoId
    }).$promise;
  }

  newTodo.$inject = ['TodosService'];

  function newTodo(TodosService) {
    return new TodosService();
  }
}());
