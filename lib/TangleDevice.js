/// <reference path="functions.js" />
/// <reference path="TimeTrack.js" />

/// <reference path="TnglReader.js" />
/// <reference path="TnglWriter.js" />

/// <reference path="TangleWebBluetoothConnector.js" />
/// <reference path="TangleDummyConnector.js" />

"use strict";

/////////////////////////////////////////////////////////////////////////

// should not create more than one object!
// the destruction of the TangleDevice is not well implemented
class TangleDevice {
  #eventEmitter;
  #uuidCounter;
  #ownerSignature;

  constructor(owner_signature) {
    this.clock = new TimeTrack();
    this.timeline = new TimeTrack();

    this.#eventEmitter = createNanoEvents();
    this.#uuidCounter = 0;
    this.#ownerSignature = owner_signature;

    this.connector = new TangleDummyConnector();

    this.assignConnector("webbluetooth");

    // auto clock sync loop
    // how to get rid of it on TangleDevice object destruction ????
    var self = this;
    setInterval(() => {
      if (self.isConnected()) {
        self.syncClock().catch((error) => {
          console.warn(error);
        });
      }
    }, 60000);
  }

  // UGLY UGLY
  assignConnector(variant) {
    if (variant === "dummy") {
      this.connector = new TangleDummyConnector();
    } else if (variant === "webbluetooth") {
      this.connector = new TangleWebBluetoothConnector();
    } else {
      throw "invalid connector";
    }

    this.variant = variant;

    this.connector.addEventListener("disconnected", this.#onDisconnected);
    this.connector.addEventListener("connected", this.#onConnected);
  }

  // valid UUIDs are in range [1..4294967295]
  #getUUID() {
    if (this.#uuidCounter >= 4294967295) {
      this.#uuidCounter = 0;
    }

    return ++this.#uuidCounter;
  }

  /**
   * @name addEventListener
   * events: "disconnected", "connected"
   *
   * all events: event.target === the sender object (TangleWebBluetoothConnector)
   * event "disconnected": event.reason has a string with a disconnect reason
   *
   * @returns unbind function
   */

  addEventListener(event, callback) {
    return this.#eventEmitter.on(event, callback);
  }

  #onDisconnected = (event) => {
    console.log("> Bluetooth Device disconnected");
    return this.#eventEmitter.emit("disconnected", { target: this });

    // if (e.target.connected) {
    //   setTimeout(() => {
    //     console.log("Reconnecting device...");
    //     return event.target
    //       .reconnect()
    //       .then(async () => {
    //         let success = false;

    //         for (let index = 0; index < 3; index++) {
    //           await sleep(1000);
    //           try {
    //             if (await event.target.transmitter.sync(this.clock.millis())) {
    //               success = true;
    //               break;
    //             }
    //           } catch (e) {
    //             console.warn("Time sync unsuccessful");
    //           }
    //         }

    //         if (success) {
    //           console.log("Sync time success");
    //         } else {
    //           console.error("Sync time on connection failed");
    //         }
    //       })
    //       .catch((error) => {
    //         console.warn(error);
    //       });
    //   }, 1000);
    // }
  };

