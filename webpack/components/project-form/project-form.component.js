var reflectMetadata = require('reflect-metadata');
var ng = {
  core: require("@angular/core")
};
var ProjectService = require("../../services/project.service");
var Project = require("../../classes/project");

var ProjectFormComponent = ng.core.Component({
  selector: "project-form",
  template: require("./project-form.component.html"),
  providers: [ProjectService],
  outputs: ["valueChanged"],
  inputs: ["projectId", "mode"],
  queries: {
    projectInput: new ng.core.ViewChild('projectInput')
  }
}).Class({
  newModel: function() {
    this.model = new Project("");
  },
  constructor: [
    ProjectService,
    ng.core.Renderer,
    function(ProjectService, Renderer) {
      this.ProjectService = ProjectService;
      this.renderer = Renderer;
      this.valueChanged = new ng.core.EventEmitter();
      this.projectId = null;
      this.newModel();
    }
  ],

  ngOnInit: function() {
    if (this.projectId != null) {
      this.ProjectService.findProject(this.projectId)
      .subscribe(data => {
        this.model = data.json();
      }, error => {
        window.alert(error);
      });
    };
  },

  ngAfterViewChecked: function() {
    this.renderer.invokeElementMethod(
      this.projectInput.nativeElement, 'focus');
  },

  onSubmit: function() {
    this.ProjectService.saveProject(this.model)
    .subscribe(response => { 
      this.newModel();
      this.valueChanged.emit({project: response.json()});
    }, error => {
      window.alert(error);
    });
  }
});

module.exports = ProjectFormComponent;