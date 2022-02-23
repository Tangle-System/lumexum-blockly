"use strict";

//////////////////////////////////////////////////////////////////////////

function Transmitter() {
  this.TERMINAL_CHAR_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";
  this.SYNC_CHAR_UUID = "0000ffe2-0000-1000-8000-00805f9b34fb";
  this.UPDATE_CHAR_UUID = "9ebe2e4b-10c7-4a81-ac83-49540d1135a5";

  this._service = null;
  this._terminalChar = null;
  this._syncChar = null;
  this._updateChar = null;
  this._writing = false;
  this._queue = [];
}

Transmitter.prototype.attach = function (service) {
  this._service = service;

  return this._service
    .getCharacteristic(this.TERMINAL_CHAR_UUID)
    .catch((e) => {
      console.warn(e);
    })
    .then((characteristic) => {
      this._terminalChar = characteristic;
      return this._service.getCharacteristic(this.SYNC_CHAR_UUID);
    })
    .catch((e) => {
      console.warn(e);
    })
    .then((characteristic) => {
      this._syncChar = characteristic;
      return this._service.getCharacteristic(this.UPDATE_CHAR_UUID);
    })
    .catch((e) => {
      console.warn(e);
    })
    .then((characteristic) => {
      this._updateChar = characteristic;
      this.deliver(); // kick off transfering thread if there are item in queue
    })
    .catch((e) => {
      console.warn(e);
    });
};

// Transmitter.prototype.disconnect = function () {
//   this._service = null;
//   this._terminalChar = null;
//   this._syncChar = null;
// };

Transmitter.prototype._writeTerminal = function (payload, response) {
  //console.log("_writeTerminal()");

  return new Promise(async (resolve, reject) => {
    const payload_uuid = parseInt(new Date().getTime() & 0xffffffff);
    const packet_header_size = 12; // 3x 4byte integers: payload_uuid, index_from, payload.length
    const packet_size = detectAndroid() ? 212 : 512; // min size packet_header_size + 1
    const bytes_size = packet_size - packet_header_size;

    let index_from = 0;
    let index_to = bytes_size;

    let error = null;

    while (index_from < payload.length) {
      if (index_to > payload.length) {
        index_to = payload.length;
      }

      const bytes = [...toBytes(payload_uuid, 4), ...toBytes(index_from, 4), ...toBytes(payload.length, 4), ...payload.slice(index_from, index_to)];

      try {
        if (response) {
          await this._terminalChar.writeValueWithResponse(new Uint8Array(bytes));
        } else {
          await this._terminalChar.writeValueWithoutResponse(new Uint8Array(bytes));
        }
      } catch (e) {
        reject(e);
        return;
      }

      index_from += bytes_size;
      index_to = index_from + bytes_size;
    }

    resolve();
    return;
  });
};

// deliver() thansfers data reliably to the Bluetooth Device. It might not be instant.
// It may even take ages to get to the device, but it will! (in theory)
Transmitter.prototype.deliver = function (data) {
  //console.log("deliver()");

  if (data) {
    this._queue.push({ payload: data, reliable: true });
  }

  if (!this._writing) {
    this._writing = true;

    // spawn async function to handle the transmittion one payload at the time
    (async () => {
      while (this._queue.length > 0) {
        //let timestamp = Date.now();

        let item = this._queue.shift();

        try {
          await this._writeTerminal(item.payload, item.reliable);
        } catch (error) {
          console.warn(error);
          //console.warn("write to the characteristics was unsuccessful");

          // if writing characteristic fail, then stop transmitting
          // but keep data to transmit in queue
          if (item.reliable) this._queue.unshift(item);
          this._writing = false;

          return;
        }

        //let duration = Date.now() - timestamp;
        //console.log("Wrote " + item.payload.length + " bytes in " + duration + " ms (" + item.payload.length / (duration / 1000) / 1024 + " kBps)");
      }
      this._writing = false;
    })();
  }
};

// transmit() tryes to transmit data NOW. ASAP. It will fail,
// if deliver or another transmit is being executed at the moment
// returns true if transmittion (only transmittion, not receive) was successful
Transmitter.prototype.transmit = function (data) {
  //console.log("transmit()");

  if (!data) {
    return true;
  }

  if (!this._writing) {
    // insert data as first item in sending queue
    this._queue.unshift({ payload: data, reliable: false });
    // and deliver the data to device
    this.deliver();
    return true;
  } else {
    return false;
  }
};

