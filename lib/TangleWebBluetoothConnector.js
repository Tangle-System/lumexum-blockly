// npm install --save-dev @types/web-bluetooth
/// <reference types="web-bluetooth" />
/// <reference path="TangleConnector.js" />
/// <reference path="TnglReader.js" />

"use strict";


// ! od 0.8.0 maji vsechny tangle enabled BLE zarizeni jednotne TANGLE_DEVICE_UUID.
// ! kazdy typ (produkt) Tangle Zarizeni ma svuj kod v manufacturer data
// ! verze FW lze získat také z manufacturer data
// Tangle network se může propojit pouze když všechny zařízení mají stejny FW.

// xxConnection.js si drží state připojení, reconnectuje, udržuje fyzicky komunikaci vždy pouze s
// jedním zařízením v jednu chvíli

//////////////////////////////////////////////////////////////////////////

// Deffered object
class Command {

  static TYPE_DELIVER = 1; // deliver makes sure message was received (TCP style)
  static TYPE_TRANSMIT = 2; // transmit is fire and forget (UDP style)
  static TYPE_REQUEST = 3; // request requests data from firmware ("HTTP style")
  static TYPE_CONFIGURE = 4; // configure configures the device and reads its response ("HTTP style")

  constructor(type, payload, label) {
    this.type = type;
    this.payload = payload;
    this.label = label;
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

/*
    is renamed Transmitter 
*/
class WebBLEConnection extends TangleConnectorFlags {
  // private fields
  #service;
  #terminalChar;
  #clockChar;
  #deviceChar;
  #writing;
  #queue;
  #eventEmitter;
  #uuidCounter;

  constructor() {
    super();

    /*
      BLE Tangle Service
    */
    this.#service = /** @type {BluetoothRemoteGATTService} */ (null);

    /*  
      Terminal Characteristics governs the communication with the Tangle Netwok.
      That means tngl uploads, timeline manipulation, event emitting...
      You can access it only if you are authenticated via the Device Characteristics
    */
    this.#terminalChar = /** @type {BluetoothRemoteGATTCharacteristic} */ (null); // ? only accesable when connected to the mesh network

    /*  
      The whole purpuse of clock characteristics is to synchronize clock time
      of the application with the Tangle network
    */
    this.#clockChar = /** @type {BluetoothRemoteGATTCharacteristic} */ (null); // ? always accesable

    /*  
      Device Characteristics is renamed Update Characteristics
      Device Characteristics handles ALL CONCEPTS WITH THE 
      PHYSICAL CONNECTED DEVICE. On the other hand Terminal Characteristics 
      handles concepts connected with the whole tangle network - all devices 
      With Device Charactristics you can upload FW to the single device, 
      access and manipulate json config of the device, adopt device, 
      and authenticate the application client with the tangle network
    */
    this.#deviceChar = /** @type {BluetoothRemoteGATTCharacteristic} */ (null);

    /*
      simple mutex indicating that communication over BLE is in progress
    */
    this.#writing = false;

    /*
      queue of commands (deliver, transmit, request, configure) to be proccessed
    */
    this.#queue = /** @type {Command[]} */ ([]);

    this.#eventEmitter = createNanoEvents();
    this.#uuidCounter = 0;

    window.onbeforeunload = (e) => {
      if (!e) e = window.event;

      if (this.#writing) {
        e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = "Právě probíhá update připojeného zařízení, neopouštějte tuto stránku.";
        window.confirm("Právě probíhá update připojeného zařízení, neopouštějte tuto stránku.");
      }
    };
  }

  #getUUID() {
    // valid UUIDs are in range [1..4294967295] (32 bit number)
    if (this.#uuidCounter >= 4294967295) {
      this.#uuidCounter = 0;
    }

    return ++this.#uuidCounter;
  }

  attach(service, terminalUUID, clockUUID, deviceUUID) {
    this.#service = service;

    console.log("> Getting Terminal Characteristics...");
    return this.#service
      .getCharacteristic(terminalUUID)
      .then((characteristic) => {
        this.#terminalChar = characteristic;
        return this.#terminalChar.startNotifications();
      })
      .then(() => {
        console.log("> Terminal notifications started");
        this.#terminalChar.addEventListener("characteristicvaluechanged", this.#onTerminalNotification);
      })
      .catch((e) => {
        console.warn(e);
      })
      .then(() => {
        console.log("> Getting Clock Characteristics...");
        return this.#service.getCharacteristic(clockUUID);
      })
      .then((characteristic) => {
        this.#clockChar = characteristic;
      })
      .catch((e) => {
        console.warn(e);
      })
      .then(() => {
        console.log("> Getting Device Characteristics...");
        return this.#service.getCharacteristic(deviceUUID);
      })
      .then((characteristic) => {
        this.#deviceChar = characteristic;
      })
      .catch((e) => {
        console.warn(e);
      })
      .then(() => {
        this.#process(); // kick off transfering thread if there are commands in queue
      });
  }

  #writeBytes(characteristic, bytes, response) {
    const write_uuid = this.#getUUID(); // two messages za sebou nesmi mit stejne UUID!
    const packet_header_size = 12; // 3x 4byte integers: write_uuid, index_from, payload.length
    const packet_size = detectAndroid() ? 212 : 512; // min size packet_header_size + 1 !!!! ANDROID NEEDS PACKET SIZE <= 212!!!!
    const bytes_size = packet_size - packet_header_size;

    if (response) {
      return new Promise(async (resolve, reject) => {
        let index_from = 0;
        let index_to = bytes_size;

        while (index_from < bytes.length) {
          if (index_to > bytes.length) {
            index_to = bytes.length;
          }

          const payload = [...toBytes(write_uuid, 4), ...toBytes(index_from, 4), ...toBytes(bytes.length, 4), ...bytes.slice(index_from, index_to)];

          await characteristic.writeValueWithResponse(new Uint8Array(payload)).catch((e) => {
            console.warn(e);
            reject(e);
            return;
          });

          index_from += bytes_size;
          index_to = index_from + bytes_size;
        }
        resolve();
        return;
      });
    } else {
      if (bytes.length > bytes_size) {
        console.error("The maximum bytes that can be written without response is " + bytes_size);
        return Promise.reject("WriteError");
      }
      const payload = [...toBytes(write_uuid, 4), ...toBytes(0, 4), ...toBytes(bytes.length, 4), ...bytes.slice(0, bytes.length)];
      return characteristic.writeValueWithoutResponse(new Uint8Array(payload));
    }
  }

