"use strict";

goog.require("Blockly.Tngl");

// function hexToRgb(hex) {
//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result ?
//     'rgb(' + parseInt(result[1], 16)
//     + ',' + parseInt(result[2], 16)
//     + ',' + parseInt(result[3], 16) + ')'
//     : null;
// }

function secToMiliSec(sec) {
  return Math.floor(parseFloat(sec) * 1000);
}

function formatByte(value) {
  if (value < 16) {
    return "0x0" + value.toString(16);
  } else if (value < 256) {
    return "0x" + value.toString(16);
  } else {
    return "0xff";
  }
}

function formatFloat(number) {
  if (Number.isInteger(number)) { 
    return number + ".0"
  } else {
    return number.toString(); 
  }
}

function formatPercentage(percent) {
  return ((percent * 10) / 10).toString() + "%";
}

function ratioToByte(ratio) {
  return Math.floor(ratio * 255);
}

function decodeNextAnimationValue(value_next) {
  if (value_next != "") {
    return ".next(" + value_next + ")";
  } else {
    return "";
  }
}

function decodeExtendDeviceValue(value_next) {
  if (value_next != "") {
    return ".extends(" + value_next + ")";
  } else {
    return "";
  }
}

//////////////////////////////////////////////////////////

Blockly.Tngl["animation_fill"] = function (block) {
  var colour_color = block.getFieldValue("COLOR");
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code =
    "animFill(" + number_duration + ", " + colour_color + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_rainbow"] = function (block) {
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var number_zoom = formatPercentage(block.getFieldValue("ZOOM"));
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code =
    "animRainbow(" + number_duration + ", " + number_zoom + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_fade"] = function (block) {
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code =
    "animFade(" +
    number_duration +
    ", " +
    colour_color1 +
    ", " +
    colour_color2 +
    ")" +
    value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_plasma_shot"] = function (block) {
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var colour_color = block.getFieldValue("COLOR");
  var number_percentage = formatPercentage(block.getFieldValue("PERCENTAGE"));
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code =
    "animPlasmaShot(" +
    number_duration +
    ", " +
    colour_color +
    ", " +
    number_percentage +
    ")" +
    value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_loading_bar"] = function (block) {
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code =
    "animLoadingBar(" +
    number_duration +
    ", " +
    colour_color1 +
    ", " +
    colour_color2 +
    ")" +
    value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_none"] = function (block) {
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code = "animNone(" + number_duration + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_color_roll"] = function (block) {
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code =
    "animColorRoll(" +
    number_duration +
    ", " +
    colour_color1 +
    ", " +
    colour_color2 +
    ")" +
    value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_palette_roll"] = function (block) {
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var colour_color3 = block.getFieldValue("COLOR3");
  var colour_color4 = block.getFieldValue("COLOR4");
  var colour_color5 = block.getFieldValue("COLOR5");
  var colour_color6 = block.getFieldValue("COLOR6");
  var colour_color7 = block.getFieldValue("COLOR7");
  var colour_color8 = block.getFieldValue("COLOR8");
  var number_zoom = formatPercentage(block.getFieldValue("ZOOM"));
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );
  var code =
    "animPaletteRoll(" +
    number_duration +
    ", " +
    colour_color1 +
    ", " +
    colour_color2 +
    ", " +
    colour_color3 +
    ", " +
    colour_color4 +
    ", " +
    colour_color5 +
    ", " +
    colour_color6 +
    ", " +
    colour_color7 +
    ", " +
    colour_color8 +
    ", " +
    number_zoom +
    ")" +
    value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["handler"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_handler_type = block.getFieldValue("HANDLER_TYPE");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    dropdown_handler_type +
    "(" +
    number_start +
    ", " +
    number_duration +
    ', "' +
    text_device_label +
    '", {\n' +
    statements_sequence +
    "});\n"
  );
};

