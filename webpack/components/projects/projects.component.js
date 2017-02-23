var reflectMetadata = require('reflect-metadata');
var ng = {
  core: require("@angular/core")
};
var ProjectService = require("../../services/project.service")

// Modal window
var ngxModal = require("ngx-modal");

var ProjectsComponent = ng.core.Component({
  selector: "projects",
  template: require("./projects.component.html"),
  providers: [
    ProjectService
  ],
  imports: [ 
    ngxModal.ModalModule
  ],
  queries: { 
    projectModal: new ng.core.ViewChild('projectModal')
  }
}).Class({
  constructor: [
    ProjectService,
    ng.core.Renderer,
    function(ProjectService, Renderer) {
      this.ProjectService = ProjectService;
      this.renderer = Renderer;
      this.projects = null;
      this.proj = false;
      this.projectId = null;
    }
  ],

  ngOnInit: function() {
    this.loadProjects();
  },

  loadProjects: function() {
    this.ProjectService.getList()
    .subscribe(data => {
      this.projects = data.json();
    }, error => {
      window.alert(error);
    });
  },

  newProject: function() {
    this.proj = true;
    this.projectId = null;
    this.projectModal.open();
  },

  editProject: function(project) {
    this.proj = true;
    this.projectId = project.id;
    this.projectModal.open();
  },

  deleteProject: function(project) {
    if (confirm("Are U sure?") === true) {
      this.ProjectService.deleteProject(project)
      .subscribe(response => { 
        this.loadProjects(); 
      });
    };
  },

});

module.exports = ProjectsComponent;