  #readBytes(characteristic) {
    // read the requested value
    return characteristic.readValue();
  }

  // enqueues command into the communation queue
  #process(command) {
    let result = null;

    if (command) {
      result = command.promise;

      // there must only by one command in the queue with given label
      // this is used to send only the most recent command.
      // for example events
      // so if there is a command with that label, then remove it and
      // push this command to the end of the queue
      if (command.label) {
        for (let i = 0; i < this.#queue.length; i++) {
          if (this.#queue[i].label === command.label) {
            this.#queue[i].resolve();
            this.#queue.splice(i, 1);
            break;
          }
        }
      }

      this.#queue.push(command);
    }

    if (!this.#writing) {
      this.#writing = true;

      // spawn async function to handle the transmittion one command at the time
      (async () => {
        while (this.#queue.length > 0) {
          //let timestamp = Date.now();

          let command = this.#queue.shift();

          switch (command.type) {
            case Command.TYPE_DELIVER:
              await this.#writeBytes(this.#terminalChar, command.payload, true)
                .then(() => {
                  command.resolve();
                })
                .catch((error) => {
                  //console.warn(error);
                  command.reject(error);
                });
              break;

            case Command.TYPE_TRANSMIT:
              await this.#writeBytes(this.#terminalChar, command.payload, false)
                .then(() => {
                  command.resolve();
                })
                .catch((error) => {
                  //console.warn(error);
                  command.reject(error);
                });
              break;

            case Command.TYPE_REQUEST:
              await this.#writeBytes(this.#terminalChar, command.payload, true)
                .then(() => {
                  return this.#readBytes(this.#terminalChar);
                })
                .then((data) => {
                  command.resolve(data);
                })
                .catch((error) => {
                  //console.warn(error);
                  command.reject(error);
                });
              break;

            case Command.TYPE_CONFIGURE:
              await this.#writeBytes(this.#deviceChar, command.payload, true)
                .then(() => {
                  return this.#readBytes(this.#deviceChar);
                })
                .then((data) => {
                  command.resolve(data);
                })
                .catch((error) => {
                  //console.warn(error);
                  command.reject(error);
                });
              break;

            default:
              break;
          }

          //let duration = Date.now() - timestamp;
          //console.log("Wrote " + command.payload.length + " bytes in " + duration + " ms (" + command.payload.length / (duration / 1000) / 1024 + " kBps)");
        }
        this.#writing = false;
      })();
    }

    return result;
  }

  // deliver() thansfers data reliably to the Bluetooth Device. It might not be instant.
  // It may even take ages to get to the device, but it will! (in theory)
  // returns promise that resolves when message is physically send, but you
  // dont need to wait for it to resolve, and spam deliver() as you please.
  // transmering queue will handle it
  deliver(command_data, command_label) {
    return this.#process(new Command(Command.TYPE_DELIVER, command_data, command_label));
  }

  // transmit() tryes to transmit data NOW. ASAP. It will fail,
  // if deliver or another transmit is being executed at the moment
  // returns promise that will be resolved when message is physically send (only transmittion, not receive)
  transmit(command_data, command_label) {
    if (!this.#writing) {
      return this.#process(new Command(Command.TYPE_TRANSMIT, command_data, command_label));
    } else {
      return Promise.reject("Communication in proccess");
    }
  }

  // request first writes the request to the Terminal Characteristics
  // and then reads the response also from the Terminal Characteristics
  request(command_data, command_label) {
    return this.#process(new Command(Command.TYPE_REQUEST, command_data, command_label));
  }

  // configure first writes the request to the Device Characteristics
  //and then reads the response also from the Device Characteristics
  configure(configuration_data, configuration_label) {
    return this.#process(new Command(Command.TYPE_CONFIGURE, configuration_data, configuration_label));
  }

  // write timestamp to clock characteristics as fast as possible
  writeClock(timestamp) {
    if (!this.#clockChar) {
      return Promise.reject("Sync characteristics is null");
    }

    if (!this.#writing) {
      this.#writing = true;

      const bytes = toBytes(timestamp, 4);
      return this.#clockChar.writeValueWithoutResponse(new Uint8Array(bytes)).finally(() => {
        this.#writing = false;
      });
    } else {
      return Promise.reject("Communication in proccess");
    }
  }

  // reads the current clock characteristics timestamp from the device
  // as fast as possible
  readClock() {
    if (!this.#clockChar) {
      return Promise.reject("Clock characteristics is null");
    }

    if (!this.#writing) {
      this.#writing = true;

      return this.#clockChar
        .readValue()
        .then((dataView) => {
          let reader = new TnglReader(dataView);
          return reader.readInt32();
        })
        .finally(() => {
          this.#writing = false;
        });
    } else {
      return Promise.reject("Communication in proccess");
    }
  }

  #writeFirmware(firmware) {
    return new Promise(async (resolve, reject) => {
      const chunk_size = detectAndroid() ? 1008 : 4992; // must be modulo 16

      let index_from = 0;
      let index_to = chunk_size;

      let written = 0;

      console.log("OTA UPDATE");

      console.log(firmware);

      {
        //===========// RESET //===========//
        console.log("OTA RESET");

        const bytes = [this.FLAG_OTA_RESET, 0x00, ...toBytes(0x00000000, 4)];
        await this.#writeBytes(this.#deviceChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });
      }

      await sleep(100);

      {
        //===========// BEGIN //===========//
        console.log("OTA BEGIN");

        const bytes = [this.FLAG_OTA_BEGIN, 0x00, ...toBytes(firmware.length, 4)];
        await this.#writeBytes(this.#deviceChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });
      }

      await sleep(10000);

      {
        //===========// WRITE //===========//
        console.log("OTA WRITE");

        const start_timestamp = new Date().getTime();

        while (written < firmware.length) {
          if (index_to > firmware.length) {
            index_to = firmware.length;
          }

          const bytes = [this.FLAG_OTA_WRITE, 0x00, ...toBytes(written, 4), ...firmware.slice(index_from, index_to)];

          await this.#writeBytes(this.#deviceChar, bytes, true).catch((e) => {
            console.error(e);
            reject(e);
            return;
          });

          written += index_to - index_from;

          this.#eventEmitter.emit("ota_status",  Math.floor((written * 10000) / firmware.length) / 100);

          index_from += chunk_size;
          index_to = index_from + chunk_size;
        }

        console.log("Firmware written in " + (new Date().getTime() - start_timestamp) / 1000 + " seconds");
      }

      await sleep(100);

      {
        //===========// END //===========//
        console.log("OTA END");

        const bytes = [this.FLAG_OTA_END, 0x00, ...toBytes(written, 4)];
        await this.#writeBytes(this.#deviceChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });
      }

      resolve();
      return;
    });
  }

  updateFirmware(firmware) {
    if (this.#writing) {
      return Promise.reject("Write currently in progress");
    }

    this.#writing = true;

    return this.#writeFirmware(firmware)
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.#writing = false;
      });
  }

  // updateConfig(config) {
  //   if (this.#writing) {
  //     return Promise.reject("Write currently in progress");
  //   }

  //   this.#writing = true;

  //   return this.#writeConfig(config)
  //     .catch((e) => {
  //       console.error(e);
  //     })
  //     .finally(() => {
  //       this.#writing = false;
  //     });
  // }

  deviceReboot() {
    const bytes = [this.FLAG_REBOOT, 0x00, ...toBytes(0x00000000, 4)];
    return this.#writeBytes(this.#deviceChar, bytes, true);
  }

  // resets the Communations, discarding command queue
  reset() {
    this.#service = null;
    this.#terminalChar = null;
    this.#clockChar = null;
    this.#deviceChar = null;
    this.#writing = false;

    for (let i = 0; i < this.#queue.length; i++) {
      this.#queue[i].reject();
    }
    this.#queue = [];
  }

  // WIP, event handling from tangle network to application
  // timeline changes from tangle network to application ...
  #onTerminalNotification(event) {

    /*
    if received command is 


    */

    // let value = event.target.value;
    // let a = [];
    // for (let i = 0; i < value.byteLength; i++) {
    //   a.push("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
    // }
    // console.log("> " + a.join(" "));
  }
}

