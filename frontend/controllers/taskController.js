app.controller('taskController', function($scope, AuthService, $location, $rootScope) {
  $scope.newTask = {};

  const projectId = $location.search().projectId;

  $scope.newTask = {
      project: projectId //  Set project automatically
  };

  function toUTCDateOnly(dateString) {
      const localDate = new Date(dateString);
      return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
  }

  $scope.createTask = function() {
      // console.log('Create Task clicked!', $scope.newTask);
      const TaskData = {
          title: $scope.newTask.title,
          description: $scope.newTask.description,
          startDate: toUTCDateOnly($scope.newTask.startDate),
          endDate: toUTCDateOnly($scope.newTask.endDate),
          project: $scope.newTask.project
      };

      AuthService.createTask(TaskData)
          .then(function(response) {
              alert('Task created!');
              location.reload();
          })
          .catch(function(error) {
              console.error('Error:', error);
              alert('Failed to create Task');
          });
  };

  $scope.goToTaskList = function(projectId) {
    console.log(projectId);
      $location.path('/assign-role-task').search({ projectId: projectId });
  };
});

app.controller('assignTaskController', function($scope, AuthService, $rootScope, $timeout,$location) {
  $scope.myTasks = [];
  $scope.selectedTask = null;
  $scope.employees = [];
  $scope.selectedEmployees = []; // Array to store selected employees
  const projectId = $location.search().projectId; 

  $scope.goToEmpList = function(task) {
    $location.path('/assign-task-emp').search({ task: JSON.stringify(task) });
  };
  
  // Load tasks assigned to current user
  $scope.loadTasks = function(projectId) {
      AuthService.getMyTasks(projectId)
          .then(function(res) {
              $scope.myTasks = res.data;
          })
          .catch(function(error) {
              console.error('Error loading tasks:', error);
          });
  };

  $scope.loadTasks(projectId); // Initial call to load tasks
  
  $scope.loadingTasks = true;
  $scope.showTaskBoard = false;

  $timeout(function () {
    if ($location.path() === '/view-task') {
      $scope.viewTasks(projectId);
    }
  }, 0);
  
  $scope.viewTasks = function(projectId) {
    // Loading started
    $scope.loadingTasks = true;
    $scope.showTaskBoard = false; // Hide board while loading
    $scope.tasks = []; // Clear old tasks

    // console.log("Fetching tasks for projectId:", projectId);
  
    AuthService.getTaskByProject(projectId)
      .then(function(response) {
        $scope.tasks = response.data;
        $scope.loadingTasks = false; // Loader off
        $scope.showTaskBoard = true; // Now show tasks
      })
      .catch(function(error) {
        console.error('Error fetching tasks:', error);
        $scope.loadingTasks = false;
      });
  };
  $scope.getCurrentUserId = function() {
    return $rootScope.currentUser ? $rootScope.currentUser.id : null;
  };
  
  $scope.isAssignedToCurrentUser = function(task) {
    const currentUserId = $scope.getCurrentUserId();
    if (!Array.isArray(task.assignedTo)) return false;
    return task.assignedTo.some(user => user._id === currentUserId);
  };
  
  $scope.changeTaskStatus = function(task) {
    AuthService.updateTaskStatus(task._id)
      .then(function(response) {
        alert('Task status updated!');
        $scope.viewTasks(projectId); // Refresh task list
      })
      .catch(function(err) {
        console.error(err);
        alert('Failed to update task status.');
      });
  };
  $scope.goToUpdateTask = function(task) {
    $location.path('/update-task').search({ task: JSON.stringify(task) });
  };  
  $scope.gotoProject = function(){
    $location.path('view-project');
  }
});

app.controller('taskEmployeeController', function($scope, AuthService, $rootScope, $timeout, $location){
  $scope.selectedTask = null;
  $scope.employees = [];
  $scope.loadingEmployees = false;
  const task = JSON.parse($location.search().task || '{}');

  $scope.selectTask = function(task) {
    $scope.selectedTask = task;
    if (task && task.project && task.project._id) {
      const projectId = task.project._id;
      $scope.employees = [];
      $scope.loadingEmployees = true;

      AuthService.getAllEmployees(projectId)
        .then(function(res) {
          $scope.employees = res.data;
        })
        .catch(function(error) {
          console.error('Error loading employees:', error);
        })
        .finally(function() {
          $scope.loadingEmployees = false;
        });
    } else {
      console.error("Task or project ID missing.");
    }
  };

  $scope.selectTask(task);


  $scope.assignTask = function() {
      const selectedEmployees = $scope.employees.filter(employee => employee.selected);

      if (selectedEmployees.length > 0 && $scope.selectedTask) {
          selectedEmployees.forEach(function(employee) {
              // Assign task to each selected employee
              AuthService.assignTask($scope.selectedTask._id, employee._id)
                  .then(function(res) {
                      console.log('Task assigned to employee:', employee.name);
                  })
                  .catch(function(err) {
                      console.error('Error assigning task:', err);
                  });
          });

          // Alert user when task is assigned
          alert('Task assigned successfully to selected employees!');
          location.reload();
      } else {
          alert('Please select at least one employee.');
      }
  };
  $timeout(function () {
    window.dispatchEvent(new Event('resize'));
  }, 100);
});

app.controller('updateTaskController', function($scope, $location, AuthService) {
  $scope.task = JSON.parse($location.search().task || '{}');
  $scope.task.startDate = new Date($scope.task.startDate);
  $scope.task.endDate = new Date($scope.task.endDate);
  function toUTCDateOnly(dateString) {
    const localDate = new Date(dateString);
    return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
  }

  $scope.updateTask = function() {
    const updatedTask = {
      title: $scope.task.title,
      description: $scope.task.description,
      startDate: toUTCDateOnly($scope.task.startDate),
      endDate: toUTCDateOnly($scope.task.endDate)
    };

    AuthService.updateTask($scope.task._id, updatedTask)
      .then(function(res) {
        alert('Task updated successfully!');
        location.reload();
      })
      .catch(function(err) {
        console.error(err);
        alert('Error updating task.');
      });
  };
});
