var ng = {
  core: require("@angular/core")
};

var Project = ng.core.Class({
  constructor: function(name) {
    this.name = name;
  }
});

module.exports = Project;