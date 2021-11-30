// npm install --save-dev @types/web-bluetooth
/// <reference types="web-bluetooth" />
/// <reference path="TangleConnector.js" />
/// <reference path="TnglReader.js" />

"use strict";

//////////////////////////////////////////////////////////////////////////

// Deffered object
class Command {
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

class Transmitter extends TangleConnectorFlags {
  // private fields
  #service;
  #terminalChar;
  #clockChar;
  #updateChar;
  #writing;
  #queue;
  #uuidCounter;

  constructor() {
    super();

    this.TRANSFER_TYPE_DELIVER = 1; // deliver makes sure message was received
    this.TRANSFER_TYPE_TRANSMIT = 2; // transmit is wire and forget
    this.TRANSFER_TYPE_REQUEST = 3; // request requests data from firmware

    this.#service = null;
    this.#terminalChar = null; // ? only accesable when connected to the mesh network
    this.#clockChar = null; // ? always accesable
    this.#updateChar = null; // ? only accesable when adopting
    this.#writing = false;
    this.#queue = [];
    this.#uuidCounter = 0;
  }

  // valid UUIDs are in range [1..4294967295] (32 bit number)
  #getUUID() {
    if (this.#uuidCounter >= 4294967295) {
      this.#uuidCounter = 0;
    }

    return ++this.#uuidCounter;
  }