/////////////////////////////////////////////////////////////////////////////////////

// Connector connects the application with one Tangle Device, that is then in a 
// position of a controller for other Tangle Devices
class TangleWebBluetoothConnector {
  #webBTDevice;
  #connection;
  #eventEmitter;
  #reconection;
  #criteria;

  constructor() {
    this.TANGLE_SERVICE_UUID = "cc540e31-80be-44af-b64a-5d2def886bf5";

    this.TERMINAL_CHAR_UUID = "33a0937e-0c61-41ea-b770-007ade2c79fa";
    this.CLOCK_CHAR_UUID = "7a1e0e3a-6b9b-49ef-b9b7-65c81b714a19";
    this.DEVICE_CHAR_UUID = "9ebe2e4b-10c7-4a81-ac83-49540d1135a5";

    this.#webBTDevice = null;
    this.#connection = new WebBLEConnection();
    this.#eventEmitter = createNanoEvents();
    this.#reconection = false;
    this.#criteria = {};

    window.addEventListener("beforeunload", this.disconnect);
  }

  isConnected() {
    return this.#webBTDevice && this.#webBTDevice.gatt.connected;
  }

  /**
   * @name addEventListener
   * events: "connected", "disconnected", "ota_status", "event"
   *
   * all events: event.target === the sender object (this)
   * event "disconnected": event.reason has a string with a disconnect reason
   *
   * @returns unbind function
   */
  addEventListener(event, callback) {
    return this.#eventEmitter.on(event, callback);
  }

