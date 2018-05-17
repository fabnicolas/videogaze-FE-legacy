/**
 * Utility ES5 class to load images asynchronously using Image browser class.
 * 
 * Loaded images are stored as reference in JS; loading the same image again will result in returning its reference.
 * 
 * @author Fabio Crispino
 */
var ImageLoader=(function(){
    var _loaded_images;
    var init = function(){_loaded_images=[];}
    init(); // List is cleared at beginning.

    /**
     * Check if a specific image is loaded.
     * 
     * @param {string} src - The image URL.
     */
    var isLoaded = function(src){return (_loaded_images.indexOf(src) > -1);}

    /**
     * Load an image.
     * The image src is stored as reference so that browser won't reload the same image again.
     * 
     * @param {string} src - The image URL.
     * @param {function} callback - Callback invoked on complete (status, data).
     */
    var load=function(src,callback){
        if(!isLoaded(src)){
            var img=new Image();
            img.onload=function(){callback(src);}
            img.src=src;
        }else{callback(src);}
    }

    /**
     * Load a background image, using load function and setting the body backgroundImage style attribute.
     * 
     * @param {string} src - The background image URL.
     * 
     * @see {@link load} for further info.
     */
    var loadBackgroundImage=function(src){
        load(src,function(source){
            document.body.style.backgroundImage='url('+source+')';
        })
    }

    // Class visibility.
    return{
        init: init,
        load: load,
        loadBackgroundImage: loadBackgroundImage
    }
})();