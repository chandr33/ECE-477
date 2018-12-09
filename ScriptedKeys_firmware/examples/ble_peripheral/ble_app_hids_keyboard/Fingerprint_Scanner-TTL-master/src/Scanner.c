#include "Scanner.h"

static unsigned char command_packet[12];
static unsigned char response_packet[12];
static struct Command command_members;
bool ACK = false;
short error_code = 0;

void clearCommandPacket() {
  for (int i = 0; i < 12; i++) {
    command_packet[i] = 0;
  }
}
void getPacketBytes(unsigned char command) {
  command_members.command[0] = command;
  command_members.command[1] = 0x00;
  short checksum = CalculateChecksum_Command();
  clearCommandPacket();
  command_packet[0] = COMMAND_START_CODE_1;
  command_packet[1] = COMMAND_START_CODE_2;
  command_packet[2] = COMMAND_DEVICE_ID_1;
  command_packet[3] = COMMAND_DEVICE_ID_2;
  command_packet[4] = command_members.Parameter[0];
  command_packet[5] = command_members.Parameter[1];
  command_packet[6] = command_members.Parameter[2];
  command_packet[7] = command_members.Parameter[3];
  command_packet[8] = command_members.command[0];
  command_packet[9] = command_members.command[1];
  command_packet[10] = (unsigned char)(checksum&0x00FF);
  command_packet[11] = (unsigned char)((checksum&0xFF00) >> 8);
}

short CalculateChecksum_Command() {
        short w = 0;
	w += COMMAND_START_CODE_1;
	w += COMMAND_START_CODE_2;
	w += COMMAND_DEVICE_ID_1;
	w += COMMAND_DEVICE_ID_2;
	w += command_members.Parameter[0];
	w += command_members.Parameter[1];
	w += command_members.Parameter[2];
	w += command_members.Parameter[3];
	w += command_members.command[0];
	w += command_members.command[1];
	return w;
}

void SendCommand() {
    app_uart_flush();
    int i = 0;
    uint32_t success;
    for (i = 0; i < 12; i++) {
        while(success = app_uart_put(command_packet[i]) != NRF_SUCCESS);
          if (success == NRF_ERROR_NO_MEM) {
            printf("UART Transmission failed\n");
          }
    }
    printf("\n");
}

short parseError(unsigned char high, unsigned char low) {
  short e;
  if (high == 0x00) {
    e = INVALID;
  }
  else {
      switch(low)
      {
	case 0x00: e = NO_ERROR; break;
	case 0x01: e = NACK_TIMEOUT; break;
	case 0x02: e = NACK_INVALID_BAUDRATE; break;
	case 0x03: e = NACK_INVALID_POS; break;
	case 0x04: e = NACK_IS_NOT_USED; break;
	case 0x05: e = NACK_IS_ALREADY_USED; break;
	case 0x06: e = NACK_COMM_ERR; break;
	case 0x07: e = NACK_VERIFY_FAILED; break;
	case 0x08: e = NACK_IDENTIFY_FAILED; break;
	case 0x09: e = NACK_DB_IS_FULL; break;
	case 0x0A: e = NACK_DB_IS_EMPTY; break;
	case 0x0B: e = NACK_TURN_ERR; break;
	case 0x0C: e = NACK_BAD_FINGER; break;
	case 0x0D: e = NACK_ENROLL_FAILED; break;
	case 0x0E: e = NACK_IS_NOT_SUPPORTED; break;
	case 0x0F: e = NACK_DEV_ERR; break;
	case 0x10: e = NACK_CAPTURE_CANCELED; break;
	case 0x11: e = NACK_INVALID_PARAM; break;
        case 0x12: e = NACK_FINGER_IS_NOT_PRESSED; break;
      }
  }
  return e;
}

void clearResponsePacket() {
  for (int i = 0; i < 12; i++) {
    response_packet[i] = 0;
  }
}

void getResponse() {
  ACK = false;
  bool done = false;  
  error_code = 0;
  uint8_t first_byte = 0;
  while (true){
    while (app_uart_get(&first_byte) != NRF_SUCCESS);
    if (first_byte == 0x55)
    {
      break;
    }
  }
  clearResponsePacket();
  response_packet[0] = first_byte;
  for (int i = 1; i < 12; i++) {
     while (app_uart_get(&first_byte) != NRF_SUCCESS) {}
     response_packet[i] = first_byte;
  }
  if (response_packet[8] == 0x30)
      ACK = true;
  else {
      error_code = parseError(response_packet[5],response_packet[4]);
  }
 }