  /*

criteria: pole objektu, kde plati: [{ tohle and tamto and toto } or { tohle and tamto }]

možnosti:
  name: string
  namePrefix: string
  fwVersion: string
  ownerSignature: string
  productCode: number

criteria example:
[
  // all Devices that are named "NARA Aplha", are on 0.7.2 fw and are
  // adopted by the owner with "baf2398ff5e6a7b8c9d097d54a9f865f" signature.
  // Product code is 1 what means NARA Alpha
  {
    name:"NARA Alpha" 
    fwVersion:"0.7.2"
    ownerSignature:"baf2398ff5e6a7b8c9d097d54a9f865f"
    productCode:1
  },
  // all the devices with the name starting with "NARA", without the 0.7.3 FW and 
  // that are not adopted by anyone
  // Product code is 2 what means NARA Beta 
  {
    namePrefix:"NARA"
    fwVersion:"!0.7.3"
    ownerSignature:"00000000000000000000000000000000"
    productCode:2
  }
]


*/

  // choose one Tangle device (user chooses which device to connect to via a popup)
  // if no criteria are set, then show all Tangle devices visible.
  // first bonds the BLE device with the PC/Phone/Tablet if it is needed.
  // Then selects the device
  userSelect(criteria) {
    //console.log("choose()");

    if (this.isConnected()) {
      return this.disconnect().then(() => {
        return this.userSelect(criteria);
      });
    }

    console.log(criteria);

    // store new criteria as a array
    if (criteria) {
      if (Array.isArray(criteria)) {
        this.#criteria = criteria;
      } else {
        this.#criteria = [criteria];
      }
    } else {
      this.#criteria = [];
    }

    /** @type {RequestDeviceOptions} */
    let web_ble_options = { filters: /** @type {BluetoothLEScanFilter[]} */ ([]) };

    if (this.#criteria.length == 0) {
      web_ble_options.filters.push({ services: [this.TANGLE_SERVICE_UUID] });
    }
    //
    else {
      for (let i = 0; i < this.#criteria.length; i++) {
        const criterium = this.#criteria[i];

        let filter = { services: [this.TANGLE_SERVICE_UUID] };
        //let filter = {};

        if (criterium.name) {
          filter.name = criterium.name;
        } else if (criterium.namePrefix) {
          filter.namePrefix = criterium.namePrefix;
        }

        // if any of these criteria are required, then we need to build a manufacturer data filter.
        if (criterium.fwVersion || criterium.ownerSignature || criterium.productCode) {
          const company_identifier = 0x02e5; // Bluetooth SIG company identifier if Espressif

          delete filter.services;

          let prefix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          let mask = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

          if (criterium.productCode) {
            if (criterium.productCode < 0 || criterium.productCode > 0xffff) {
              throw "invalid productCode";
            }

            const product_code_byte_offset = 2;
            const product_code_bytes = [criterium.productCode & 0xff, (criterium.productCode >> 8) & 0xff];

            for (let i = 0; i < 2; i++) {
              prefix[product_code_byte_offset + i] = product_code_bytes[i];
              mask[product_code_byte_offset + i] = 0xff;
            }
          }

          if (criterium.ownerSignature) {
            if (criterium.ownerSignature.length != 32) {
              throw "invalid ownerSignature";
            }

            const owner_signature_byte_offset = 4;
            const owner_signature_code_bytes = hexStringToUint8Array(criterium.ownerSignature);

            for (let i = 0; i < 16; i++) {
              prefix[owner_signature_byte_offset + i] = owner_signature_code_bytes[i];
              mask[owner_signature_byte_offset + i] = 0xff;
            }
          }

          if (criterium.fwVersion) {
            const fw_version_byte_offset = 0;
            const reg = criterium.fwVersion.match(/(!?)([\d]+).([\d]+).([\d]+)/);
            const version_code = reg[2] * 10000 + reg[3] * 100 + reg[4] * 1;
            const version_bytes = [version_code & 0xff, (version_code >> 8) & 0xff];

            if (reg[1] === "!") {
              // workaround for web bluetooth not having a filter for "if the manufacturer data are not this, then show me the device"
              // we will generate 16 filters, each filtering one of the 16 bits that is different from my version.
              // if the one bit is different, then the version of the found device is different than mine.
              // and thats what we need.

              filter.manufacturerData = [];

              for (let i = 0; i < 2; i++) {
                // version is defined as 2 bytes
                for (let j = 0; j < 8; j++) {
                  // each byte 8 bits

                  for (let k = 0; k < 2; k++) {
                    prefix[fw_version_byte_offset + k] = 0;
                    mask[fw_version_byte_offset + k] = 0;
                  }

                  prefix[fw_version_byte_offset + i] = ~(version_bytes[i] & (1 << j));
                  mask[fw_version_byte_offset + i] = 1 << j;

                  let filter_clone = JSON.parse(JSON.stringify(filter));
                  filter_clone.manufacturerData = [{ companyIdentifier: company_identifier, dataPrefix: new Uint8Array(prefix), mask: new Uint8Array(mask) }];
                  web_ble_options.filters.push(filter_clone);
                }
              }
            } else {
              for (let i = 0; i < 2; i++) {
                prefix[fw_version_byte_offset + i] = version_bytes[i];
                mask[fw_version_byte_offset + i] = 0xff;
              }
              filter.manufacturerData = [{ companyIdentifier: company_identifier, dataPrefix: new Uint8Array(prefix), mask: new Uint8Array(mask) }];
              web_ble_options.filters.push(filter);
            }
          } else {
            filter.manufacturerData = [{ companyIdentifier: company_identifier, dataPrefix: new Uint8Array(prefix), mask: new Uint8Array(mask) }];
            web_ble_options.filters.push(filter);
          }
        } else {
          web_ble_options.filters.push(filter);
        }
      }
    }

    console.log(web_ble_options.filters);

    return navigator.bluetooth.requestDevice(web_ble_options.filters.length != 0 ? web_ble_options : { acceptAllDevices: true }).then((device) => {
      console.log(device);

      this.#webBTDevice = device;
      this.#webBTDevice.addEventListener("gattserverdisconnected", this.#onDisconnected);
    });
  }

