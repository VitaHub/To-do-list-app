var reflectMetadata = require('reflect-metadata');
var ng = {
  core: require("@angular/core")
};
var ProjectService = require("../../services/project.service")
var TaskService = require("../../services/task.service")

// Drag and drop
var dragula = require('ng2-dragula/ng2-dragula');

// Modal window
var ngxModal = require("ngx-modal");

var ProjectsComponent = ng.core.Component({
  selector: "projects",
  template: require("./projects.component.html"),
  providers: [
    ProjectService,
    TaskService
  ],
  imports: [ 
    dragula.DragulaService,
    ngxModal.ModalModule
  ],
  queries: { 
    taskModal: new ng.core.ViewChild('taskModal'),
    projectModal: new ng.core.ViewChild('projectModal')
  }
}).Class({
  constructor: [
    ProjectService,
    TaskService,
    dragula.DragulaService,
    ng.core.Renderer,
    function(ProjectService, TaskService, DragulaService, Renderer) {
      this.ProjectService = ProjectService;
      this.TaskService = TaskService;
      this.DragulaService = DragulaService;
      this.renderer = Renderer;
      this.projects = null;
      this.DragulaService.dropModel
        .subscribe(value => {
          this.reorderTasks(value[0], value[1].id);
        }
      );
      this.options = {
        moves: function(el, container, handle) {
          return handle.className === 'fa fa-unsorted prioritize';
        }
      };
      this.proj = false;
      this.task = false;
      this.projectId = null;
      this.taskId = null;
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

  loadTasks: function($event) {
    this.TaskService.getList($event.projectId)
    .subscribe(data => {
      this.projects.forEach(function(item) {
        if (item.id == $event.projectId) {
          item.tasks = data.json();
        };
      });
    }, error => {
      window.alert(error);
    });
  },

  editTask: function(project, task) {
    this.task = true;
    this.projectId = project.id;
    this.taskId = task.id;
    this.taskModal.open();
  },

  markTask: function(projectId, task) {
    this.TaskService.markTask(projectId, task)
    .subscribe(response => {
      this.loadProjects();
    });
  },

  reorderTasks: function(projectId, taskId) {
    var taskIndex = this.projects.filter(x => x.id == projectId)[0]
      .tasks.map(x => x.id).indexOf(parseInt(taskId));
    this.TaskService.reorderTasks(projectId, taskId, taskIndex)
      .subscribe(response => {
        console.log(response);
      }, error => {
        window.alert(error);
      });
  },

  deleteTask: function(project, task) {
    if (confirm("Are U sure?") === true) {
      this.TaskService.deleteTask(project, task)
      .subscribe(response => { 
        this.loadProjects(); 
      });
    };
  }

});

module.exports = ProjectsComponent;