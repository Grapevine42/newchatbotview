$( document ).ready(function() {
    var mapEntityArray = ["situation_fire","situation_fire","situation_fire","situation_fire","situation_fire"];
    var imageEntityArray = ["situation_fire","situation_fire","situation_fire","situation_fire","situation_fire"];
    $("#cameraview").hide();

    for(var i = 0; i < mapEntityArray.length; i++){
        var conEntity ;
        if(conEntity == mapEntityArray[0]){
            return type = "map";
        }
    }
    var chatbody = $("#msg_history");
    var socket = io.connect("192.168.1.80:8080");


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

        // listphoto();
        // $("#test2").click(function () {
        //     $.ajax({
        //         url: 'http://192.168.90.97:8080/closeshel',
        //         contentType: 'application/json',
        //         method: 'POST',
        //         crossDomain: true,
        //         data: JSON.stringify({
        //             x: 37.528292,
        //             y: 127.117533
        //         }),
        //         success: function (data) {
        //             $('#test').html(data.name + '  ' + data.x + ' ' + data.y);
        //             beaches.push([data.name, parseFloat(data.x), parseFloat(data.y), 10]);
        //             setMarkers(map);
        //         }, error: function (error) {
        //             alert(error);
        //         }
        //
        //     });
        //
        // });
        // setMarkers(map);
    }

    function createSlider() {

    }

    function create() {

    }


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
    })
    $("#camera").click(function () {
        $("#cameraview").show();
        $("#cameraview").append(
            '<video id="video" width="640" height="480" autoplay></video>\n' +
            '<button id="snap">Snap Photo</button>\n' +
            '<canvas id="canvas" width="640" height="480"></canvas>\n'
        )
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
            context.drawImage(video, 0, 0, 640, 480);
        });
    })



    $("#chatinput input[type=text]").on('keydown', function (e) {
        if (e.which == 13) {
            addMyTalk()
        }
    });

    $(".newMessage-back").click(function () {
        $(".side-two").css({
            "left": "-100%"
        });
    });

    function addMyTalk(msg) {
        //화면에 표시하기
        var mymsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"sent_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "            <p>" + msg +"</p>\n" +
            "            <span class=\"time_date\"> 11:01 AM    |    June 9</span></div>\n" +
            "        </div>\n" +
            "        </div>\n")
        chatbody.append(mymsg);
        socket.emit('message', msg);
    }

    function addTheirTalk() {

    }
    socket.on('message', (data) => {
        var getMsg = data;
        console.log(getMsg);
        if(data.type== 'map'){
            drawMap();
        }
        else if(data.type== 'image'){
            drawImageSlider();
        }
        var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"received_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "            <p>" + getMsg.data.output.text[0] +"</p>\n" +
            "            <span class=\"time_date\"> 11:01 AM    |    June 9</span></div>\n" +
            "        </div>\n" +
            "        </div>\n")
        chatbody.append(theirMsg);
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
        chatbody.append(theirMsg);
        initMap();

    }

    function drawSelection() {
        var theirMsg = $("    <div class=\"outgoing_msg\">\n" +
            "            <div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\"\n" +
            "        alt=\"sunil\"></div>\n" +
            "            <div class=\"received_msg\">\n" +
            "            <div class=\"received_withd_msg\">\n" +
            "            <div = 'map'>" + "지도를 그릴거에요" +"</div>\n" +
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
});
//지도를 만들어주는 기능
//선택 버튼을 만들어주는 기능
//질문 구분 로직

