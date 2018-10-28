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

var MAX_MACRO_LENGTH = 100;

function initialize() {
    var default_placeholders = [
	"ESC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BACKSPACE", //0-13
	"TAB", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",			//14-27
	"CAPS", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "ENTER",			//28-40
	"L_SHIFT", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "R_SHIFT",			//41-52
	"L_CTRL", "L_WIN", "L_ALT", "SPACE", "R_ALT", "R_WIN", "FN_KEY", "R_CTRL"	//53-60
    ];

    var shift_placeholders = [
	"ESC", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "PLUS", "BACKSPACE",
	"TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|",
	"CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "ENTER",
	"L_SHIFT", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", "R_SHIFT",
	"L_CTRL", "L_WIN", "L_ALT", "SPACE", "R_ALT", "R_WIN", "FN_KEY", "R_CTRL"
    ];

    /*var fn_placeholders = [
	"ESC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BACKSPACE", //0-13
	"TAB", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",			//14-27
	"CAPS", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "ENTER",			//28-40
	"L_SHIFT", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "R_SHIFT",			//41-52
	"L_CTRL", "L_WIN", "L_ALT", "SPACE", "R_ALT", "R_WIN", "FN_KEY", "R_CTRL" //53-60
    ];*/

    /*var fn_shift_placeholders = [
	"ESC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BACKSPACE", //0-13
	"TAB", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",			//14-27
	"CAPS", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "ENTER",			//28-40
	"L_SHIFT", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "R_SHIFT",			//41-52
	"L_CTRL", "L_WIN", "L_ALT", "SPACE", "R_ALT", "R_WIN", "FN_KEY", "R_CTRL" //53-60
    ];*/

    store_var(default_placeholders, "default_placeholders");
    store_var(shift_placeholders, "shift_placeholders");
    //store_var(fn_placeholders, "fn_placeholders");
    //store_var(fn_shift_placeholders, "fn_shift_placeholders");

    var value_Array = new SiteData(); //data storage for textareas
    var macro_Array = new Array();

    for (var i = 0; i < 12; i++)
    {
    	macro_Array[i] = new Macro();
    }

    store_var(value_Array, "value_Array");
    store_var(macro_Array, "macro_Array");

	document.getElementById("SHIFT_box").checked = false;
	document.getElementById("CTRL_box").checked = false;
	document.getElementById("FN_box").checked = false;
	document.getElementById("ALT_box").checked = false;
	

    sessionStorage.array_page = 0;
}

function get_checklist_index() //checks marked checkboxs and returns an integer from 0 to 15. this corresponds to a stored table, retrieved from get_placeholder_index
{
    var alt = document.getElementById("ALT_box").checked;
    var fn = document.getElementById("FN_box").checked;
    var shift = document.getElementById("SHIFT_box").checked;
    var ctrl = document.getElementById("CTRL_box").checked;

    return alt * 1 + fn * 2 + ctrl * 4 + shift * 8;
}

function get_placeholder_index(chk_number) //converts chk_number (an index from 0 to 15) into its corresponding placeholder table index (from 0 to 3)
{
    if(chk_number == 10) { //fn && shift && !ctrl && !alt
	return 0;
    } else if (chk_number == 2) { //fn
	return 0;
    } else if(chk_number == 8 || chk_number == 10) { //shift && !ctrl && !alt
	return 1;
    } else {
	return 0;
    }
}

function store_var(storing_variable, id_string) { //Function to store arrays and objects in sessionStorage
    sessionStorage.setItem(id_string, JSON.stringify(storing_variable, function(key, value) {
        return value;
    }));
}

function get_var(id_string) { //Retrieves objects stored in sessionStorage
    var storedData = sessionStorage.getItem(id_string);
    if (storedData) {
	return JSON.parse(storedData, function(key, value) { //from https://stackoverflow.com/questions/14027168/how-to-restore-original-object-type-from-json
        return value.hasOwnProperty("__type")
        ? Types[value.__type].revive(value)
        : this[key];
    });
    } else {
	return false;
    }
}

