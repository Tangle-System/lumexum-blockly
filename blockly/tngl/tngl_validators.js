"use strict";

goog.require("Blockly");
goog.require("Blockly.Blocks");

// validator for ARRAY (TUPLE)
var validator_A = function (value) {
  if (!value) {
    return null;
  }

  let reg = value.match(/\[ *0x[0-9abcdef]{2}( *, *0x[0-9abcdef]{2}){0,3} *\]/i);

  if (reg) {
    return reg[0].replace(/\s/g, "").replace(/,/g, ", ");
  }

  return null;
};

// validator for SCALE
var validator_S = function (value) {
  if (!value) {
    return null;
  }

  // let reg = value.match(/([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))\s*%/);

  let reg = value.match(/([+-]?[0-9]+[.]?[0-9]*|[.][0-9]+)\s*%/);

  if (reg) {
    let num = parseFloat(reg[1]);
    if (num < -100.0) num = -100.0;
    if (num > 100.0) num = 100.0;
    return num + "%";
  }

  if (!isNaN(value)) {
    return validator_S(value + "%");
  }

  return null;
};

// validator for TIMESTAMP
var validator_T = function (value) {
  if (!value) {
    return null;
  }

  value = value.trim();

  if (value == "inf" || value == "Inf" || value == "infinity" || value == "Infinity") {
    return "Infinity";
  }

  if (value == "-inf" || value == "-Inf" || value == "-infinity" || value == "-Infinity") {
    return "-Infinity";
  }

  // if the value is a number
  if (!isNaN(value)) {
    value += "s";
  }

  // let days = value.match(/([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))\s*d/);
  // let hours = value.match(/([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))\s*h/);
  // let minutes = value.match(/([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))\s*m/);
  // let secs = value.match(/([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))\s*s/);
  // let msecs = value.match(/([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+))\s*t/);

  let days = value.match(/([+-]?[0-9]+[.]?[0-9]*|[.][0-9]+)\s*d/);
  let hours = value.match(/([+-]?[0-9]+[.]?[0-9]*|[.][0-9]+)\s*h/);
  let minutes = value.match(/([+-]?[0-9]+[.]?[0-9]*|[.][0-9]+)\s*m/);
  let secs = value.match(/([+-]?[0-9]+[.]?[0-9]*|[.][0-9]+)\s*s/);
  let msecs = value.match(/([+-]?[0-9]+[.]?[0-9]*|[.][0-9]+)\s*t/);

  let result = "";
  let total = 0;

  if (days) {
    let d = parseFloat(days[1]);
    result += d + "d ";
    total += d * 86400000;
  }
  if (hours) {
    let h = parseFloat(hours[1]);
    result += h + "h ";
    total += h * 3600000;
  }
  if (minutes) {
    let m = parseFloat(minutes[1]);
    result += m + "m ";
    total += m * 60000;
  }
  if (secs) {
    let s = parseFloat(secs[1]);
    result += s + "s ";
    total += s * 1000;
  }

  if (msecs) {
    let ms = parseFloat(msecs[1]);
    result += ms + "t ";
    total += ms;
  }

  if (total >= 2147483647) {
    return "Infinity";
  }

  if (total <= -2147483648) {
    return "-Infinity";
  }

  return result == "" ? null : result.trim();
};

// validator for LABEL
var validator_L = function (value) {
  if (!value) {
    return null;
  }

  value = value.trim();

  if (!value.substring(0, 1).match(/[a-zA-Z_$]/) || value.lastIndexOf("$") > 0) {
    return null;
  }

  let reg = value.match(/\$*([A-Za-z_][\w]*)/);

  if (reg) {
    return "$" + reg[1].substring(0, 5);
  }

  return null;
};

// validator for PIXELS
var validator_P = function (value) {
  if (!value) {
    return null;
  }

  let reg = value.match(/(-?\d+)\s*px/);

  if (reg) {
    return reg[1] + "px";
  }

  if (!isNaN(value)) {
    return validator_P(value + "px");
  }

  return null;
};

