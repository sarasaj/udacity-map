//the code for creating the map and markers i learned when doing the lessons on google API
var map;
var markers = [];
var marker;
var current; //current marker

var locationsArray = [{
        title: 'Grand Hotel Zell Am See',
        location: {
            lat: 47.3242331,
            lng: 12.8011459
        },
        marker: ""
    },
    {
        title: 'Lake_Zell',
        location: {
            lat: 47.3250432,
            lng: 12.8013639
        },
        marker: ""
    },
    {
        title: 'Ali papa Resturant',
        location: {
            lat: 47.3243087,
            lng: 12.7965509
        },
        marker: ""
    },
    {
        title: 'Leisure Center Zell am See',
        location: {
            lat: 47.325925,
            lng: 12.795040
        },
        marker: ""
    },
    {
        title: 'Rosenburg',
        location: {
            lat: 47.323306,
            lng: 12.796228
        },
        marker: ""
    }

];
var Location = function(location) {
    this.title = ko.observable(location.title);
    this.lat = ko.observable(location.location.lat);
    this.lng = ko.observable(location.location.lng);
    this.marker = ko.observable(location.marker);
};
var largeInfowindow;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    var defaultIcon = makeMarkerIcon('d61717');
    var highLightedIcon = makeMarkerIcon('FFFF24');
    
    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 47.3235200,
                lng: 12.7968500
            },
            zoom: 15
        });
    } catch (error) {
        alert("error loading the map");
        console.log("in catch");
    }
    largeInfowindow = new google.maps.InfoWindow();
    

    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locationsArray.length; i++) {
        // Get the position from the location array.
        var position = locationsArray[i].location;
        var title = locationsArray[i].title;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        marker.setIcon(defaultIcon);
        markers.push(marker);
        locationsArray[i].marker = marker;
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', onclickinfo);
        bounds.extend(markers[i].position);
        current= marker;
    }
    // Extend the boundaries of the map for each marker
    google.maps.event.addDomListener(window, 'resize', function() {
      map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    });

    ko.applyBindings(viewModel);

}

function onclickinfo() {
    var onClickIcon = makeMarkerIcon('7142f4');
    restMarker();
    current = this;
    populateInfoWindow(this, largeInfowindow);
    this.setIcon(onClickIcon); //when clicked it turns purple
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        var wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + marker.title + '&prop=revisions&rvprop=content&callback=?';
        jQuery.ajax({
                url: wikiUrl,
                dataType: 'jsonp',
            })
            .done(function(response) {
                var wikiContent = '';
                var articleList = response[1],
                    articleStr = articleList[0];
                var url;
                if(articleStr === undefined) {
                    url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    infowindow.setContent('<div>' + marker.title + '</div><br> no wikipedia article has been found');
                    
                }else {
                    url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    infowindow.setContent('<div>' + marker.title + '</div><br> visit <a target="_blank" href="' + url + '">wikipedia site for more info</a><br>');
                }
                infowindow.open(map, marker);
                

            })
            .fail(function() {
                //error handling
                alert("error in ajax call to wikipedia's api");
            });



        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin of 0, 0 and be anchored at 10, 34).
//function that changes the color of the marker from udacity course on API
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

function hideAllMarkers(){
    for (var i = 0; i < locationsArray.length; i++) {
        locationsArray[i].marker.setVisible(false);
    }
}
function toggleBounce(marker) {
    restMarker();
    current = marker;
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);

    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1000); 
    }
}

function errorMessage() {
    alert("an error accord please check again");
}
function restMarker(){
    current.setAnimation(null);
    var defaultIcon = makeMarkerIcon('d61717');
    current.setIcon(defaultIcon);
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100vw";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0p";
}