(function() {
	function Output(msg) {
		var m = document.getElementById("messages");
		m.innerHTML = msg + m.innerHTML;
	}


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


	// Output file information
	function ParseFile(file) {
		console.log(file);

		console.log(window.URL.createObjectURL(file));

		if(file.type.indexOf("video")>-1){
			  var video_element = document.getElementById("video-preview");
			  video_element.src = URL.createObjectURL(file);
			  video_element.type = file.type;
			  video_element.style.display = "block";
			  video_element.play();
			  video_element.onplaying = function(){console.log("ok");setTimeout(function(){video_element.pause()},5000);};
		}

		Output(
			"<p>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);
	}


	// Initialize the uploader.
	function uploader_init() {
		var fileselect = document.getElementById("fileselect");
		var filedrag = document.getElementById("filedrag");
		var submitbutton = document.getElementById("submitbutton");
		var video_element = document.getElementById("video-preview");

		// File selected.
		fileselect.addEventListener("change", eventhandler_fileselected, false);

		// XHR2 available?
		if((new XMLHttpRequest()).upload){
			// File drop handlers
			filedrag.addEventListener("dragover", eventhandler_mousehover_dragging_file, false);	// Mouse inside it
			filedrag.addEventListener("dragleave", eventhandler_mousehover_dragging_file, false);	// Mouse outside it
			filedrag.addEventListener("drop", eventhandler_fileselected, false);	// File dropped
			filedrag.style.display = "block";

			// Remove submit button.
			submitbutton.style.display = "none";
			video_element.style.display = "none";
		}

	}

	// If file management is allowed on the browser
	if (window.File && window.FileList && window.FileReader) {
		uploader_init();
	}
})();