var RoomHTTPEvents = (function(){
    var fetch_data = function(method,url,form_data=null,callback=null){
        var xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
        
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200) {
                if(callback!=null) callback(JSON.parse(xhr.response));
            }
        };
        
        xhr.onerror = function(){ 
            console.log("XHR error: "+method+",URL="+url+",form_data="+form_data);
        }; 
        
        if(form_data!=null) xhr.send(form_data);
        else                xhr.send();
    }

    var init=function(roomcode=null,callback=null){
        var fd = new FormData();
		fd.append("mode","init_stream");
        fd.append("roomcode",roomcode);

        fetch_data(
            'POST',
            'http://thedarkgates.rf.gd/videogaze-BE/room.php',
            fd, callback
        )
    }

    var request=function(roomcode,request_type,request_value,callback=null){
        var fd = new FormData();
		fd.append("mode","request");
        fd.append("roomcode",roomcode);
        fd.append("request_type",request_type);
        fd.append("request_value",request_value);

        fetch_data(
            'POST',
            'http://thedarkgates.rf.gd/videogaze-BE/room.php',
            fd, callback
        )
    }

    return{
        init: init,
        request: request
    }
})();

var Room = (function(){
    var _roomdata=null;

    var get_data=function(){return _roomdata;}

    var init=function(roomcode=null,callback=null){
        RoomHTTPEvents.init(roomcode,function(response){
            if(response.status==1){
                _roomdata = response.message;
                if(!response.message.hasOwnProperty("roomcode")) _roomdata.roomcode = roomcode;
            }
            if(callback!=null) callback(response);
        });
    }

    var set_stream=function(stream_type,stream_key){
        RoomHTTPEvents.request(_roomdata.roomcode,'set_stream',stream_type+";key="+stream_key);
    }

    var set_isplaying=function(isplaying){
        RoomHTTPEvents.request(_roomdata.roomcode,'set_isplaying',(isplaying==true?1:0));
    }

    var set_current_time=function(current_time){
        RoomHTTPEvents.request(_roomdata.roomcode,'set_current_time',current_time);
    }

    var attach_videojs_handler=function(video_player_id){
        var actual_time=(new Date()).getTime();
        var my_player = videojs(video_player_id);
        my_player.on('loadeddata',function(){
            var player_time=(new Date()).getTime();
            console.log("Video took: "+(player_time-actual_time)+" ms to buffer!");
        });
        my_player.on('timeupdate',function(){
            console.log("Current time, timeupdate = "+my_player.currentTime());
        })
        my_player.on('playing',function(){
            console.log("Video playing at time: "+my_player.currentTime());
        });
        my_player.on('waiting',function(){
            console.log("Video is buffering...");
        });
        my_player.on('pause',function(){
            console.log("Video paused.");
        });
        my_player.on('seeking',function(){
            console.log("Video seeking...");
        });
        my_player.on('seeked',function(){
            console.log("Video seeked at time: "+my_player.currentTime());
        });
    }

    return{
        init: init,
        get_data: get_data,
        attach_videojs_handler: attach_videojs_handler
    }
})();