// npm install --save-dev @types/web-bluetooth
/// <reference types="web-bluetooth" />
/// <reference path="TangleAccessInterface.js" />
/// <reference path="TnglReader.js" />

"use strict";


// ! od 0.8.0 maji vsechny tangle enabled BLE zarizeni jednotne TANGLE_DEVICE_UUID.
// ! kazdy typ (produkt) Tangle Zarizeni ma svuj kod v manufacturer data
// ! verze FW lze získat také z manufacturer data
// Tangle network se může propojit pouze když všechny zařízení mají stejny FW.

// xxConnection.js si drží state připojení, reconnectuje, udržuje fyzicky komunikaci vždy pouze s
// jedním zařízením v jednu chvíli

/////////////////////////////////////////////////////////////////////////////////////

// Connector connects the application with one Tangle Device, that is then in a 
// position of a controller for other Tangle Devices
class TangleDummyConnector {
  #connection;
  #eventEmitter;
  #reconection;

  constructor() {
    this.#eventEmitter = createNanoEvents();
  }

  connected() {
    return false;
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
    return Promise.resolve();
  }

  // takes the criteria, scans for scan_period and automatically selects the device,
  // you can then connect to. This works only for BLE devices that are bond with the phone/PC/tablet
  // the app is running on OR doesnt need to be bonded in a special way.
  // if more devices are found matching the criteria, then the strongest signal wins
  // if no device is found within the timeout period, then it returns an error

  // if no criteria are provided, all Tangle enabled devices (with all different FWs and Owners and such)
  // are eligible.

  autoSelect(criteria, scan_period = 1000, timeout = 3000) {
    return Promise.resolve();
  }

  // connect Connector to the selected Tangle Device. Also can be used to reconnect.
  // Fails if no device is selected
  connect(attempts = 3) {
    return Promise.resolve();
  }

  // disconnect Connector from the connected Tangle Device. But keep it selected
  disconnect() {
    return Promise.resolve();
  }

  // deliver handles the communication with the Tangle network in a way
  // that the command is guaranteed to arrive
  deliver(command_payload, command_label) {
    return Promise.resolve();
  }

  // transmit handles the communication with the Tangle network in a way
  // that the command is NOT guaranteed to arrive
  transmit(command_payload, command_label) {
    return Promise.resolve();
  }

  // request handles the requests on the Tangle network. The command request
  // is guaranteed to get a response
  request(command_payload, command_label) {
    return Promise.resolve();
  }

  // configure processes data meant for the physical device that
  // the Connector is connected to. Is used to write config, id,
  // read battery status,
  configure(configuration_payload, configuration_label) {
    return Promise.resolve();
  }

  // synchronizes the device internal clock with the provided TimeTrack clock
  // of the application as precisely as possible
  setClock(clock) {
    return Promise.resolve();
  }

  // returns a TimeTrack clock object that is synchronized with the internal clock
  // of the device as precisely as possible
  getClock() {
    return Promise.resolve();
  }

  // handles the firmware updating. Sends "ota_status" events
  // to all handlers
  updateFirmware(firmware) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < 100; i++) {
        this.#eventEmitter.emit("ota_status", i);
        await sleep(100);
      }
      resolve();
      return;
    });
  }
}
