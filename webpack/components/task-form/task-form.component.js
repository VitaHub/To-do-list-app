var reflectMetadata = require('reflect-metadata');
var ng = {
  core: require("@angular/core")
};
var TaskService = require("../../services/task.service");
var Task = require("../../classes/task");

var TaskFormComponent = ng.core.Component({
  selector: "task-form",
  template: require("./task-form.component.html"),
  providers: [TaskService],
  outputs: ["valueChanged"],
  inputs: ["taskId", "projectId", "mode"],
  queries: {
    taskInput: new ng.core.ViewChild('taskInput')
  }
}).Class({

  newModel: function() {
    this.model = new Task("", false);
  },
  
  constructor: [
    TaskService,
    ng.core.Renderer,
    function(TaskService, Renderer) {
      this.TaskService = TaskService;
      this.renderer = Renderer;
      this.valueChanged = new ng.core.EventEmitter();
      this.taskId = null;
      this.projectId = null;
      this.newModel();

      this.focusProject = null;
      this.focusedProject = null;
    }
  ],

  ngOnInit: function() {
    if (this.taskId != null) {
      this.TaskService.findTask(this.projectId, this.taskId)
      .subscribe(data => {
        this.model = data.json();
      }, error => {
        window.alert(error);
      });
    };
  },

  setFocusedProject: function(projectId) {
    this.focusProject = projectId;
  },

  isFocused: function(projectId) {
    this.focusedProject = projectId;
  },

  ngAfterViewChecked: function() {
    if (!!this.taskInput == true) {
      this.renderer.invokeElementMethod(
        this.taskInput.nativeElement, 'focus');
    } else {
      this.focusInput();
    };

  },

  focusInput: function() {
    if (this.focusProject != null && this.focusProject != this.focusedProject) {
      try {
        el = document.getElementById("task-for-proj-" + this.focusProject);
        this.renderer.invokeElementMethod(el, 'focus');
      } catch (err) {};
    };
  },

  onSubmit: function() {
    this.TaskService.saveTask(this.projectId, this.model)
    .subscribe(response => { 
      this.newModel();
      this.valueChanged.emit({ projectId: this.projectId,
                                task: response.json() });
      this.focusedProject = null;
    }, error => {
      window.alert(error);
    });
  }
});

module.exports = TaskFormComponent;