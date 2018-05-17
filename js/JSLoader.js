/* This module inheritely runs only once.
   JSLoader is an utility class to load JS files on runtime.
   
   Normal usage:
    '''
    <script src="./js/JSLoader.js"></script>
    <script>
        JSLoader.setFolder("js/");          // Set folder as root of your .js files (Optional).
        JSLoader.load_once("myscript.js", function(){
            // myscript.js loaded
        });
    </script>
    '''
*/

if(typeof(JSLoader)=='undefined'){

var JSLoader = (function(undefined){
    var _js_folder = null;
    var _js_loaded = [];

    var setFolder = function(js_folder){_js_folder=js_folder;}
    var compose_src = function(src){return (_js_folder!=null) ? _js_folder+src : src;}
    var isLoaded = function(src){return (_js_loaded.indexOf(compose_src(src)) > -1);}

    var load_script = function(src, callback){
        var script = document.createElement("script");
        if(callback!=null) script.onload = callback;
        script.src = compose_src(src);
        document.head.appendChild(script);
    }

    var load = function(src, callback){
        if(callback===undefined) callback=null;

        if(!isLoaded(src)) load_script(src, callback);
        else               callback();
    }

    var load_once = function(src, callback){
        if(callback===undefined) callback=null;

        if(!isLoaded(src)){
            load_script(src, callback);
            _js_loaded.push(compose_src(src));
        }else{
            callback();
        }
    }

    return {
        setFolder: setFolder,
        load: load,
        load_once: load_once
    };
})();

}