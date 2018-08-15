initMap();

var beaches = [['hi', 37.528292, 127.117533, 0]];
function initMap() {
    console.log("init map");
    var map = new google.maps.Map(document.getElementById('map_google'), {
        zoom: 10,
        center: {lat: myInfo.lat, lng: myInfo.long}
    });

    setMarkers2(map);
}


function setMarkers2(map) {

    var image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };

    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    for (var i = 0; i < beaches.length; i++) {
        var beach = beaches[i];
        var marker = new google.maps.Marker({
            position: {lat: beach[1], lng: beach[2]},
            map: map,
            icon: image,
            shape: shape,
            title: beach[0],
            zIndex: beach[3]
        });
    }
    ;
}

function singleMarker(){
    $.ajax({
        url: 'http://172.20.10.2:8080/closeshel',
        contentType: 'application/json',
        method: 'POST',
        crossDomain: true,
        data: JSON.stringify({
            x: myInfo.lat,
            y: myInfo.long
        }),
        success: function (data) {
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(data.x), lng: parseFloat(data.y)},
                map: map,
                icon: image,
                shape: shape,
                title: data.name,
                zIndex: 1
            });
        }, error: function (error) {
            alert(error);
        }

    });
}


function doubleMarker(){
    $.ajax({
        url: "http://192.168.90.97:8080/listphoto",
        type: 'get',
        success: function (data) {
            console.log(data + 'data');
            $.each(data, function (index, item) {
                console.log('item.location ' + item.location + ' ' + typeof item.location);
                location = (item.location + '').split(',');
                beaches.push([item._id, parseFloat(location[0]), parseFloat(location[1]), index]);
                console.log(beaches);
                alert(beaches);
            });

        },
        error: function () {
            alert("error");
        }
    });
}