  // takes the criteria, scans for scan_period and automatically selects the device,
  // you can then connect to. This works only for BLE devices that are bond with the phone/PC/tablet
  // the app is running on OR doesnt need to be bonded in a special way.
  // if more devices are found matching the criteria, then the strongest signal wins
  // if no device is found within the timeout period, then it returns an error

  // if no criteria are provided, all Tangle enabled devices (with all different FWs and Owners and such)
  // are eligible.

  autoSelect(criteria, scan_period = 1000, timeout = 3000) {
    // step 1. for the scan_period scan the surroundings for BLE devices.
    // step 2. if some devices matching the criteria are found, then select the one with
    //         the greatest signal strength. If no device is found until the timeout,
    //         then return error

    if (this.isConnected()) {
      return this.disconnect().then(() => {
        return this.autoSelect(criteria);
      });
    }

    // web bluetooth cant really auto select bluetooth device. This is the closest you can get.
    if (this.#webBTDevice && JSON.stringify(criteria) === JSON.stringify(this.#criteria)) {
      return Promise.resolve();
    }

    // Web Bluetooth nepodporuje možnost automatické volby zařízení.
    // Proto je to tady implementováno totožně jako userSelect.

    return this.userSelect(criteria);
  }

  // connect Connector to the selected Tangle Device. Also can be used to reconnect.
  // Fails if no device is selected
  connect(attempts = 3) {
    this.#reconection = true;

    if (!this.#webBTDevice) {
      return Promise.reject("SelectionError");
    }

    if (this.#webBTDevice.gatt.connected) {
      console.log("> Bluetooth Device is already connected");
      return Promise.resolve();
    }

    if (attempts <= 0) {
      console.log("> Connect attempts have expired");
      return Promise.reject("ConnectionError");
    }

    console.log("> Connecting to Bluetooth device...");
    return this.#webBTDevice.gatt
      .connect()
      .then((server) => {
        this.#connection.reset();

        console.log("> Getting the Bluetooth Service...");
        return server.getPrimaryService(this.TANGLE_SERVICE_UUID);
      })
      .then((service) => {
        console.log("> Getting the Service Characteristic...");

        return this.#connection.attach(service, this.TERMINAL_CHAR_UUID, this.CLOCK_CHAR_UUID, this.DEVICE_CHAR_UUID);
      })
      .then(() => {
        console.log("> Bluetooth Device Connected");
        return this.#eventEmitter.emit("connected", { target: this });
      })
      .catch((error) => {
        console.warn(error.name);

        // If the device is far away, sometimes this "NetworkError" happends
        if (error.name == "NetworkError") {
          return sleep(1000).then(() => {
            if (this.#reconection) {
              return this.connect(attempts - 1);
            } else {
              return Promise.reject("ConnectionError");
            }
          });
        } else {
          throw error;
        }
      });
  }

