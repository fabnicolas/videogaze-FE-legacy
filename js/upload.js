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
            console.log("Simulation: " + key + "," + chunk_id + "," + NUM_CHUNKS);
            uploadChunk(file.slice(start, end), key, chunk_id, NUM_CHUNKS);
            start = end;
            end = start + BYTES_PER_CHUNK;
            chunk_id++;
        }
    }

    var uploadChunk = function(chunkFile, key, chunk_number, max_chunks) {
		var fd = new FormData();
		fd.append("chunk_file",chunkFile);
		fd.append("key",key);
		fd.append("chunk_number",chunk_number);
		fd.append("max_chunks",max_chunks);
		
        var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://finalgalaxy.unaux.com/videogaze-BE/handle_file_upload.php', true);
        xhr.upload.onprogress = function(e) {
            if(e.lengthComputable) {
                var perc = Math.round((e.loaded / e.total) * 100);
                perc = parseFloat(perc) + '%';
                console.log(perc);
            }
        };
        xhr.onloadend = function(e) {
            uploaders.pop();
            if(!uploaders.length) console.log("All sent!");
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
        ChunkUploader.uploadFile(file);
    }

    /* DEPRECATED
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