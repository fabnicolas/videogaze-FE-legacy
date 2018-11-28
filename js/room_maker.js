var make_room = function(roomcode, stream_type, stream_key, extra){
  SPA.setVar('video_to_play', stream_key);
  JSLoader.load("room.js",function(){
      Room.init(roomcode,
          {'stream_type': stream_type, 'stream_key': SPA.getVar('video_to_play')},
          function(response){
              if(response.status==1){
                  SPA.setVar('roomcode',response.message.roomcode);
                  SPA.setPage("room.html");
              }
          }
      );
  });
}