function reset_all() {
    if(confirm("Are you sure you want to reset all key bindings?")) {
	var value_Array = new SiteData();
	store_var(value_Array, "value_Array");
	var array_page = Number(get_checklist_index());
	
	for(var i = 0; i < 61; i++)
	{
		var page = value_Array.getPage(array_page);
		document.getElementById("key"+i).value = page.getData(i).str_data;
	}
	
	/*var value_Array = [];
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

	store_var(value_Array, "value_Array");*/
    }

}

function reset_page() {
    if(confirm("Are you sure you want to reset the current listings?"))
	{
		var value_Array = get_var("value_Array");
		var array_page = get_checklist_index();
		store_var(array_page, "array_page");
		var placeholder_table = get_placeholder_table(get_placeholder_index(array_page));
		var page = new Page(array_page);
		for(var i = 0; i < 61; i++)
		{
			
			document.getElementById("key"+i).value = page.getData(i).str_data;

		/*var value_Array = get_var("value_Array");
		var array_page = Number(sessionStorage.array_page);
		for(var i = 0; i < 61; i++) {
			value_Array[array_page][i] = ;
			document.getElementById("key"+i).value = value_Array[array_page][i];
		}
		store_var(value_Array, "value_Array");*/
		}
		value_Array.updatePage(array_page, page);
		store_var(value_Array, "value_Array");
	}
}

function reset_macros() {
    if(confirm("Are you sure you want to reset all macros?")) {
	//Run reset
    }
}

function get_placeholder_table(index) //return placeholder table from placeholder index (called from get_placeholder_index(int))
{

    if(index == 0) { //fn && shift && !ctrl && !alt
	return get_var("default_placeholders");
    } else if (index == 1) { //fn
	return get_var("shift_placeholders");
    //} else if(index == 3) { //shift && !ctrl && !alt
	//return get_var("shift_placeholders");
    } else {
	return get_var("default_placeholders");
    }
}

function convert_index_to_readable_name(index) //decode index (0 to 15) into a readable name
{
    var ret_string = "";
    if ((index >> 1) & 1) //fn
    {
	ret_string = ret_string + "FN";
    }

    if ((index >> 2) & 1) //ctrl
    {
	if (ret_string != "")
	{
	    ret_string = ret_string + " + ";
	}
	ret_string = ret_string + "CTRL";
    }

    if (index & 1) //alt
    {
	if (ret_string != "")
	{
	    ret_string = ret_string + " + ";
	}
	ret_string = ret_string + "ALT";
    }

    if ((index >> 3) & 1) //shift
    {
	if (ret_string != "")
	{
	    ret_string = ret_string + " + ";
	}
	ret_string = ret_string + "SHIFT";
    }

    if (ret_string == "") //default
    {
	ret_string = "Default"
    }

    return ret_string;
}

function convert_readable_name_to_index(name)
{
	var ret_index = 0;

	//split string along +
	var no_plus = name.split("+");

	//remove whitespace
	var no_whitespace = /\S+/;
	var converted_name = [];
	for (var i = 0; i < no_plus.length(); i++)
	{
		converted_name[i] = no_whitespace.exec(no_plus[i]);
	}

	if (converted_name.includes("FN"))
	{
		ret_index = ret_index | 2;
	}

	if (converted_name.includes("SHIFT"))
	{
		ret_index = ret_index | 8;
	}

	if(converted_name.includes("CTRL"))
	{
		ret_index = ret_index | 4;
	}

	if(converted_name.includes("ALT"))
	{
		ret_index = ret_index | 1;
	}

	return ret_index;
}

function update_placeholders () {

    var checklist = get_checklist_index();
    var placeholder_index = get_placeholder_index(checklist);
    for(var i = 0; i < 61; i++) {
	var curr_placeholder = get_placeholder_table(placeholder_index);
	if(checklist & 1) { //alt
	    curr_placeholder[i] = "ALT + " + curr_placeholder[i];
	}
	if((checklist & 8) && (checklist & 1 || checklist & 4)) { //shift && (alt || ctrl)
	    curr_placeholder[i] = "SHIFT + " + curr_placeholder[i];
	}
	if(checklist & 4) { //ctrl
	    curr_placeholder[i] = "CTRL + " + curr_placeholder[i];
	}

	document.getElementById("key"+i).placeholder = curr_placeholder[i];
    }
}

