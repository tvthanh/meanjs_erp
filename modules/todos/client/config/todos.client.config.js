(function () {
  'use strict';

  angular
    .module('todos')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Todos',
      state: 'todos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'todos', {
      title: 'List Todos',
      state: 'todos.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'todos', {
      title: 'Create Todo',
      state: 'todos.create',
      roles: ['user']
    });
  }
}());
