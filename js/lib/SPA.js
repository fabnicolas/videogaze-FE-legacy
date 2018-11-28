/**
 * SPA.js is a ES5 experimental framework for Single Page Applications (SPA).
 * 
 * This module inheritely runs only once.
 * 
 * The aim is:
 * - Lightweight (As of 5/17/2018, it's around 10-11 KB with DOMUtils.js);
 * - Simplicity (Pages are inherited as fragments in a single folder);
 * - Inheritance;
 * - HTML/CSS/JS dynamic loading by injecting DOM directly (This script uses DOMUtils.js for DOM operations).
 * 
 * This framework uses data- attributes to determine contents loaded dynamically without polluting HTML with bad stuff.
 * 
 * Comments are for developers ease of use; please minify those scripts in production for maximum performances.
 * 
 * Example (JSLoader):
 *  '''
 *  <header id="spa-top">My page</header>
 *  <div id="spa-app"></div>
 * 
 *  <script src="./js/lib/JSLoader.js"></script>
 *  <script>
 *      JSLoader.load('./js/lib/SPA.js',function(){
 *          SPA.init('./page_fragments/',function(){
 *              SPA.setVar('cat_name','Lord Beerus');
 *              SPA.setPage('page1.html'); // page1.html can access cat_name by using var cat_name = SPA.getVar('cat_name'); 
 *          });
 *      });
 *  </script>
 *  '''
 * 
 * @author Fabio Crispino
*/

if(typeof(SPA)=='undefined'){  // Load it only one time.

var SPA = (function(undefined){
    var _initialized=false;
    var _page_fragments_folder;
    var _div_spajs; // Div used to inject JS inside <body> tag.
    var _div_spavars; // Div used to inject SPA variables.

    /**
     * Init Single Page Application (SPA).
     * 
     * <div id="spa-js"></div> will be injected in <body>.
     * <div id="spa-vars"></div> too.
     * 
     * Optionally you can set a folder for your fragments, if you don't want to use the root folder.
     * 
     * @param {string} page_fragments_folder - 
     * @param {function} callback - Callback on complete (no parameters).
     */
    var init=function(page_fragments_folder, callback){
        if(page_fragments_folder===undefined) page_fragments_folder=null;
        if(callback===undefined) callback=null;
        // Require DOMUtils 
        JSLoader.load_once("lib/DOMUtils.js",function(){
            if(_initialized==false){
                _div_spajs = document.createElement("div");
                _div_spajs.id="spa-js";
                document.body.appendChild(_div_spajs);

                _div_spavars = document.createElement("div");
                _div_spavars.id="spa-vars";
                document.body.appendChild(_div_spavars);
                _initialized=true;
            }
            _page_fragments_folder = (page_fragments_folder!=null) ? page_fragments_folder : '';
            if(callback!=null) callback();
        });
    }

    /**
     * Set a SPA shared variable and assign a value to it.
     * 
     * Variables are injected as <div id="spa-var--variable_name"></div> inside 'spa-var' div.
     * 
     * Variables can be easily accessed from JS by using SPA.getVar(variable_name) method and are visible to every sub-page.
     * 
     * @param {string} variable_name - The variable name. 
     * @param {string} variable_value - The variable value in string format.
     * 
     * @see {@link getVar} Get a shared SPA variable.
     */
    var setVar=function(variable_name,variable_value){
        var spa_div_var_id="spa-var--"+variable_name;
        var div_var=document.getElementById(spa_div_var_id);
        if(div_var==null){
            div_var=document.createElement("div");
            div_var.id=spa_div_var_id;
            _div_spavars.appendChild(div_var);
        }
        div_var.innerHTML=variable_value;
    }

    /**
     * Get a SPA shared variable value by its name.
     * 
     * Variables are detected by using getElementById("spa-var--var_name") and reading innerHTML property.
     * 
     * @param {string} variable_name - The variable name. 
     */
    var getVar=function(variable_name){
        var div_var=document.getElementById("spa-var--"+variable_name);
        if(div_var!=null) return div_var.innerHTML;
        else              return null;
    }

    /**
     * Set a SPA page fragment as current fragment.
     * 
     * It's possible to set a custom route after loading a fragment.
     * 
     * @param {string} html_page - The fragment name.
     * @param {string} route - The new route.
     */
    var setPage=function(html_page, route){
        if(route===undefined) route=null;

        DOMUtils.loadHTML(_page_fragments_folder+html_page, function(status, text){
            if(status==true){
                DOMUtils.injectHTMLwJS(text,
                    document.getElementById("spa-app"),
                    _div_spajs
                );
                if(route!=null) setRoute(route);
            }
        });
    }

    /**
     * Set a route.
     * Single Page Applications loads content dynamically, so if you wanna add browser state - You should use this method.
     * 
     * @param {string} route - The new route.
     */
    var setRoute=function(route){
        window.history.replaceState({}, document.title, route);
    }

    // Class visibility.
    return{
        init: init,
        setVar: setVar,
        getVar: getVar,
        setPage: setPage,
        setRoute: setRoute
    }
})();

}