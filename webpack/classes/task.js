var ng = {
  core: require("@angular/core")
};

var Task = ng.core.Class({
  constructor: function(name, done) {
    this.name = name;
    this.done = done;
  }
});

module.exports = Task;