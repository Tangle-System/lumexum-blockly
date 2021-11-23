"use strict";

//////////////////////////////////////////////////////////////////////////

// Tangle Bluetooth Device
class TangleDummyConnector {
  constructor() {}

  isConnected() {
    return false;
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
    return null;
  }

  // adopt() - prvně provede párovací proces, pokud je potřeba. Pak provede adoptovací proces, kdy
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

  choose(criteria) {
    return Promise.resolve();
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

  connect(criteria, scan_period = 1000, timeout = 3000) {
    return Promise.resolve();
  }

  // reconnect() {
  //   return Promise.resolve();
  // }

  disconnect() {
    return Promise.resolve();
  }

  // // Object event.target is Bluetooth Device getting disconnected.
  // #onDisconnected = (e) => {
  //   //console.log("> Bluetooth Device disconnected");

  //   console.log(this);

  //   // let self = e.target.tangleBluetoothConnectionReference;
  //   this.#eventEmitter.emit("disconnected", { target: this });
  // }

  // reset() {
  //   return Promise.resolve();
  // }

  deliver(command_payload, command_label) {
    return Promise.resolve();
  }

  transmit(command_payload) {
    return Promise.resolve();
  }

  request(command_payload, command_label) {
    return Promise.resolve();
  }

  // setClock(clock) {
  //    return Promise.resolve();

  // };

  getClock() {
    return Promise.resolve(new TimeTrack(0));
  }

  updateFirmware(firmware) {
    return Promise.resolve();
  }

  updateConfig(config) {
    return Promise.resolve();
  }

  // deviceReboot() {
  //   return Promise.resolve();
  // }
}
