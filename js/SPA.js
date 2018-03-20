// This module inheritely runs only once.

if(typeof(SPA)=='undefined'){

var SPA = (function(undefined){
    var _initialized=false;
    var _page_fragments_folder;
    var _div_spajs;
    var _div_spavars;

    var init=function(page_fragments_folder=null, callback=null){
        // Require DOMUtils 
        JSLoader.load_once("DOMUtils.js",function(){
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

    var getVar=function(variable_name){
        var div_var=document.getElementById("spa-var--"+variable_name);
        if(div_var!=null) return div_var.innerHTML;
        else              return null;
    }

    var setPage=function(html_page){
        DOMUtils.loadHTML(_page_fragments_folder+html_page, function(status, text){
            if(status==true){
                DOMUtils.injectHTMLwJS(text,
                    document.getElementById("spa-app"),
                    _div_spajs
                );
            }
        });
    }

    return{
        init: init,
        setVar: setVar,
        getVar: getVar,
        setPage: setPage
    }
})();

}