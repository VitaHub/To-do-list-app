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
    projectModal: new ng.core.ViewChild('projectModal'),
    deadlineModal: new ng.core.ViewChild('deadlineModal')
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
      this.deadline = new Date();
      this.today = new Date();
      this.projectId = null;
      this.taskId = null;

      this.taskIndex = null;
      this.projectIndex = null;
    }
  ],

  ngOnInit: function() {
    this.loadProjects();
  },

  addProject: function(e) {
    this.projects.unshift(e.project);
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

  editProject: function(project, pi) {
    this.projectIndex = pi;
    this.proj = true;
    this.projectId = project.id;
    this.projectModal.open();
  },

  updateProject: function(e) {
    this.projects[this.projectIndex].name = e.project.name;
  },

  deleteProject: function(project, pi) {
    if (confirm("Are U sure?") === true) {
      this.ProjectService.deleteProject(project)
      .subscribe(response => { 
        this.projects.splice(pi, 1);
      });
    };
  },

  addTask: function(e, pi) {
    this.projects[pi].tasks.push(e.task);
  },

  editTask: function(project, task, pi, ti) {
    this.projectIndex = pi;
    this.taskIndex = ti;
    this.task = true;
    this.projectId = project.id;
    this.taskId = task.id;
    this.taskModal.open();
  },

  updateTask: function(e) {
    this.projects[this.projectIndex].tasks[this.taskIndex] = e.task;
  },

  markTask: function(projectId, task, pi, ti) {
    this.TaskService.markTask(projectId, task)
    .subscribe(response => {
      this.projects[pi].tasks[ti] = response.json();
    });
  },

  editDeadline: function(project, task, pi, ti) {
    if (task.deadline == null) {
      delete this.deadline;
    } else {
      this.deadline = new Date(task.deadline);
    };
    this.projectIndex = pi;
    this.taskIndex = ti;
    this.projectId = project.id;
    this.taskId = task.id;
    this.deadlineModal.open();
  },

  setDeadline: function(date) {
    this.TaskService.setDeadline(this.projectId, 
      this.taskId, this.formatDate(date))
        .subscribe(response => {
          this.deadlineModal.close();
          this.projects[this.projectIndex].tasks[this.taskIndex] = response.json();
        }, error => {
          window.alert(error);
        });
  },

  beforeDeadline: function(deadline) {
    dl = new Date(deadline);
    if (dl >= this.today) {
      return true;
    } else {
      return false;
    };
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

  deleteTask: function(project, task, pi, ti) {
    if (confirm("Are U sure?") === true) {
      this.TaskService.deleteTask(project, task)
      .subscribe(response => { 
        this.projects[pi].tasks.splice(ti, 1);
      });
    };
  },

  formatDate: function(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

});

module.exports = ProjectsComponent;