// validator for COLOR
var validator_C = function (value) {
  if (!value) {
    return null;
  }

  let reg = value.match(/#(([0-9a-fA-F]{2}){3})/);

  if (reg) {
    return "#" + reg[1].toLowerCase();
  }

  if (value.indexOf("#") != -1) {
    return "";
  }

  return null;
};

// validator for EXPRESIONS
var validator_E = function (value) {
  if (!value) {
    return null;
  }

  let reg = value.match(/{{([\w\W]*)}}/);

  if (reg) {
    return "{{ " + reg[1].trim() + " }}";
  }

  return null;
};

// validator for SCALE and EXPRESION
var validator_SE = function (value) {
  return validator_S(value) ?? validator_E(value);
};

// validator for TIMESTAMP and EXPRESION
var validator_TE = function (value) {
  return validator_T(value) ?? validator_E(value);
};

// validator for LABEL and EXPRESION
var validator_LE = function (value) {
  return validator_L(value) ?? validator_E(value);
};

// validator for PIXELS and EXPRESION
var validator_PE = function (value) {
  return validator_P(value) ?? validator_E(value);
};

// validator for SCALE and LABEL
var validator_SLE = function (value) {
  return validator_S(value) ?? validator_L(value) ?? validator_E(value);
};

// validator for LABEL and COLOR and EXPRESSION
var validator_LCE = function (value) {
  return validator_L(value) ?? validator_C(value) ?? validator_E(value);
};

// validator for TIMESTAMP and LABEL
var validator_TLE = function (value) {
  return validator_T(value) ?? validator_L(value) ?? validator_E(value);
};

// validator for ARRAY and SCALE and TIMESTAMP and LABEL and COLOR
var validator_ASTLCE = function (value) {
  return validator_A(value) ?? validator_S(value) ?? validator_T(value) ?? validator_L(value) ?? validator_C(value) ?? validator_E(value);
};

//=======================

Blockly.Blocks["animation_dummy_next"].setValidators = function () {};

Blockly.Blocks["animation_dummy_add"].setValidators = function () {};

Blockly.Blocks["drawing"].setValidators = function () {
  this.getField("START").setValidator(validator_TLE);
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["drawing_dummy"].setValidators = function () {};

Blockly.Blocks["animation_definition"].setValidators = function () {
  this.getField("ANIMATION_LABEL").setValidator(validator_LE);
  this.getField("DURATION").setValidator(validator_TE);
};

Blockly.Blocks["animation_call"].setValidators = function () {
  this.getField("ANIMATION_LABEL").setValidator(validator_LE);
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["animation_fill"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
  this.getField("COLOR").setValidator(validator_LCE);
};

Blockly.Blocks["animation_rainbow"].setValidators = function () {
  this.getField("ZOOM").setValidator(validator_SLE);
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["animation_fade"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
  this.getField("COLOR1").setValidator(validator_LCE);
  this.getField("COLOR2").setValidator(validator_LCE);
};

Blockly.Blocks["animation_plasma_shot"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
  this.getField("PERCENTAGE").setValidator(validator_SLE);
  this.getField("COLOR").setValidator(validator_LCE);
};

Blockly.Blocks["animation_loading_bar"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
  this.getField("COLOR1").setValidator(validator_LCE);
  this.getField("COLOR2").setValidator(validator_LCE);
};

Blockly.Blocks["animation_none"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["animation_color_roll"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
  this.getField("COLOR1").setValidator(validator_LCE);
  this.getField("COLOR2").setValidator(validator_LCE);
};

Blockly.Blocks["animation_palette_roll"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["window"].setValidators = function () {
  this.getField("START").setValidator(validator_TLE);
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["window_2"].setValidators = function () {
  this.getField("FROM").setValidator(validator_TLE);
  this.getField("TO").setValidator(validator_TLE);
};

Blockly.Blocks["modifier_brightness"].setValidators = function () {
  this.getField("VARIABLE_LABEL").setValidator(validator_SLE);
};

Blockly.Blocks["modifier_timeline"].setValidators = function () {
  this.getField("TIME_SOURCE").setValidator(validator_LE);
};

Blockly.Blocks["modifier_color_switch"].setValidators = function () {};

Blockly.Blocks["modifier_timechange"].setValidators = function () {
  this.getField("FROM_TIME_UNIT").setValidator(validator_TLE);
  this.getField("TO_TIME_UNIT").setValidator(validator_TLE);
};

Blockly.Blocks["modifier_timeloop"].setValidators = function () {
  this.getField("LOOP").setValidator(validator_TLE);
};

Blockly.Blocks["modifier_timescale"].setValidators = function () {
  this.getField("VARIABLE_LABEL").setValidator(validator_SLE);
};

Blockly.Blocks["modifier_fade"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["modifier_dummy_add"].setValidators = function () {};

Blockly.Blocks["modifier_settime"].setValidators = function () {
  this.getField("TIMESTAMP").setValidator(validator_TLE);
};

Blockly.Blocks["frame"].setValidators = function () {
  this.getField("START").setValidator(validator_TLE);
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["event_source"].setValidators = function () {
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["event_replace_param"].setValidators = function () {
  this.getField("EVENT_PARAMETER").setValidator(validator_ASTLCE);
};

Blockly.Blocks["event_dummy_add"].setValidators = function () {};

Blockly.Blocks["event_emit_code"].setValidators = function () {
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

// Blockly.Blocks["event_emit_timeline"].setValidators = function () {
//   this.getField("TIMESTAMP").setValidator(validator_TE);
// };

Blockly.Blocks["handler_manual"].setValidators = function () {
  this.getField("START").setValidator(validator_TLE);
  this.getField("DURATION").setValidator(validator_TLE);
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["clip"].setValidators = function () {
  this.getField("START").setValidator(validator_TLE);
  this.getField("DURATION").setValidator(validator_TLE);
};

Blockly.Blocks["clip_marks_definition"].setValidators = function () {
  this.getField("MARKS_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["clip_mark_timestamp"].setValidators = function () {
  this.getField("TIMESTAMP").setValidator(validator_TE);
};

Blockly.Blocks["clip_marks"].setValidators = function () {
  this.getField("MARKS").setValidator(validator_LE);
};

Blockly.Blocks["clip_mark"].setValidators = function () {
  this.getField("TIMESTAMP").setValidator(validator_TE);
};

Blockly.Blocks["clip_marks_inline"].setValidators = function () {};

Blockly.Blocks["clip_dummy_mark"].setValidators = function () {};

Blockly.Blocks["tangle_definition"].setValidators = function () {
  this.getField("TANGLE_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["tangle_port"].setValidators = function () {
  this.getField("DEVICE_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["tangle_pixels"].setValidators = function () {
  this.getField("DEVICE_LABEL").setValidator(validator_LE);
  this.getField("RANGE_FROM").setValidator(validator_PE);
  this.getField("RANGE_COUNT").setValidator(validator_PE);
  this.getField("RANGE_STEP").setValidator(validator_PE);
};

Blockly.Blocks["tangle_dummy_pixels_extend"].setValidators = function () {};

Blockly.Blocks["group_port"].setValidators = function () {
  this.getField("SHIFT").setValidator(validator_TE);
};

Blockly.Blocks["group_definition"].setValidators = function () {
  this.getField("GROUP_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["group_tangle"].setValidators = function () {
  this.getField("SHIFT").setValidator(validator_TE);
  this.getField("TANGLE_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["group_dummy_tangle"].setValidators = function () {};

Blockly.Blocks["siftcanvas_tangles"].setValidators = function () {};

Blockly.Blocks["siftcanvas_tangle"].setValidators = function () {
  this.getField("TANGLE_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["siftcanvas_dummy_tangle_add"].setValidators = function () {};

Blockly.Blocks["siftcanvas_groups"].setValidators = function () {};

Blockly.Blocks["siftcanvas_group"].setValidators = function () {
  this.getField("GROUP_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["siftcanvas_dummy_group_add"].setValidators = function () {};

Blockly.Blocks["siftcanvas_device"].setValidators = function () {
  this.getField("DEVICE_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["siftcanvas_devices"].setValidators = function () {};

Blockly.Blocks["siftcanvas_dummy_device_add"].setValidators = function () {};

Blockly.Blocks["siftcanvas_port"].setValidators = function () {};

Blockly.Blocks["siftcanvas_ports"].setValidators = function () {};

Blockly.Blocks["siftcanvas_dummy_port_add"].setValidators = function () {};

Blockly.Blocks["code_inline"].setValidators = function () {
  this.appendDummyInput().appendField("code").appendField(new Blockly.FieldMultilineInput(""), "INLINE_CODE");
};

Blockly.Blocks["commentary_block"].setValidators = function () {
  this.setColour("#cdcdcd");
};

Blockly.Blocks["commentary_line"].setValidators = function () {
  this.setColour("#cdcdcd");
};

Blockly.Blocks["commentary_spacer"].setValidators = function () {
  this.setColour("#cdcdcd");
};

Blockly.Blocks["device_4ports"].setValidators = function () {
  this.getField("DEVICE_LABEL").setValidator(validator_LE);
  this.getField("DEVICE_BRIGHTNESS").setValidator(validator_SE);
  this.getField("PORT_A_LENGTH").setValidator(validator_PE);
  this.getField("PORT_B_LENGTH").setValidator(validator_PE);
  this.getField("PORT_C_LENGTH").setValidator(validator_PE);
  this.getField("PORT_D_LENGTH").setValidator(validator_PE);
};

Blockly.Blocks["device_8ports"].setValidators = function () {
  this.getField("DEVICE_LABEL").setValidator(validator_LE);
  this.getField("DEVICE_BRIGHTNESS").setValidator(validator_SE);
  this.getField("PORT_A_LENGTH").setValidator(validator_PE);
  this.getField("PORT_B_LENGTH").setValidator(validator_PE);
  this.getField("PORT_C_LENGTH").setValidator(validator_PE);
  this.getField("PORT_D_LENGTH").setValidator(validator_PE);
  this.getField("PORT_E_LENGTH").setValidator(validator_PE);
  this.getField("PORT_F_LENGTH").setValidator(validator_PE);
  this.getField("PORT_G_LENGTH").setValidator(validator_PE);
  this.getField("PORT_H_LENGTH").setValidator(validator_PE);
};

Blockly.Blocks["variable_create"].setValidators = function () {
  this.getField("LABEL").setValidator(validator_LE);
};

Blockly.Blocks["value_dummy"].setValidators = function () {};

Blockly.Blocks["value_math"].setValidators = function () {};

Blockly.Blocks["value_map"].setValidators = function () {};


Blockly.Blocks["value_read_variable"].setValidators = function () {
  this.getField("VARIABLE_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["value_constant"].setValidators = function () {
  this.getField("VALUE").setValidator(validator_ASTLCE);
};

Blockly.Blocks["sensor_artnet"].setValidators = function () {
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["sensor_touch"].setValidators = function () {
  this.getField("TOUCH_LABEL").setValidator(validator_LE);
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["sensor_gyro"].setValidators = function () {
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["sensor_acc"].setValidators = function () {
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["sensor_gesture"].setValidators = function () {
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["sensor_button"].setValidators = function () {
  this.getField("BUTTON_LABEL").setValidator(validator_LE);
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["sensor_dummy"].setValidators = function () {};

Blockly.Blocks["generator_sin"].setValidators = function () {
  this.getField("PERIOD").setValidator(validator_TE);
};

Blockly.Blocks["generator_last_event_parameter"].setValidators = function () {
  this.getField("EVENT_LABEL").setValidator(validator_LE);
};

Blockly.Blocks["generator_perlin_noise"].setValidators = function () {};

Blockly.Blocks["generator_saw"].setValidators = function () {
  this.getField("PERIOD").setValidator(validator_TLE);
};

Blockly.Blocks["generator_triangle"].setValidators = function () {
  this.getField("PERIOD").setValidator(validator_TLE);
};

Blockly.Blocks["generator_square"].setValidators = function () {
  this.getField("PERIOD").setValidator(validator_TLE);
};

Blockly.Blocks["generator_smoothout"].setValidators = function () {
  this.getField("DURATION").setValidator(validator_TLE);
};