  #onConnected = (event) => {
    return event.target
      .getClock()
      .then((clock) => {
        this.clock = clock;
        console.log("> Bluetooth Device connected");
        return this.#eventEmitter.emit("connected", { target: this });
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  // každé tangle zařízení může být spárováno pouze s jedním účtem. (jednim user_key)
  // jakmile je sparovana, pak ji nelze prepsat novým učtem.
  // filtr pro pripojovani k zarizeni je pak účet.

  // adopt != pair
  // adopt reprezentuje proces, kdy si webovka osvoji nove zarizeni. Tohle zarizeni, ale uz
  // muze byt spárováno s telefonem / TangleConnectem

  // pri adoptovani MUSI byt vsechny zarizeni ze skupiny zapnuty.
  // vsechny zarizeni totiz MUSI vedet o vsech.
  // adopt() {
  // const BLE_OPTIONS = {
  //   //acceptAllDevices: true,
  //   filters: [
  //     { services: [this.TRANSMITTER_SERVICE_UUID] },
  //     // {services: ['c48e6067-5295-48d3-8d5c-0395f61792b1']},
  //     // {name: 'ExampleName'},
  //   ],
  //   //optionalServices: [this.TRANSMITTER_SERVICE_UUID],
  // };
  // //
  // return this.connector
  //   .adopt(BLE_OPTIONS).then((device)=> {
  //     // ulozit device do local storage jako json
  //   })
  //   .catch((error) => {
  //     console.warn(error);
  //   });
  // }

  adopt() {
    const criteria = [{ ownerSignature: "00000000000000000000000000000000" }];
    //const criteria = [{ fwVersion: "!0.7.3" }];

    //const criteria = [];

    console.log("> Adopting device...");
    return this.connector
      .userSelect(criteria)
      .then(() => {
        return this.connector.connect(10);
      })
      .then(() => {
        const request_uuid = this.#getUUID();
        const bytes = [FLAGS.FLAG_ADOPT_REQUEST, ...toBytes(request_uuid, 4), ...toBytes(this.#ownerSignature, 16)];

        return this.connector.request(bytes, "ADPT").then((response) => {
          let reader = new TnglReader(response);

          console.log("> Got response:", response);

          if (reader.readFlag() !== FLAGS.FLAG_ADOPT_RESPONSE) {
            throw "InvalidResponse";
          }

          const response_uuid = reader.readUint32();

          if (response_uuid != request_uuid) {
            throw "InvalidResponse";
          }

          const error_code = reader.readUint8();
          const device_mac = reader.readBytes(6);

          console.log(`error_code=${error_code}, device_mac=${device_mac}`);

          return { mac: device_mac };
        });
      });
  }

  connect() {
    const criteria = { ownerSignature: this.#ownerSignature };

    // .then(() => {
    return this.connector.autoSelect(criteria).then(() => {
      this.connector.connect(10);
    });
    // .then(() => {
    //   return this.connector.getClock();
    // })
    // .then((clock) => {
    //   this.clock = clock;
    //   return this.requestTimeline();
    // })
    // .catch((error) => {
    //   console.warn(error);
    // });
    // });
  }

  disconnect() {
    return this.connector.disconnect();
  }

  isConnected() {
    return this.connector.isConnected();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  writeTngl(tngl_bytes) {
    //console.log("writeTngl()");

    const flags = this.timeline.paused() ? 0b00010000 : 0b00000000; // flags: [reserved,reserved,reserved,timeline_paused,reserved,reserved,reserved,reserved]
    const timeline_bytes = [FLAGS.FLAG_SET_TIMELINE, ...toBytes(this.clock.millis(), 4), ...toBytes(this.timeline.millis(), 4), flags];

    const payload = [...timeline_bytes, ...tngl_bytes];
    return this.connector.deliver(payload, "TNGL");
  }

  // event_label example: "evt1"
  // event_value example: 1000
  emitEvent(event_label, device_id = 0xff, force_delivery = true) {
    //console.log("emitEvent()");

    const payload = [FLAGS.FLAG_EMIT_EVENT, ...labelToBytes(event_label), ...toBytes(this.timeline.millis(), 4), device_id];
    return this.connector.deliver(payload, force_delivery ? null : "E" + event_label + device_id);
  }

  // event_label example: "evt1"
  // event_value example: 1000
  emitTimestampEvent(event_label, event_value, device_id = 0xff, force_delivery = false) {
    //console.log("emitTimestampEvent()");

    const payload = [FLAGS.FLAG_EMIT_TIMESTAMP_EVENT, ...toBytes(event_value, 4), ...labelToBytes(event_label), ...toBytes(this.timeline.millis(), 4), device_id];
    return this.connector.deliver(payload, force_delivery ? null : "E" + event_label + device_id);
  }

  // event_label example: "evt1"
  // event_value example: "#00aaff"
  emitColorEvent(event_label, event_value, device_id = 0xff, force_delivery = false) {
    //console.log("emitPercentageEvent()");
    //console.log("emitColorEvent()");

    const payload = [FLAGS.FLAG_EMIT_COLOR_EVENT, ...colorToBytes(event_value), ...labelToBytes(event_label), ...toBytes(this.timeline.millis(), 4), device_id];
    return this.connector.deliver(payload, force_delivery ? null : "E" + event_label + device_id);
  }

  // event_label example: "evt1"
  // event_value example: 100.0
  // !!! PARAMETER CHANGE !!!
  emitPercentageEvent(event_label, event_value, device_id = 0xff, force_delivery = false) {
    //console.log("emitPercentageEvent()");

    const payload = [FLAGS.FLAG_EMIT_PERCENTAGE_EVENT, ...percentageToBytes(event_value), ...labelToBytes(event_label), ...toBytes(this.timeline.millis(), 4), device_id];
    return this.connector.deliver(payload, force_delivery ? null : "E" + event_label + device_id);
  }

  // event_label example: "evt1"
  // event_value example: "label"
  // !!! PARAMETER CHANGE !!!
  emitLabelEvent(event_label, event_value, device_id = 0xff, force_delivery = false) {
    //console.log("emitLabelEvent()");

    const payload = [FLAGS.FLAG_EMIT_LABEL_EVENT, ...labelToBytes(event_value), ...labelToBytes(event_label), ...toBytes(this.timeline.millis(), 4), device_id];
    return this.connector.deliver(payload, force_delivery ? null : "E" + event_label + device_id);
  }

  // !!! PARAMETER CHANGE !!!
  syncTimeline() {
    //console.log("syncTimeline()");
    const flags = this.timeline.paused() ? 0b00010000 : 0b00000000; // flags: [reserved,reserved,reserved,timeline_paused,reserved,reserved,reserved,reserved]
    const payload = [FLAGS.FLAG_SET_TIMELINE, ...toBytes(this.clock.millis(), 4), ...toBytes(this.timeline.millis(), 4), flags];
    return this.connector.deliver(payload, "TMLN");
  }

  // syncClock() {
  //   //console.log("syncClock()");
  //   return this.connector.setClock(this.clock);
  // };

  updateFirmware(firmware) {
    //console.log("updateFirmware()");
    return this.connector.updateFirmware(firmware);
  }

  updateConfig(config) {
    //console.log("updateConfig()");
    return this.connector.updateConfig(config);
  }

  requestTimeline() {
    console.log("> Requesting timeline...");

    const request_uuid = this.#getUUID();
    const bytes = [FLAGS.FLAG_TIMELINE_REQUEST, ...toBytes(request_uuid, 4)];

    return this.connector.request(bytes, "TMLR").then((response) => {
      let reader = new TnglReader(response);

      console.log("> Got response:", response);

      if (reader.readFlag() !== FLAGS.FLAG_TIMELINE_RESPONSE) {
        throw "InvalidResponse";
      }

      const response_uuid = reader.readUint32();

      if (response_uuid != request_uuid) {
        throw "InvalidResponse";
      }

      const clock_timestamp = reader.readInt32();
      const timeline_timestamp = reader.readInt32();
      const timeline_paused = reader.readUint8();

      console.log(`clock_timestamp=${clock_timestamp}, timeline_timestamp=${timeline_timestamp}, timeline_paused=${timeline_paused}`);

      if (timeline_paused) {
        this.timeline.setState(timeline_timestamp, true);
      } else {
        this.timeline.setState(timeline_timestamp + (this.clock.millis() - clock_timestamp), false);
      }
    });
  }

  syncClock() {
    console.log("> Getting current clock...");

    return this.connector
      .getClock()
      .then((device_clock) => {
        console.log("> Synchronizing clock...");

        const device_clock_delta = device_clock.millis() - this.clock.millis();

        console.log("device_clock_delta = " + device_clock_delta);

        const bytes = [FLAGS.FLAG_ADJUST_CLOCK, ...toBytes(device_clock_delta, 4)];
        return this.connector.deliver(bytes, "CLKS"); // CLKS = clock sync
      })
      .then(() => {
        console.log("> Device clock synchronized");
      });
  }

  networkReboot() {
    console.log("> Rebooting network...");

    const payload = [FLAGS.FLAG_NETWORK_REBOOT];
    return this.connector.deliver(payload, "NREB");
  }

  setDeviceId(id) {
    console.log("> Rebooting network...");

    const payload = [FLAGS.FLAG_DEVICE_ID, id];
    return this.connector.deliver(payload, "SDID");
  }
}
