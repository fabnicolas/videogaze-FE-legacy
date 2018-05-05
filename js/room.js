var DateTimeParser = (function(){
    var get_timestamp=function(date_str){
        if(date_str===undefined) date_str=null;
        return new Date(date_str!=null ? Date.parse(date_str): Date.now()).getTime();
    }
    return{get_timestamp: get_timestamp}
})();

var RoomHTTPEvents = (function(){
    var _mode=2; // 0=short polling, 1=long polling, 2=SSE

    var repeat_checktype=function(repeat_data,repeat_typetocheck){
        return repeat_data!=null &&
                repeat_data.hasOwnProperty("repeat_type") &&
                repeat_data.repeat_type==repeat_typetocheck;
    }



    var xhr_fetch_data = function(method,url,form_data,xhr_timeout,repeat_data,callback){
        if(form_data===undefined) form_data=null;
        if(xhr_timeout===undefined) xhr_timeout=3000;
        if(repeat_data===undefined) repeat_data=null;
        if(callback===undefined) callback=null;

        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.timeout=xhr_timeout;
        
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    console.log('xhr_response',method,url,JSON.parse(xhr.response).message);
                    if(callback!=null) callback(JSON.parse(xhr.response));
                    if(repeat_checktype(repeat_data,'always')){
                        setTimeout(xhr_fetch_data(method,url,form_data,xhr_timeout,callback),repeat_data.repeat_time);
                    }
                }else{
                    if(repeat_checktype(repeat_data,'onerror') || repeat_checktype(repeat_data,'always')){
                        setTimeout(xhr_fetch_data(method,url,form_data,xhr_timeout,callback),repeat_data.repeat_time);
                    }
                }
            }
        };

        xhr.ontimeout = function(){
            console.log("XHR: onTimeout["+method+",URL="+url+",form_data="+form_data+"]");
            if(repeat_checktype(repeat_data,'onerror') || repeat_checktype(repeat_data,'always')){
                setTimeout(xhr_fetch_data(method,url,form_data,xhr_timeout,callback),repeat_data.repeat_time);
            }
        }
        
        xhr.onerror = function(){ 
            console.log("XHR: onError["+method+",URL="+url+",form_data="+form_data+"]");
            if(repeat_checktype(repeat_data,'onerror') || repeat_checktype(repeat_data,'always')){
                setTimeout(xhr_fetch_data(method,url,form_data,xhr_timeout,callback),repeat_data.repeat_time);
            }
        }; 
        
        if(form_data!=null) xhr.send(form_data);
        else                xhr.send();
    }

    var sse_fetch_data = function(method,url,form_data,xhr_timeout,repeat_data,callback){
        if(form_data===undefined) form_data=null;
        if(xhr_timeout===undefined) xhr_timeout=3000;
        if(repeat_data===undefined) repeat_data=null;
        if(callback===undefined) callback=null;

        if(typeof(EventSource) !== 'undefined'){
            var source = new EventSource(url+
                "?mode="+form_data.get('mode')+"&roomcode="+form_data.get('roomcode')
            );
            source.onerror = function(event){
                console.log('SSE error:'+method+",URL="+url+",form_data="+form_data+",event="+JSON.stringify(event));
                source.close();
                source.close();
                if(repeat_checktype(repeat_data,'onerror') || repeat_checktype(repeat_data,'always')){
                    setTimeout(
                        sse_fetch_data(method,url,form_data,xhr_timeout,repeat_data,callback),
                    repeat_data.repeat_time);
                }
            };
            source.onmessage = function(event){
                var server_message = JSON.parse(event.data);
                console.log(server_message);
                if(!(server_message.status==0 && server_message.message=="SSE_CLOSE_CONNECTION")){
                    callback(server_message);
                }else{
                    source.close();
                    if(repeat_checktype(repeat_data,'always')){
                        setTimeout(
                            sse_fetch_data(method,url,form_data,xhr_timeout,repeat_data,callback),
                        repeat_data.repeat_time);
                    }
                }
            }
        }else{
            xhr_fetch_data(method,url,form_data,xhr_timeout,repeat_data,callback);
        }
    }



    var init=function(roomcode,extra_data,callback){
        if(roomcode===undefined) roomcode=null;
        if(extra_data===undefined) extra_data=null;
        if(callback===undefined) callback=null;
        
        console.log(arguments);

        var fd = new FormData();

		fd.append("mode","init_stream");
        fd.append("roomcode",roomcode);
        if(extra_data!=null) for(var extra_data_param_name in extra_data){
            fd.append(extra_data_param_name,extra_data[extra_data_param_name]);
        }

        xhr_fetch_data(
            'POST',
            window.backend_url+'room.php',
            fd, undefined, {repeat_type: 'onerror', repeat_time: 250}, callback
        );
    }

    var request=function(roomcode,request_type,request_value,extra_data,callback){
        if(extra_data===undefined) extra_data=null;
        if(callback===undefined) callback=null;

        var fd = new FormData();
		fd.append("mode","request");
        fd.append("roomcode",roomcode);
        fd.append("request_type",request_type);
        fd.append("request_value",request_value);
        if(extra_data!=null) for(var extra_data_param_name in extra_data){
            fd.append(extra_data_param_name,extra_data[extra_data_param_name]);
        }

        xhr_fetch_data(
            'POST',
            window.backend_url+'room.php',
            fd, undefined, {repeat_type: 'onerror', repeat_time: 250}, callback
        );
    }

    var sync=function(roomcode,callback){
        if(callback===undefined) callback=null;

        var fd = new FormData();
        fd.append("mode","sync");
        fd.append("roomcode",roomcode);

        if(_mode==0){
            xhr_fetch_data(
                'POST',
                window.backend_url+'room.php',
                fd, undefined, {repeat_type: 'always', repeat_time: 250}, callback
            );
        }else if(_mode==2){
            sse_fetch_data(
                'POST',
                window.backend_url+'room.php',
                fd, undefined, {repeat_type: 'always', repeat_time: 250}, callback
            );
        }
    }



    return{
        init: init,
        request: request,
        sync: sync
    }
})();

