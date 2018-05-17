/**
 * Utility ES5 class to manage DOM by loading HTML, CSS and JS files dynamically.
 * 
 * @author Fabio Crispino
 */
var DOMUtils = (function(undefined){
    /**
     * Load HTML file from a given URL and retrieve data inside it.
     * 
     * @param {string} url - The URL of the HTML file to load by using XHR.
     * @param {function} callback - Callback invoked on complete (status, data).
     */
    var loadHTML = function(url, callback){
        if(callback===undefined) callback=null;
        
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
          if(request.status >= 200 && request.status < 400){
            if(callback!=null) callback(true, request.responseText);
          }else{
            if(callback!=null) callback(false, undefined);
          }
        };
        request.send();
    }

    /**
     * Inject content (HTML-only) inside DOMElement.
     * 
     * @param {string} text - The content to inject inside DOMElement.
     * @param {DOMElement} node - The DOM element that has to be injected.
     */
    var injectHTML = function(text, node){
        node.innerHTML = text;
    }

    /**
     * Inject content (HTML) and scripts (JS) inside DOMElement given.
     * 
     * @param {string} text  - The content to inject inside DOMElement.
     * @param {DOMElement} node_html - The DOM element that has to be injected with HTML content.
     * @param {DOMElement} node_js - The JS element that has to be injected with JS scripts.
     */
    var injectHTMLwJS = function(text, node_html, node_js){
        injectHTML(text, node_html);
        injectJSFromDOM(node_html, node_js);
    }

    /**
     * Inject and load stylesheet file (CSS) inside HEAD tag.
     * 
     * @param {string} url - The URL of the CSS file to attach into head.
     * @param {function} callback - Callback invoked on complete (no parameters).
     */
    var loadCSS = function(url,callback){
        if(callback===undefined) callback=null;

        var resource = document.createElement('link'); 
        resource.setAttribute("rel", "stylesheet");
        resource.setAttribute("href",url);
        resource.setAttribute("type","text/css");
        resource.setAttribute("data-async", "true");
        document.getElementsByTagName('head')[0].appendChild(resource);

        if(callback!=null) callback();
    }

    /**
     * Extracts scripts (JS) from a source node and injects them inside a destination node.
     * 
     * @param {DOMElement} node_html - The DOMElement source holding scripts that have to be extracted.
     * @param {DOMElement} destination - The DOMElement destination that will hold scripts extracted from the source.
     */
    var injectJSFromDOM = function(node_html, destination){
        clearNodeChilds(destination);
        var scripts = node_html.getElementsByTagName("script");
        for(var i=0;i<scripts.length;i++){
            if(scripts[i].src) injectJSSrc(scripts[i].src, destination);
            else               injectJSCode(scripts[i].innerHTML, destination);
        }
    }

    /**
     * Clear a node completely deleting every its child, node by node.
     * 
     * @param {DOMElement} node - The node that has to be cleared.
     */
    var clearNodeChilds = function(node){
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    /**
     * Injects JS code directly inside a destination node.
     * The JS code will be inserted inside a <script> tag that will be appended as child of the destination node.
     * 
     * @param {string} code - The JS code (As string).
     * @param {DOMElement} destination - The DOMElement destination that will contain the script provided.
     */
    var injectJSCode = function(code, destination){
        var script = document.createElement('script');
        script.text = code;
        script.type = 'text/javascript';
        destination.appendChild(script);
    }

    /**
     * Injects JS script, loaded from a URL, inside a destination node.
     * The JS script will be inserted inside a <script> tag that will be appended as child of the destination node.
     * 
     * @param {string} src - The JS script URL.
     * @param {DOMElement} destination - The DOMElement destination that will contain the script provided.
     */
    var injectJSSrc = function(src, destination){
        var script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        destination.appendChild(script);
    }

    /**
     * Toggle class.
     * This is a feature that replaces jQuery toggle function, which is very useful to add/remove classes dynamically.
     * 
     * @param {DOMElement} el - The DOMElement node to toggle a specific className on.
     * @param {string} className - The className to toggle.
     * 
     * @see {@link http://youmightnotneedjquery.com/|We don't need jQuery}
     */
    var toggleClass = function(el, className){
        if(el.classList!==undefined){
            el.classList.toggle(className);
        }else{
            var classes = el.className.split(' ');
            var existingIndex = -1;
            for(var i = classes.length; i--;) {
                if (classes[i] === className){existingIndex = i; break;}
            }

            if(existingIndex >= 0) classes.splice(existingIndex, 1);
            else                   classes.push(className);

            el.className = classes.join(' ');
        }
    }

    // Class visibility.
    return {
        loadHTML: loadHTML,
        injectJSFromDOM: injectJSFromDOM,
        injectHTML: injectHTML,
        injectHTMLwJS: injectHTMLwJS,
        toggleClass: toggleClass,
        loadCSS: loadCSS
    }
})();