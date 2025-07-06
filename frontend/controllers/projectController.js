app.controller('projectController', function($scope,AuthService,$location,$rootScope) {
    $scope.project = {};
    $scope.users = [];
    $scope.newTask = {};
    $scope.roleAssignment = {};
    
    function toUTCDateOnly(dateString) {
      const localDate = new Date(dateString);
      return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
    }

    $scope.createProject = function () {
      const projectData = {
        name: $scope.project.name,
        description: $scope.project.description,
        startDate: toUTCDateOnly($scope.project.startDate),
        endDate: toUTCDateOnly($scope.project.endDate)
      };
    
      AuthService.createProject(projectData)
        .then(function (response) {
          alert('Project created!');
          $location.path('/assign-role');
        })
        .catch(function (error) {
          console.error('Error:', error);
          alert('Failed to create project');
        });
    };
  
    $scope.getProjects = function() {
      AuthService.getUserProjects()
        .then(function(response) {
          $scope.proj = response.data;
        })
        .catch(function(error) {
          console.error("Error loading projects:", error);
        })
    };
    $scope.getProjects();
    $scope.getUsers = function() {
      AuthService.getAllUsers()
        .then(function(response) {
          const allUsers = response.data;
          const currentUserId = $rootScope.currentUser.id;
          $scope.users = allUsers.filter(user => user._id !== currentUserId);
        }).catch(function(error) {
          console.error("Error loading users:", error);
          alert("Failed to load users.");
        });
    };
    $scope.currentUser = $rootScope.currentUser;
    // console.log("Logged-in user in projectController:", $scope.currentUser);
    $scope.getUsers();
  
$scope.assignRole = function(userId, role,projectId) {
  if (!projectId) {
    alert("Project ID not found!");
    return;
  }

  AuthService.assignUserRole(userId, role, projectId )
    .then(function(response) {
      alert('Role assigned successfully');
      $location.reload();
    })
    .catch(function(error) {
      alert('Error assigning role: ' + (error.data?.error || 'Unknown error'));
      console.error("Assign Role Error:", error);
    });
};
$scope.loadingProjects = true;

$scope.loadAllUserProjects = function () {
  const checkUserReady = function () {
    if ($rootScope.currentUser) {
      AuthService.getUserRelatedProjects()
        .then(function (response) {
          $scope.projects = response.data;
        })
        .catch(function (error) {
          console.error('Error loading user projects:', error);
        })
        .finally(function () {
          $scope.loadingProjects = false;
        });
    } else {
      // Try again after 100ms
      setTimeout(checkUserReady, 100);
    }
  };

  checkUserReady();
};

$scope.loadAllUserProjects();
$scope.getAssignedRole = function(userId, project) {
  const member = project.members.find(m => m.user === userId || (m.user && m.user._id === userId));
  return member ? member.role : '';
};
$scope.getUserRole = function(project) {
  const member = project.members.find(m => m.user._id === $scope.currentUser.id);
  return member ? member.role : null;
};

$scope.updateproject = function () {
  if (!$scope.project || !$scope.project._id) {
    alert("No project selected to update!");
    return;
  }
  const updatedData = {
    projectId: $scope.project._id,
    name: $scope.project.name,
    description: $scope.project.description,
    startDate: toUTCDateOnly($scope.project.startDate),
    endDate: toUTCDateOnly($scope.project.endDate)
  };

  AuthService.updateProject(updatedData)
    .then(function (response) {
      alert('Project updated successfully!');
      $scope.loadAllUserProjects();
      $location.path('/view-project'); // or wherever you want to go next
    })
    .catch(function (error) {
      console.error('Update error:', error);
      alert('Failed to update project');
    });
};


$scope.deleteProject = function(projectId) {
  if (confirm("Are you sure you want to delete this project?")) {
    AuthService.deleteProject(projectId)
      .then(function(response) {
        alert("Project deleted successfully!");
        $scope.loadAllUserProjects();
        $location.path('/view-project'); // or wherever you want to go next

      })
      .catch(function(error) {
        console.error("Delete Error:", error);
        alert("Failed to delete project: " + (error.data?.message || "Unknown error"));
      });
  }
};


$scope.goToUpdateProject = function (projectId) {
  $location.path('/update-project').search({ projectId: projectId });
};

$scope.projectDetails = {};

$scope.loadProjectById = function() {
  const projectId = $location.search().projectId; // Assumes URL is like /update-project?projectId=123
  $scope.project.endDate = new Date($scope.project.endDate);
  $scope.project.startDate = new Date($scope.project.startDate);


  if (!projectId) {
    alert("No project ID provided in URL.");
    return;
  }

  AuthService.getProjectById(projectId)
    .then(function(response) {
      $scope.projectDetails = response.data;
      $scope.project = {  // Optional: If you use $scope.project for form binding
        _id: response.data._id,
        name: response.data.name,
        description: response.data.description,
        startDate: new Date(response.data.startDate),
        endDate: new Date(response.data.endDate)
      };
    })
    .catch(function(error) {
      console.error("Error loading project:", error);
      alert("Failed to load project.");
    });
};
if ($location.path() === '/update-project') {
  $scope.loadProjectById();
};
$scope.createTask = function(projectId) {
  $location.path('/create-task').search({ projectId: projectId });
};
$scope.viewtask = function(projectId) {
  $location.path('/view-task').search({ projectId: projectId });
};
});
