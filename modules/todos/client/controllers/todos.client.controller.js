(function () {
  'use strict';

  // Todos controller
  angular
    .module('todos')
    .controller('TodosController', TodosController);

  TodosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'todoResolve'];

  function TodosController ($scope, $state, $window, Authentication, todo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.todo = todo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Todo
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.todo.$remove($state.go('todos.list'));
      }
    }

    // Save Todo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.todoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.todo._id) {
        vm.todo.$update(successCallback, errorCallback);
      } else {
        vm.todo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('todos.view', {
          todoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
