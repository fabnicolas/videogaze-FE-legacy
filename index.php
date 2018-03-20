<?php
    function get_parameter($param,$default_value=null){
        return (isset($_GET[$param])?$_GET[$param]:$default_value);
    }
    $video_source = get_parameter('video_url');
    $roomcode = get_parameter('roomcode');
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
</head>

<body>
    <div class="vbox background-layer">
    <header id="spa-top" class="vbox-top">
        <h1>VideoGaze</h1>
        <a onclick="SPA.setPage('start.html')" href="#">#START</a>
        <a onclick="SPA.setPage('second.html')" href="#">#SECOND</a>
        <a onclick="SPA.setPage('lorem.html')" href="#">#LOREM_IPSUM</a>
        <a onclick="SPA.setPage('room.html')" href="#">#ROOM</a>
    </header>
    <footer id="spa-app" class="vbox-bottom"></footer>
    <script type="text/javascript" src="./js/JSLoader.js"></script>
    <script type="text/javascript">
        JSLoader.setFolder("js/");
        JSLoader.load_once("SPA.js", function(){
            SPA.init('./page_fragments/',function(){
                SPA.setVar('video_to_play','<?php echo ($video_source!=null)?$video_source:'sample.mp4';?>');
                SPA.setVar('roomcode','<?php echo $roomcode;?>');
                <?php
                if($video_source!=null) echo "SPA.setPage('video.html');";
                elseif($roomcode!=null) echo "SPA.setPage('room.html');";
                else                    echo "SPA.setPage('start.html');";
                ?>
            });
        });
    </script>
    </div>
</body>
</html>