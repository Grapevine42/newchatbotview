$( document ).ready(function() {
    var serverAddress = "localhost";
    var mapEntityArray = ["situation_fire","situation_fire","situation_fire","situation_fire","situation_fire"];
    var imageEntityArray = ["situation_fire","situation_fire","situation_fire","situation_fire","situation_fire"];
    $("#cameraview").hide();
    $("#walwal").hide();

    for(var i = 0; i < mapEntityArray.length; i++){
        var conEntity ;
        if(conEntity == mapEntityArray[0]){
            return type = "map";
        }
    }
    var chatbody = $("#msg_history");
    var socket = io.connect("http://localhost:8080");


    var myInfo = {
        name: "defualt",
        blood :"O rh+",
        age :"30",
        gender : "female",
        lat: 0,
        long: 0
    };

    init();


    function init() {
        setUserData()
    }

    function setUserData() {
        console.log("location ?")
        geoFindMe(function (lat, long) {
            myInfo.lat = lat;
            myInfo.long = long;
            console.log("my location : ", myInfo);
            sendMyInfo()
        });
    }

    function sendMyInfo() {
        socket.emit("enter", myInfo);

    }
    function geoFindMe(callback) {
        if (!navigator.geolocation) {
            alert("사용자 위치를 파악할 수 없습니다");
            return;
        }

        function success(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;


            callback(latitude, longitude);
        };

        function error() {
            console.error("err gps")
            output.innerHTML = "사용자의 위치를 찾을 수 없습니다.";
        };
        navigator.geolocation.getCurrentPosition(success, error);
    }


    function initMap() {
        console.log("init map");
        var map = new google.maps.Map(document.getElementById('map_google'), {
            zoom: 10,
            center: {lat: myInfo.lat, lng: myInfo.long}
        });
console.log('map'+map);
        setMarkers(map);
    }


    function setMarkers(map) {

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





    function createSlider() {

    }

    function create() {

    }

//----walwal

    var beaches = [['hi', 37.528292, 127.117533, 0]];

    function initWalwal() {
        console.log("init map");
        var map = new google.maps.Map(document.getElementById('map_google'), {
            zoom: 10,
            center: {lat: myInfo.lat, lng: myInfo.long}
        });

        setWalMarkers(map);
    }


    function setWalMarkers(map) {

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


        var location;
        $.ajax({
            url: "http://172.20.10.2:8080/listphoto",
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
                marker.addListener('click', function () {
                    alert('marker clicked');
                    walDetail();
                });
            },
            error: function () {
                alert("error");
            }
        });


    }


    function walDetail(){
        $('#walwal').hide();
        $('#walDetail').show();
        var str;
        $.ajax({
            url: "http://172.20.10.2:8080/listphoto",
            type: 'get',
            success: function (data) {
                console.log(data + 'data');
                str='';
                $.each(data, function (index, item) {
                str += '<div class="w3-display-container mySlides">'
                    str += '    <img src="http://172.20.10.2:8080/'
                    str += item.path
                    str +='"style="width:100%">'
                    str += '       <div class="w3-display-bottomleft w3-large w3-container w3-padding-16 w3-black">'
                    str += item.name
                    str += '</div></div>'
                });

                $('#walSlider').append(str);
    }
        });

    }
//----


    $(".heading-compose").click(function () {
        $(".side-two").css({
            "left": "0"
        });
    });
    $("#send").click(function () {
        console.log("isclick?")
        var value = $("#chatinput").val();
        console.log(value);
        addMyTalk(value);
    });
    $("#camera").click(function () {
        $("#cameraview").show();
        $("#cameraview").append(
            '<video id="video" width="640" height="480" autoplay></video>\n' +
            '<button id="snap">Snap Photo</button>\n' +
            '<button id="sendPhoto">sendPhoto</button>\n'+
            '<canvas id="canvas" width="640" height="480"></canvas>\n'
        );
        var video = document.getElementById('video');
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            });
        }
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var video = document.getElementById('video');

// Trigger photo take
        document.getElementById("snap").addEventListener("click", function() {
            var image= context.drawImage(video, 0, 0, 640, 480);
            image.src = canvas.toDataURL('images');
        });

    });

    $("#walwalBtn").click(function () { //왈왈이 페이지
        alert('hi');
       $('#walwal').show();
        initWalwal();

    });


    $(".newMessage-back").click(function () {
        $(".side-two").css({
            "left": "-100%"
        });
    });

    function addMyTalk(msg) {
        //화면에 표시하기
        var mymsg = $(
            "<div class=\"outgoing_msg\">\n" +
            "<div class=\"sent_msg\">\n" +
            "<p>" + msg +"</p>" +
            "<span class=\"time_date\"> "+moment().calendar()+"</span> </div>\n" +
            "</div>\n")
        chatbody.append(mymsg);
        socket.emit('message', msg);
    }

    function addTheirTalk() {

    }
    socket.on('message', (data) => {
        var getMsg = data;
        console.log(getMsg);
        if(data.type== 'map'){ //현재 위치에서 가장 가까운 대피소를 보기
            drawMap();
        }
        else if(data.type== 'image'){
            drawImageSlider();
        }
        else if(data.type=='drawDisasterPreview'){
            drawDisasterPreview(getMsg.location, getMsg.status);
        }
        else if(data.type=='option'){
            //{ type: ‘option’, data: [ ‘situation’, ‘escape’, ‘request’ ] }
            var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
                "<div class=\"received_msg\">\n" +
                "<div class=\"received_withd_msg\">\n" +
                "<p>" + getMsg.data.output.text[0] +"</p>\n" +
                "<span class=\"time_date\">" +moment().calendar() +"</span></div>\n" +
                "</div>\n" +
                "</div>\n")
            chatbody.append(theirMsg);

        }
        else{
        var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"received_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "            <p>" + getMsg.data.output.text[0] +"</p>\n" +
            "<span class=\"time_date\">" +moment().calendar() +"</span></div>\n" +
            "        </div>\n" +
            "        </div>\n")
        chatbody.append(theirMsg);}
    });
    function drawMap() {
        var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"received_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "            <div id= 'map_google' style='width: 300px; height: 300px'>" + "지도를 그릴거에요" +"</div>\n" +
            "            <span class=\"time_date\"> 11:01 AM    |    June 9</span></div>\n" +
            "        </div>\n" +
            "        </div>\n")
        initMap();
        chatbody.append(theirMsg);

    }

    function drawSelection() {
        var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"received_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "            <div = 'selection'>" + "지도를 그릴거에요" +"</div>\n" +
            "            <span class=\"time_date\"> 11:01 AM    |    June 9</span></div>\n" +
            "        </div>\n" +
            "        </div>\n")
        chatbody.append(theirMsg);
    }

    function drawImageSlider() {
        var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"received_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "            <img src= \'"+ imageName +" \'>" + "지도를 그릴거에요" +"</img>\n" +
            "            <span class=\"time_date\"> 11:01 AM    |    June 9</span></div>\n" +
            "        </div>\n" +
            "        </div>\n")
        chatbody.append(theirMsg);

    }


    function drawDisasterPreview(location, status) {

        var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"received_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "           <h4>Disaster Info.<br>"+location+"<br></h4><h2>"+status+"</h2>\n" +
            "            <span class=\"time_date\"> 11:01 AM    |    June 9</span></div>\n" +
            "        </div>\n" +
            "        </div>\n")
        chatbody.append(theirMsg);

    }

//-----------------------walDetail - slider------------------------
    $('input').keyup(function(e) {
        if (e.keyCode == 13) {
            var value = $("#chatinput").val();
            addMyTalk(value);
        };
    });



    var slideIndex = 1;
    showDivs(slideIndex);

    function plusDivs(n) {
        showDivs(slideIndex += n);
    }

    function showDivs(n) {
        var i;
        var x = document.getElementsByClassName("mySlides");
        if (n > x.length) {slideIndex = 1}
        if (n < 1) {slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "block";
    }

///------------------------------------


});


//지도를 만들어주는 기능
//선택 버튼을 만들어주는 기능
//질문 구분 로직
