var map;
var markers = [];
var polygon = null;
var placeMarkers = [];

function initMap() {
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];


  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -37.8136, lng: 144.9631}, // center of Melbourne City
    zoom: 14,
    styles: styles,
  });

  // var timeAutocomplete = new google.maps.places.Autocomplete(
  //   (document.getElementById('search-within-time-text')),{
  //     componentRestrictions: {
  //       country: 'AU'
  //     }
  //   });
  // var zoomAutocomplete = new google.maps.places.Autocomplete(
  //   (document.getElementById('zoom-to-area-text')),{
  //     componentRestrictions: {
  //       country: 'AU'
  //     }
  //   });
  // zoomAutocomplete.bindTo('bounds', map);
  // var searchBox = new google.maps.places.Autocomplete(
  //   document.getElementById('places-search'),{
  //     componentRestrictions: {
  //       country: 'AU'
  //     }
  //   }
  // );
  // searchBox.setBounds(map.getBounds());


  // Default locations in Melbourne CBD area.
  var locations = [
    {title: 'Shopping Center', location: {lat: -37.8102, lng: 144.9628}},
    {title: 'Queen Victoria Market', location: {lat: -37.8076, lng: 144.9568}},
    {title: 'University of Melbourne', location: {lat: -37.7964, lng: 144.9612}},
    {title: 'Flinders Street railway station', location: {lat: -37.8183, lng: 144.9671}},
    {title: 'St Kilda Beach', location: {lat: -37.8679, lng: 144.9740}},
  ];

  var largeInfowindow = new google.maps.InfoWindow();

  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24'); // Change color when mouses over the marker.
  
  // Initialize the drawing manager.
  // var drawingManager = new google.maps.drawing.DrawingManager({
  //   drawingMode: google.maps.drawing.OverlayType.POLYGON,
  //   drawingControl: true,
  //   drawingControlOptions: {
  //     position: google.maps.ControlPosition.TOP_LEFT,
  //     drawingModes: [
  //       google.maps.drawing.OverlayType.POLYGON
  //     ]
  //   }
  // });

  // Initially create an array of markers.
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  // document.getElementById('show-listings').addEventListener('click', showListings);
  // document.getElementById('hide-listings').addEventListener('click', function() {
  //   hideMarkers(markers);
  // });
  // document.getElementById('toggle-drawing').addEventListener('click', function() {
  //   toggleDrawing(drawingManager);
  // });
  // document.getElementById('zoom-to-area').addEventListener('click', function() {
  //   zoomToArea();
  // });
  // document.getElementById('search-within-time').addEventListener('click', function() {
  //   searchWithinTime();
  // });
  // searchBox.addListener('places_changed', function() {
  //   searchBoxPlaces(this);
  // });
  // document.getElementById('go-places').addEventListener('click', textSearchPlaces);

//   drawingManager.addListener('overlaycomplete', function(event) {
//     if (polygon) {
//       polygon.setMap(null);
//       hideMarkers(markers);
//     }
//     drawingManager.setDrawingMode(null);
//     polygon = event.overlay;
//     polygon.setEditable(true);
//     searchWithinPolygon();
//     polygon.getPath().addListener('set_at', searchWithinPolygon);
//     polygon.getPath().addListener('insert_at', searchWithinPolygon);
//   });
// }

// Set content of each info window
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

    // Add street view below
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

    // Open the window
    infowindow.open(map, marker);    
  }
}

// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
// function hideMarkers(markers) {
//   for (var i = 0; i < markers.length; i++) {
//     markers[i].setMap(null);
//   }
// }

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// This shows and hides (respectively) the drawing options.
// function toggleDrawing(drawingManager) {
//   if (drawingManager.map) {
//     drawingManager.setMap(null);
//     // In case the user drew anything, get rid of the polygon
//     if (polygon !== null) {
//       polygon.setMap(null);
//     }
//   } else {
//     drawingManager.setMap(map);
//   }
// }

  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
