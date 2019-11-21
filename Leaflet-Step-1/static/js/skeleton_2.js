// Load the geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Create a function for the marker size
function markerSize(magnitude) {
    return magnitude * 10;
}

// Create a function to determine each marker color
function markerColor(magnitude) {

    // Use conditionals to determine which color
    if (magnitude > 5) {
        return "maroon";
    }
    else if (magnitude > 4) {
        return "red";
    }
    else if (magnitude > 3) {
        return "orange";
    }
    else if (magnitude > 2) {
        return "yellow";
    }
    else if (magnitude > 1) {
        return "green";
    }
    else {
        return "lime";
    }

}

// Perform a request of the data
d3.json(geoData, function(data) {

    // Once the response is recieved, send it to the createFeatures function
    createFeatures(data.features);
});

// Create the createFeatures function
function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

// Create a function to create a map
function createMap(earthquakes) {

    // Create the tile layer
    var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Initialize all the LayerGroups I will use
    var layers = {
        LOW: new L.LayerGroup(),
        LOW_MEDIUM: new L.LayerGroup(),
        MEDIUM: new L.LayerGroup(),
        MEDIUM_HIGH: new L.LayerGroup(),
        HIGH: new L.LayerGroup(),
        EXTREME: new L.LayerGroup()
    };

    // Create the map object with options
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [
            layers.LOW,
            layers.LOW_MEDIUM,
            layers.MEDIUM,
            layers.MEDIUM_HIGH,
            layers.HIGH,
            layers.EXTREME
        ]
    });

    // Add the streetMap tile layer to the map
    streetMap.addTo(myMap);

    // Create an overlays object to add to the layer control
    var overlays = {
        "Low": layers.LOW,
        "Low-Medium": layers.LOW_MEDIUM,
        "Medium": layers.MEDIUM,
        "Medium-High": layers.MEDIUM_HIGH,
        "High": layers.High,
        "Extreme": layers.EXTREME
    };

    // Create a control for the layers and overlay layers to it
    L.control.layers(null, overlays).addTo(myMap);

    // Create a legend to display information about the map
    var info = L.control({
        position: "bottomright"
    });

    // Insert a div with the class of "legend" when the layer control is added
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };

    // Add the info legend to the map
    info.addTo(myMap);

    // Initialize an object containing markers for each layer group
    var markers = {
        LOW: L.circle
    }

}
