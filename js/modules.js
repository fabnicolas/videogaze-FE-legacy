var Utils = (function(undefined){
    var loadHTML = function(url, callback=undefined){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
          if(request.status >= 200 && request.status < 400){
            if(callback) callback(true, request.responseText);
          }else{
            if(callback) callback(false, undefined);
          }
        };
        request.send();
    }

    var parseHTML = function(text, node){
      node.innerHTML = text;
    }

    var parseHTMLwJS = function(text, node, destination){
      parseHTML(text, node);
      injectJSFromDOM(node, destination);
    }

    var injectJSFromDOM = function(node, destination){
      clearNodeChilds(destination);
      var scripts = node.getElementsByTagName("script");
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

    return {
        loadHTML: loadHTML,
        injectJSFromDOM: injectJSFromDOM,
        parseHTML: parseHTML,
        parseHTMLwJS: parseHTMLwJS
    }
})();