  attach(service, terminalUUID, clockUUID, updateUUID) {
    this.#service = service;

    console.log("> Getting Terminal Characteristics...");
    return (
      this.#service
        .getCharacteristic(terminalUUID)
        .then((characteristic) => {
          this.#terminalChar = characteristic;
          //return this.#terminalChar.startNotifications();
        })
        // .then(() => {
        //   console.log("> Terminal notifications started");
        //   this.#terminalChar.addEventListener("characteristicvaluechanged", this.#onTerminalNotification);
        // })
        .catch((e) => {
          console.warn(e);
        })
        .then(() => {
          console.log("> Getting Clock Characteristics...");
          return this.#service.getCharacteristic(clockUUID);
        })
        .then((characteristic) => {
          this.#clockChar = characteristic;
          //return this.#clockChar.startNotifications();
        })
        // .then(() => {
        //   console.log("> Clock notifications started");
        //   this.#clockChar.addEventListener("characteristicvaluechanged", this.#onSyncNotification);
        // })
        .catch((e) => {
          console.warn(e);
        })
        .then(() => {
          console.log("> Getting Update Characteristics...");
          return this.#service.getCharacteristic(updateUUID);
        })
        .then((characteristic) => {
          this.#updateChar = characteristic;
        })
        .catch((e) => {
          console.warn(e);
        })
        .then(() => {
          this.#process(); // kick off transfering thread if there are commands in queue
        })
    );
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
        return Promise.reject("The maximum bytes that can be written without response is " + bytes_size);
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

          try {
            switch (command.type) {
              case this.TRANSFER_TYPE_DELIVER:
                await this.#writeBytes(this.#terminalChar, command.payload, true).then(() => {
                  command.resolve();
                });
                break;

              case this.TRANSFER_TYPE_TRANSMIT:
                await this.#writeBytes(this.#terminalChar, command.payload, false).then(() => {
                  command.resolve();
                });
                break;

              case this.TRANSFER_TYPE_REQUEST:
                await this.#writeBytes(this.#terminalChar, command.payload, true)
                  .then(() => {
                    return this.#readBytes(this.#terminalChar);
                  })
                  .then((data) => {
                    command.resolve(data);
                  });
                break;

              default:
                break;
            }
          } catch (error) {
            console.warn(error);

            // // if writing characteristic fail, then stop transmitting
            // // but keep data to transmit in queue
            // this.#queue.unshift(command);
            // this.#writing = false;

            command.reject(error);
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
    return this.#process(new Command(this.TRANSFER_TYPE_DELIVER, command_data, command_label));
  }

  // transmit() tryes to transmit data NOW. ASAP. It will fail,
  // if deliver or another transmit is being executed at the moment
  // returns promise that will be resolved when message is physically send (only transmittion, not receive)
  transmit(command_data) {
    if (!this.#writing) {
      return this.#process(new Command(this.TRANSFER_TYPE_TRANSMIT, command_data, null));
    } else {
      return Promise.reject("Communication in proccess");
    }
  }

  request(command_data, command_label) {
    return this.#process(new Command(this.TRANSFER_TYPE_REQUEST, command_data, command_label));
  }

  // #writeSync(time_delta) {

  //   const bytes = [...toBytes(time_delta, 4)];
  //   return this.#clockChar.writeValueWithResponse(new Uint8Array(bytes));

  //   // return new Promise(async (resolve, reject) => {
  //   //   let success = true;

  //   //   try {
  //   //     const bytes = [...toBytes(timestamp, 4)];
  //   //     await this.#clockChar.writeValueWithoutResponse(new Uint8Array(bytes)).catch((e) => {
  //   //       console.warn(e);
  //   //       success = false;
  //   //     });
  //   //     await this.#clockChar.writeValueWithoutResponse(new Uint8Array([])).catch((e) => {
  //   //       console.warn(e);
  //   //       success = false;
  //   //     });

  //   //     if (success) {
  //   //       resolve();
  //   //       return;
  //   //     } else {
  //   //       reject();
  //   //       return;
  //   //     }
  //   //   } catch (e) {
  //   //     console.error(e);
  //   //     reject();
  //   //     return;
  //   //   }
  //   // });
  // };

  // writeSync() synchronizes the device clock
  writeClock(timestamp) {
    //console.log("sync(" + time_delta +")");

    if (!this.#clockChar) {
      Promise.reject("Sync characteristics is null");
    }

    if (!this.#writing) {
      this.#writing = true;

      const bytes = toBytes(timestamp, 4);
      return this.#clockChar.writeValueWithoutResponse(new Uint8Array(bytes)).finally(() => {
        this.#writing = false;
      });
    } else {
      Promise.reject("Communication in proccess");
    }
  }

  // readSync() synchronizes the device clock

  readClock() {
    //console.log("sync(" + timestamp +")");

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
        await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
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
        await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
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

          await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
            console.error(e);
            reject(e);
            return;
          });

          written += index_to - index_from;

          console.log(Math.floor((written * 10000) / firmware.length) / 100 + "%");

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
        await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });
      }

      resolve();
      return;
    });
  }

  #writeConfig(config) {
    return new Promise(async (resolve, reject) => {
      let written = 0;

      console.log("CONFIG UPDATE");
      console.log(config);

      console.log(this.#updateChar);

      {
        //===========// RESET //===========//
        console.log("CONFIG RESET");

        const bytes = [this.FLAG_CONFIG_RESET, 0x00, ...toBytes(0x00000000, 4)];
        await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });
      }

      await sleep(100);

      {
        //===========// BEGIN //===========//
        console.log("CONFIG BEGIN");

        const bytes = [this.FLAG_CONFIG_BEGIN, 0x00, ...toBytes(config.length, 4)];
        await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });
      }

      await sleep(100);

      const start_timestamp = new Date().getTime();

      {
        //===========// WRITE //===========//
        console.log("CONFIG WRITE");

        const bytes = [this.FLAG_CONFIG_WRITE, 0x00, ...toBytes(written, 4), ...config];
        await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });

        written += config.length;
      }

      const end_timestamp = new Date().getTime();

      console.log("Config written in " + (end_timestamp - start_timestamp) / 1000 + " seconds");

      await sleep(100);

      {
        //===========// END //===========//
        console.log("CONFIG END");

        const bytes = [this.FLAG_CONFIG_END, 0x00, ...toBytes(written, 4)];
        await this.#writeBytes(this.#updateChar, bytes, true).catch((e) => {
          console.error(e);
          reject(e);
          return;
        });
      }

      resolve();
      return;
    });
  }

  // sync() synchronizes the device clock
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

  // sync() synchronizes the device clock
  updateConfig(config) {
    if (this.#writing) {
      return Promise.reject("Write currently in progress");
    }

    this.#writing = true;

    return this.#writeConfig(config)
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.#writing = false;
      });
  }

  // sync() synchronizes the device clock
  deviceReboot() {
    const bytes = [this.FLAG_REBOOT, 0x00, ...toBytes(0x00000000, 4)];
    return this.#writeBytes(this.#updateChar, bytes, true);
  }

  // resets the transmitter, leaving send queue intact
  reset() {
    this.#service = null;
    this.#terminalChar = null;
    this.#clockChar = null;
    this.#updateChar = null;
    this.#writing = false;

    for (let i = 0; i < this.#queue.length; i++) {
      this.#queue[i].reject();
    }
    this.#queue = [];
  }

  // #onTerminalNotification(event) {
  //   let value = event.target.value;
  //   let a = [];
  //   for (let i = 0; i < value.byteLength; i++) {
  //     a.push("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
  //   }
  //   console.log("> " + a.join(" "));
  // };

  // #onSyncNotification(event) {
  //   let value = event.target.value;
  //   let a = [];
  //   for (let i = 0; i < value.byteLength; i++) {
  //     a.push("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
  //   }
  //   console.log("> " + a.join(" "));
  // };
}

