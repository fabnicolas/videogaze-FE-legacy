var ImageLoader=(function(){
    var _loaded_images;
    var init = function(){_loaded_images=[];}
    init();

    var isLoaded = function(src){return (_loaded_images.indexOf(src) > -1);}

    var load=function(src,callback){
        if(!isLoaded(src)){
            var img=new Image();
            img.onload=function(){callback(src);}
            img.src=src;
        }else{callback(src);}
    }

    var loadBackgroundImage=function(src){
        load(src,function(source){
            document.body.style.backgroundImage='url('+source+')';
        })
    }

    return{
        init: init,
        load: load,
        loadBackgroundImage: loadBackgroundImage
    }
})();