class TangleConnectorFlags {
  constructor() {
    this.FLAG_OTA_BEGIN = 255;
    this.FLAG_OTA_WRITE = 0;
    this.FLAG_OTA_END = 254;
    this.FLAG_OTA_RESET = 253;

    this.FLAG_CONFIG_BEGIN = 1;
    this.FLAG_CONFIG_WRITE = 2;
    this.FLAG_CONFIG_END = 3;
    this.FLAG_CONFIG_RESET = 4;
    this.FLAG_REBOOT = 5;
    //this.FLAG_RESTART = 6;
    //this.FLAG_ABORT = 7;
  }
}