/////////////////////////////////////////////////////////////////////////////////////

// Tangle Bluetooth Device
class TangleWebBluetoothConnector {
  #eventEmitter;
  #reconection;
  #criteria;

  constructor() {
    this.TANGLE_SERVICE_UUID = "cc540e31-80be-44af-b64a-5d2def886bf5";

    this.TERMINAL_CHAR_UUID = "33a0937e-0c61-41ea-b770-007ade2c79fa";
    this.CLOCK_CHAR_UUID = "7a1e0e3a-6b9b-49ef-b9b7-65c81b714a19";
    this.UPDATE_CHAR_UUID = "9ebe2e4b-10c7-4a81-ac83-49540d1135a5";

    this.webBTDevice = null;
    this.transmitter = new Transmitter();
    this.#eventEmitter = createNanoEvents();
    this.#reconection = false;
    this.#criteria = {};

    window.addEventListener("beforeunload", this.disconnect);
  }

  isConnected() {
    return this.webBTDevice && this.webBTDevice.gatt.connected;
  }

  /**
   * @name addEventListener
   * events: "connected", "disconnected"
   *
   * all events: event.target === the sender object (this)
   * event "disconnected": event.reason has a string with a disconnect reason
   *
   * @returns unbind function
   */
  addEventListener(event, callback) {
    return this.#eventEmitter.on(event, callback);
  }

  // choose() - prvně provede párovací proces, pokud je potřeba. Pak provede adoptovací proces, kdy
  // ukaze popup se jmena vsech zarizeni, ktere jsou v parovacim režimu. Uzivatel si pak klikutím
  // jedno z nich vybere a to se pak zadoptuje.
  //
  // returns json s mac adresou a klicem zarizeni
  // zaroven se sparuje s BLE zarizenim a ulozi si ho spolecne
  // zavolej po zmacknuti adopt tlacitka na zarizeni

  // xxConnection.js si drží state připojení, reconnectuje, udržuje fyzicky komunikaci vždy pouze s
  // jedním zařízením v jednu chvíli

  /*

criteria:

{
  name:"NARA Alpha"
  namePrefix:"NARA"
  fwVersion:"0.7.2"
  ownerSignature:"baf2398ff5e6a7b8c9d097d54a9f865f"
  productCode:1
}

returns Promise
resolve pokud je pripoji k vybranemu zarizeni z popupu
reject pokud se spojení nepodaří

*/

