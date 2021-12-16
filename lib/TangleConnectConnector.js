// // npm install --save-dev @types/web-bluetooth
// /// <reference types="web-bluetooth" />
// /// <reference path="TangleAccessInterface.js" />
// /// <reference path="TnglReader.js" />

// "use strict";

// // ! od 0.8.0 maji vsechny tangle enabled BLE zarizeni jednotne TANGLE_DEVICE_UUID.
// // ! kazdy typ (produkt) Tangle Zarizeni ma svuj kod v manufacturer data
// // ! verze FW lze získat také z manufacturer data
// // Tangle network se může propojit pouze když všechny zařízení mají stejny FW.

// // xxConnection.js si drží state připojení, reconnectuje, udržuje fyzicky komunikaci vždy pouze s
// // jedním zařízením v jednu chvíli

// //////////////////////////////////////////////////////////////////////////

// /*
//    ConnectConnection is a class that handles the communication with the Tangle Connect
//    native interface. Maybe exchanges json messages, maybe IDK
// */
// class ConnectConnection extends TangleConnectorFlags {
//   // Tangle Connect comunication implementation
// }

// /////////////////////////////////////////////////////////////////////////////////////

// // Connector connects the application with one Tangle Device, that is then in a
// // position of a controller for other Tangle Devices
// class TangleConnectConnector {
//   #connection;
//   #eventEmitter;
//   #reconection;

//   constructor() {
//     this.TANGLE_SERVICE_UUID = "cc540e31-80be-44af-b64a-5d2def886bf5";

//     this.TERMINAL_CHAR_UUID = "33a0937e-0c61-41ea-b770-007ade2c79fa";
//     this.CLOCK_CHAR_UUID = "7a1e0e3a-6b9b-49ef-b9b7-65c81b714a19";
//     this.DEVICE_CHAR_UUID = "9ebe2e4b-10c7-4a81-ac83-49540d1135a5";

//     this.#connection = new ConnectConnection();
//     this.#eventEmitter = createNanoEvents();
//     this.#reconection = false;

//     window.addEventListener("beforeunload", () => {
//       this.disconnect();
//     });
//   }

//   connected() {
//     // returns true if the device connected, or false if the device
//     // is not selected, or is not connected
//   }

//   /**
//    * @name addEventListener
//    * events: "connected", "disconnected", "ota_status", "event"
//    *
//    * all events: event.target === the sender object (this)
//    * event "disconnected": event.reason has a string with a disconnect reason
//    *
//    * @returns unbind function
//    */
//   addEventListener(event, callback) {
//     return this.#eventEmitter.on(event, callback);
//   }

//   /*

// criteria: pole objektu, kde plati: [{ tohle and tamto and toto } or { tohle and tamto }]

// možnosti:
//   name: string
//   namePrefix: string
//   fwVersion: string
//   ownerSignature: string
//   productCode: number
//   adoptionFlag: bool

// criteria example:
// [
//   // all Devices that are named "NARA Aplha", are on 0.7.2 fw and are
//   // adopted by the owner with "baf2398ff5e6a7b8c9d097d54a9f865f" signature.
//   // Product code is 1 what means NARA Alpha
//   {
//     name:"NARA Alpha" 
//     fwVersion:"0.7.2"
//     ownerSignature:"baf2398ff5e6a7b8c9d097d54a9f865f"
//     productCode:1
//   },
//   // all the devices with the name starting with "NARA", without the 0.7.3 FW and 
//   // that are not adopted by anyone
//   // Product code is 2 what means NARA Beta 
//   {
//     namePrefix:"NARA"
//     fwVersion:"!0.7.3"
//     productCode:2
//     adoptionFlag:true
//   }
// ]


// */

//   // choose one Tangle device (user chooses which device to connect to via a popup)
//   // if no criteria are set, then show all Tangle devices visible.
//   // first bonds the BLE device with the PC/Phone/Tablet if it is needed.
//   // Then selects the device
//   userSelect(criteria) {
//     //console.log("choose()");

//     if (this.connected()) {
//       return this.disconnect().then(() => {
//         return this.autoSelect(criteria);
//       });
//     }

//     // return a promise that resolves when user selects a device matching the
//     // criteria. The promise is rejected when user dissmisses the
//   }

//   // takes the criteria, scans for scan_period and automatically selects the device,
//   // you can then connect to. This works only for BLE devices that are bond with the phone/PC/tablet
//   // the app is running on OR doesnt need to be bonded in a special way.
//   // if more devices are found matching the criteria, then the strongest signal wins
//   // if no device is found within the timeout period, then it returns an error

