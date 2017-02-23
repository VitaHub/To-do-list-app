var ng = {
  core: require("@angular/core"),
  http: require("@angular/http")
};

var ProjectService = ng.core.Injectable()
.Class({
  constructor: [
    ng.http.Http,
    function(http) { 
      this.http = http;
    }
  ],
  getList: function() {
    return this.http.get('/api/projects.json');
  },
  findProject: function(projectId) {
    return this.http.get('/api/projects/' + projectId + '.json');
  },
  deleteProject: function(project) {
    return this.http.delete('/api/projects/' + project.id + '.json');
  },
  saveProject: function(project) {
    var body = { project: project };

    if (!!project.id) {
      return this.http.patch('/api/projects/' + project.id + '.json', body);
    } else {
      return this.http.post('/api/projects.json', body);
    };
  }
})

module.exports = ProjectService;