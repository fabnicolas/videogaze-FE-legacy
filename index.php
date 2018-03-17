<?php
    $video_source = isset($_GET['video_url']) ? $_GET['video_url'] : null;
?>
<!DOCTYPE html>
<html>

<head>
    
    <base href="http://thedarkgates.rf.gd/videogaze/"/> 
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="VideoGaze - Watch videos with friends and lovers together!">
    <meta name="author" content="fabnicolas">
    <title>VideoGaze - Watch videos with friends and lovers together!</title>
    <link rel="stylesheet" href="./css/style.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="http://vjs.zencdn.net/6.6.3/video-js.css" rel="stylesheet">
  
    <!-- If you'd like to support IE8 -->
    <script src="http://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>
</head>

<body>
    <div class="vbox background-layer">
    <header id="spa-top" class="vbox-top">
        <h1>VideoGaze</h1>
        <a onclick="setPage('start.html')" href="#">#START</a>
        <a onclick="setPage('second.html')" href="#">#SECOND</a>
        <a onclick="setPage('lorem.html')" href="#">#LOREM_IPSUM</a>
    </header>
    <footer id="spa-app" class="vbox-bottom"></footer>
    <div id="spa-js"></div>
    <div id="spa-vars">
        <div id="spa-var--video_to_play"><?php echo ($video_source!=null)?$video_source:'sample.mp4';?></div>
    </div>
    <script type="text/javascript" src="./js/JSLoader.js"></script>
    <script type="text/javascript">
        JSLoader.setFolder("js/");
        JSLoader.load_once("modules.js", function(){
            <?php
            if($video_source!=null) echo "setPage('video.html');";
            else                    echo "setPage('start.html');";
            ?>
        });

        function setPage(html_page){
            Utils.loadHTML(html_page, function(status, text){
                if(status==true){
                    Utils.parseHTMLwJS(text,
                        document.getElementById("spa-app"),
                        document.getElementById("spa-js")
                    );
                }
            });
        }
    </script>
    </div>
</body>
</html>