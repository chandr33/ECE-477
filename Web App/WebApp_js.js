/*Notes for implementation:
The final character should be encoded in two bytes:

The first byte is the virtual key that corresponds to the key that is pressed to get that result.
See- https://docs.microsoft.com/en-us/windows/desktop/inputdev/virtual-key-codes
For example: "'CTRL' + c" has a first byte of 0x43 as that is the virtual code for C key, ! -> 0x31 corresponding to 1 key

The second byte is all modifier keys that need to be pressed simultaneously reach that value, each key encoded as a bit.
Byte2 = {Null, Macro, L_CTRL, R_CTRL, L_SHIFT, R_SHIFT, L_ALT, R_ALT}
A 1 in a position corresponds to that key being pressed, 1 in the macro means byte 1 corresponds to that macro.
Example: 0b 0100 0000 means that L_CTRL is needed in combination with the key in part 1

Edge cases:
Modifier keys themselves will be encoded with only the key, so the modifier value will be 0. Modifier keys can not have additional modifiers, so modifiers must be with keys that can be modified or alone.
Any combination of keys must be composed of 1 non-modifier key and 1-4 modifiers
If Left or Right is not specified with the modifier, then default to plain versions 0x11-13, if need to choose, choose right to avoid gaming conflicts
*/

function initialize() {
	var default_placeholders = [
		"'ESC'", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "'BACKSPACE'", //0-13
		"'TAB'", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",			//14-27
		"'CAPS'", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "'ENTER'",			//28-40
		"'L_Shift'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "'R_SHIFT'",			//41-52
		"'L_CTRL'", "'L_WIN'", "'L_ALT'", "'SPACE'", "'R_ALT'", "'R_WIN'", "'FN'", "'R_CTRL'"	//53-60
	];
	
	var shift_placeholders = [
		"'ESC'", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "'BACKSPACE'",
		"'TAB'", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|",
		"'CAPS'", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "'ENTER'",
		"'L_Shift'", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", "'R_SHIFT'",
		"'L_CTRL'", "'L_WIN'", "'L_ALT'", "'SPACE'", "'R_ALT'", "'R_WIN'", "'FN'", "'R_CTRL'"
	];
	
	var fn_placeholders = [
		"'ESC'", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "'BACKSPACE'", //0-13
		"'TAB'", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",			//14-27
		"'CAPS'", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "'ENTER'",			//28-40
		"'L_Shift'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "'R_SHIFT'",			//41-52
		"'L_CTRL'", "'L_WIN'", "'L_ALT'", "'SPACE'", "'R_ALT'", "'R_WIN'", "'FN'", "'R_CTRL'" //53-60
	];
	
	var fn_shift_placeholders = [
		"'ESC'", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "'BACKSPACE'", //0-13
		"'TAB'", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",			//14-27
		"'CAPS'", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "'ENTER'",			//28-40
		"'L_Shift'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "'R_SHIFT'",			//41-52
		"'L_CTRL'", "'L_WIN'", "'L_ALT'", "'SPACE'", "'R_ALT'", "'R_WIN'", "'FN'", "'R_CTRL'" //53-60
	];

	var value_Array = [];
	for(var i = 0; i < 16; i++) {
		var page = [];
		for(var j = 0; j < 61; j++) {
		    page.push(document.getElementById("key" + j).value);
		}
		value_Array.push(page);
	}
	
	store_var(default_placeholders, "default_placeholders");
	store_var(shift_placeholders, "shift_placeholders");
	store_var(fn_placeholders, "fn_placeholders");
	store_var(fn_shift_placeholders, "fn_shift_placeholders");
	store_var(value_Array, "value_Array");
	
	sessionStorage.array_page = 0;
}

function store_var(storing_variable, id_string) { //Function to store arrays and objects in sessionStorage
	sessionStorage.setItem(id_string, JSON.stringify(storing_variable));
	return;
}

function get_var(id_string) { //Retrieves objects stored in sessionStorage
	var storedData = sessionStorage.getItem(id_string);
	if (storedData) {
		return JSON.parse(storedData);
	} else {
		return false;
	}
}

