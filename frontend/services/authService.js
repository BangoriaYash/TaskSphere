app.factory('AuthService', function($http) {
    const API = 'http://localhost:5000/api/auth';
    const API_P = 'http://localhost:5000/api/projects';
    const Task_API = 'http://localhost:5000/api/tasks';
  
    return {
      register: function(user) {
        return $http.post(`${API}/register`, user,{withCredentials: true});
      },
      login: function(user) {
        return $http.post(`${API}/login`, user,{withCredentials: true}).then(res => {
          console.log("Login success", res.data);
          return res;
        });;
      },
      logout: function() {
        return $http.post(`${API}/logout`,{withCredentials: true});
      },
      
      createProject: function(projectData) {
        return $http.post(`${API_P}/create`, projectData,{ withCredentials: true });
      },
      // Fetch all users (admin sees this list)
      getAllUsers: function() {
        return $http.get(`${API_P}/users`, { withCredentials: true });
      },
  
      // Admin assigns role (leader/member) to other users
      assignUserRole: function(userId, role,projectId) {
        return $http.put(`${API_P}/assign-role`, { userId, role , projectId}, { withCredentials: true });
      },
      getUserProjects: function(){
        return $http.get(`${API_P}/my`, {withCredentials: true });
      },
      getUserRelatedProjects(){
        return $http.get(`${API_P}/user-related-projects`, {withCredentials: true });
      },
      updateProject: function (projectData) {
        return $http.put(`${API_P}/update/${projectData.projectId}`, projectData,{withCredentials: true });
      },
      deleteProject: function(projectId) {
        return $http.delete(`${API_P}/delete/${projectId}`, { withCredentials: true });
      },
      getProjectById: function(projectId) {
        return $http.get(`${API_P}/project/${projectId}`, { withCredentials: true });
      },
      createTask: function(TaskData) {
        return $http.post(`${Task_API}/createTask`, TaskData,{ withCredentials: true });
      },
      getMyTasks: function(projectId) {
        return $http.get(`${Task_API}/my-tasks/${projectId}`, { withCredentials: true });
      },
      getAllEmployees: function(projectId) {
          return $http.get(`${Task_API}/${projectId}/employees`, { withCredentials: true });
      },
      assignTask: function(taskId, employeeId) {
          return $http.put(`${Task_API}/assign-task/${taskId}`, { employeeId }, { withCredentials: true });
      },
      getTaskByProject: function(projectId){
        return $http.get(`${API_P}/getTaskByProject/${projectId}`,{withCredentials: true});
      },
      updateTaskStatus: function(taskId){
        return $http.patch(`${Task_API}/update-status/${taskId}`,{withCredentials: true})
      },
      updateTask: function(taskId,data){
        return $http.put(`${Task_API}/tasks/${taskId}`, data);
      }
    };
  });
  