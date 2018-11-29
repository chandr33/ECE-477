#pragma once

uint8_t default_lookup_table [4] [64] = {
{ //Mode 1 Normal
    0x2A,       /* Key backspace */
    0x35,       /* Key ` */
    0x31,       /* Key \ */
    0x2B,       /* Key tab */
    0x39,       /* Key capslock */
    0x00,        /* undefined */
    0xE0,       /* Key LeftControl */
    0x00,       /* undefined */
	
    0x2E,       /* Key = */
    0x1E,       /* Key 1 */
    0x30,       /* Key ] */
    0x14,        /* Key q */
    0x04,       /* Key a */
    0x28,       /* Key enter */
    0xE1,       /* Key LeftShift*/
    0xE4,       /* Key RightControl */
	
    0x2D,       /* Key - */
    0x1F,        /* Key 2 */
    0x2F,       /* Key [ */
    0x1A,       /* Key w */
    0x16,       /* Key s */
    0x34,       /* Key ' */
    0xE3,       /* Key LeftWindow */ //NOTE: Assuming LeftWindow as Left GUI
    0xE5,        /* Key RightShift */
	
    0x27,       /* Key 0 */
    0x20,        /* Key 3 */
    0x13,       /* Key P */
    0x08,       /* Key E */
    0x07,       /* Key D */
    0x33,       /* Key ; */
    0x1D,       /* Key z */
    0xE8,        /* Key FN */ 
	
    0x26,       /* Key 9 */
    0x21,       /* Key 4 */
    0x12,       /* Key o */
    0x15,       /* Key r */
    0x06,       /* Key c */
    0x0F,        /* Key l */
    0xE2,       /* Key LeftAlt */
    0xE7,       /* Key RightWindow */
	
    0x25,       /* Key 8 */
    0x22,       /* Key 5 */
    0x0C,       /* Key i */
    0x17,        /* Key t */
    0x09,       /* Key f */
    0x36,       /* Key , */
    0x1B,       /* Key x */
    0x38,       /* Key / */
	
    0x24,       /* Key 7 */
    0x23,        /* Key 6 */
    0x0E,       /* Key k */
    0x0A,       /* Key g */
    0x19,       /* Key v */
    0x10,       /* Key m */
    0x2C,       /* Key space */
    0x37,        /* Key . */
	
    0x18,       /* Key u */
    0x1C,        /* Key y */
    0x0D,       /* Key j */
    0x0B,       /* Key h */
    0x05,       /* Key b */
    0x11,       /* Key n */
    0x00,       /* undefined */
    0xE6        /* Key RightAlt */
},
{	//Mode 1 FN
    0x2A,       /* Key backspace */
    0x29,       /* Key esc */
    0xEA,        /* Macro1 */ //0x31,       /* Key \ */
    0x2B,       /* Key tab */
    0x39,       /* Key capslock */
    0x00,        /* undefined */
    0xE0,       /* Key LeftControl */
    0x00,       /* undefined */
	
    0x45,       /* Key F12 */
    0x3A,       /* Key F1 */
    0x30,       /* Key ] */
    0x5F,        /* Key Numpad7 */
    0x5C,       /* Key Numpad4 */
    0x28,       /* Key enter */
    0xE1,       /* Key LeftShift*/
    0xE4,       /* Key RightControl */
	
    0x44,       /* Key F11 */
    0x3B,        /* Key F2 */
    0x2F,       /* Key [ */
    0x60,       /* Key Numpad8 */
    0x5D,       /* Key Numpad5 */
    0x34,       /* Key ' */
    0xE9,       /* Key LeftWindow */ //NOTE: Assuming LeftWindow as Left GUI
    0xE5,        /* Key RightShift */
	
    0x43,       /* Key F10 */
    0x3C,        /* Key F3 */
    0x13,       /* Key P */
    0x61,       /* Key Numpad9 */
    0x5E,       /* Key Numpad6 */
    0x33,       /* Key ; */
    0x59,       /* Key Numpad1 */
    0xE8,        /* Key FN */ //NOTE: Not currently bound.
	
    0x42,       /* Key F9 */
    0x3D,       /* Key F4 */
    0x12,       /* Key o */
    0x15,       /* Key r */
    0x5B,       /* Key Numpad3 */
    0x4F,        /* Key ARROW_RIGHT */
    0xE2,       /* Key LeftAlt */
    0xE9,       /* Key RightWindow */
	
    0x41,       /* Key F8 */
    0x3E,       /* Key F5 */
    0x0C,       /* Key i */
    0x17,        /* Key t */
    0x62,       /* Key Numpad0 */
    0x36,       /* Key , */
    0x5A,       /* Key Numpad2 */
    0x38,       /* Key / */
	
    0x40,       /* Key F7 */
    0x3F,        /* Key F6 */
    0x52,       /* Key ARROW_UP */
    0x0A,       /* Key g */
    0x19,       /* Key v */
    0x10,       /* Key m */
    0x2C,       /* Key space */
    0x37,        /* Key . */
	
    0x18,       /* Key u */
    0x1C,        /* Key y */
    0x51,       /* Key ARROW_DOWN */
    0x50,       /* Key ARROW_LEFT */
    0x05,       /* Key b */
    0x11,       /* Key n */
    0x00,       /* undefined */
    0xE6        /* Key RightAlt */
},
{ //Mode 2 Normal
    0x2A,       /* Key backspace */
    0x35,       /* Key ` */
    0x31,       /* Key \ */
    0x2B,       /* Key tab */
    0x39,       /* Key capslock */
    0x00,        /* undefined */
    0xE0,       /* Key LeftControl */
    0x00,       /* undefined */
	
    0x30,       /* Key ] */
    0x1E,       /* Key 1 */
    0x2E,       /* Key = */
    0x34,       /* Key ' */
    0x04,       /* Key a */
    0x28,       /* Key enter */
    0xE1,       /* Key LeftShift*/
    0xE4,       /* Key RightControl */
	
    0x2F,       /* Key [ */
    0x1F,        /* Key 2 */
    0x38,       /* Key / */
    0x36,       /* Key , */ 
    0x12,       /* Key o */
    0x2D,       /* Key - */
    0xE3,       /* Key LeftWindow */ //NOTE: Assuming LeftWindow as Left GUI
    0xE5,        /* Key RightShift */
	
    0x27,       /* Key 0 */
    0x20,        /* Key 3 */
    0x0F,        /* Key l */
    0x37,        /* Key . */
    0x08,       /* Key E */
    0x16,       /* Key s */
    0x33,       /* Key ; */
    0xE8,        /* Key FN */ //NOTE: Not currently bound.
	
    0x26,       /* Key 9 */
    0x21,       /* Key 4 */
    0x15,       /* Key r */
    0x13,       /* Key P */
    0x0D,       /* Key j */
    0x11,       /* Key n */
    0xE2,       /* Key LeftAlt */
    0xE7,       /* Key RightWindow */
	
    0x25,       /* Key 8 */
    0x22,       /* Key 5 */
    0x06,       /* Key c */
    0x1C,        /* Key y */
    0x18,       /* Key u */
    0x1A,       /* Key w */
    0x14,        /* Key q */
    0x1D,       /* Key z */
	
    0x24,       /* Key 7 */
    0x23,        /* Key 6 */
    0x17,        /* Key t */
    0x0C,       /* Key i */
    0x0E,       /* Key k */
    0x10,       /* Key m */
    0x2C,       /* Key space */
    0x19,       /* Key v */
	
    0x0A,       /* Key g */
    0x09,       /* Key f */
    0x0B,       /* Key h */
    0x07,       /* Key D */
    0x1B,       /* Key x */
    0x05,       /* Key b */
    0x00,       /* undefined */
    0xE6        /* Key RightAlt */
},
{ //Mode 2 FN
    0x2A,       /* Key backspace */
    0x29,       /* Key esc */
    0x31,       /* Key \ */
    0x2B,       /* Key tab */
    0x39,       /* Key capslock */
    0x00,        /* undefined */
    0xE0,       /* Key LeftControl */
    0x00,       /* undefined */
	
    0x30,       /* Key ] */
    0x1E,       /* Key 1 */
    0x2E,       /* Key = */
    0x34,       /* Key ' */
    0x04,       /* Key a */
    0x28,       /* Key enter */
    0xE1,       /* Key LeftShift*/
    0xE4,       /* Key RightControl */
	
    0x2F,       /* Key [ */
    0x1F,        /* Key 2 */
    0x38,       /* Key / */
    0x36,       /* Key , */
    0x12,       /* Key o */
    0x2D,       /* Key - */
    0xE3,       /* Key LeftWindow */ //NOTE: Assuming LeftWindow as Left GUI
    0xE5,        /* Key RightShift */
	
    0x27,       /* Key 0 */
    0x20,        /* Key 3 */
    0x0F,        /* Key l */
    0x37,        /* Key . */
    0x08,       /* Key E */
    0x16,       /* Key s */
    0x33,       /* Key ; */
    0xE8,        /* Key FN */ //NOTE: Not currently bound.
	
    0x26,       /* Key 9 */
    0x21,       /* Key 4 */
    0x15,       /* Key r */
    0x13,       /* Key P */
    0x0D,       /* Key j */
    0x11,       /* Key n */
    0xE2,       /* Key LeftAlt */
    0xE7,       /* Key RightWindow */
	
    0x25,       /* Key 8 */
    0x22,       /* Key 5 */
    0x06,       /* Key c */
    0x1C,        /* Key y */
    0x18,       /* Key u */
    0x1A,       /* Key w */
    0x14,        /* Key q */
    0x1D,       /* Key z */
	
    0x24,       /* Key 7 */
    0x23,        /* Key 6 */
    0x17,        /* Key t */
    0x0C,       /* Key i */
    0x0E,       /* Key k */
    0x10,       /* Key m */
    0x2C,       /* Key space */
    0x19,       /* Key v */
	
    0x0A,       /* Key g */
    0x09,       /* Key f */
    0x0B,       /* Key h */
    0x07,       /* Key D */
    0x1B,       /* Key x */
    0x05,       /* Key b */
    0x00,       /* undefined */
    0xE6        /* Key RightAlt */
}};

uint8_t macro_1 [ ] = {
  0x46, //Send string, 6 chars
  0x22, 0x0b, //H
  0x00, 0x08, //e
  0x00, 0x0f, //l
  0x00, 0x0f, //l
  0x00, 0x12, //o
  0x00, 0x2c, //SPACE
  0x81, 0x04, //Repeat 1 command 4 times
  0x45, //Send string, 5 chars
  0x22, 0x1A, //W
  0x00, 0x12, //o
  0x00, 0x15, //r
  0x00, 0x0f, //l
  0x00, 0x07, //d
  0x41, //Send string, 1 char
  0x00, 0x28 //\n
  
};