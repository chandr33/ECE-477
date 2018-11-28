#include "Scanner.h"

static unsigned command_packet[12];
static struct Command command_members;

void getPacketBytes(unsigned char command) {
  command_members.command[0] = 0x00;
  command_members.command[1] = command;
  short checksum = CalculateChecksum_Command();
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
  command_packet[11] = (unsigned char)(checksum&0xFF00);
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
    int i = 0;
    for (i = 0; i < 12; i++) {
        uint32_t success = app_uart_put((uint8_t)command_packet[i]);
        if (success == NRF_ERROR_NO_MEM) {
            NRF_LOG_INFO("UART Transmission failed\n");
            NRF_LOG_FLUSH();
            break;
        }
    }
}

void getResponse() {
  bool done = false;
  uint8_t first_byte = 0;
  unsigned char response_packet[12];
  while (done == false) {
      app_uart_get(&first_byte);
      if (first_byte == 0x55)
          done = true;
  }
  unsigned char response[12];
  response[0] = first_byte;
  for (int i = 1; i < 12; i++) {
     while (app_uart_get(&first_byte) == NRF_ERROR_NOT_FOUND) {
          NRF_LOG_INFO("UART Transmission failed\n");
     }
     response[i] = first_byte;
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