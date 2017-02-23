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
  http: require("@angular/http")
};

var dragula = require('ng2-dragula');
var ngxModal = require("ngx-modal");

var ProjectsComponent = require('./components/projects/projects.component');
var ProjectFormComponent = 
  require('./components/project-form/project-form.component');

var AppModule = ng.core.NgModule({
  imports: [ 
    ng.platformBrowser.BrowserModule, 
    ng.forms.FormsModule,
    ng.http.HttpModule,
    dragula.DragulaModule,
    ngxModal.ModalModule
  ],
  declarations: [ 
    ProjectsComponent,
    ProjectFormComponent
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
