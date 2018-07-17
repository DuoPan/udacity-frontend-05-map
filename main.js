var markers = [];

var locations = [
  {title: 'Shopping Center', location: {lat: -37.8102, lng: 144.9628}},
  {title: 'Queen Victoria Market', location: {lat: -37.8076, lng: 144.9568}},
  {title: 'University of Melbourne', location: {lat: -37.7964, lng: 144.9612}},
  {title: 'Flinders Street railway station', location: {lat: -37.8183, lng: 144.9671}},
  {title: 'St Kilda Beach', location: {lat: -37.8679, lng: 144.9740}},
  {title: 'Monash University', location: {lat: -37.876823, lng: 145.045837}},
];

var AppViewModel = function(locations) {
  var self = this;
  self.locs = ko.observableArray(ko.utils.arrayMap(locations, function(loc) {
    return {
      title: loc.title, 
      highlight: function(){
        let i = 0;
        for(; i < markers.length; i++) {
          if (markers[i].title === this.title) {
            if (markers[i].getAnimation() !== null) {
              markers[i].setAnimation(null);
            } else {
              markers[i].setAnimation(google.maps.Animation.BOUNCE);
            }
            break;
          }
        }
      }
    };
  }));
  self.init = self.locs();

  self.Query = ko.observable('');

  self.filter = function() {
    // 重置locs list
    self.locs(self.init);
    // 重置map
    let i = 0;
    if (self.Query() === '') {
      self.resetMap();
      return;
    }
    // 更新list
    self.locs(self.locs().filter(item => item.title.includes(self.Query())));
    // 更新marker
    for(i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    self.resetMap();    
  }

  self.resetMap = function() {
    self.locs().map((item) => {
      for(i = 0; i < markers.length; i++) {
        if (markers[i].title === item.title) {
          markers[i].setMap(map);
          break;
        }
      }
    });
    return;
  }


}

ko.applyBindings(new AppViewModel(locations));

