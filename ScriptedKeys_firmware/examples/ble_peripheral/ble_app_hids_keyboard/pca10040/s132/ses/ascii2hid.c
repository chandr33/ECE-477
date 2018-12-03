#include "ascii2hid.h"

//This fuction converts the ASCII character into HID keyboard keys
uint8_t ascii2hid(char ascChar, uint8_t* modi){
  uint8_t hid_value;
  switch(ascChar)
    {
        case 'A' : hid_value = 0x04; modi = 0x20; break;
        case 'B' : hid_value = 0x05; modi = 0x20; break;
        case 'C' : hid_value = 0x06; modi = 0x20; break;
        case 'D' : hid_value = 0x07; modi = 0x20; break;
        case 'E' : hid_value = 0x08; modi = 0x20; break;
        case 'F' : hid_value = 0x09; modi = 0x20; break;
        case 'G' : hid_value = 0x0A; modi = 0x20; break;
        case 'H' : hid_value = 0x0B; modi = 0x20; break;
        case 'I' : hid_value = 0x0C; modi = 0x20; break;
        case 'J' : hid_value = 0x0D; modi = 0x20; break;
        case 'K' : hid_value = 0x0E; modi = 0x20; break;
        case 'L' : hid_value = 0x0F; modi = 0x20; break;
        case 'M' : hid_value = 0x10; modi = 0x20; break;
        case 'N' : hid_value = 0x11; modi = 0x20; break;
        case 'O' : hid_value = 0x12; modi = 0x20; break;
        case 'P' : hid_value = 0x13; modi = 0x20; break;
        case 'Q' : hid_value = 0x14; modi = 0x20; break;
        case 'R' : hid_value = 0x15; modi = 0x20; break;
        case 'S' : hid_value = 0x16; modi = 0x20; break;
        case 'T' : hid_value = 0x17; modi = 0x20; break;
        case 'U' : hid_value = 0x18; modi = 0x20; break;
        case 'V' : hid_value = 0x19; modi = 0x20; break;
        case 'W' : hid_value = 0x1A; modi = 0x20; break;
        case 'X' : hid_value = 0x1B; modi = 0x20; break;
        case 'Y' : hid_value = 0x1C; modi = 0x20; break;
        case 'Z' : hid_value = 0x1D; modi = 0x20; break;

        case 'a' : hid_value = 0x04; modi = 0x00; break;
        case 'b' : hid_value = 0x05; modi = 0x00; break;
        case 'c' : hid_value = 0x06; modi = 0x00; break;
        case 'd' : hid_value = 0x07; modi = 0x00; break;
        case 'e' : hid_value = 0x08; modi = 0x00; break;
        case 'f' : hid_value = 0x09; modi = 0x00; break;
        case 'g' : hid_value = 0x0A; modi = 0x00; break;
        case 'h' : hid_value = 0x0B; modi = 0x00; break;
        case 'i' : hid_value = 0x0C; modi = 0x00; break;
        case 'j' : hid_value = 0x0D; modi = 0x00; break;
        case 'k' : hid_value = 0x0E; modi = 0x00; break;
        case 'l' : hid_value = 0x0F; modi = 0x00; break;
        case 'm' : hid_value = 0x10; modi = 0x00; break;
        case 'n' : hid_value = 0x11; modi = 0x00; break;
        case 'o' : hid_value = 0x12; modi = 0x00; break;
        case 'p' : hid_value = 0x13; modi = 0x00; break;
        case 'q' : hid_value = 0x14; modi = 0x00; break;
        case 'r' : hid_value = 0x15; modi = 0x00; break;
        case 's' : hid_value = 0x16; modi = 0x00; break;
        case 't' : hid_value = 0x17; modi = 0x00; break;
        case 'u' : hid_value = 0x18; modi = 0x00; break;
        case 'v' : hid_value = 0x19; modi = 0x00; break;
        case 'w' : hid_value = 0x1A; modi = 0x00; break;
        case 'x' : hid_value = 0x1B; modi = 0x00; break;
        case 'y' : hid_value = 0x1C; modi = 0x00; break;
        case 'z' : hid_value = 0x1D; modi = 0x00; break;

        case '1' : hid_value = 0x59; modi = 0x00; break;
        case '2' : hid_value = 0x5A; modi = 0x00; break;
        case '3' : hid_value = 0x5B; modi = 0x00; break;
        case '4' : hid_value = 0x5C; modi = 0x00; break;
        case '5' : hid_value = 0x5D; modi = 0x00; break;
        case '6' : hid_value = 0x5E; modi = 0x00; break;
        case '7' : hid_value = 0x5F; modi = 0x00; break;
        case '8' : hid_value = 0x60; modi = 0x00; break;
        case '9' : hid_value = 0x61; modi = 0x00; break; 
        case '0' : hid_value = 0x62; modi = 0x00; break;

        case '-' : hid_value = 0x56; modi = 0x00; break;
        case ':' : hid_value = 0x33; modi = 0x20; break;
        case ',' : hid_value = 0x36; modi = 0x00; break;
        case '.' : hid_value = 0x37; modi = 0x00; break;
        case '/' : hid_value = 0x38; modi = 0x00; break;
        case ' ' : hid_value = 0x2C; modi = 0x00; break; 
        case '\n' : hid_value = 0x28; modi = 0x00; break;
        case '"' : hid_value = 0x34; modi = 0x20; break; 
        case '>' : hid_value = 0x37; modi = 0x20; break;
        case '~' : hid_value = 0x32; modi = 0x20; break;


        default: hid_value = 0x00; modi = 0x00; break;   ;// Error handling
    }

  return hid_value;
}