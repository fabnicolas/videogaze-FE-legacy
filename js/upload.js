(function() {
	function Output(msg) {
		var m = document.getElementById("messages");
		m.innerHTML = msg + m.innerHTML;
	}


	// file drag hover
	function eventhandler_mousehover_dragging_file(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function eventhandler_mousedrop_fileselected(e) {
		console.log("FileSelectHandler");
		console.log(e);

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
		}

	}


	// output file information
	function ParseFile(file) {
		console.log(file);

		console.log(window.URL.createObjectURL(file));

		Output(
			"<p>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);
	}


	// initialize
	function Init() {
		var fileselect = document.getElementById("fileselect");
		var filedrag = document.getElementById("filedrag");
		var submitbutton = document.getElementById("submitbutton");

		// File selected.
		fileselect.addEventListener("change", eventhandler_mousedrop_fileselected, false);

		// XHR2 available
		if((new XMLHttpRequest()).upload){
			// File drop handlers
			filedrag.addEventListener("dragover", eventhandler_mousehover_dragging_file, false);	// Mouse inside it
			filedrag.addEventListener("dragleave", eventhandler_mousehover_dragging_file, false);	// Mouse outside it
			filedrag.addEventListener("drop", eventhandler_mousedrop_fileselected, false);	// File dropped
			filedrag.style.display = "block";

			// Remove submit button.
			submitbutton.style.display = "none";
		}

	}

	// If file management is allowed on the browser
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}
})();