Transmitter.prototype._writeSync = async function (timestamp) {
  return new Promise(async (resolve, reject) => {
    const bytes = [...toBytes(timestamp, 4)];
    await this._syncChar.writeValueWithoutResponse(new Uint8Array(bytes)).catch((e) => {
      console.warn(e);
    });
    await this._syncChar.writeValueWithoutResponse(new Uint8Array([])).catch((e) => {
      console.warn(e);
    });

    resolve();
    return;
  });
};

// sync() synchronizes the device clock
Transmitter.prototype.sync = async function (timestamp) {
  //console.log("sync(" + timestamp +")");

  if (!this._writing) {
    this._writing = true;

    this._writeSync(timestamp);

    this._writing = false;
  }
};

Transmitter.prototype._writeFirmware = function (firmware) {
  return new Promise(async (resolve, reject) => {
    const FLAG_OTA_BEGIN = 255;
    const FLAG_OTA_WRITE = 0;
    const FLAG_OTA_END = 254;
    const FLAG_OTA_RESET = 253;

    const data_size = detectAndroid() ? 192 : 496;

    let index_from = 0;
    let index_to = data_size;

    let written = 0;

    console.log("OTA UPDATE");

    console.log(firmware);

    {
      //===========// RESET //===========//
      console.log("OTA RESET");

      const bytes = [FLAG_OTA_RESET, 0x00, ...toBytes(0x00000000, 4)];

      await this._updateChar.writeValueWithResponse(new Uint8Array(bytes)).catch((error) => {
        console.error(error);
        reject(error);
        return;
      });
    }

    await sleep(100);

    {
      //===========// BEGIN //===========//
      console.log("OTA BEGIN");

      const bytes = [FLAG_OTA_BEGIN, 0x00, ...toBytes(firmware.length, 4)];

      await this._updateChar.writeValueWithResponse(new Uint8Array(bytes)).catch((error) => {
        console.error(error);
        reject(error);
        return;
      });
    }

    await sleep(10000);

    const start_timestamp = new Date().getTime();

    {
      //===========// WRITE //===========//
      console.log("OTA WRITE");

      while (written < firmware.length) {
        if (index_to > firmware.length) {
          index_to = firmware.length;
        }

        const bytes = [FLAG_OTA_WRITE, 0x00, ...toBytes(written, 4), ...firmware.slice(index_from, index_to)];

        try {
          await this._updateChar.writeValueWithResponse(new Uint8Array(bytes));
          written += index_to - index_from;
        } catch (error) {
          console.error(error);
          reject(error);
          return;
        }

        console.log(Math.floor((written * 10000) / firmware.length) / 100 + "%");

        index_from += data_size;
        index_to = index_from + data_size;
      }
    }

    const end_timestamp = new Date().getTime();

    console.log("Firmware written in " + (end_timestamp - start_timestamp) / 1000 + " seconds");

    await sleep(100);

    {
      //===========// END //===========//
      console.log("OTA END");

      const bytes = [FLAG_OTA_END, 0x00, ...toBytes(written, 4)];

      await this._updateChar.writeValueWithResponse(new Uint8Array(bytes)).catch((error) => {
        console.warn(error); // on this message device reboots, what means the update is successful
        resolve();
        return;
      });
    }

    // if the device doesnt reboot and the message succeds, then it is fail.
    reject("Update failed");
    return;
  });
};

// sync() synchronizes the device clock
Transmitter.prototype.update = async function (firmware) {
  if (this._writing) {
    console.error("Write currently in progress");
    return false;
  }

  this._writing = true;

  let success = true;

  await this._writeFirmware(firmware).catch((e) => {
    console.error(e);
    success = false;
  });

  this._writing = false;

  return success;
};

// clears the queue of items to send
Transmitter.prototype.reset = function () {
  this._writing = false;
  this._queue = [];
};

/////////////////////////////////////////////////////////////////////////////////////

// Tangle Bluetooth Device

