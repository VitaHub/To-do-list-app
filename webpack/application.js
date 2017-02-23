require("bootstrap/dist/css/bootstrap.css");
var coreJS = require('core-js');
var zoneJS = require('zone.js');
var reflectMetadata = require('reflect-metadata');
var ng = {
  core: require("@angular/core"),
  common: require("@angular/common"),
  compiler: require("@angular/compiler"),
  forms: require("@angular/forms"),
  platformBrowser: require("@angular/platform-browser"),
  platformBrowserDynamic: require("@angular/platform-browser-dynamic"),
  // router: require("@angular/router"),
  http: require("@angular/http")
};

// var ProjectsComponent = require('./projects/projects.component');
// var ProjectFormComponent = require('./project-form/project-form.component');
// var TaskFormComponent = require('./task-form/task-form.component');

var dragula = require('ng2-dragula');
var ngxModal = require("ngx-modal");

var ProjectsComponent = ng.core.Component({
  selector: "projects",
  template: '\
    <h2 *ngIf="name">Hello {{name}}!</h2> \
    <form> \
      <div class="form-group"> \
        <label for="name">Name</label> \
        <input type="text" id="name" class="form-control" \
        name="name" bindon-ngModel="name"> \
      </div> \
    </form> \
    '
  }).Class({
  constructor: function() {
    this.name = null;
  }
});

var AppModule = ng.core.NgModule({
  imports: [ 
    ng.platformBrowser.BrowserModule, 
    ng.forms.FormsModule,
    ng.http.HttpModule,
    dragula.DragulaModule,
    ngxModal.ModalModule
  ],
  declarations: [ 
    ProjectsComponent/*,
    ProjectFormComponent,
    TaskFormComponent*/
  ],
  bootstrap: [ ProjectsComponent ]
}).Class({
  constructor: function() {}
});

document.addEventListener('DOMContentLoaded', function() {
  var shouldBootstrap = document.getElementById("ng2-app");
  if (shouldBootstrap) {
    ng.platformBrowserDynamic.
    platformBrowserDynamic().
    bootstrapModule(AppModule);
  }
});
