var County = Backbone.Model.extend({
  defaults: {
    labels: ['Wellness exams', 'Sterilzation', 'Education', 'Long-acting', 'Barrier', 'Hormone']
  },

  initialize: function() {
    var self = this;

    var fields = _.find(shapes, function(c) {
      return c.properties.fips === self.get('fips');
    });

    var shape = new Shape(fields);

    this.set('shape', shape);
  },

  returnCountBundle: function() {
    var self = this;

    var payload = [];

    _.each(this.get('labels'), function(v,i) {
      payload.push({
        type: v,
        total2012: self.get('jj12')[i],
        total2013: self.get('jj13')[i]
      });
    });

    return payload;
  },

  getShape: function() {
    var shape = this.get('shape');
    return shape.attributes;
  }
});

var Shape = Backbone.Model.extend({});