Blockly.Tngl["handler_manual"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_handler_trigger = block.getFieldValue("HANDLER_TRIGGER");
  var text_handler_param = block.getFieldValue("HANDLER_PARAM");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    dropdown_handler_trigger +
    "[" +
    text_handler_param +
    "](" +
    number_start +
    ", " +
    number_duration +
    ', "' +
    text_device_label +
    '", {\n' +
    statements_sequence +
    "});\n"
  );
};

Blockly.Tngl["handler_ontouch"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_touch_port = block.getFieldValue("TOUCH_PORT");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    "handlerTouch[" +
    dropdown_touch_port +
    "](" +
    number_start +
    ", " +
    number_duration +
    ', "' +
    text_device_label +
    '", {\n' +
    statements_sequence +
    "});\n"
  );
};

Blockly.Tngl["handler_onimpact"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_intensity = block.getFieldValue("INTENSITY");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    "handlerMovement[" +
    dropdown_intensity +
    "](" +
    number_start +
    ", " +
    number_duration +
    ', "' +
    text_device_label +
    '", {\n' +
    statements_sequence +
    "});\n"
  );
};

Blockly.Tngl["handler_onkeypress"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_key = block.getFieldValue("KEY");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    "handlerKeyPress[" +
    dropdown_key +
    "](" +
    number_start +
    ", " +
    number_duration +
    ', "' +
    text_device_label +
    '", {\n' +
    statements_sequence +
    "});\n"
  );
};

Blockly.Tngl["commentary_block"] = function (block) {
  var text_comment = block.getFieldValue("COMMENT");
  var statements_canvas_commands = Blockly.Tngl.statementToCode(
    block,
    "CANVAS_COMMANDS"
  );
  var code = statements_canvas_commands;
  return code;
};

Blockly.Tngl["commentary_line"] = function (block) {
  var text_comment = block.getFieldValue("COMMENT");
  var code = "";
  return code;
};

