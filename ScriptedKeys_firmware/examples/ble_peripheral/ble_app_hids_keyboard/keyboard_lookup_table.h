#pragma once

const uint8_t default_lookup_table[64] = {
    0x2A,       /* Key backspace */
    0x29,       /* Key esc */
    0x31,       /* Key \ */
    0x2B,       /* Key tab */
    0x39,       /* Key capslock */
    0x00,        /* undefined */
    0xE0,       /* Key LeftControl */
    0x00,       /* undefined */
    0x86,       /* Key = */
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
    0x00,        /* Key FN */ //NOTE: Not currently bound.
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
};