// This module inheritely runs only once.

if(typeof(JSLoader)=='undefined'){
    var JSLoader = (function(undefined){
        var _js_folder = null;
        var _js_loaded = [];

        var setFolder = function(js_folder){_js_folder=js_folder;}
        var compose_src = function(src){return (_js_folder!=null) ? _js_folder+src : src;}
        var isLoaded = function(src){return (_js_loaded.indexOf(compose_src(src)) > -1);}

        var load_script = function(src, callback=undefined){
            var script = document.createElement("script");
            if(callback) script.onload = callback;
            script.src = compose_src(src);
            document.head.appendChild(script);
        }

        var load = function(src, callback=undefined){
            if(!isLoaded(src)) load_script(src, callback);
        }

        var load_once = function(src, callback=undefined){
            if(!isLoaded(src)){
                load_script(src, callback);
                _js_loaded.push(compose_src(src));
            }
        }

        return {
            setFolder: setFolder,
            load: load,
            load_once: load_once
        };
    })();
}