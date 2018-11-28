var LocalFileSelector = (function(){
  var callback=null;

  var getInputFile=function(event) {
      var URL = window.URL || window.webkitURL;
      var file = this.files[0];
      if(file != null) {
          if(callback!=null) callback(URL.createObjectURL(file));
      }
  }

  var listenTo=function(selector,callback_func){
      callback=callback_func;
      document.getElementById(selector).addEventListener('change', getInputFile, false);
  }
  return {getInputFile: getInputFile, listenTo: listenTo};
})();
