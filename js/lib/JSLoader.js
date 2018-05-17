/**
 * JSLoader is an utility ES5 class to load JS files on runtime.
 * 
 * This module inheritely runs only once.
 * This is a very lightweight script that replaces awesome module loaders like RequireJS for simple including tasks.
 * 
 * Comments are for developers ease of use; please minify those scripts in production for maximum performances.
 * 
 * Normal usage:
 *  '''
 *  <script src="./js/lib/JSLoader.js"></script>
 *  <script>
 *      JSLoader.setFolder("js/");          // Set folder as root of your .js files (Optional).
 *      JSLoader.load_once("myscript.js", function(){
 *          // myscript.js loaded
 *      });
 *  </script>
 *  '''
 * 
 * @author Fabio Crispino
*/

if(typeof(JSLoader)=='undefined'){  // Load it only one time.

var JSLoader = (function(undefined){
    var _js_folder = null;
    var _js_loaded;
    var init = function(){_js_loaded=[];}
    init(); // List is cleared at beginning.

    /**
     * Set main JS folder.
     * This is optional, but it is very useful if all your scripts are inside a subdirectory, as
     * you don't have to type that subdirectory path again.
     * 
     * @param {string} js_folder - The subdirectory name.
     */
    var setFolder = function(js_folder){_js_folder=js_folder;}

    /**
     * Utility function to compose src by taking into account the main JS folder, if set.
     * 
     * @param {string} src - The JS file (as URL).
     */
    var compose_src = function(src){return (_js_folder!=null) ? _js_folder+src : src;}

    /**
     * Check if a specific JS file is loaded.
     * 
     * @param {string} src - The JS file (as URL).
     */
    var isLoaded = function(src){return (_js_loaded.indexOf(compose_src(src)) > -1);}

    /**
     * Loads a JS file.
     * This function does NOT take in account scripts already loaded.
     * 
     * This function is used as complementary function for 'load' and 'load_once'.
     * 
     * @param {string} src - The JS file (as URL).
     * @param {function} callback - Callback invoked on complete (no parameters). The callback is invoked thanks to onload property on <script> tag.
     *
     * @see {@link load} Loads a JS file.
     * @see {@link load_once} Loads a JS file (preventing duplicates).
     */
    var load_script = function(src, callback){
        var script = document.createElement("script");
        if(callback!=null) script.onload = callback;
        script.src = compose_src(src);
        document.head.appendChild(script);
    }

    /**
     * Loads a JS file.
     * This function takes in account scripts already loaded: if script is already loaded using 'load_once', it prevents duplicating it.
     * 
     * Notice that if you load script using "load", it does NOT prevent future duplicates; this is by design because:
     * - You can ensure yourself to load a specific script with 'load_once', then others with 'load';
     * - You can use 'load_once' on every reference of the same script if you wanna ensure loading just one time;
     * - You can use 'load' also to load duplicates if no 'load_once' was invoked.
     * 
     * @param {string} src - The JS file (as URL).
     * @param {function} callback - Callback invoked on complete (no parameters). The callback is invoked thanks to onload property on <script> tag.
     *
     * @see {@link load_script} Loads a JS file (allowing duplicates).
     * @see {@link load_once} Loads a JS file (preventing duplicates).
     */
    var load = function(src, callback){
        if(callback===undefined) callback=null;

        if(!isLoaded(src)) load_script(src, callback);
        else               callback();
    }

    /**
     * Loads a JS file.
     * This function takes in account scripts already loaded: if script is already loaded, it prevents duplicating it.
     * 
     * A script loaded with 'load_once' will not be reloaded again, unless you want to use 'load_script' which bypasses checks.
     * 
     * @param {string} src - The JS file (as URL).
     * @param {function} callback - Callback invoked on complete (no parameters). The callback is invoked thanks to onload property on <script> tag.
     *
     * @see {@link load} Loads a JS file.
     * @see {@link load_script} Loads a JS file (allowing duplicates).
     */
    var load_once = function(src, callback){
        if(callback===undefined) callback=null;

        if(!isLoaded(src)){
            load_script(src, callback);
            _js_loaded.push(compose_src(src));
        }else{
            callback();
        }
    }

    // Class visibility.
    return {
        init: init,
        setFolder: setFolder,
        load: load,
        load_once: load_once
    };
})();

}