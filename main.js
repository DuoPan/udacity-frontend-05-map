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
              markers[i].setIcon(
                new google.maps.MarkerImage(
                  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|0091ff|40|_|%E2%80%A2',
                  new google.maps.Size(21, 34),
                  new google.maps.Point(0, 0),
                  new google.maps.Point(10, 34),
                  new google.maps.Size(21, 34))
              );
              markers[i].setAnimation(null);
            } else {
              markers[i].setIcon(
                new google.maps.MarkerImage(
                  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|FF0000|40|_|%E2%80%A2',
                  new google.maps.Size(30, 50),
                  new google.maps.Point(0, 0),
                  new google.maps.Point(10, 34),
                  new google.maps.Size(30, 50))
              );
              markers[i].setAnimation(google.maps.Animation.BOUNCE);
              google.maps.event.trigger(markers[i], "click");
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
    // self.locs(self.locs().filter(item => item.title.includes(self.Query())));
    self.locs(self.locs().filter(item => item.title.toLowerCase().includes(self.Query().toLowerCase())));
    // 更新marker
    self.resetMap();    
  }

  self.resetMap = function() {
    for(i = 0; i < markers.length; i++) {
      markers[i].setIcon(
        new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|0091ff|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21, 34))
      );
      markers[i].setMap(null);
    }
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

  self.clearFliter = function() {
    // clear input field
    self.Query('');
    // clear self.locs
    self.locs(self.init);
    // refresh markers
    self.resetMap();
  }

  self.universityFliter = function() {
    self.Query('[University]');
    let temp = [];
    temp.push(self.init[2]);
    temp.push(self.init[5]);
    self.locs(temp);
    self.resetMap();
  }

  self.shopFliter = function() {
    self.Query('[Shop]');
    let temp = [];
    temp.push(self.init[0]);
    temp.push(self.init[1]);
    self.locs(temp);
    self.resetMap();
  }

  self.landmarkFliter = function() {
    self.Query('[Landmark]');
    let temp = [];
    temp.push(self.init[3]);
    temp.push(self.init[4]);
    self.locs(temp);
    self.resetMap();
  }

  self.showSidebar = ko.observable(false);

  self.openNav = function() {
    self.showSidebar(true);
  }
  self.closeNav = function() {
    self.showSidebar(false);
  }
}

ko.applyBindings(new AppViewModel(locations));