bool SetLED_func(bool on) {
  unsigned char command = CmosLed;
  if (on)
    command_members.Parameter[0] = 0x01;
  else
    command_members.Parameter[0] = 0x00;

  command_members.Parameter[1] = 0x00;
  command_members.Parameter[2] = 0x00;
  command_members.Parameter[3] = 0x00;
  getPacketBytes(command);
  SendCommand();
  getResponse();
}

void getParameterfromInt(uint8_t id) {
  command_members.Parameter[0] = (unsigned char)(id&0x000000ff);
  command_members.Parameter[1] = (unsigned char)(id&0x0000ff00) >> 8;
  command_members.Parameter[2] = (unsigned char)(id&0x00ff0000) >> 16;
  command_members.Parameter[3] = (unsigned char)(id&0xff000000) >> 24;
}
bool CheckEnrolled_func(uint8_t id) {
  unsigned char command = CheckEnrolled;
  getParameterfromInt(id);
  getPacketBytes(command);
  SendCommand();
  getResponse();
  return ACK;
}

int EnrollStart_func(int id) {
  unsigned char command = EnrollStart;
  command_members.Parameter[0] = (unsigned char)(id&0x000000ff);
  command_members.Parameter[1] = (unsigned char)(id&0x0000ff00) >> 8;
  command_members.Parameter[2] = (unsigned char)(id&0x00ff0000) >> 16;
  command_members.Parameter[3] = (unsigned char)(id&0xff000000) >> 24;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  int retval = 0;
  if (ACK == false) {
      if (error_code == NACK_DB_IS_FULL) retval = 1;
      if (error_code == NACK_INVALID_POS) retval = 2;
      if (error_code == NACK_IS_ALREADY_USED) retval = 3;
  }
  return retval;
}

bool IsPressFinger_func() {
  unsigned char command = IsPressFinger;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  bool retval = false;
  int pval = response_packet[4];
  pval += response_packet[5];
  pval += response_packet[6];
  pval += response_packet[7];
  if (pval == 0) retval = true;
  return retval;
}

bool CaptureFinger_func(bool highquality) {
  unsigned char command = CaptureFinger;
  if (highquality) {
    getParameterfromInt(1);
  }
  else {
    getParameterfromInt(0);
  }
  getPacketBytes(command);
  SendCommand();
  getResponse();
  return ACK;
}

int intFromParameter() {
    int retval = 0;
    retval = (retval << 8) + response_packet[7];
    retval = (retval << 8) + response_packet[6];
    retval = (retval << 8) + response_packet[5];
    retval = (retval << 8) + response_packet[4];
    return retval;
}

int Enroll1_func() {
  unsigned char command = Enroll1;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  int retval = intFromParameter();
  if (retval < 3000) retval = 3; else retval = 0;
  {
      if (error_code == NACK_ENROLL_FAILED) retval = 1;
      if (error_code == NACK_BAD_FINGER) retval = 2;
  }
  if (ACK) return 0; else return retval;
}

int Enroll2_func() {
  unsigned char command = Enroll2;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  int retval = intFromParameter();
  if (retval < 3000) retval = 3; else retval = 0;
  {
      if (error_code == NACK_ENROLL_FAILED) retval = 1;
      if (error_code == NACK_BAD_FINGER) retval = 2;
  }
  if (ACK) return 0; else return retval;
}

int Enroll3_func() {
  unsigned char command = Enroll3;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  int retval = intFromParameter();
  if (retval < 3000) retval = 3; else retval = 0;
  {
      if (error_code == NACK_ENROLL_FAILED) retval = 1;
      if (error_code == NACK_BAD_FINGER) retval = 2;
  }
  if (ACK) return 0; else return retval;
}

int Identify1_N_func() {
  unsigned char command = Identify1_N;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  int retval = intFromParameter();
  if (retval > 3000)
    retval = 3000;
  return retval;
}

int GetEnrollCount_func() {
  unsigned char command = GetEnrollCount;
  command_members.Parameter[0] = 0x00;
  command_members.Parameter[1] = 0x00;
  command_members.Parameter[2] = 0x00;
  command_members.Parameter[3] = 0x00;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  int retval = intFromParameter();
  return retval;
}

bool DeleteAll_func() {
  unsigned char command = DeleteAll;
  getPacketBytes(command);
  SendCommand();
  getResponse();
  return ACK;
}

void Open_func() {
  unsigned char command = Open;
  command_members.Parameter[0] = 0x00;
  command_members.Parameter[1] = 0x00;
  command_members.Parameter[2] = 0x00;
  command_members.Parameter[3] = 0x00;
  getPacketBytes(command);
  SendCommand();
  getResponse();
}