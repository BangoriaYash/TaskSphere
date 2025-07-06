app.controller('RegisterController', function($scope, AuthService, $location) {
    $scope.user = {};
  
    $scope.register = function() {
      AuthService.register($scope.user)
        .then(function(response) {
          alert('Registration successful!');
          $location.path('/login');
        })
        .catch(function(err) {
          alert(err.data.error || 'Registration failed!');
        });
    };
  });
  