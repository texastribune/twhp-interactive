var counties = new Counties();
var activeCounty = new Backbone.Collection();

var countySelectView = new CountySelectView({collection: counties});

new BarChartView();
new TableView();
new TableProviderView();

var mapView = new MapView({
  mapboxID: 'texastribune.map-4xwafpgp',
  mapEl: 'map'
});

var layer = new GeoJsonLayerView({collection: counties});

counties.fetch({reset: true}).then(function() {
  activeCounty.set(counties.findWhere({county: 'Harris'}));
});