function update_values () {
    //Store old values
    var value_Array = get_var("value_Array");
    var array_page = Number(sessionStorage.array_page);
	var page = value_Array.getPage(array_page);

    for(var i = 0; i < 61; i++) {
		page.page_data[i].setData(document.getElementById("key"+i).value);
    }

	value_Array.updatePage(array_page, page);

    //Load in new values

    array_page = get_checklist_index();
	page = value_Array.getPage(array_page);

    for(var i = 0; i < 61; i++) {
	document.getElementById("key"+i).value = page.page_data[i].str_data;
    }

    //Store Variables Again
    sessionStorage.array_page = array_page;
    store_var(value_Array, "value_Array");
    store_var(array_page, "array_page");
}

function validatePage()
{
	var value_Array = get_var("value_Array");
	var cur_page = value_Array.getPage(get_checklist_index());
	console.log(value_Array);

	for (var i = 0; i < 61; i++)
	{
		if (cur_page.getData(i).getValidity() == false)
		{
			document.getElementById("key"+i).style.border = "2px solid red";
		}
		else
		{
			document.getElementById("key"+i).style.border = "";
		}
	}
}

function updateMacroLoopState()
{
	var macro_Array = get_var("macro_Array");
	console.log(macro_Array);
	for (var i = 0; i < 12; i++)
	{
		macro_Array[i].setToggleState(document.getElementById("repeat"+i).checked);
	}
	store_var(macro_Array, "macro_Array");
}

function updateMacroText(obj)
{
	var macro_num = parseInt(obj.id.replace("macro", ''));
	var macro_Array = get_var("macro_Array");
	macro_Array[macro_num].setMacro(obj.value);
	store_var(macro_Array, "macro_Array");
}

function checkMacroTextLength(obj)
{
	var macro_num = parseInt(obj.id.replace("macro", ''));
	var macro_Array = get_var("macro_Array");
	if (macro_Array[macro_num].getMacro().length > MAX_MACRO_LENGTH)
	{
		macro_Array[macro_num].setMacro(macro_Array[macro_num].getMacro().substring(0, MAX_MACRO_LENGTH));
		document.getElementById(obj.id).value = macro_Array[macro_num].getMacro();
	}
	store_var(macro_Array, "macro_Array");
	console.log(macro_Array[macro_num].getMacro().length);
}

