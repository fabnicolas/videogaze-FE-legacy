var DOMUtils = (function(undefined){
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

    var injectHTML = function(text, node){
        node.innerHTML = text;
    }

    var injectHTMLwJS = function(text, node_html, node_js){
        injectHTML(text, node_html);
        injectJSFromDOM(node_html, node_js);
        //injectHEAD(node_html);
    }

    var loadCSS = function(url,callback){
        if(callback===undefined) callback=null;

        var resource = document.createElement('link'); 
        resource.setAttribute("rel", "stylesheet");
        resource.setAttribute("href",url);
        resource.setAttribute("type","text/css");
        resource.setAttribute("data-async", "true");
        document.getElementsByTagName('head')[0].appendChild(resource);
    }

    var injectJSFromDOM = function(node_html, destination){
        clearNodeChilds(destination);
        var scripts = node_html.getElementsByTagName("script");
        for(var i=0;i<scripts.length;i++){
            if(scripts[i].src) injectJSSrc(scripts[i].src, destination);
            else               injectJSCode(scripts[i].innerHTML, destination);
        }
    }

    var clearNodeChilds = function(node){
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    var injectJSCode = function(code, destination){
        var script = document.createElement('script');
        script.text = code;
        script.type = 'text/javascript';
        destination.appendChild(script);
    }

    var injectJSSrc = function(src, destination){
        var script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        destination.appendChild(script);
    }

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

    return {
        loadHTML: loadHTML,
        injectJSFromDOM: injectJSFromDOM,
        injectHTML: injectHTML,
        injectHTMLwJS: injectHTMLwJS,
        toggleClass: toggleClass,
        loadCSS: loadCSS
    }
})();