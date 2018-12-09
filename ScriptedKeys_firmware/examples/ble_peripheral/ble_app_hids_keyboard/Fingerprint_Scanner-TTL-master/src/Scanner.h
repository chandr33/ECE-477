//#include "SoftwareSerial.h"
#pragma once 
#include <stdbool.h>
#include <stdio.h>
#include "nrf_log.h"
#include "nrf_log_ctrl.h"
#include "nrf_log_default_backends.h"
#include "app_uart.h"

enum CommandCodes {
                                        NotSet				= 0x00,		// Default value for enum. Scanner will return error if sent this.
					Open				= 0x01,		// Open Initialization
					Close				= 0x02,		// Close Termination
					UsbInternalCheck	= 0x03,		// UsbInternalCheck Check if the connected USB device is valid
					ChangeEBaudRate		= 0x04,		// ChangeBaudrate Change UART baud rate
					SetIAPMode			= 0x05,		// SetIAPMode Enter IAP Mode In this mode, FW Upgrade is available
					CmosLed				= 0x12,		// CmosLed Control CMOS LED
					GetEnrollCount		= 0x20,		// Get enrolled fingerprint count
					CheckEnrolled		= 0x21,		// Check whether the specified ID is already enrolled
					EnrollStart			= 0x22,		// Start an enrollment
					Enroll1				= 0x23,		// Make 1st template for an enrollment
					Enroll2				= 0x24,		// Make 2nd template for an enrollment
					Enroll3				= 0x25,		// Make 3rd template for an enrollment, merge three templates into one template, save merged template to the database
					IsPressFinger		= 0x26,		// Check if a finger is placed on the sensor
					DeleteID			= 0x40,		// Delete the fingerprint with the specified ID
					DeleteAll			= 0x41,		// Delete all fingerprints from the database
					Verify1_1			= 0x50,		// Verification of the capture fingerprint image with the specified ID
					Identify1_N			= 0x51,		// Identification of the capture fingerprint image with the database
					VerifyTemplate1_1	= 0x52,		// Verification of a fingerprint template with the specified ID
					IdentifyTemplate1_N	= 0x53,		// Identification of a fingerprint template with the database
					CaptureFinger		= 0x60,		// Capture a fingerprint image(256x256) from the sensor
					MakeTemplate		= 0x61,		// Make template for transmission
					GetImage			= 0x62,		// Download the captured fingerprint image(256x256)
					GetRawImage			= 0x63,		// Capture & Download raw fingerprint image(320x240)
					GetTemplate			= 0x70,		// Download the template of the specified ID
					SetTemplate			= 0x71,		// Upload the template of the specified ID
					GetDatabaseStart	= 0x72,		// Start database download, obsolete
					GetDatabaseEnd		= 0x73,		// End database download, obsolete
					UpgradeFirmware		= 0x80,		// Not supported
					UpgradeISOCDImage	= 0x81,		// Not supported
					Ack					= 0x30,		// Acknowledge.
					Nack				= 0x31		// Non-acknowledge
};
struct Command {
    unsigned char Parameter[4];
    unsigned char command[2];
};

/* Command activation codes */
static const unsigned char COMMAND_START_CODE_1 = 0x55;	// Static byte to mark the beginning of a command packet	-	never changes
static const unsigned char COMMAND_START_CODE_2 = 0xAA;	// Static byte to mark the beginning of a command packet	-	never changes
static const unsigned char COMMAND_DEVICE_ID_1 = 0x01;	// Device ID Byte 1 (lesser byte)							-	theoretically never changes
static const unsigned char COMMAND_DEVICE_ID_2 = 0x00;	// Device ID Byte 2 (greater byte)

/* Command Packet Functions */
void GetPacketBytes(unsigned char);
void ParameterFromInt(int i);
short CalculateChecksum_Command();						// Checksum is calculated using byte addition
unsigned char GetHighByte_Command(short w);						
unsigned char GetLowByte_Command(short w);

enum Errors_Enum {
					NO_ERROR					= 0x0000,	// Default value. no error
					NACK_TIMEOUT				= 0x1001,	// Obsolete, capture timeout
					NACK_INVALID_BAUDRATE		= 0x1002,	// Obsolete, Invalid serial baud rate
					NACK_INVALID_POS			= 0x1003,	// The specified ID is not between 0~199
					NACK_IS_NOT_USED			= 0x1004,	// The specified ID is not used
					NACK_IS_ALREADY_USED		= 0x1005,	// The specified ID is already used
					NACK_COMM_ERR				= 0x1006,	// Communication Error
					NACK_VERIFY_FAILED			= 0x1007,	// 1:1 Verification Failure
					NACK_IDENTIFY_FAILED		= 0x1008,	// 1:N Identification Failure
					NACK_DB_IS_FULL				= 0x1009,	// The database is full
					NACK_DB_IS_EMPTY			= 0x100A,	// The database is empty
					NACK_TURN_ERR				= 0x100B,	// Obsolete, Invalid order of the enrollment (The order was not as: EnrollStart -> Enroll1 -> Enroll2 -> Enroll3)
					NACK_BAD_FINGER				= 0x100C,	// Too bad fingerprint
					NACK_ENROLL_FAILED			= 0x100D,	// Enrollment Failure
					NACK_IS_NOT_SUPPORTED		= 0x100E,	// The specified command is not supported
					NACK_DEV_ERR				= 0x100F,	// Device Error, especially if Crypto-Chip is trouble
					NACK_CAPTURE_CANCELED		= 0x1010,	// Obsolete, The capturing is canceled
					NACK_INVALID_PARAM			= 0x1011,	// Invalid parameter
					NACK_FINGER_IS_NOT_PRESSED	= 0x1012,	// Finger is not pressed
					INVALID						= 0XFFFF	// Used when parsing fails
};

struct Response {
  unsigned char RawBytes[12];
  unsigned char ParameterBytes[4];
  unsigned char ResponseBytes[2];
  bool ACK;
};

/* Response Packet Functions */
int IntFromParameter();
bool CheckParsing(unsigned char b, unsigned char propervalue, unsigned char alternatevalue, const char* varname, bool UseSerialDebug);
short CalculateChecksum_Response(unsigned char* buffer, int length);
unsigned char GetHighByte_Response(short w);						
unsigned char GetLowByte_Response(short w);
void setup_response(unsigned char* buffer, bool UseSerialDebug);


/*Scanner Functions */

void Open_func();
void Close_func();
bool SetLED_func(bool);
bool ChangeBaudRate(unsigned long baud);
int GetEnrollCount_func();
bool CheckEnrolled_func(uint8_t id);
int EnrollStart_func(int id);
int Enroll1_func();
int Enroll2_func();
int Enroll3_func();
bool IsPressFinger_func();
bool DeleteID_func(int ID);
bool DeleteAll_func();
int Verify1_1_func(int id);
int Identify1_N_func();
bool CaptureFinger_func(bool highquality);
void SendCommand();
void getResponse();


