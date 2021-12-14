/// <reference path="TangleWebBluetoothConnector.js" />
/// <reference path="TangleDummyConnector.js" />

const DEVICE_FLAGS = Object.freeze({
  // legacy FW update flags
  FLAG_OTA_BEGIN: 255, // legacy
  FLAG_OTA_WRITE: 0, // legacy
  FLAG_OTA_END: 254, // legacy
  FLAG_OTA_RESET: 253, // legacy
  FLAG_DEVICE_REBOOT: 5, // legacy

  FLAG_CONFIG_UPDATE_REQUEST: 10,
  FLAG_CONFIG_UPDATE_RESPONSE: 11,

  FLAG_TNGL_FINGERPRINT_REQUEST: 242,
  FLAG_TNGL_FINGERPRINT_RESPONSE: 243,
  FLAG_TIMELINE_REQUEST: 245,
  FLAG_TIMELINE_RESPONSE: 246,

  FLAG_CONNECT_REQUEST: 238,
  FLAG_CONNECT_RESPONSE: 239,
  FLAG_ADOPT_REQUEST: 240,
  FLAG_ADOPT_RESPONSE: 241,
});

const NETWORK_FLAGS = Object.freeze({
  /* command flags */

  DEVICE_CONF_BYTES: 240,
  FLAG_TNGL_BYTES: 248,

  FLAG_EMIT_EVENT: 247,

  FLAG_SET_TIMELINE: 249,
  FLAG_EMIT_TIMESTAMP_EVENT: 250,
  FLAG_EMIT_COLOR_EVENT: 251,
  FLAG_EMIT_PERCENTAGE_EVENT: 252,
  FLAG_EMIT_LABEL_EVENT: 253,
});


class TangleAccessInterface {
  #connector;

  constructor() {
    this.#connector;
  }

  deliver(payload, payload_label) {}
}
