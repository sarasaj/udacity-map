var viewModel = function() {
    var self = this;
    this.locations = ko.observableArray([]);

    locationsArray.forEach(function(location) {
        self.locations.push(new Location(location));
    });

    self.query = ko.observable('');

    // this.showMarker = function(loc) {
    //     console.log("in showMarker:"+loc.title);
    //     // populateInfoWindow(this.marker, largeInfowindow);
    //     // toggleBounce(this.marker);
    // };
    this.show = function(location) {
        console.log("location.title() : " + location.title());
        toggleBounce(location.marker());
        populateInfoWindow(location.marker(), largeInfowindow);
    };
    this.search = function(value) {
        self.locations.removeAll();
        for (var x in locationsArray) {
            if (locationsArray[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.locations.push(new Location(locationsArray[x]));
            }
        }

    };
    self.query.subscribe(self.search);
};