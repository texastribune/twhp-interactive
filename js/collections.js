var Counties = Backbone.Collection.extend({
  model: County,

  url: '../data/data.json',

  getShapes: function() {
    return this.map(function(model) {
      return model.getShape();
    });
  }
});