var SmartTimeout = (function(){
    var func_timeout_list=[];

    var setSmartTimeout = function(id,callback,time){
        if(func_timeout_list[id]==null){
            func_timeout_list[id]=setTimeout(callback,time);
        }else{
            clearTimeout(func_timeout_list[id]);
            func_timeout_list[id]=null;
            setSmartTimeout(id,callback,time);
        }
    }

    return{
        setSmartTimeout: setSmartTimeout
    }
})();

var Room = (function(){
    var _roomdata=null;
    var _videoplayer=null;
    var _sync_enabled=false;
    var _is_attempting_requests=false;
    var _sync_ignore_events=false;
    var _local_last_ctime=0;
    var _local_last_isplaying=0;
    var _buffering_time=0;
    var _event_handlers=[];
    var _player_ready=false;

    var get_data=function(){return _roomdata;}

    var init=function(roomcode,extra_data,callback){
        if(roomcode===undefined) roomcode=null;
        if(extra_data===undefined) extra_data=null;
        if(callback===undefined) callback=null;

        RoomHTTPEvents.init(roomcode,extra_data,function(response){
            if(response.status==1){
                _roomdata = response.message;
                if(!response.message.hasOwnProperty("roomcode")) _roomdata.roomcode = roomcode;
            }
            if(callback!=null) callback(response);
        });
    }

    var http_room_request=function(request_type,request_value,extra_data){
        if(extra_data===undefined) extra_data=null;

        _is_attempting_requests=true;
        console.log("[room] request("+JSON.stringify(arguments)+")");
        RoomHTTPEvents.request(_roomdata.roomcode,request_type,request_value,extra_data,function(){
            _is_attempting_requests=false;
        });
    }

    var set_stream=function(stream_type,stream_key){
        http_room_request('set_stream',stream_type+";key="+stream_key);
    }

    var set_isplaying=function(isplaying,videotime){
        http_room_request('set_isplaying',(isplaying==true?1:0),{'request_videotime': round_time(videotime,6)});
    }

    var set_current_time=function(videotime){
        http_room_request('set_current_time',round_time(videotime,6));
    }

    var round_time=function(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
      

    var event_notrigger=function(event_name,callback){
        for(var ient=0;ient<event_name.length;ient++){
            _videoplayer.off(event_name[ient],_event_handlers[event_name[ient]]);
        }
        callback();
        for(var ient=0;ient<event_name.length;ient++){
            _videoplayer.on(event_name[ient],_event_handlers[event_name[ient]]);
        }
    }

    var sync=function(callback){
        RoomHTTPEvents.sync(_roomdata.roomcode,callback);
    }

    var start_sync=function(first_time){
        console.log(Math.round('642.442560'*1000));
        console.log("start_sync("+JSON.stringify(arguments)+","+_is_attempting_requests+")");
        if(first_time) _sync_enabled=true;
        if(_sync_enabled){
            if(!_is_attempting_requests){
                sync(function(server_sync){
                    if(!_is_attempting_requests && server_sync.status==1){
                        _sync_ignore_events=true;
                        
                        server_sync=server_sync.message;
                        console.log(server_sync);
                        if(_player_ready==true){
                            if(server_sync.hasOwnProperty("stream_ctime") &&
                                server_sync.hasOwnProperty("last_ctime") &&
                                server_sync.hasOwnProperty("last_isplaying")){
                                server_sync.last_ctime=DateTimeParser.get_timestamp(server_sync.last_ctime);
                                server_sync.last_isplaying=DateTimeParser.get_timestamp(server_sync.last_isplaying);
                                console.log("time_cached="+_local_last_ctime);
                                console.log("time_server="+server_sync.last_ctime);
                                
                                if(first_time==true){
                                    if(server_sync.stream_isplaying==1){
                                        event_notrigger(['pause','playing','seeked'],function(){
                                            _videoplayer.currentTime(
                                                (DateTimeParser.get_timestamp() -
                                                server_sync.last_isplaying +
                                                Math.round(server_sync.stream_ctime*1000)
                                                )/1000
                                            );
                                        });
                                    }else{
                                        event_notrigger(['pause','playing','seeked'],function(){
                                            _videoplayer.currentTime(
                                                server_sync.stream_ctime
                                            );
                                        });
                                    }
                                    _local_last_ctime=server_sync.last_ctime;
                                }else{
                                    if(Math.abs(server_sync.last_ctime-_local_last_ctime) > 1000){
                                        var video_wasplaying = _videoplayer.isplaying;
                                        if(video_wasplaying) event_notrigger('pause',function(){
                                            _videoplayer.pause();
                                        });
                                        event_notrigger(['pause','playing','seeked'],function(){
                                            _videoplayer.currentTime(server_sync.stream_ctime);
                                        });
                                        if(video_wasplaying) event_notrigger('playing',function(){_videoplayer.pause();});

                                        console.log("Difference: "+(server_sync.last_ctime-_local_last_ctime));
                                        _local_last_ctime=server_sync.last_ctime;
                                    }
                                }
                            }
                            
                            if(server_sync.hasOwnProperty("stream_isplaying")){
                                if(server_sync.stream_isplaying==1){
                                    event_notrigger(['playing'],function(){_videoplayer.play();});
                                }else{
                                    event_notrigger(['pause'],function(){_videoplayer.pause();});
                                }
                            }
                        }
                        
                        first_time=false;
                        setTimeout(function(){_sync_ignore_events=false;},250);
                    }
                });
            }else{SmartTimeout.setSmartTimeout('room_sync',function(){start_sync(false);},250);}
        }
    }

    var stop_sync=function(){
        _sync_enabled=false;
    }

    var attach_videojs_handler=function(video_player_id,callback){
        if(callback===undefined) callback=null;

        var actual_time=(new Date()).getTime();
        _videoplayer = videojs(video_player_id);

        _event_handlers['loadeddata']=function(){
            var player_actual_time=(new Date()).getTime();
            console.log("[videojs_event] Video took: "+(player_actual_time-actual_time)+" ms to buffer!");
            //start_sync(true);
        }

        /*_event_handlers['timeupdate']=function(){
            console.log("Current time, timeupdate = "+_videoplayer.currentTime());
        }*/

        _event_handlers['playing']=function(){
            if(!_sync_ignore_events){
                _is_attempting_requests=true;
                console.log("[videojs_event]","Video playing at time: "+_videoplayer.currentTime());
                SmartTimeout.setSmartTimeout('playing',function(){
                    set_isplaying(!_videoplayer.paused(), _videoplayer.currentTime());
                },300);
            }
        }

        _event_handlers['waiting']=function(){
            _buffering_time=(new Date()).getTime();
            console.log("[videojs_event] Video is buffering...");
        }

        _event_handlers['pause']=function(){
            if(!_sync_ignore_events){
                _is_attempting_requests=true;
                console.log("[videojs_event]","Video paused.");
                SmartTimeout.setSmartTimeout('playing',function(){
                    set_isplaying(!_videoplayer.paused(), _videoplayer.currentTime());
                },300);
            }
        }

        _event_handlers['seeking']=function(){
            console.log("[videojs_event] Video seeking...");
        }

        _event_handlers['seeked']=function(){
            console.log("[videojs_event]","Video seeked at time: "+_videoplayer.currentTime());
            if(!_sync_ignore_events){
                _is_attempting_requests=true;
                SmartTimeout.setSmartTimeout('seeking',function(){
                    set_current_time(_videoplayer.currentTime());
                },200);
            }
        }

        _videoplayer.one('loadeddata',_event_handlers['loadeddata']);
        //_videoplayer.on('timeupdate',_event_handlers['timeupdate']);
        _videoplayer.on('playing', _event_handlers['playing']);
        _videoplayer.on('waiting',_event_handlers['waiting']);
        _videoplayer.on('pause',_event_handlers['pause']);
        _videoplayer.on('seeking',_event_handlers['seeking']);
        _videoplayer.on('seeked',_event_handlers['seeked']);

        // On loaded meta data
        _videoplayer.on('loadedmetadata',function(){
            _videoplayer.play();
            _videoplayer.pause();
            console.log("[videojs_event] Loaded metadata");
            _player_ready=true;
            setTimeout(function(){start_sync(true)},1000); // Temporary
        });
        
        // To monitor.
        if(callback!=null) callback();
    }

    function set_room_content(video_container_id,video_player_id,room_data,callback){
        if(callback===undefined) callback=null;

        VideoJSPlayer.init(function(){
            window.history.replaceState({}, document.title, './room/'+room_data.roomcode);
            SPA.setVar("roomcode",room_data.roomcode);
            SPA.setVar("video_to_play",room_data.stream_key);
            var video_to_play = room_data.stream_key;
            if(room_data.stream_type=='local'){
                VideoJSPlayer.inject_local_video_player(
                    video_container_id,
                    video_player_id,
                    video_to_play,
                    '',
                    function(){
                        Room.attach_videojs_handler("my_video");
                    }
                );
            }else if(room_data.stream_type=='youtube'){
                VideoJSPlayer.inject_youtube_video_player(
                    video_container_id,
                    video_player_id,
                    video_to_play,
                    '',
                    function(){
                        Room.attach_videojs_handler("my_video",function(){
                            console.log("CONTROLS ATTACHED!");
                            //Room.start_sync(true);
                        });
                    }
                );
            }else if(room_data.stream_type=='external_mp4'){
                VideoJSPlayer.inject_external_mp4_video_player(
                    video_container_id,
                    video_player_id,
                    video_to_play,
                    '',
                    function(){
                        Room.attach_videojs_handler("my_video",function(){
                            console.log("CONTROLS ATTACHED!");
                            //Room.start_sync(true);
                        });
                    }
                );
            }
        });

        if(callback!=null) callback();
    }

    var get_video_player=function(){
        return _videoplayer;
    }

    return{
        init: init,
        get_data: get_data,
        attach_videojs_handler: attach_videojs_handler,
        get_video_player: get_video_player,
        start_sync: start_sync,
        set_room_content: set_room_content
    }
})();