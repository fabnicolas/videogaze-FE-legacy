var VideoJSPlayer = (function(){
    var is_initialized=false;

    var init = function(callback){
        if(callback===undefined) callback=null;

        if(is_initialized===false){
            var link_videojs_css=document.createElement('link');
            link_videojs_css.href='http://vjs.zencdn.net/6.6.3/video-js.css';
            link_videojs_css.rel='stylesheet';
            document.getElementsByTagName('head')[0].appendChild(link_videojs_css);

            var script_videojs_js=document.createElement('script');
            script_videojs_js.src='http://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js';
            document.getElementsByTagName('head')[0].appendChild(script_videojs_js);

            var script = document.createElement("script");
            script.src = "http://vjs.zencdn.net/6.6.3/video.js";
            if(callback!=null) script.onload=callback;
            document.body.appendChild(script);
            is_initialized=true;
        }
    }

    //<!--<source src="MY_VIDEO.webm" type='video/webm'>--> h->poster="progress.png"
    var inject_video_player = function(node,player_id,filename,extra_video_elements,callback){
        if(player_id===undefined) player_id='my_video';
        if(extra_video_elements===undefined) extra_video_elements='';
        if(callback===undefined) callback=null;
        
        var body_data = '<video id="'+player_id+'" style="width:100%;height:100%;" class="video-js" controls '+extra_video_elements+' preload="auto"'
        +'\n width="640" height="264" data-setup="{}">'
        +'\n<source src="'+(window.backend_url)+'stream_mp4.php?filename='+filename+'"'
        +' type=\'video/mp4\'>'
        +  '\n<p class="vjs-no-js">'
        +    '\nTo view this video please enable JavaScript, and consider upgrading to a web browser that'
        +    '\n<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>'
        +  '\n</p>'
        +'\n</video>';
        node.innerHTML = body_data;
        if(callback!=null) callback();
    }

    return {
        init: init,
        inject_video_player: inject_video_player
    }
})();