  // choose one device (user chooses which device to connect to via a popup)
  userSelect(criteria) {
    //console.log("choose()");

    if (this.webBTDevice && this.webBTDevice.gatt.connected) {
      this.disconnect();
    }

    // store new criteria
    if (criteria) {
      this.#criteria = criteria;
    }

    /** @type {RequestDeviceOptions} */
    let web_ble_options = { filters: /** @type {BluetoothLEScanFilter[]} */ ([{ services: [this.TANGLE_SERVICE_UUID] }]) };

    if (this.#criteria.name) {
      web_ble_options.filters.push({ name: this.#criteria.name });
    } else if (this.#criteria.namePrefix) {
      web_ble_options.filters.push({ namePrefix: this.#criteria.namePrefix });
    }

    // if any of these criteria are required, then we need to build a manufacturer data filter.
    if (this.#criteria.fwVersion || this.#criteria.ownerSignature || this.#criteria.productCode) {
      const company_identifier = 741; // Bluetooth SIG company identifier if Espressif

      let prefix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let mask = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      if (this.#criteria.productCode) {
        if (this.#criteria.productCode < 0 || this.#criteria.productCode > 0xffff) {
          throw "invalid productCode";
        }

        const product_code_byte_offset = 2;
        const product_code_bytes = [this.#criteria.productCode & 0xff, (this.#criteria.productCode >> 8) & 0xff];

        for (let i = 0; i < 2; i++) {
          prefix[product_code_byte_offset + i] = product_code_bytes[i];
          mask[product_code_byte_offset + i] = 0xff;
        }
      }

      if (this.#criteria.ownerSignature) {
        if (this.#criteria.ownerSignature.length != 32) {
          throw "invalid ownerSignature";
        }

        const owner_signature_byte_offset = 4;
        const owner_signature_code_bytes = hexStringToUint8Array(this.#criteria.ownerSignature);

        for (let i = 0; i < 16; i++) {
          prefix[owner_signature_byte_offset + i] = owner_signature_code_bytes[i];
          mask[owner_signature_byte_offset + i] = 0xff;
        }
      }

      if (this.#criteria.fwVersion) {
        const fw_version_byte_offset = 0;
        const reg = this.#criteria.fwVersion.match(/(!?)([\d]+).([\d]+).([\d]+)/);
        const version_code = reg[2] * 10000 + reg[3] * 100 + reg[4] * 1;
        const version_bytes = [version_code & 0xff, (version_code >> 8) & 0xff];

        if (reg[1] === "!") {
          // workaround for web bluetooth not having a filter for "if the manufacturer data are not this, then show me the device"
          // we will generate 16 filter, each filtering one of the 16 bits that is different from my version.
          // if the one bit is different, then the version of the found device is different than mine.
          // and thats what we need.
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

              web_ble_options.filters.push({ manufacturerData: [{ companyIdentifier: company_identifier, dataPrefix: new Uint8Array(prefix), mask: new Uint8Array(mask) }] });
            }
          }
        } else {
          for (let i = 0; i < 2; i++) {
            prefix[fw_version_byte_offset + i] = version_bytes[i];
            mask[fw_version_byte_offset + i] = 0xff;
          }

          web_ble_options.filters.push({ manufacturerData: [{ companyIdentifier: company_identifier, dataPrefix: new Uint8Array(prefix), mask: new Uint8Array(mask) }] });
        }
      } else {
        web_ble_options.filters.push({ manufacturerData: [{ companyIdentifier: company_identifier, dataPrefix: new Uint8Array(prefix), mask: new Uint8Array(mask) }] });
      }
    }

    console.log(web_ble_options.filters);

    return navigator.bluetooth.requestDevice(web_ble_options.filters.length != 0 ? web_ble_options : { acceptAllDevices: true }).then((device) => {
      console.log(device);

      this.webBTDevice = device;
      this.webBTDevice.addEventListener("gattserverdisconnected", this.#onDisconnected);
    });
  }

  /*

  // jakmile mam adoptovane lampy, zavolam 

{
  "name":"NARA Alpha"
  "prefix":"NARA"
  "fw":"0.7.2"
  "owner":"baf2398ff5e6a7b8c9d097d54a9f865f"
  "product":"NARA"
}

  // vyhledaji se vsechny devices v okoli s Tangle FW UUID (UUID je jednotné, verze FW je v ) 

  returns Promise
  resolve pokud se pripoji k nejakemu zarizezi podle kriterií v daném timeoutu
  reject pokud se spojení nepodaří

*/

  // ukaze

  // takes the criteria, scans for scan_period and automatically connects to a device
  // that is in the criteria and has the strongest signal
  // is no device is found within the timeout period, then it returns an error

  // if no criteria are provided, then last used criteria are used. Last criteria are NOT stored
  // in local storage, and are earased on the application restart

  // automatically connects to a device that is passing the criteria. If the device disconnects,
  // automatically tries to reconect to any device that is passing the criteria.

  autoSelect(criteria, scan_period = 1000, timeout = 3000) {
    //console.log("connect()");

    if (this.webBTDevice && this.webBTDevice.gatt.connected) {
      this.disconnect();
    }

    if (this.webBTDevice && JSON.stringify(criteria) === JSON.stringify(this.#criteria) ) {
      console.log("Selected the same device as before.");
      return Promise.resolve();
    }

    // store new criteria
    if (criteria) {
      this.#criteria = criteria;
    }

    // problem

    // ! jednotne TANGLE_DEVICE_UUID
    // ! kazdy typ Tangle Zarizeni ma svuj kod v manufacturer data
    // verzi FW se dozvim pri TNGL FW version requestu. Abych mohl zjistovat FW cele site

    // mam ulozene vsechny devices, ke kterým jsem se driv pripojoval
    // zceknu jestli tyhle devices advertisuji muj owner_key
    // vyberu ze zarizeni, co maji muj owner_key zarizeni s nejvetsim signalem
    // a k nemu se pripojim.

    // if nenaleznu zarizenu ze seznamu, pak vrati chybu "zarizeni nejsou sparovana".

    // pod timto user key mam ulozene tyhle device ids

    // Web Bluetooth nepodporuje možnost automatické volby zařízení.

    return this.userSelect(criteria);
  }

  // reconnects to the last

  // reconnect() {
  //   //console.log("reconnect()");
  //   console.log("> Reconnecting Bluetooth device...");

  //   if (this.#reconection) {
  //     return this.connect();
  //   } else {
  //     return Promise.reject("Reconnection disabled. Connect again with connect()");
  //   }
  // }

  connect(attempts) {
    if (!this.webBTDevice) {
      return Promise.reject("SelectionError");
    }

    this.#reconection = true;

    if (this.webBTDevice.gatt.connected) {
      console.log("> Bluetooth Device is already connected");
      return Promise.resolve();
    }

    if (attempts <= 0) {
      console.log("> Connect attempts have expired");
      return Promise.reject("ConnectionError");
    }

    console.log("> Connecting to Bluetooth device...");
    return this.webBTDevice.gatt
      .connect()
      .then((server) => {
        this.transmitter.reset();

        console.log("> Getting the Bluetooth Service...");
        return server.getPrimaryService(this.TANGLE_SERVICE_UUID);
      })
      .then((service) => {
        console.log("> Getting the Service Characteristic...");

        return this.transmitter.attach(service, this.TERMINAL_CHAR_UUID, this.CLOCK_CHAR_UUID, this.UPDATE_CHAR_UUID);
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

  disconnect() {
    //console.log("disconnect()");

    this.#reconection = false;

    if (!this.webBTDevice) {
      return Promise.reject("SelectionError");
    }

    console.log("> Disconnecting from Bluetooth Device...");

    if (this.webBTDevice.gatt.connected) {
      this.webBTDevice.gatt.disconnect();
    } else {
      console.log("Bluetooth Device is already disconnected");
    }

    this.transmitter.reset();

    return Promise.resolve();
  }

  #onDisconnected = (event) => {
    console.log("> Bluetooth Device disconnected");
    return this.#eventEmitter.emit("disconnected", { target: this }).then(() => {
      if (this.#reconection) {
        return this.connect();
      }
    });
  };

  // // Object event.target is Bluetooth Device getting disconnected.
  // #onDisconnected = (e) => {
  //   //console.log("> Bluetooth Device disconnected");

  //   console.log(this);

  //   // let self = e.target.tangleBluetoothConnectionReference;
  //   this.#eventEmitter.emit("disconnected", { target: this });
  // }

  // reset() {
  //   console.log("> Reseting connection...");

  //   this.disconnect();

  //   this.webBTDevice = null;
  //   this.transmitter.reset();
  // }

  deliver(command_payload, command_label) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.transmitter.deliver(command_payload, command_label);
  }

  transmit(command_payload) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.transmitter.transmit(command_payload);
  }

  request(command_payload, command_label) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.transmitter.request(command_payload, command_label);
  }

  setClock(clock) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return new Promise(async (resolve, reject) => {
      for (let index = 0; index < 3; index++) {
        await sleep(1000);
        try {
          await this.transmitter.writeClock(clock.millis());
          console.log("Clock write success");
          resolve();
          return;
        } catch (e) {
          console.warn("Clock write failed");
        }
      }

      reject("Clock write failed");
    });
  }

  getClock() {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return new Promise(async (resolve, reject) => {
      for (let index = 0; index < 3; index++) {
        await sleep(1000);
        try {
          const timestamp = await this.transmitter.readClock();
          console.log("Clock read success:", timestamp);
          resolve(new TimeTrack(timestamp));
          return;
        } catch (e) {
          console.warn("Clock read failed:", e);
        }
      }

      reject("Clock read failed");
    });
  }

  updateFirmware(firmware) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.transmitter.updateFirmware(firmware);
  }

  updateConfig(config) {
    if (!this.isConnected()) {
      return Promise.reject("Bluetooth device disconnected");
    }

    return this.transmitter.updateConfig(config);
  }

  // deviceReboot() {
  //   if (!this.isConnected()) {
  //     return Promise.reject("Bluetooth device disconnected");
  //   }

  //   return this.transmitter.deviceReboot();
  // }
}