  // disconnect Connector from the connected Tangle Device. But keep it selected
  disconnect() {
    this.#reconection = false;

    if (!this.#webBTDevice) {
      return Promise.reject("SelectionError");
    }

    console.log("> Disconnecting from Bluetooth Device...");

    if (this.#webBTDevice.gatt.connected) {
      this.#webBTDevice.gatt.disconnect();
    } else {
      console.log("Bluetooth Device is already disconnected");
    }

    this.#connection.reset();

    return Promise.resolve();
  }

  // when the device is disconnected, the javascript Connector.js layer decides
  // if it should be revonnected. Here is implemented that it should be
  // reconnected only if the this.#reconection is true. The event handlers are fired
  // synchronously. So that only after all event handlers (one after the other) are done,
  // only then start this.connect() to reconnect to the bluetooth device
  #onDisconnected = (event) => {
    console.log("> Bluetooth Device disconnected");
    return this.#eventEmitter.emit("disconnected", { target: this }).then(() => {
      if (this.#reconection) {
        return this.connect();
      }
    });
  };

  // deliver handles the communication with the Tangle network in a way
  // that the command is guaranteed to arrive
  deliver(command_payload, command_label) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.#connection.deliver(command_payload, command_label);
  }

  // transmit handles the communication with the Tangle network in a way
  // that the command is NOT guaranteed to arrive
  transmit(command_payload, command_label) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.#connection.transmit(command_payload, command_label);
  }

  // request handles the requests on the Tangle network. The command request
  // is guaranteed to get a response
  request(command_payload, command_label) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.#connection.request(command_payload, command_label);
  }

  // configure processes data meant for the physical device that
  // the Connector is connected to. Is used to write config, id,
  // read battery status,
  configure(configuration_payload, configuration_label) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.#connection.configure(configuration_payload, configuration_label);
  }

  // synchronizes the device internal clock with the provided TimeTrack clock
  // of the application as precisely as possible
  setClock(clock) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return new Promise(async (resolve, reject) => {
      for (let index = 0; index < 3; index++) {
        await sleep(1000);
        try {
          await this.#connection.writeClock(clock.millis());
          console.log("Clock write success");
          resolve();
          return;
        } catch (e) {
          console.warn("Clock write failed");
        }
      }

      reject("Clock write failed");
      return;
    });
  }

  // returns a TimeTrack clock object that is synchronized with the internal clock
  // of the device as precisely as possible
  getClock() {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return new Promise(async (resolve, reject) => {
      for (let index = 0; index < 3; index++) {
        await sleep(1000);
        try {
          const timestamp = await this.#connection.readClock();
          console.log("Clock read success:", timestamp);
          resolve(new TimeTrack(timestamp));
          return;
        } catch (e) {
          console.warn("Clock read failed:", e);
        }
      }

      reject("Clock read failed");
      return;
    });
  }

  // handles the firmware updating. Sends "ota_status" events
  // to all handlers
  updateFirmware(firmware) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.#connection.updateFirmware(firmware);
  }
}
