"use strict";

/** Example TangleDevice implementation
 */

function TangleSerialDevice() {
  this.serialConnection = new TangleSerialConnection();

  this.serialConnection.addEventListener("disconnected", this.onDisconnected);
  this.serialConnection.addEventListener("connected", this.onConnected);
  this.serialConnection.addEventListener("receive", this.onReceive);

  // auto clock sync loop
  var self = this;
  setInterval(() => {
    if (self.isConnected()) {
      self.syncClock(getTimestamp());
    }
  }, 10000);

  window.addEventListener("beforeunload", this.serialConnection.disconnect);
}

/**
 * @name TangleSerialDevice.prototype.addEventListener
 * events: "receive", "disconnected", "connected"
 *
 * all events: event.target === the sender object (TangleBluetoothConnection)
 * event "receive": event.payload contains received data
 * event "disconnected": event.reason has a string with a disconnect reason
 *
 * @returns unbind function
 */
TangleSerialDevice.prototype.addEventListener = function (event, callback) {
  return this.serialConnection.addEventListener(event, callback);
};

TangleSerialDevice.prototype.onDisconnected = function (event) {
  console.log("Serial Device disconnected");

  if (event.reason === "BreakError") {
    setTimeout(() => {
      console.log("Reconnecting device...");
      return event.target
        .reconnect()
        .then(() => {
          event.target.transmitter.sync(getTimestamp());
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000);
  }
};

TangleSerialDevice.prototype.onConnected = function (event) {
  console.log("Serial Device connected");
};

TangleSerialDevice.prototype.onReceive = function (event) {
  //console.log(">", event.payload);
};

TangleSerialDevice.prototype.connect = function () {
  return this.serialConnection
    .scan()
    .then(() => {
      return this.serialConnection.connect();
    })
    .then(() => {
      this.serialConnection.transmitter.sync(getTimestamp());
    })
    .catch((error) => {
      console.warn(error);
    });
};

TangleSerialDevice.prototype.reconnect = function () {
  return this.serialConnection
    .reconnect()
    .then(() => {
      this.serialConnection.transmitter.sync(getTimestamp());
    })
    .catch((error) => {
      console.warn(error);
    });
};

TangleSerialDevice.prototype.disconnect = function () {
  return this.serialConnection.disconnect().catch((error) => {
    console.warn(error);
  });
};

TangleSerialDevice.prototype.isConnected = function () {
  return this.serialConnection.connected;
};

TangleSerialDevice.prototype.uploadTngl = function (tngl_bytes, timeline_timestamp, timeline_paused) {
  //console.log("uploadTngl()");

  if (!this.serialConnection || !this.serialConnection.connected) {
    console.warn("Serial device disconnected");
    return false;
  }

  const FLAG_SYNC_TIMELINE = 242;
  const payload = [FLAG_SYNC_TIMELINE, ...toBytes(getTimestamp(), 4), ...toBytes(timeline_timestamp, 4), timeline_paused ? 1 : 0, ...tngl_bytes];
  this.serialConnection.transmitter.deliver(payload);

  return true;
};

TangleSerialDevice.prototype.setTime = function (timeline_timestamp, timeline_paused) {
  //console.log("setTime()");

  if (!this.serialConnection || !this.serialConnection.connected) {
    console.warn("Serial device disconnected");
    return false;
  }

  const FLAG_SYNC_TIMELINE = 242;
  const payload = [FLAG_SYNC_TIMELINE, ...toBytes(getTimestamp(), 4), ...toBytes(timeline_timestamp, 4), timeline_paused ? 1 : 0];
  this.serialConnection.transmitter.deliver(payload);

  return true;
};

TangleSerialDevice.prototype.writeTrigger = function (trigger_type, trigger_param, timeline_timestamp) {
  //console.log("writeTrigger()");

  if (!this.serialConnection || !this.serialConnection.connected) {
    console.warn("Serial device disconnected");
    return false;
  }

  const FLAG_TRIGGER = 241;
  const payload = [FLAG_TRIGGER, 0, trigger_type, trigger_param, ...toBytes(timeline_timestamp, 4)];
  this.serialConnection.transmitter.deliver(payload);

  return true;
};

TangleSerialDevice.prototype.syncTime = function (timeline_timestamp, timeline_paused) {
  //console.log("syncTime()");

  if (!this.serialConnection || !this.serialConnection.connected) {
    console.warn("Serial device disconnected");
    return false;
  }

  const FLAG_SYNC_TIMELINE = 242;
  const payload = [FLAG_SYNC_TIMELINE, ...toBytes(getTimestamp(), 4), ...toBytes(timeline_timestamp, 4), timeline_paused ? 1 : 0];
  this.serialConnection.transmitter.transmit(payload);

  return true;
};

TangleSerialDevice.prototype.syncClock = function () {
  //console.log("syncClock()");

  if (!this.serialConnection || !this.serialConnection.connected) {
    console.warn("Serial device disconnected");
    return false;
  }

  this.serialConnection.transmitter.sync(getTimestamp());
  return true;
};