//   // if no criteria are provided, all Tangle enabled devices (with all different FWs and Owners and such)
//   // are eligible.

//   autoSelect(criteria, scan_period = 1000, timeout = 3000) {
//     // step 1. for the scan_period scan the surroundings for BLE devices.
//     // step 2. if some devices matching the criteria are found, then select the one with
//     //         the greatest signal strength. If no device is found until the timeout,
//     //         then return error

//     if (this.connected()) {
//       return this.disconnect().then(() => {
//         return this.autoSelect(criteria, scan_period, timeout);
//       });
//     }

//     // if a device is connected, disconnect it automatically.
//     // returns a promise that is resolved when Tangle device is selected.
//     //
//   }

//   // connect Connector to the selected Tangle Device. Also can be used to reconnect.
//   // Fails if no device is selected
//   connect(attempts = 3) {
//     this.#reconection = true;

//     // return a promise that resolves when the selected device was connected.
//     // the promise is rejected if no device is selected, or number of connection
//     // attemps spaced 1s apart failes
//   }

//   // disconnect Connector from the connected Tangle Device. But keep it selected
//   disconnect() {
//     // turn off automatic reconnection then device is disconnected
//     this.#reconection = false;

//     // return a promise that resolves when the device was disconnected or is already disconnected.
//     // rejects with an error if no device is selected
//   }

//   // when the device is disconnected, the javascript Connector.js layer decides
//   // if it should be revonnected. Here is implemented that it should be
//   // reconnected only if the this.#reconection is true. The event handlers are fired
//   // synchronously. So that only after all event handlers (one after the other) are done,
//   // only then start this.connect() to reconnect to the bluetooth device
//   #onDisconnected = (event) => {
//     console.log("> Bluetooth Device disconnected");
//     return this.#eventEmitter.emit("disconnected", { target: this }).then(() => {
//       if (this.#reconection) {
//         return this.connect();
//       }
//     });
//   };

//   // deliver handles the communication with the Tangle network in a way
//   // that the command is guaranteed to arrive
//   deliver(command_payload, command_label) {
//     if (!this.connected()) {
//       return Promise.reject("Bluetooth device disconnected");
//     }

//     // return a promise that resolves when command was written from the queue to the characteristics
//     // or rejected if some error happends
//   }

//   // transmit handles the communication with the Tangle network in a way
//   // that the command is NOT guaranteed to arrive
//   transmit(command_payload, command_label) {
//     if (!this.connected()) {
//       return Promise.reject("Bluetooth device disconnected");
//     }

//     // return a promise that resolves when command was written to the characteristics
//     // or rejected if some error happends
//   }

//   // request handles the requests on the Tangle network. The command request
//   // is guaranteed to get a response
//   request(command_payload, command_label) {
//     if (!this.connected()) {
//       return Promise.reject("Bluetooth device disconnected");
//     }

//     // return a promise that resolves when command was written and then
//     // response was read. Resolve then returns the response as an array of bytes
//   }

//   // configure processes data meant for the physical device that
//   // the Connector is connected to. Is used to write config, id,
//   // read battery status,
//   configure(configuration_payload, configuration_label) {
//     if (!this.connected()) {
//       return Promise.reject("Bluetooth device disconnected");
//     }

//     // return a promise that resolves when configuration was written and then
//     // result was read. Resolve then returns the result as a array of bytes read from
//     // the device
//   }

//   // synchronizes the device internal clock with the provided TimeTrack clock
//   // of the application as precisely as possible
//   setClock(clock) {
//     if (!this.connected()) {
//       return Promise.reject("Bluetooth device disconnected");
//     }

//     // return a promise that resolves when you successfully try to write
//     // without value clock timestamp to clock characteristics
//     // or is rejected when it fails
//   }

//   // returns a TimeTrack clock object that is synchronized with the internal clock
//   // of the device as precisely as possible
//   getClock() {
//     if (!this.connected()) {
//       return Promise.reject("Bluetooth device disconnected");
//     }

//     // return promise that resolve with TimeTrack clock object, that
//     // is synchronized with Tangle Device clock as accuratly as possible
//   }

//   // handles the firmware updating. Sends "ota_status" events
//   // to all handlers
//   updateDeviceFirmware(firmware) {
//     if (!this.connected()) {
//       return Promise.reject("Bluetooth device disconnected");
//     }

//     // return promise that resolves when firmware is successfully uploaded
//     // or rejected when it fails
//   }
// }
