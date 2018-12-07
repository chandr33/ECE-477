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

var MAX_MACRO_LENGTH = 128;

var keyboard_lookup_table = [
"BACKSPACE", "ESC", "\\", "TAB", "CAPS", null, "L_CTRL", null, //0-7
"=", "1", "]", "q", "a", "ENTER", "L_SHIFT", "R_CTRL", //8-15
"-", "2", "[", "w", "s", "'", "L_WIN", "R_SHIFT", //16-23
"0", "3", "p", "e", "d", ";", "z", "FN_KEY", //24-31
"9", "4", "o", "r", "c", "l", "L_ALT", "R_WIN", //32-39
"8", "5", "i", "t", "f", ",", "x", "/", //40-47
"7", "6", "k", "g", "v", "m", "SPACE", ".", //48-55
"u", "y", "j", "h", "b", "n", null, "R_ALT" //56-63
];

var hid_codes = {
	"a": 0x04, "b": 0x05, "c": 0x06,
	"d": 0x07, "e": 0x08,
	"f": 0x09, "g": 0x0A,
	"h": 0x0B, "i": 0x0C,
	"j": 0x0D, "k": 0x0E,
	"l": 0x0F, "m": 0x10,
	"n": 0x11, "o": 0x12,
	"p": 0x13, "q": 0x14,
	"r": 0x15, "s": 0x16,
	"t": 0x17, "u": 0x18,
	"v": 0x19, "w": 0x1A,
	"x": 0x1B, "y": 0x1C,
	"z": 0x1D, "1": 0x1E,
	"2": 0x1F, "3": 0x20,
	"4": 0x21, "5": 0x22,
	"6": 0x23, "7": 0x24,
	"8": 0x25, "9": 0x26,
	"0": 0x27, "ENTER": 0x28,
	"\\n": 0x28,
	"ESC": 0x29,
	"BACKSPACE": 0x2A,
	"TAB": 0x2B,
	"\\t": 0x2B,
	"SPACE": 0x2C,
	" ": 0x2C,
	"-": 0x2D,
	"=": 0x2E,
	"[": 0x2F,
	"]": 0x30,
	"\\": 0x31,
	";": 0x33,
	"'": 0x34,
	"TILDE": 0x35,
	"`": 0x35,
	",": 0x36,
	".": 0x37,
	"/": 0x38,
	"CAPS": 0x39,
	"F1": 0x3A,
	"F2": 0x3B,
	"F3": 0x3C,
	"F4": 0x3D,
	"F5": 0x3E,
	"F6": 0x3F,
	"F7": 0x40,
	"F8": 0x41,
	"F9": 0x42, 
	"F10": 0x43,
	"F11": 0x44,
	"F12": 0x45,
	"PNT_SCRN": 0x46,
	"SCROLL_LOCK": 0x47,
	"PAUSE": 0x48,
	"INSERT": 0x49,
	"HOME": 0x4A,
	"PAGE_UP": 0x4B,
	"DELETE": 0x4C,
	"END": 0x4D,
	"PAGE_DOWN": 0x4E,
	"RIGHT_ARROW": 0x4F,
	"LEFT_ARROW": 0x50,
	"DOWN_ARROW": 0x51,
	"UP_ARROW": 0x52,
	"MUTE": 0x7F,
	"VOLUME_UP": 0x80,
	"VOLUME_DOWN": 0x81,
	"L_CTRL": 0xE0,
	"L_SHIFT": 0xE1,
	"L_ALT": 0xE2,
	"L_WIN": 0xE3,
	"R_CTRL": 0xE4,
	"R_SHIFT": 0xE5,
	"R_ALT": 0xE6,
	"R_WIN": 0xE7,

	"FN_KEY": 0xE8,
	"FN_LOCK": 0xE9,
	"MACRO1": 0xEA,
	"MACRO2": 0xEB,
	"MACRO3": 0xEC,
	"MACRO4": 0xED,
	"MACRO5": 0xEE,
	"MACRO6": 0xEF,
	"MACRO7": 0xF0,
	"MACRO8": 0xF1,
	"MACRO9": 0xF2,
	"MACRO10": 0xF3,
	"MACRO11": 0xF4,
	"MACRO12": 0xF5,
	"SEND_KEY" 0xF6
};

var default_other = [
"`"
];

var shift_other = [
"~"
];

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
	document.getElementById("Mode_box").checked = false;
	

    sessionStorage.array_page = 0;
}

function get_checklist_index() //checks marked checkboxs and returns an integer from 0 to 15. this corresponds to a stored table, retrieved from get_placeholder_index
{
    var alt = document.getElementById("ALT_box").checked;
    var fn = document.getElementById("FN_box").checked;
    var shift = document.getElementById("SHIFT_box").checked;
    var ctrl = document.getElementById("CTRL_box").checked;
    var mode = document.getElementById("Mode_box").checked;

    return ctrl * 1 + shift * 2 + alt * 4 + fn * 8 + mode * 16;
}

