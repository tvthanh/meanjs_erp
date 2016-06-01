(function () {
  'use strict';

  describe('Todos Route Tests', function () {
    // Initialize global variables
    var $scope,
      TodosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TodosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TodosService = _TodosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('todos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/todos');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TodosController,
          mockTodo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('todos.view');
          $templateCache.put('modules/todos/client/views/view-todo.client.view.html', '');

          // create mock Todo
          mockTodo = new TodosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Todo Name'
          });

          // Initialize Controller
          TodosController = $controller('TodosController as vm', {
            $scope: $scope,
            todoResolve: mockTodo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:todoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.todoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            todoId: 1
          })).toEqual('/todos/1');
        }));

        it('should attach an Todo to the controller scope', function () {
          expect($scope.vm.todo._id).toBe(mockTodo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/todos/client/views/view-todo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TodosController,
          mockTodo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('todos.create');
          $templateCache.put('modules/todos/client/views/form-todo.client.view.html', '');

          // create mock Todo
          mockTodo = new TodosService();

          // Initialize Controller
          TodosController = $controller('TodosController as vm', {
            $scope: $scope,
            todoResolve: mockTodo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.todoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/todos/create');
        }));

        it('should attach an Todo to the controller scope', function () {
          expect($scope.vm.todo._id).toBe(mockTodo._id);
          expect($scope.vm.todo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/todos/client/views/form-todo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TodosController,
          mockTodo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('todos.edit');
          $templateCache.put('modules/todos/client/views/form-todo.client.view.html', '');

          // create mock Todo
          mockTodo = new TodosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Todo Name'
          });

          // Initialize Controller
          TodosController = $controller('TodosController as vm', {
            $scope: $scope,
            todoResolve: mockTodo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:todoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.todoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            todoId: 1
          })).toEqual('/todos/1/edit');
        }));

        it('should attach an Todo to the controller scope', function () {
          expect($scope.vm.todo._id).toBe(mockTodo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/todos/client/views/form-todo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