function reset_all() {
	if(confirm("Are you sure you want to reset all key bindings?")) {
		var value_Array = [];
		for(var i = 0; i < 16; i++) {
			var page = [];
			for(var j = 0; j < 61; j++) {
				page.push("");
			}
			value_Array.push(page);
		}
		for(var i = 0; i < 61; i++) {
			document.getElementById("key"+i).value = "";
		}
		
		store_var(value_Array, "value_Array");
	}
	
}

function reset_page() {
	if(confirm("Are you sure you want to reset the current listings?")) {
		var value_Array = get_var("value_Array");
		var array_page = Number(sessionStorage.array_page);
		for(var i = 0; i < 61; i++) {
			value_Array[array_page][i] = "";
			document.getElementById("key"+i).value = value_Array[array_page][i];
		}
		store_var(value_Array, "value_Array");
	}
}

function reset_macros() {
	if(confirm("Are you sure you want to reset all macros?")) {
		//Run reset
	}
}

function update_placeholders () {
	var alt = document.getElementById("ALT_box").checked;
	var fn = document.getElementById("FN_box").checked;
	var shift = document.getElementById("SHIFT_box").checked;
	var ctrl = document.getElementById("CTRL_box").checked;
	
	var placeholders;
	if(fn && shift && !ctrl && !alt) {
		placeholders = get_var("fn_shift_placeholders");
	} else if (fn) {
		placeholders = get_var("fn_placeholders");
	} else if(shift && !ctrl && !alt) {
		placeholders = get_var("shift_placeholders");
	} else {
		placeholders = get_var("default_placeholders");
	}
	
	for(var i = 0; i < 61; i++) {
		var curr_placeholder = placeholders[i];
		if(alt) {
			curr_placeholder = "'ALT' + " + curr_placeholder;
		}
		if(shift && (alt || ctrl)) {
			curr_placeholder = "'SHIFT' + " + curr_placeholder;
		}
		if(ctrl) {
			curr_placeholder = "'CTRL' + " + curr_placeholder;
		}
		
		document.getElementById("key"+i).placeholder = curr_placeholder;
	}
}

function update_values () {
	//Store old values
	var value_Array = get_var("value_Array");
	var array_page = Number(sessionStorage.array_page);
	
	for(var i = 0; i < 61; i++) {
		value_Array[array_page][i] = document.getElementById("key"+i).value;
	}
	
	//Load in new values
	var alt = document.getElementById("ALT_box").checked;  //Least significant
	var fn = document.getElementById("FN_box").checked;		
	var shift = document.getElementById("SHIFT_box").checked;
	var ctrl = document.getElementById("CTRL_box").checked; //Most significant
	
	array_page = alt * 1 + fn * 2 + shift * 4 + ctrl * 8;
	
	for(var i = 0; i < 61; i++) {
		document.getElementById("key"+i).value = value_Array[array_page][i];
	}
	
	//Store Variables Again
	sessionStorage.array_page = array_page;
	store_var(value_Array, "value_Array");
}

function download() {
    var temp_value_array = new Array();
    
    for (var i = 0; i < 16; i++)
    {
	var array_frame = {name: "test"+i, data: get_var("value_Array")[i]};
	
	for (var j = 0; j < 61; j++)
	{
	    
	    if (array_frame.data[j] == "")
	    {
		array_frame.data[j] = null;
	    }
	}
	temp_value_array.push(array_frame);
    }
    download_file(JSON.stringify(temp_value_array), "test.txt", "/text/plain");
}

function download_file (data, filename, type) { //source: https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
    var file = new Blob([data], {type: type}); //create a Blob (a pseudo-File object?)
    var a = document.createElement("a"), //create a hyperlink
	url = URL.createObjectURL(file); //create a URL for our object
    a.href = url; //hyperlink uses URL of object as reference
    a.download = filename; //on click, download the object
    document.body.appendChild(a); //attach to body...?
    a.click(); //simulate click of hyperlink
    setTimeout(function() { //create lambda function, execute after file is downloaded?
	document.body.removeChild(a); //remove attached node from body
	window.URL.revokeObjectURL(url); //invalidate generated URL
    }, 0);
}

