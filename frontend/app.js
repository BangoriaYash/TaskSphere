var app = angular.module('taskApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })
    .when('/admin', {
      templateUrl: 'views/admin.html',
      // controller: 'adminController'
    })
    .when('/create-project', {
      templateUrl: 'views/createProject.html',
      controller: 'projectController'
    })
    .when('/assign-role', {
      templateUrl: 'views/assignRole.html',
      controller: 'projectController'
    })
    .when('/view-project',{
      templateUrl: 'views/viewProject.html',
      controller: 'projectController'
    })
    .when('/update-project',{
      templateUrl:'views/updateProject.html',
      controller:'projectController'
    })
    .when('/create-task',{
      templateUrl:'views/createTask.html',
      controller:'taskController'
    })
    .when('/assign-role-task',{
      templateUrl:'views/assignTask.html',
      controller:'assignTaskController'
    })
    .when('/assign-task-emp', {
      templateUrl:'views/taskToEmployee.html',
      controller:'taskEmployeeController'
    })
    .when('/view-task',{
      templateUrl:'views/viewTask.html',
      controller:'assignTaskController'
    })
    .when('/update-task',{
      templateUrl:'views/updateTask.html',
      controller:'updateTaskController'
    })
    .otherwise({
      redirectTo: '/login'
    });

  $httpProvider.defaults.withCredentials = true; // Allow cookies with requests
});
app.run(function($rootScope) {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    $rootScope.currentUser = JSON.parse(storedUser);
  }
});