function get_placeholder_index(chk_number) //converts chk_number (an index from 0 to 15) into its corresponding placeholder table index (from 0 to 3)
{
    if(chk_number == 10) { //fn && shift && !ctrl && !alt
	return 0;
    } else if (chk_number == 8) { //fn
	return 0;
    } else if(chk_number == 2 || chk_number == 10) { //shift && !ctrl && !alt
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
    if ((index >> 3) & 1) //fn
    {
	ret_string = ret_string + "FN";
    }

    if ((index) & 1) //ctrl
    {
	if (ret_string != "")
	{
	    ret_string = ret_string + " + ";
	}
	ret_string = ret_string + "CTRL";
    }

    if ((index >> 2) & 1) //alt
    {
	if (ret_string != "")
	{
	    ret_string = ret_string + " + ";
	}
	ret_string = ret_string + "ALT";
    }

    if ((index >> 1) & 1) //shift
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
		     "L_ALT", "SPACE", "R_ALT", "R_WIN", "R_CTRL", "FN_KEY", "R_SHIFT", "ENTER", "TAB"
		   ];

    var shift_found = false;
    var key_found = false; //used to verify key is at end of entry
    var return_data = {valid: false, data: 0};

    //retrieve value from id
    var user_input = data.str_data;
    var token_array = user_input.split("+");
    var no_space_patt = /\S+/;
    var no_multiple_words = /.+\s+.+/; //words separated by whitespace

    for (var i = 0; i < token_array.length; i++) //loop until user_input is completely scanned
    {
		if (key_found) //key must be at end of token_array, so invalidate
		{
			console.log("Validate fxn return due to key_found");
			return_data.valid = false;
			return return_data;
		}
		if (no_multiple_words.exec(token_array[i]) != null) //keys were separated by spaces, not +. throw error
		{
			console.log("Validate fxn retuned due to keys separated by whitespace, not +");
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
				var default_placeholders = get_var("default_placeholders");
				if (shift_position != -1) //entry exists in shift table
				{
					return_data.data |= 0x2200; //set SHIFT flag
					return_data.data &= 0xFF00; //clear character code
					return_data.data |= hid_codes[(default_placeholders[shift_position])]; //set character code according to position in shift table
					//+ get_var("default_placeholders")[shift_position];
					key_found = true;
				} //if (shift_position != -1) //entry exists in shift table
				else if (default_placeholders.includes(token)) //entry exists in default table
				{
					return_data.data &= 0xFF00;
					return_data.data |= hid_codes[(token)];
					/*if (return_data.data == "")
					{
						return_data.data = token;
					}
					else
					{
						return_data.data = return_data.data+"+" + token;
					}*/
					key_found = true;
				}
				else if (default_other.includes(token))
				{
					return_data.data &= 0xFF00;
					return_data.data |= hid_codes[token];
				}
				else if (shift_other.includes(token))
				{
					return_data.data |= 0x2200;
					return_data.data &= 0xFF00;
					return_data.data |= hid_codes[default_other[shift_other.indexOf(token)]];
				}
				else if(token.toUpperCase() == "SHIFT") //shift keyword detected. set flag
				{
					return_data.data |= 0x2200;
					/*if (return_data.data == "")
					{
						return_data.data = "SHIFT";
					}
					else
					{
						return_data.data = return_data.data + "+SHIFT";
					}*/
					shift_found = true;
				}
				else if(token.toUpperCase() == "CTRL")
				{
					return_data.data |= 0x1100;
					/*if (return_data.data == "")
					{
						return_data.data = token.toUpperCase();
					}
					else
					{
						return_data.data = return_data.data+"+" + token.toUpperCase();
					}*/
				}
				else if (token.toUpperCase() == "FN")
				{
					/**NOT USED**/

					//return_data.data |= 0x0200;
				}
				else if (token.toUpperCase() == "ALT")
				{
					return_data.data |= 0x4400;
				}
				else if (token in hid_codes) //not recognized. throw error
				{
					return_data.data |= hid_codes[token];
				}
				else
				{
					console.log("Validate fxn returned due to not recognizing input: " + token);
					return_data.valid = false;
					return return_data;
				}
			}
			else //token is a keyword that is in both shift and default tables. counts as a key.
			{
				return_data.data &= 0xFF00;
				return_data.data |= hid_codes[(token)];
				/*if (return_data.data == "")
				{
					return_data.data = token.toUpperCase();
				}
				else
				{
					return_data.data = return_data.data+"+" + token.toUpperCase();
				}*/
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

function validateMacroSyntax(data, repeatAllowed)
{
	
	var string_data = "";
	var return_data = {valid: false, bytecode: [], command_count: 0};
	if (typeof(data) === 'string')
	{
		string_data = data;
	}
	else if (typeof(data) === Macro)
	{
		string_data = data.getMacro();
	}

	
	var repeat_token_patt = /repeat\((.+?)\)\s*?{(.*)}\s*/m; //finds a repeat structure
	var string_patt = /\"(.+?)\"/; //finds a string
	var no_whitespace_patt = /\s*(.*)/; //remove leading whitespace
	var parallel_patt = /\"([^\"\&]*)\"(\s*\&\s*\"([^\"\&]*)\")+/; //find a parallel structure (multiple keys simultaneous)
	var parallel_parse = /\"([^\"\&]+)\"/; //meant to parse tokens out of parallel_patt

	var ready_string = string_data.replace(no_whitespace_patt, '$1') //strip leading whitespace
	console.log("ready_string: " + ready_string);
	while (ready_string.length != 0)
	{

		//run string_patt, repeat_token_patt, and parallel_patt. find starting index. pick one that starts at 0, throw error if none
		var repeat_index = ready_string.search(repeat_token_patt);
		var string_index = ready_string.search(string_patt);
		var parallel_index = ready_string.search(parallel_patt);

		console.log("Repeat_index: " + repeat_index);
		console.log("String_index: " + string_index);
		console.log("Parallel_index: " + parallel_index);

		if (repeat_index != 0 && string_index != 0 && parallel_index != 0) //basic syntax error
		{
			console.log("Macro did not have a valid regex at next index");
			console.log("Repeat_index: " + repeat_index);
			console.log("String_index: " + string_index);
			console.log("Parallel_index: " + parallel_index);
			return_data.valid = false;
			return return_data;
		}

		//remove regex from string

		var token;
		if (repeat_index == 0)
		{
			if (!repeatAllowed)
			{
				console.log("Repeat structure was blocked! Syntax fails.");
				return_data.valid = false;
				return return_data;
			}

			token = ready_string.match(repeat_token_patt);
			ready_string = ready_string.replace(token[0], ""); //returns an array of matched values, 0 index is whole string

			var repeat_val = token[1]; //iteration number

			if (isNaN(repeat_val)) //confirm it is an integer
			{
				console.log("Given repeat value was not a number.");
				return_data.valid = false;
				return return_data;
			}

			var opcode = 0;
			opcode |= (0x2) << 6; //store opcode
			var repeats = repeat_val;

			var result = validateMacroSyntax(token[2], false); //Note: repeat cannot be nested now!
			if (!result.valid)
			{
				console.log("Repeat body was not valid");
				return_data.valid = false;
				return return_data;
			}
			opcode |= result.command_count & 0x3F; //note: impossible for this to overflow, given the character limit. 
			
			return_data.bytecode.push(opcode);
			return_data.bytecode.push(parseInt(repeats));
			return_data.bytecode.push.apply(return_data.bytecode, result.bytecode); 
			return_data.command_count += result.command_count; //add nested statement's count to current count
			return_data.command_count++;
		}
		else if (parallel_index == 0) //must check before string_patt, so that this has priority
		{
			var parallel_string = ready_string.match(parallel_patt)[0];
			ready_string = ready_string.replace(parallel_string, '');
			var tokens = new Array();
			var modifier = 0;
			var opcode = 0x3 << 6;
			var num_characters = 0;
			var characters = new Array();

			while (parallel_parse.test(parallel_string))
			{
				token = parallel_parse.exec(parallel_string)[1];
				if (tokens.includes(token))
				{
					console.log("Key entered multiple times!");
					return_data.valid = false;
					return return_data;
				}

				tokens.push(token);

				console.log(token);

				var default_placeholders = get_var("default_placeholders");

				if (!default_placeholders.includes(token) && !default_other.includes(token) && token.toUpperCase() != "SHIFT" && token.toUpperCase() != "CTRL" && token.toUpperCase() != "ALT") //TODO: How is FN handled?
				{
					console.log("Parallel structure was given an invalid argument.");
					return_data.valid = false;
					return return_data;
				}

				if (token == "SHIFT")
				{
					modifier |= 0x22;
				}
				else if (token == "CTRL")
				{
					modifier |= 0x11;
				}
				else if (token == "ALT")
				{
					modifier |= 0x44;
				}
				else
				{
					characters.push(hid_codes[token]);
					num_characters++;
				}

				parallel_string = parallel_string.replace(token, '');
			}

			opcode |= 0x3F & num_characters; //not possible to overflow, given character limit
			return_data.bytecode.push(opcode);
			return_data.bytecode.push(modifier);
			return_data.bytecode.push.apply(return_data.bytecode, characters);

			
			return_data.command_count++;

			
		}
		else if (string_index == 0)
		{
			token = ready_string.match(string_patt)[1];
			var opcode = 0;
			opcode |= (0x01 << 6); //actual opcode
			opcode |= token.length;
			return_data.bytecode.push(opcode);
			for (var i = 0; i < token.length; i++)
			{
				var bytecode = getBytecodeFromCharacter(token[i]);
				return_data.bytecode.push((bytecode & 0xFF00) >> 8);
				return_data.bytecode.push(bytecode & 0x00FF);
			}

			ready_string = ready_string.replace(ready_string.match(string_patt)[0], '');
			return_data.command_count++;
			//as far as I'm aware, there is no invalid string that can be given...
		}
		

		//repeat until ready_string == NULL

		var ready_string = ready_string.replace(no_whitespace_patt, '$1') //strip leading whitespace
	}

	return_data.valid = true;
	return return_data;
}

function getBytecodeFromCharacter(char)
{
	var return_var = 0;
	var shift_table = get_var("shift_placeholders");
	var default_table = get_var("default_placeholders");
	if (shift_table.includes(char) && !default_table.includes(char)) //in shift table, but not default table. shift flag is applied
	{
		return_var |= 0x2200;
		return_var |= hid_codes[(default_table[shift_table.indexOf(char)])]; //lookup position in shift_table, get character from default table, get its index in keyboard_table
	}
	else if (shift_other.includes(char) && !default_other.includes(char))
	{
		return_var |= 0x2200;
		return_var |= hid_codes[default_other[shift_other.indexOf(char)]];
	}
	else
	{
		return_var |= hid_codes[(char)];
	}

	return return_var;
}

function download() {
    var temp_value_array = Array();
    var validation = true;
    var invalid_data_dump = []; //used for debugging validate fxn.
    var default_placeholders = get_var("default_placeholders");
    var value_Array = get_var("value_Array");
    class binding_obj
    {
    	constructor()
    	{
    		this.binding = new Array();
    		this.idx = 0;
    	}
    };

    for (var i = 0; i < 32; i++)
    {
		var array_frame = {bindings: [], file_out: []}; //artifact of old header information. not breaking functioning code to fix.
		/*if (i > 15)
		{
			array_frame.mode = 1;
		}*/
		console.log("key"+i+" is currently being validated");
		console.log(get_var("value_Array").getPage(i));

		for (var j = 0; j < 61; j++)
		{
			var bind_object = new binding_obj();
			var validation_data = validate_keybind_syntax(value_Array.getPage(i).page_data[j]); //check if valid
			bind_object.idx = keyboard_lookup_table.indexOf(default_placeholders[j]);
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
			if (validation_data.data == 0)
			{
				console.log("No data returned! i: " + i + " j: " + j);
			}
			else
			{
				bind_object.binding.push((validation_data.data & 0xFF00) >> 8);
				bind_object.binding.push(validation_data.data & 0x00FF);
			}
			array_frame.bindings.push(bind_object);
		}
		array_frame.bindings.sort(function(a, b) {return a.idx - b.idx});
		console.log("array_frame", array_frame);
		for (var k = 0; k < 61; k++)
		{
			if (k == 5 || k == 6 || k == 60)
			{
				array_frame.file_out.push(0);
				array_frame.file_out.push(0);
			}
			array_frame.file_out.push.apply(array_frame.file_out, array_frame.bindings[k].binding);
		}

		temp_value_array.push(array_frame.file_out);
	}
	var macro_validation = true;
	var macro_Array = get_var("macro_Array");
	for (var j = 0; j < 12; j++)
	{
		var macro_frame = [];
		var macro = macro_Array[j];
		//macro_frame.name = "macro " + (j + 1);
		//macro_frame.macro = macro.getMacro();
		var result = validateMacroSyntax(macro.getMacro(), true);
		if (!result.valid)
		{
			validation = false;
			macro.setValid(false);
			macro_Array[j] = macro;
			document.getElementById("macro" + j).style.border = "2px solid red";
		}
		else
		{
			macro.setValid(true);
			macro_Array[j] = macro;
			document.getElementById("macro" + j).style.border = "";
			macro_frame = result.bytecode;
		}
		if (macro.getToggleState())
		{
			macro_frame.push(1);
		}
		else
		{
			macro_frame.push(0);
		}
		temp_value_array.push(macro_frame)
	}
	store_var(macro_Array, "macro_Array");

	if (validation && macro_validation)
	{
		download_file(JSON.stringify(temp_value_array), "test.txt", "/application/json");
		//console.log("Validation successful! Download halted for debugging purposes.");
	}
	else if (!validation)
	{
		console.log("Download failed! A textbox had invalid syntax.");
		console.log(invalid_data_dump);
		window.alert("There was a syntax error in specified keybindings. Download halted.");
	}
	else
	{
		console.log("Download failed! A macro had invalid syntax.");
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