Blockly.Tngl["dummy_animation_next"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_add_animation"] = function (block) {
  var code = "animNone(0)";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["clip_definition"] = function (block) {
  var text_clip_id = block.getFieldValue("CLIP_ID");
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  var code =
    'defClip("' +
    text_clip_id +
    '", ' +
    number_duration +
    ", {\n" +
    statements_sequence +
    "});\n";
  return code;
};

Blockly.Tngl["clip_animation_call"] = function (block) {
  var text_clip_id = block.getFieldValue("CLIP_ID");
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var value_next = decodeNextAnimationValue(
    Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE)
  );

  var code =
    "clip(" + number_duration + ', "' + text_clip_id + '")' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["commentary_spacer"] = function (block) {
  var code = "\n";
  return code;
};

Blockly.Tngl["window"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  var func;

  switch (dropdown_draw_mode) {
    case "NONE":
      func = "frame";
      break;
    case "SET":
      func = "setWindow";
      break;
    case "ADD":
      func = "addWindow";
      break;
    case "SUB":
      func = "subWindow";
      break;
    case "MUL":
      func = "mulWindow";
      break;
    case "FIL":
      func = "filWindow";
      break;
  }

  var code =
    func +
    "(" +
    number_start +
    ", " +
    number_duration +
    ", {\n" +
    statements_sequence +
    "});\n";

  return code;
};

Blockly.Tngl["window_2"] = function (block) {
  var number_from = secToMiliSec(block.getFieldValue("FROM"));
  var number_to = secToMiliSec(block.getFieldValue("TO"));
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  var func;

  switch (dropdown_draw_mode) {
    case "NONE":
      func = "frame";
      break;
    case "SET":
      func = "setWindow";
      break;
    case "ADD":
      func = "addWindow";
      break;
    case "SUB":
      func = "subWindow";
      break;
    case "MUL":
      func = "mulWindow";
      break;
    case "FIL":
      func = "filWindow";
      break;
  }

  var code =
    func +
    "(" +
    number_from +
    ", " +
    (number_to - number_from) +
    ", {\n" +
    statements_sequence +
    "});\n";

  return code;
};

// Blockly.Tngl['window_with_effect'] = function(block) {
//   var number_start = block.getFieldValue('START');
//   var number_duration = block.getFieldValue('DURATION');
//   var dropdown_draw_mode = block.getFieldValue('DRAW_MODE');
//   var statements_sequence = Blockly.Tngl.statementToCode(block, 'SEQUENCE');
//   var dropdown_effect = block.getFieldValue('EFFECT');
//   var number_effect_from = block.getFieldValue('EFFECT_FROM');
//   var number_effect_to = block.getFieldValue('EFFECT_TO');
//   // TODO: Assemble Tngl into code variable.
//   var code = '...;\n';
//   return code;
// };

Blockly.Tngl["tangle_definition"] = function (block) {
  var text_tangle_id = block.getFieldValue("TANGLE_ID");
  var value_pixels = Blockly.Tngl.valueToCode(
    block,
    "PIXELS",
    Blockly.Tngl.ORDER_NONE
  );

  var code = 'defTangle("' + text_tangle_id + '", {\n' + value_pixels + "});\n";
  return code;
};

Blockly.Tngl["tangle_pixels"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var number_range_from = block.getFieldValue("RANGE_FROM");
  var number_range_count = block.getFieldValue("RANGE_COUNT");
  var number_range_step = block.getFieldValue("RANGE_STEP");
  var value_pixels = Blockly.Tngl.valueToCode(
    block,
    "PIXELS",
    Blockly.Tngl.ORDER_NONE
  );

  var code =
    '  pixels("' +
    text_device_label +
    '", ' +
    dropdown_port +
    ", " +
    number_range_from +
    ", " +
    number_range_count +
    ", " +
    number_range_step +
    ");\n" +
    value_pixels;

  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["tangle_neopixel"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var checkbox_reverse =
    block.getFieldValue("REVERSE") == "TRUE" ? "true" : "false";
  var value_pixels = Blockly.Tngl.valueToCode(
    block,
    "PIXELS",
    Blockly.Tngl.ORDER_NONE
  );

  var code =
    '  neopixel("' +
    text_device_label +
    '", ' +
    dropdown_port +
    ", " +
    checkbox_reverse +
    ");\n" +
    value_pixels;

  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_tangle_pixels_extend"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_tangle_pixels_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["drawing"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var value_animation = Blockly.Tngl.valueToCode(
    block,
    "ANIMATION",
    Blockly.Tngl.ORDER_NONE
  );

  var func;

  switch (dropdown_draw_mode) {
    case "SET":
      func = "setDrawing";
      break;
    case "ADD":
      func = "addDrawing";
      break;
    case "SUB":
      func = "subDrawing";
      break;
    case "MUL":
      func = "mulDrawing";
      break;
    case "FIL":
      func = "filDrawing";
      break;
  }

  var code =
    func +
    "(" +
    number_start +
    ", " +
    number_duration +
    ", " +
    value_animation +
    ");\n";
  return code;
};

// Blockly.Tngl['drawing_with_effect'] = function(block) {
//   var number_start = block.getFieldValue('START');
//   var number_duration = block.getFieldValue('DURATION');
//   var dropdown_draw_mode = block.getFieldValue('DRAW_MODE');
//   var dropdown_effect = block.getFieldValue('EFFECT');
//   var number_effect_from = block.getFieldValue('EFFECT_FROM');
//   var number_effect_to = block.getFieldValue('EFFECT_TO');
//   var value_animation = Blockly.Tngl.valueToCode(block, 'ANIMATION', Blockly.Tngl.ORDER_NONE);
//   // TODO: Assemble Tngl into code variable.
//   var code = '...;\n';
//   return code;
// };

Blockly.Tngl["dummy_drawing_add"] = function (block) {
  var code = "";
  return code;
};

Blockly.Tngl["siftcanvas_neopixels"] = function (block) {
  var value_neopixels = Blockly.Tngl.valueToCode(
    block,
    "NEOPIXELS",
    Blockly.Tngl.ORDER_NONE
  );
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  var code =
    "siftTangles({\n" +
    value_neopixels +
    "}, {\n" +
    statements_sequence +
    "});\n";
  return code;
};

Blockly.Tngl["siftcanvas_neopixel"] = function (block) {
  var dropdown_tangle = block.getFieldValue("TANGLE");
  var value_next = Blockly.Tngl.valueToCode(
    block,
    "NEXT",
    Blockly.Tngl.ORDER_NONE
  );

  var code = '  tangle("' + dropdown_tangle + '");\n' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_siftcanvas_neopixel"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_tangles"] = function (block) {
  var value_tangles = Blockly.Tngl.valueToCode(
    block,
    "TANGLES",
    Blockly.Tngl.ORDER_NONE
  );
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  var code =
    "siftTangles({\n" +
    value_tangles +
    "}, {\n" +
    statements_sequence +
    "});\n";
  return code;
};

Blockly.Tngl["siftcanvas_tangle"] = function (block) {
  var text_tangle_id = block.getFieldValue("TANGLE_ID");
  var value_next = Blockly.Tngl.valueToCode(
    block,
    "NEXT",
    Blockly.Tngl.ORDER_NONE
  );

  var code = '  tangle("' + text_tangle_id + '");\n' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_siftcanvas_tangle"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["group_definition"] = function (block) {
  var text_group_id = block.getFieldValue("GROUP_ID");
  var statements_tangles = Blockly.Tngl.statementToCode(block, "TANGLES");

  var code =
    'defGroup("' + text_group_id + '", {\n' + statements_tangles + "});\n";
  return code;
};

Blockly.Tngl["group_tangle"] = function (block) {
  var text_tangle_id = block.getFieldValue("TANGLE_ID");
  var number_shift = secToMiliSec(block.getFieldValue("SHIFT"));

  var code = 'tangle("' + text_tangle_id + '", ' + number_shift + ");\n";
  return code;
};

Blockly.Tngl["group_neopixel"] = function (block) {
  var dropdown_tangle_id = block.getFieldValue("TANGLE_ID");
  var number_shift = secToMiliSec(block.getFieldValue("SHIFT"));

  var code = 'tangle("' + dropdown_tangle_id + '", ' + number_shift + ");\n";
  return code;
};

Blockly.Tngl["group_device"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var number_shift = secToMiliSec(block.getFieldValue("SHIFT"));

  var code = 'device("' + text_device_label + '", ' + number_shift + ");\n";
  return code;
};

Blockly.Tngl["dummy_group_tangle"] = function (block) {
  var code = "";
  return code;
};

Blockly.Tngl["siftcanvas_groups"] = function (block) {
  var value_groups = Blockly.Tngl.valueToCode(
    block,
    "GROUPS",
    Blockly.Tngl.ORDER_NONE
  );
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    "siftGroups({\n" + value_groups + "}, {\n" + statements_sequence + "});\n"
  );
};

