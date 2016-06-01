(function () {
  'use strict';

  angular
    .module('todos')
    .controller('TodosListController', TodosListController);

  TodosListController.$inject = ['TodosService'];

  function TodosListController(TodosService) {
    var vm = this;

    vm.todos = TodosService.query();
  }
}());
