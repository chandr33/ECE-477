#include "Scanner.h"

static unsigned char command_packet[12];
static struct Command command_members;

void getPacketBytes(unsigned char command) {
  command_members.command[0] = command;
  command_members.command[1] = 0x00;
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
    int i = 0;
    uint32_t success;
    for (i = 0; i < 12; i++) {
        while(success = app_uart_put(command_packet[i]) != NRF_SUCCESS);
          if (success == NRF_ERROR_NO_MEM) {
            printf("UART Transmission failed\n");
            //NRF_LOG_FLUSH();
          }
    }
}

void getResponse() {
  bool done = false;
  uint8_t first_byte = 0;
  unsigned char response_packet[12];
  NRF_LOG_INFO("Waiting for response.\n");
  while (true){
    while (app_uart_get(&first_byte) != NRF_SUCCESS);
    if (first_byte == 0x55)
    {
      printf("%x,", first_byte);
      break;
      //NRF_LOG_INFO("The byte we got: %d.", first_byte);
    }
  }
  NRF_LOG_INFO("Did get first byte.\n");
  unsigned char response[12];
  response[0] = first_byte;
  for (int i = 1; i < 12; i++) {
     while (app_uart_get(&first_byte) != NRF_SUCCESS) {}
     printf("%x,", first_byte);
     response[i] = first_byte;
  }
  NRF_LOG_INFO("Got all 12 bytes.\n");
  
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