Blockly.Tngl["siftcanvas_group"] = function (block) {
  var text_group_id = block.getFieldValue("GROUP_ID");
  var value_next = Blockly.Tngl.valueToCode(
    block,
    "NEXT",
    Blockly.Tngl.ORDER_NONE
  );

  var code = '  group("' + text_group_id + '");\n' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_siftcanvas_group"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_devices"] = function (block) {
  var value_devices = Blockly.Tngl.valueToCode(
    block,
    "DEVICES",
    Blockly.Tngl.ORDER_NONE
  );
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    "siftDevices({\n" + value_devices + "}, {\n" + statements_sequence + "});\n"
  );
};

Blockly.Tngl["siftcanvas_device"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var value_next = Blockly.Tngl.valueToCode(
    block,
    "NEXT",
    Blockly.Tngl.ORDER_NONE
  );

  var code = '  device("' + text_device_label + '");\n' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_siftcanvas_device"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["device"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var number_device_identifier = formatByte(block.getFieldValue("DEVICE_IDENTIFIER"));
  var number_device_brightness = formatByte(block.getFieldValue("DEVICE_BRIGHTNESS"));

  var number_port_a_length = block.getFieldValue("PORT_A_LENGTH");
  var number_port_b_length = block.getFieldValue("PORT_B_LENGTH");
  var number_port_c_length = block.getFieldValue("PORT_C_LENGTH");
  var number_port_d_length = block.getFieldValue("PORT_D_LENGTH");

  var code =
    'defDevice("' + text_device_label + '", ' + number_device_identifier + ", " + number_device_brightness + ", " + number_port_a_length + ", " + number_port_b_length + ", " + number_port_c_length + ", " + number_port_d_length + ");\n";

  return code;
};

