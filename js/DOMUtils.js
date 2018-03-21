var DOMUtils = (function(undefined){
    var loadHTML = function(url, callback){
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
      injectHEAD(node_html);
    }

    var injectHEAD = function(node_html){
      
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

    return {
        loadHTML: loadHTML,
        injectJSFromDOM: injectJSFromDOM,
        injectHTML: injectHTML,
        injectHTMLwJS: injectHTMLwJS
    }
})();