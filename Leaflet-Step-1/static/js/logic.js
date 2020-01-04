const API_KEY = "pk.eyJ1IjoicGd1aWxsZXJnYW4iLCJhIjoiY2s0OWIyYXZ4MDNieTNucmlkandtZmR2YyJ9.QOfRLdh6TPZbNZ_49_8IwA";

var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5,
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);




function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#630000";
    case magnitude > 4:
      return "#ab0000";
    case magnitude > 3:
      return "#f30000";
    case magnitude > 2:
      return "#ff4e4e";
    case magnitude > 1:
      return "#ff9c9c";
    default:
      return "#ffeaea";
    }
  }

function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

var json_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(json_link, function(data) {

  	L.geoJson(data, 
    	{
    	pointToLayer: function(feature, latlng) {
      		return L.circleMarker(latlng);
    	},
  		style: function(feature) {
      		return {
        	opacity: .4,
      		fillOpacity: .8,
      		fillColor: getColor(feature.properties.mag),
      		color: "#000000",
      		radius: getRadius(feature.properties.mag),
      		stroke: true,
     		weight: 0.5
      		}
      	},
      	onEachFeature: function(feature, layer) {
      		layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    	}
  	}).addTo(myMap);

  	var legend = L.control({
    	position: "topleft"
  	});

  	legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#ffeaea",
      "#ff9c9c",
      "#ff4e4e",
      "#f30000",
      "#ab0000",
      "#630000"
    ];

    
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    	return div;
  	};
  	legend.addTo(myMap);

})