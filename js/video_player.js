var VideoJSPlayer = (function(){
    var is_initialized=false;

    var init = function(){
        return true;//Hack
        if(is_initialized===false){
            var link_videojs_css=document.createElement('link');
            link_videojs_css.href='http://vjs.zencdn.net/6.6.3/video-js.css';
            link_videojs_css.rel='stylesheet';
            document.getElementsByTagName('head')[0].appendChild(link_videojs_css);

            var script_videojs_js=document.createElement('script');
            script_videojs_js.src='http://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js';
            document.getElementsByTagName('head')[0].appendChild(script_videojs_js);
            is_initialized=true;
        }
    }

    //<!--<source src="MY_VIDEO.webm" type='video/webm'>--> h->poster="progress.png"
    var get_video_player = function(filename){
        var body_data = '<video id="my-video" style="width:100%;height:100%;" class="video-js" controls preload="auto"'
        +'\n width="640" height="264" data-setup="{}">'
        +'\n<source src="http://thedarkgates.rf.gd/videogaze-BE/stream_mp4.php?filename='+filename+'"'
        +' type=\'video/mp4\'>'
        +  '\n<p class="vjs-no-js">'
        +    '\nTo view this video please enable JavaScript, and consider upgrading to a web browser that'
        +    '\n<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>'
        +  '\n</p>'
        +'\n</video>';

        var script = document.createElement("script");
        script.src = "http://vjs.zencdn.net/6.6.3/video.js";
        document.body.appendChild(script);

        return body_data;
    }

    return {
        init: init,
        get_video_player: get_video_player
    }
})();