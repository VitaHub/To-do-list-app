var ng = {
  core: require("@angular/core"),
  http: require("@angular/http")
};

var TaskService = ng.core.Injectable()
.Class({
  constructor: [
    ng.http.Http,
    function(http) { 
      this.http = http;
    }
  ],
  getList: function(projectId) {
    return this.http.get('/api/projects/' + projectId + 
      '/tasks.json');
  },
  findTask: function(projectId, taskId) {
    return this.http.get('/api/projects/' + projectId + 
      '/tasks/' + taskId + '.json');
  },
  deleteTask: function(project, task) {
    return this.http.delete('/api/projects/' + project.id + 
      '/tasks/' + task.id + '.json');
  },
  saveTask: function(projectId, task) {
    var body = { task: task };
    if (!!task.id) {
      return this.http.patch('/api/projects/' + projectId + 
        '/tasks/' + task.id + '.json', body);
    } else {
      return this.http.post('/api/projects/' + projectId + '/tasks.json', body);
    };
  },
  markTask: function(projectId, task) {
    task["done"] = !task["done"];
    var body = { task: task };
    return this.http.patch('/api/projects/' + projectId + 
      '/tasks/' + task.id + '.json', body);
  },
  reorderTasks: function(projectId, taskId, taskIndex) {
    var params = { 
      projectId: projectId, 
      taskId: taskId,
      newTaskIndex: taskIndex
    };
    return this.http.patch('/api/projects/' + projectId + 
      '/tasks/' + taskId + '.json', params);
  }
})

module.exports = TaskService;