var RoomHTTPEvents = (function(){
    var init=function(roomcode=null,callback=null){
        var fd = new FormData();
		fd.append("mode","init_stream");
        fd.append("roomcode",roomcode);

        var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://thedarkgates.rf.gd/videogaze-BE/room.php', true);
        
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200) {
                if(callback!=null) callback(JSON.parse(xhr.response));
            }
        };
        
        xhr.onerror = function(){ 
            console.log("XHR error");
        }; 
        
        xhr.send(fd);
    }

    return{
        init: init
    }
})();

var Room = (function(){
    var _roomdata=null;

    var get_data=function(){return _roomdata;}

    var init=function(roomcode=null,callback=null){
        RoomHTTPEvents.init(roomcode,function(response){
            if(response.status==1){
                _roomdata = response.message;
            }
            if(callback!=null) callback(response);
        });
    }

    return{
        init: init,
        get_data: get_data
    }
})();