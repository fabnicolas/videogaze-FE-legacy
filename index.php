<?php
    $config = include(__DIR__.'/config.php');
    $frontend_dir=$config['frontend_subfolder'];

    function base_url($frontend_dir=null){
        return sprintf(
            "%s://%s%s/%s",
            ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ? 'https' : 'http'),
            $_SERVER['SERVER_NAME'],
            ((isset($_SERVER['SERVER_PORT'])) ? (':'.$_SERVER['SERVER_PORT']) : ''),
            ($frontend_dir!=null?$frontend_dir.'/':'')
        );
    }
    function get_parameter($param,$default_value=null){
        return (isset($_GET[$param])?$_GET[$param]:$default_value);
    }
    $video_source = get_parameter('video_url');
    $roomcode = get_parameter('roomcode');
?>
<!DOCTYPE html>
<html>

<head>
    <base href="<?php echo base_url($frontend_dir); ?>"/> 
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="VideoGaze - Watch videos with friends and lovers together!">
    <meta name="author" content="fabnicolas">
    <title>VideoGaze - Watch videos with friends and lovers together!</title>
    <link rel="stylesheet" href="./css/style.css">
</head>

<body>
    <div id="bglayer" class="vbox background-layer">
    <header id="spa-top" class="vbox-top">
        <div id="folding-header">
            <a onclick="SPA.setPage('start.html','./')" class="title"><h1>VideoGaze</h1></a>
            <a onclick="SPA.setPage('start.html')" href="#">#START</a>
            <a onclick="SPA.setPage('second.html')" href="#">#SECOND</a>
            <a onclick="SPA.setPage('lorem.html')" href="#">#LOREM_IPSUM</a>
            <a onclick="SPA.setPage('login.html')" href="#">#LOGIN</a>
        </div>
        <div id="custom-controls">
            Controlli/Controls: 
            <span id="custom-controls-extra"></span>
            <a id="fold_control">_hide</a>
        </div>
    </header>
    <div id="spa-app" class="vbox-bottom"></div>
    <script src="./js/lib/JSLoader.js"></script>
    <script>
        window.frontend_url = (document.getElementsByTagName("base")[0]).href;
        window.backend_url = window.frontend_url+'../videogaze-BE/';

        var toggle_header,toggle_header_and_controls;
        JSLoader.setFolder("js/");
        JSLoader.load_once("lib/SPA.js", function(){
            SPA.init('./page_fragments/',function(){
                SPA.setVar('video_to_play','<?php echo ($video_source!=null)?$video_source:'sample.mp4';?>');
                SPA.setVar('roomcode','<?php echo $roomcode;?>');
                <?php
                if($video_source!=null) echo "SPA.setPage('video.html');";
                elseif($roomcode!=null) echo "SPA.setPage('room.html');";
                else                    echo "SPA.setPage('start.html');";
                ?>

                JSLoader.load("lib/CollapseElement.js", function(){
                    toggle_header = CollapseElement('folding-header');
                    toggle_header_and_controls = CollapseElement('spa-top');

                    var controls_attached=false;
                    var fold_control = document.getElementById('fold_control');
                    var div_header = document.getElementById('spa-top');
                    fold_control.onclick=function(){
                        if(!controls_attached){
                            handler_mouseenter=function(){toggle_header.start_animation();};
                            handler_mouseleave=function(){toggle_header.stop_animation();};
                            toggle_header.toggle_animation();
                        }else{
                            handler_mouseenter=null;
                            handler_mouseleave=null;
                        }
                        div_header.onmouseenter=handler_mouseenter;
                        div_header.onmouseleave=handler_mouseleave;
                        controls_attached=!controls_attached;
                    };
                });
                JSLoader.load("lib/ImageLoader.js", function(){
                    ImageLoader.loadBackgroundImage("./images/dbs.webp");
                    DOMUtils.toggleClass(document.getElementById("bglayer"), "background-layer");
                });
                DOMUtils.loadCSS("./css/roboto.css");
            });
        });

        document.onkeydown = function(event) {
            event = event || window.event;
            var keyCode = event.which || event.keyCode;
            if(keyCode===78) toggle_header_and_controls.toggle_animation()
        };
    </script>
    
    </div>
    
</body>
</html>