function validate_keybind_syntax(data) //give name of textfield object. returns object with 2 fields: valid and data.
{
    var keywords = [ "BACKSPACE", "ESC", "CAPS", "L_SHIFT", "L_CTRL", "L_WIN",
		     "L_ALT", "SPACE", "R_ALT", "R_WIN", "R_CTRL", "FN_KEY", "R_SHIFT", "ENTER"
		   ];

    var shift_found = false;
    var key_found = false; //used to verify key is at end of entry
    var return_data = {valid: false, data: ""};

    //retrieve value from id
    var user_input = data.str_data;
    var token_array = user_input.split("+");
    var no_space_patt = /\S+/;

    for (var i = 0; i < token_array.length; i++) //loop until user_input is completely scanned
    {
		if (key_found) //key must be at end of token_array, so invalidate
		{
			console.log("Validate fxn return due to key_found");
			return_data.valid = false;
			return return_data;
		}

		var token = no_space_patt.exec(token_array[i]); //remove whitespace
		if (token != null) //not null. entry from token_array was all whitespace. throw error.
		{
			token = token[0]; //token is returned as an array
			if (!keywords.includes(token.toUpperCase())) //token is not a keyword
			{
				var shift_position = get_var("shift_placeholders").indexOf(token); //used to detect if shifted value was used
				if (shift_position != -1) //entry exists in shift table
				{
					if (shift_found == false) //shift keyword was not found. add to entry
					{
						if (return_data.data == "") //nothing exists yet, don't add "+"
						{
							return_data.data = "SHIFT+" + get_var("default_placeholders")[shift_position];
						}
						else
						{
							return_data.data = return_data.data + "+SHIFT+" + get_var("default_placeholders")[shift_position];
						}
					}
					else
					{
						if (return_data.data == "")
						{
							return_data.data = "SHIFT+" + get_var("default_placeholders")[shift_position];
						}
						else
						{
							return_data.data = return_data.data + "+SHIFT+" + get_var("default_placeholders")[shift_position];
						}
					}
					key_found = true;
				} //if (shift_position != -1) //entry exists in shift table
				else if (get_var("default_placeholders").includes(token)) //entry exists in default table
				{
					if (return_data.data == "")
					{
						return_data.data = token;
					}
					else
					{
						return_data.data = return_data.data+"+" + token;
					}
					key_found = true;
				}
				else if(token.toUpperCase() == "SHIFT") //shift keyword detected. set flag
				{
					if (return_data.data == "")
					{
						return_data.data = "SHIFT";
					}
					else
					{
						return_data.data = return_data.data + "+SHIFT";
					}
					shift_found = true;
				}
				else if(token.toUpperCase() == "CTRL" || token.toUpperCase() == "FN" || token.toUpperCase() == "ALT")
				{
					if (return_data.data == "")
					{
						return_data.data = token.toUpperCase();
					}
					else
					{
						return_data.data = return_data.data+"+" + token.toUpperCase();
					}
				}
				else //not recognized. throw error
				{
					console.log("Validate fxn returned due to not recognizing input: " + token);
					return_data.valid = false;
					return return_data;
				}
			}
			else //token is a keyword that is in both shift and default tables. counts as a key.
			{
				if (return_data.data == "")
				{
					return_data.data = token.toUpperCase();
				}
				else
				{
					return_data.data = return_data.data+"+" + token.toUpperCase();
				}
				key_found = true;
			}

		}
		else
		{
			console.log("Validate fxn returned due to only whitespace being detected in token");
			console.log("return_data.data: " + return_data.data);
			console.log("input data: " + data);
			console.log("token_array: " + token_array);
			return_data.valid = false;
			return return_data;
		}
    }
    console.log("Validate fxn reached end of execution, is valid");
    return_data.valid = true;
    return return_data;
}

function validateMacroSyntax(data)
{

}

function download() {
    var temp_value_array = Array();
    var validation = true;
    var invalid_data_dump = []; //used for debugging validate fxn.
    var value_Array = get_var("value_Array");

    for (var i = 0; i < 16; i++)
    {
		var array_frame = {name: convert_index_to_readable_name(i), bindings: []};
		console.log("key"+i+" is currently being validated");
		console.log(get_var("value_Array").getPage(i));

		for (var j = 0; j < 61; j++)
		{
			var validation_data = validate_keybind_syntax(value_Array.getPage(i).page_data[j]); //check if valid
			if (validation_data.valid == false)
			{
				validation = false;
				if (get_checklist_index() == i) //currently on same page as error
				{
					document.getElementById("key"+j).style.border = "2px solid red";
				}

				invalid_data_dump.push(validation_data);

				value_Array.getPage(i).getData(j).setValidity(false);
				store_var(value_Array, "value_Array");

			}
			else if(document.getElementById("key"+j).style.border == "2px solid red") //keybind valid after previously invalid. reset it
			{
				if (get_checklist_index() == i) //confirm valid textarea is for this page
				{
					document.getElementById("key"+j).style.border = "";
				}
				value_Array.getPage(i).getData(j).setValidity(true);
				store_var(value_Array, "value_Array");
			}
			if (validation_data.data == "")
			{
				array_frame.bindings[j] = null;
			}
			else
			{
				array_frame.bindings[j] = validation_data.data;
			}
		}
		//TODO: Add macros to temp_value_array
		//var macro_array_frame = {name};
		temp_value_array.push(array_frame);
		}
		if (validation)
		{
			download_file(JSON.stringify(temp_value_array), "test.txt", "/application/json");
		}
		else
		{
		console.log("Download failed! A textbox had invalid syntax.");
		console.log(invalid_data_dump);
		window.alert("There was a syntax error in specified keybindings. Download halted.");
		}
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

