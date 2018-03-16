var ChunkUploader = (function() {
    'use strict';
    var bars = document.getElementById('bars'),
        uploaders = [],
        upload,
        chooseFile;

    var uuidv4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var composeChunksInBackend = function(key, chunk_number, max_chunks){
        if(chunk_number==0){
            console.log("Composing file with key '"+key+"' in backend. Number of chunks: "+max_chunks+".");
            console.log("Waiting for server response...");
            chunk_number++;
        }
        
        var fd = new FormData();
		fd.append("key",key);
        fd.append("chunk_number",chunk_number);
        fd.append("max_chunks",max_chunks);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://finalgalaxy.unaux.com/videogaze-BE/compose_chunks.php');
        xhr.onloadend = function(e) {
            if(xhr.status!=200){
                console.log("FAILED to compose chunk #"+chunk_number+". Status = "+xhr.status+".");
                console.log("Recomposing chunk #"+chunk_number+"...");
                composeChunksInBackend(key, chunk_number, max_chunks);
            }else{
                console.log("Composed chunk #"+chunk_number+" in backend. Status = "+xhr.status);
                if(chunk_number===max_chunks){
                    console.log("Done! Transferred and composed: "+max_chunks+" chunks.");
                }else{
                    chunk_number++;
                    console.log("Attempting to compose in backend chunk #"+chunk_number+"...");
                    composeChunksInBackend(key, chunk_number, max_chunks);
                }
            }
        };
        xhr.send(fd);
    }

    var uploadFile = function(file) {
        var BYTES_PER_CHUNK, SIZE, NUM_CHUNKS, start, end;
        BYTES_PER_CHUNK = parseInt(1048576, 10);
        SIZE = file.size;
        NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
        console.log("Sending " + NUM_CHUNKS + " chunks...");
        start = 0;
        end = BYTES_PER_CHUNK;

        var chunk_id = 1;
		var key = uuidv4();

        while(start < SIZE) {
            //console.log("Simulation: " + key + "," + chunk_id + "," + NUM_CHUNKS);
            uploadChunk(file.slice(start, end), key, chunk_id, NUM_CHUNKS, composeChunksInBackend);
            start = end;
            end = start + BYTES_PER_CHUNK;
            chunk_id++;
        }
    }

    var chunks_uploaded=0;
    var uploadChunk = function(chunkFile, key, chunk_number, max_chunks, callback_enduploadchunks=null, call_again=true) {
		var fd = new FormData();
		fd.append("chunk_file",chunkFile);
		fd.append("key",key);
		fd.append("chunk_number",chunk_number);
		fd.append("max_chunks",max_chunks);
        
        console.log("Sending chunk temporary file: "+key+"_part"+chunk_number+".tmp...");
        //console.log(chunkFile);
        var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://finalgalaxy.unaux.com/videogaze-BE/handler_chunks.php', true);
        xhr.upload.onprogress = function(e) {
            if(e.lengthComputable) {
                var perc = Math.round((e.loaded / e.total) * 100);
                if(parseFloat(perc)===100){
                    chunks_uploaded++;
                    console.log("A chunk got transferred. Chunks uploaded: "+chunks_uploaded);
                }
            }
        };
        xhr.onloadend = function(e) {
            uploaders.pop();
            if(!uploaders.length){
                console.log("All "+chunks_uploaded+" chunks got transferred successfully!");
                chunks_uploaded=0;  // Reset
                if(callback_enduploadchunks!=null) callback_enduploadchunks(key, 0, max_chunks);
            }
        };
        // Listen for response status.
        xhr.onreadystatechange = function(){ 
            // If request fails, attempt to send chunk again just one time.
            if(xhr.readyState == 4 && xhr.status != 200) {
                if(call_again) uploadChunk(chunkFile, key, chunk_number, max_chunks, composeChunksInBackend, !call_again);
                else            console.log("Error "+xhr.status);
            }
        };
        // Listen for errors.
        xhr.onerror = function () { 
            console.log("On error called");
            if(call_again) uploadChunk(chunkFile, key, chunk_number, max_chunks, composeChunksInBackend, !call_again);
            else            console.log("Error on XHR.");
        }; 
        uploaders.push(xhr);
        xhr.send(fd);
    };
	
	return{
		uploadFile: uploadFile,
		uploadChunk: uploadChunk
	}
})();

(function() {
    // Triggered when mouse hovers the rectangle while file is dragged.
    function eventhandler_mousehover_dragging_file(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "hover" : "");
    }


    // Triggered when mouse hovers the rectangle and file is dropped (Like uploading it).
    function eventhandler_fileselected(e) {
        console.log("FileSelectHandler");
        console.log(e);

        // Cancel hovering events.
        eventhandler_mousehover_dragging_file(e);

        // Fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Process all File objects (without multiple enabled there's only one).
        for(var i = 0, f; f = files[i]; i++) {
            ParseFile(f);
        }

    }

    var time_playing = 7000;
    var event_preview = null;
    // Output file information
    function ParseFile(file) {
        console.log(file);

        console.log(window.URL.createObjectURL(file));

        var filedrag = document.getElementById("file_selector");
        if(file.type.indexOf("video") > -1) {
            UploadFile(file);

            var video_element = document.getElementById("video-preview");
            video_element.src = URL.createObjectURL(file);
            video_element.type = file.type;
            video_element.style.display = "block";
            video_element.play();
            if(event_preview != null) {
                clearInterval(event_preview);
                event_preview = null;
            }

            video_element.onplaying = (event_preview = setInterval(function() {
                video_element.currentTime = 3;
                time_playing = 3000;
            }, time_playing));

            filedrag.style.height = "auto";
        } else {
            filedrag.style.height = "80%";
        }

        document.getElementById("messages").innerHTML =
            "File name: <b>" + file.name + "</b><br/>" +
            "File type: <b>" + file.type + "</b><br/>" +
            "File size: <b>" + file.size + "</b> bytes";
    }

    /* NEW */
    function UploadFile(file) {
        //console.log(file);
        ChunkUploader.uploadFile(file);
    }

    /*
    function UploadFile(file) {
        console.log("triggered file upload");
        var fd = new FormData();
        fd.append("afile", file);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://finalgalaxy.unaux.com/videogaze-BE/handle_file_upload.php', true);
        xhr.timeout = 60000;
        xhr.ontimeout = function() {
            alert("Timed out!!!");
        }

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                console.log("triggered onprogress");
                var percentComplete = Math.round((e.loaded / e.total) * 100);
                console.log(percentComplete + '% uploaded');

            }
        };
        xhr.send(fd);
    }*/


    // Initialize the uploader.
    function uploader_init() {
        var fileselect = document.getElementById("fileselect");
        var filedrag = document.getElementById("filedrag");
        var submitbutton = document.getElementById("submitbutton");
        var video_element = document.getElementById("video-preview");

        // File selected.
        fileselect.addEventListener("change", eventhandler_fileselected, false);

        // XHR2 available?
        if((new XMLHttpRequest()).upload) {
            // File drop handlers
            filedrag.addEventListener("dragover", eventhandler_mousehover_dragging_file, false); // Mouse inside it
            filedrag.addEventListener("dragleave", eventhandler_mousehover_dragging_file, false); // Mouse outside it
            filedrag.addEventListener("drop", eventhandler_fileselected, false); // File dropped
            filedrag.style.display = "block";

            // Remove submit button.
            submitbutton.style.display = "none";
            video_element.style.display = "none";
        }

    }

    // If file management is allowed on the browser
    if(window.File && window.FileList && window.FileReader) {
        uploader_init();
    }
})();