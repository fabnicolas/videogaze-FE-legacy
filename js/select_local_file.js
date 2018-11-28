JSLoader.load("lib/LocalFileSelector.js", function(){
    LocalFileSelector.listenTo("video_selector", function(file){
        JSLoader.load("video_player.js", function() {
            VideoJSPlayer.init(function() {
                JSLoader.load("room_maker.js",function(){
                    SPA.setVar('blob_loaded', '1');
                    make_room(null, 'external_mp4', file)
                });
            });
        });
    });
})