app.controller('LoginController', function($scope, AuthService, $location,$rootScope) {
    $scope.user = {};
  
    $scope.login = function() {
      AuthService.login($scope.user)
        .then(function(response) {
          const user = response.data.user;
          $rootScope.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          alert('Login successful as ' + response.data.user.role);
          if (response.data.user.role === 'admin') {
            $location.path('/admin');
          } else {
            alert('Redirect to dashboard for ' + response.data.user.role);
            $location.path('/admin');
          }
        })
        .catch(function(err) {
          alert(err.data.message || 'Login failed!');
        });
    };
  });
  