function TangleBluetoothConnection() {
  //this.TRANSMITTER_SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";

  this.BLE_OPTIONS = {
    //acceptAllDevices: true,
    filters: [
      // { services: [TRANSMITTER_SERVICE_UUID] }
      // {services: [0xffe0, 0x1803]},
      // {services: ['c48e6067-5295-48d3-8d5c-0395f61792b1']},
      // {name: 'ExampleName'},
      { namePrefix: "A" },
      { namePrefix: "a" },
      { namePrefix: "B" },
      { namePrefix: "b" },
      { namePrefix: "C" },
      { namePrefix: "c" },
      { namePrefix: "D" },
      { namePrefix: "d" },
      { namePrefix: "E" },
      { namePrefix: "e" },
      { namePrefix: "F" },
      { namePrefix: "f" },
      { namePrefix: "G" },
      { namePrefix: "g" },
      { namePrefix: "H" },
      { namePrefix: "h" },
      { namePrefix: "I" },
      { namePrefix: "i" },
      { namePrefix: "J" },
      { namePrefix: "j" },
      { namePrefix: "K" },
      { namePrefix: "k" },
      { namePrefix: "L" },
      { namePrefix: "l" },
      { namePrefix: "M" },
      { namePrefix: "m" },
      { namePrefix: "N" },
      { namePrefix: "n" },
      { namePrefix: "O" },
      { namePrefix: "o" },
      { namePrefix: "P" },
      { namePrefix: "p" },
      { namePrefix: "Q" },
      { namePrefix: "q" },
      { namePrefix: "R" },
      { namePrefix: "r" },
      { namePrefix: "S" },
      { namePrefix: "s" },
      { namePrefix: "T" },
      { namePrefix: "t" },
      { namePrefix: "U" },
      { namePrefix: "u" },
      { namePrefix: "V" },
      { namePrefix: "v" },
      { namePrefix: "W" },
      { namePrefix: "w" },
      { namePrefix: "X" },
      { namePrefix: "x" },
      { namePrefix: "Y" },
      { namePrefix: "y" },
      { namePrefix: "Z" },
      { namePrefix: "z" },
      { namePrefix: "@" },
    ],
    optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb", '60cb125a-0000-0007-0000-5ad20c574c10', '60cb125a-0000-0007-0001-5ad20c574c10', '60cb125a-0000-0007-0002-5ad20c574c10', '60cb125a-0000-0007-0003-5ad20c574c10', '60cb125a-0000-0007-0004-5ad20c574c10'],
  };

  this.bluetoothDevice = null;
  this.transmitter = null;
  this.eventEmitter = createNanoEvents();
}

TangleBluetoothConnection.prototype.connected = false;

/**
 * @name TangleBluetoothConnection.prototype.addEventListener
 * events: "connected", "disconnected"
 *
 * all events: event.target === the sender object (this)
 * event "disconnected": event.reason has a string with a disconnect reason
 *
 * @returns unbind function
 */
TangleBluetoothConnection.prototype.addEventListener = function (event, callback) {
  return this.eventEmitter.on(event, callback);
};

TangleBluetoothConnection.prototype.scan = function () {
  //console.log("scan()");

  if (this.bluetoothDevice) {
    this.disconnect();
  }

  return navigator.bluetooth.requestDevice(this.BLE_OPTIONS).then((device) => {
    this.bluetoothDevice = device;
    this.bluetoothDevice.connection = this;
    this.bluetoothDevice.addEventListener("gattserverdisconnected", this.onDisconnected);
  });
};

TangleBluetoothConnection.prototype.connect =  function () {
  //console.log("connect()");

  console.log("> Connecting to Bluetooth device...");
  return this.bluetoothDevice.gatt
    .connect()
    .then(async (server) => {
      console.log("> Getting the Bluetooth Service UUID...");
      const uuid = (await this.bluetoothDevice.gatt.getPrimaryServices())[0].uuid;
      console.log("> Getting the Bluetooth Service...");
      return server.getPrimaryService(uuid);
    })
    .then((service) => {
      console.log("> Getting the Service Characteristic...");

      if (!this.transmitter) {
        this.transmitter = new Transmitter();
      }

      return this.transmitter.attach(service);
    })
    .then(() => {
      this.connected = true;
      {
        let event = {};
        event.target = this;
        this.eventEmitter.emit("connected", event);
      }
    });
};

TangleBluetoothConnection.prototype.reconnect = function () {
  //console.log("reconnect()");

  if (this.connected && this.bluetoothDevice.gatt.connected) {
    console.log("> Bluetooth Device is already connected");
    return Promise.resolve();
  }
  return this.connect();
};

TangleBluetoothConnection.prototype.disconnect = function () {
  //console.log("disconnect()");

  if (!this.bluetoothDevice) {
    return;
  }

  console.log("> Disconnecting from Bluetooth Device...");

  // wanted disconnect removes the transmitter
  this.transmitter = null;
  self.connected = false;

  if (this.connected && this.bluetoothDevice.gatt.connected) {
    this.bluetoothDevice.gatt.disconnect();
  } else {
    console.log("> Bluetooth Device is already disconnected");
  }
};

// Object event.target is Bluetooth Device getting disconnected.
TangleBluetoothConnection.prototype.onDisconnected = function (e) {
  console.log("> Bluetooth Device disconnected");

  let self = e.target.connection;

  {
    let event = {};
    event.target = self;
    self.eventEmitter.emit("disconnected", event);
  }

  self.connected = false;
};