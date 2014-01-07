var CountySelectView = Backbone.View.extend({
  el: '#county-select',

  events: {
    'change': 'selectNewActiveCounty'
  },

  initialize: function() {
    this.listenTo(this.collection, 'reset', this.render);
    this.listenTo(activeCounty, 'add', this.setActiveValue);
  },

  render: function() {
    var payload = [];

    this.collection.each(function(model) {
      var view = new IndividualSelectView({model: model});
      payload.push(view.render().el);
    });

    this.$el.append(payload);
  },

  selectNewActiveCounty: function() {
    var val = this.$el.val();
    var county = this.collection.findWhere({fips: val});

    activeCounty.set(county);
  },

  setActiveValue: function(model) {
    this.$el.val(model.get('fips'));
  }
});

var IndividualSelectView = Backbone.View.extend({
  tagName: 'option',

  template: _.template('<%= county %>'),

  render: function() {
    this.$el.html(this.template(this.model.toJSON())).attr('value', this.model.get('fips'));
    return this;
  }
});

var BarChartView = Backbone.View.extend({
  el: '#chart-container',
  labels: ['Wellness exams', 'Sterilzation', 'Education', 'Long-acting', 'Barrier', 'Hormone'],

  initialize: function() {
    this.listenTo(activeCounty, 'add', this.renderChart);
  },

  renderChart: function(model) {
    var parentWidth = this.$el.parent().width();
    var height = $(window).width() > 767 ? 400 : 350;

    this.$el.attr({width: parentWidth, height: height});

    this.chart = new Chart(this.el.getContext('2d'));

    this.chart.Bar({
      labels: this.labels,
      datasets: [{
        fillColor : 'rgba(55, 157, 146, 0.5)',
        strokeColor : 'rgba(55, 157, 146, 1)',
        data : model.get('jj12')
      },{
        fillColor : 'rgba(155, 206, 200, 0.5)',
        strokeColor : 'rgba(155, 206, 200, 1)',
        pointColor : 'rgba(151,187,205,1)',
        pointStrokeColor : '#fff',
        data : model.get('jj13')
      }]
    },{
      scaleFontFamily: "'Helvetica', 'Arial', sans-serif"
    });
  }
});

var TableView = Backbone.View.extend({
  el: '#table-data',

  template: _.template($('#table-row').html()),

  initialize: function() {
    this.listenTo(activeCounty, 'add', this.render);
  },

  render: function(model) {
    var self = this;

    var payload = '';
    var data = model.returnCountBundle();

    _.each(data, function(temp) {
      payload += self.template(temp);
    });

    this.$el.html(payload);
  }
});

var TableProviderView = Backbone.View.extend({
  el: '#table-data-providers',

  template: _.template($('#table-row-providers').html()),

  initialize: function() {
    this.listenTo(activeCounty, 'add', this.render);
  },

  render: function(model) {
    this.$el.html(this.template(model.toJSON()));
    return this;
  }
});

var MapView = Backbone.View.extend({
  initialize: function(obj) {
    this.mapboxID = obj.mapboxID;
    this.map = L.mapbox.map(obj.mapEl, null, {
      scrollWheelZoom: false
    });
    this.baseLayer = L.mapbox.tileLayer(this.mapboxID, {detectRetina: true}).addTo(this.map);

    var width = $(window).width();

    var mapZoom = 6;
    var mapCenter = [31.35, -100];

    if(width < 767) { mapZoom = 5; }

    if(width > 767) {
      //$('#legend').addClass('mapLegendOnMap').appendTo("#map");
    }

    this.setView(mapCenter, mapZoom);
  },

  setView: function(center, zoom) {
    this.map.setView(center, zoom);
  },

  addLayer: function(l) {
    return this.map.addLayer(l);
  }
});

var GeoJsonLayerView = Backbone.View.extend({
  colors: [
    'rgb(179,88,6)',
    'rgb(241,163,64)',
    'rgb(254,224,182)',
    'rgb(247,247,247)',
    'rgb(153,142,195)'
  ],

  initialize: function() {
    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    var self = this;

    this.layer = L.geoJson(this.collection.getShapes(), {
      style: function(feature) {
        var fips = feature.properties.fips;
        var model = self.collection.findWhere({fips: fips});
        var measure = model.get('bccd');
        var color;

        if (measure > 0) { color = self.colors[4]; }
        if (measure === 0) { color = self.colors[3]; }
        if (measure < -100) { color = self.colors[2]; }
        if (measure < -1000) { color = self.colors[1]; }
        if (measure < -10000) { color = self.colors[0]; }

        return {
          weight: 1,
          color: 'rgb(255, 255, 255)',
          opacity: 1,
          fillColor: color,
          fillOpacity: 0.6
        };
      },
      onEachFeature: function(feature, layer) {
        layer.on('click', function() {
          activeCounty.set(self.collection.findWhere({fips: feature.properties.fips}));
        });
      }
    });
    mapView.addLayer(this.layer);
  },


});