///////////////////////////////////////////////////////////////////////////////////////

Blockly.Tngl["clip"] = function (block) {
  var number_start = secToMiliSec(block.getFieldValue("START"));
  var number_duration = secToMiliSec(block.getFieldValue("DURATION"));
  var dropdown_type = block.getFieldValue("TYPE");
  var text_marks = block.getFieldValue("MARKS");
  var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");

  return (
    "clip(" +
    number_start +
    ", " +
    number_duration +
    ', "' +
    text_marks +
    '", {\n' +
    statements_sequence +
    "});\n"
  );
};

Blockly.Tngl["clip_marks_definition"] = function (block) {
  var text_marks_label = block.getFieldValue("MARKS_LABEL");
  var statements_marks = Blockly.Tngl.statementToCode(block, "MARKS");

  var code =
    'defMarks("' + text_marks_label + '", {\n' + statements_marks + "});\n";
  return code;
};

Blockly.Tngl["clip_mark_timestamp"] = function (block) {
  var number_timestamp = secToMiliSec(block.getFieldValue("TIMESTAMP"));
  var value_next_mark = Blockly.Tngl.valueToCode(
    block,
    "NEXT_MARK",
    Blockly.Tngl.ORDER_NONE
  );

  var code = "mark(" + number_timestamp + "); " + value_next_mark;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["clip_marks"] = function (block) {
  var value_marks = Blockly.Tngl.valueToCode(
    block,
    "MARKS",
    Blockly.Tngl.ORDER_NONE
  );
  var code = value_marks + "\n";
  return code;
};

Blockly.Tngl["clip_mark_manual"] = function (block) {
  var text_code = block.getFieldValue("CODE");
  var code = text_code;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_clip_mark_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["dummy_clip_mark"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["code_inline"] = function (block) {
  var text_inline_code = block.getFieldValue("INLINE_CODE");
  var code = text_inline_code + "\n";
  return code;
};

// Blockly.Tngl["film_definition"] = function (block) {
//   var text_film_label = block.getFieldValue("FILM_LABEL");
//   var number_duration = block.getFieldValue("DURATION");
//   var statements_sequence = Blockly.Tngl.statementToCode(block, "SEQUENCE");
//   // TODO: Assemble Tngl into code variable.
//   var code = "...;\n";
//   return code;
// };

// Blockly.Tngl["film_call"] = function (block) {
//   var text_film_label = block.getFieldValue("FILM_LABEL");
//   var number_duration = block.getFieldValue("DURATION");
//   var value_next = Blockly.Tngl.valueToCode(
//     block,
//     "NEXT",
//     Blockly.Tngl.ORDER_NONE
//   );
//   // TODO: Assemble Tngl into code variable.
//   var code = "...";
//   // TODO: Change ORDER_NONE to the correct strength.
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

Blockly.Tngl["time_manipulator"] = function (block) {
  var number_from_time_unit =  secToMiliSec(block.getFieldValue("FROM_TIME_UNIT"));
  var number_to_time_unit = secToMiliSec(block.getFieldValue("TO_TIME_UNIT"));
  var statements_drawables = Blockly.Tngl.statementToCode(block, "DRAWABLES");

  //timetransformer(1, 2, {});

  return "timetransformer(" + number_from_time_unit + ", " + number_to_time_unit + ", {\n" + statements_drawables + "});\n";
};
