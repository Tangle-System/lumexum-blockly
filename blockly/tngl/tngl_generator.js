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

// function secToMiliSec(sec) {
//   return Math.floor(parseFloat(sec) * 1000);
// }

function formatByte(value) {
  if(value < 0) {
    return "0x00";
  } else if (value < 16) {
    return "0x0" + value.toString(16);
  } else if (value < 256) {
    return "0x" + value.toString(16);
  } else {
    return "0xff";
  }
}

// function formatFloat(number) {
//   if (Number.isInteger(number)) {
//     return number + ".0";
//   } else {
//     return number.toString();
//   }
// }

function formatBytePercentage(percent) {
  let value = percent.substring(0, percent.indexOf("%"));

  //return ((percent * 1000) / 1000).toString() + "%";
  return formatByte(Math.round(value * 255.0 / 100.0));
}


function formatPercentage(percent) {
  //return ((percent * 1000) / 1000).toString() + "%";
  return percent.replace(/ /g, '');
}

function formatPixels(pixels) {
  //return ((percent * 1000) / 1000).toString() + "%";
  return pixels.replace(/ /g, '');
}


// function ratioToByte(ratio) {
//   return Math.floor(ratio * 255);
// }

function formatNextAnimationValue(value_next) {
  if (value_next != "") {
    //return ".next(" + value_next + ")";
    return "." + value_next;
  } else {
    return "";
  }
}

function formatLabel(label) {
  return label;
}

function formatTimestamp(timestamp) {
  return timestamp.replace(/ /g, '');
}


function decodeExtendDeviceValue(value_next) {
  if (value_next != "") {
    return ".extends(" + value_next + ")";
  } else {
    return "";
  }
}

function getDuration(from, to) {
  function validateTimestamp(value) {
    if (!value) {
      return [0, "0s"];
    }
  
    if (typeof value == "number") {
      value = value.toString();
    }
  
    value = value.trim();
  
    if (value == "inf" || value == "Inf" || value == "infinity" || value == "Infinity") {
      return [2147483647, "Infinity"];
    }
  
    if (value == "-inf" || value == "-Inf" || value == "-infinity" || value == "-Infinity") {
      return [-2147483648, "-Infinity"];
    }
  
    // if the string value is a number
    if (!isNaN(value)) {
      value += "s";
    }
  
    let days = value.match(/([+-]? *[0-9]+[.]?[0-9]*|[.][0-9]+)\s*d/gi);
    let hours = value.match(/([+-]? *[0-9]+[.]?[0-9]*|[.][0-9]+)\s*h/gi);
    let minutes = value.match(/([+-]? *[0-9]+[.]?[0-9]*|[.][0-9]+)\s*m(?!s)/gi);
    let secs = value.match(/([+-]? *[0-9]+[.]?[0-9]*|[.][0-9]+)\s*s/gi);
    let msecs = value.match(/([+-]? *[0-9]+[.]?[0-9]*|[.][0-9]+)\s*(t|ms)/gi);
  
    let result = "";
    let total = 0;
  
    // logging.verbose(days);
    // logging.verbose(hours);
    // logging.verbose(minutes);
    // logging.verbose(secs);
    // logging.verbose(msecs);
  
    while (days && days.length) {
      let d = parseFloat(days[0].replace(/\s/, ""));
      result += d + "d ";
      total += d * 86400000;
      days.shift();
    }
  
    while (hours && hours.length) {
      let h = parseFloat(hours[0].replace(/\s/, ""));
      result += h + "h ";
      total += h * 3600000;
      hours.shift();
    }
  
    while (minutes && minutes.length) {
      let m = parseFloat(minutes[0].replace(/\s/, ""));
      result += m + "m ";
      total += m * 60000;
      minutes.shift();
    }
  
    while (secs && secs.length) {
      let s = parseFloat(secs[0].replace(/\s/, ""));
      result += s + "s ";
      total += s * 1000;
      secs.shift();
    }
  
    while (msecs && msecs.length) {
      let ms = parseFloat(msecs[0].replace(/\s/, ""));
      result += ms + "ms ";
      total += ms;
      msecs.shift();
    }
  
    if (total >= 2147483647) {
      return [2147483647, "Infinity"];
    } else if (total <= -2147483648) {
      return [-2147483648, "-Infinity"];
    } else if (result === "") {
      return [0, "0s"];
    } else {
      return [total, result.trim()];
    }
  }

  if (from == "Infinity") {
    return "0t";
  } else if (from == "-Infinity") {
    return to;
  } else if (to == "-Infinity") {
    return "0t";
  } else if (to == "Infinity") {
    return "Infinity";
  } else {
    return validateTimestamp(to)[0] - validateTimestamp(from)[0] + "t";
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////

Blockly.Tngl["animation_dummy_next"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_dummy_add"] = function (block) {
  var code = "animNone(0t)";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["drawing"] = function (block) {
  var text_start = block.getFieldValue("START");
  var dropdown_time_definition = block.getFieldValue("TIME_DEFINITION");
  var text_duration = block.getFieldValue("DURATION");
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var value_animation = Blockly.Tngl.valueToCode(block, "ANIMATION", Blockly.Tngl.ORDER_NONE);

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
    case "SCALE":
      func = "scaDrawing";
      break;
    case "FIL":
      func = "filDrawing";
      break;
  }

  if (dropdown_time_definition === "DURATION") {
    return func + "(" + formatTimestamp(text_start) + ", " + formatTimestamp(text_duration) + ", " + value_animation + ");\n";
  } else {
    return func + "(" + formatTimestamp(text_start) + ", " + formatTimestamp(getDuration(text_start, text_duration)) + ", " + value_animation + ");\n";
  }
};

Blockly.Tngl["drawing_dummy"] = function (block) {
  var code = "";
  return code;
};

Blockly.Tngl["animation_definition"] = function (block) {
  var text_animation_label = block.getFieldValue("ANIMATION_LABEL");
  var text_duration = block.getFieldValue("DURATION");
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  // defAnimation("asdf", 5000);
  var code = 'defAnimation(' + formatLabel(text_animation_label) + ', ' + formatTimestamp(text_duration) + ", {\n" + statements_body + "});\n";
  return code;
};

Blockly.Tngl["animation_call"] = function (block) {
  var text_animation_label = block.getFieldValue("ANIMATION_LABEL");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  // animDefined("asdf", 5000)
  value_next = formatNextAnimationValue(value_next);
  var code = 'animDefined(' + formatLabel(text_animation_label) + ', ' + formatTimestamp(text_duration) + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_fill"] = function (block) {
  var colour_color = block.getFieldValue("COLOR");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);
  var code = "animFill(" + formatTimestamp(text_duration) + ", " + colour_color + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_rainbow"] = function (block) {
  var text_zoom = block.getFieldValue('ZOOM');
  var text_duration = block.getFieldValue('DURATION');
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);
  var code = "animRainbow(" + formatTimestamp(text_duration) + ", " + formatPercentage(text_zoom) + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_fade"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);
  var code = "animFade(" + formatTimestamp(text_duration) + ", " + colour_color1 + ", " + colour_color2 + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_plasma_shot"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var colour_color = block.getFieldValue("COLOR");
  var text_percentage = block.getFieldValue("PERCENTAGE");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);
  var code = "animPlasmaShot(" + formatTimestamp(text_duration) + ", " + colour_color + ", " + formatPercentage(text_percentage) + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_loading_bar"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);
  var code = "animLoadingBar(" + formatTimestamp(text_duration) + ", " + colour_color1 + ", " + colour_color2 + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_none"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);
  var code = "animNone(" + formatTimestamp(text_duration) + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_color_roll"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);
  var code = "animColorRoll(" + formatTimestamp(text_duration) + ", " + colour_color1 + ", " + colour_color2 + ")" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["animation_palette_roll"] = function (block) {
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var colour_color3 = block.getFieldValue("COLOR3");
  var colour_color4 = block.getFieldValue("COLOR4");
  var colour_color5 = block.getFieldValue("COLOR5");
  var colour_color6 = block.getFieldValue("COLOR6");
  var colour_color7 = block.getFieldValue("COLOR7");
  var colour_color8 = block.getFieldValue("COLOR8");
  var text_zoom = block.getFieldValue("ZOOM");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  value_next = formatNextAnimationValue(value_next);

  var code =
    "animPaletteRoll(" +
    formatTimestamp(text_duration) +
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
    formatPercentage(text_zoom) +
    ")" +
    value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["window"] = function (block) {
  var text_start = block.getFieldValue("START");
  var dropdown_time_definition = block.getFieldValue("TIME_DEFINITION");
  var text_duration = block.getFieldValue("DURATION");
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  // addWindow(0, 5000, { ~modifiers~ }, {
  //   ~body~
  // });

  var func;

  switch (dropdown_draw_mode) {
    case "SET":
      func = "setWindow";
      break;
    case "ADD":
      func = "addWindow";
      break;
    case "SUB":
      func = "subWindow";
      break;
    case "SCALE":
      func = "scaWindow";
      break;
    case "FIL":
      func = "filWindow";
      break;
  }

  if (dropdown_time_definition === "DURATION") {
    var code = func + "(" + formatTimestamp(text_start) + ", " + formatTimestamp(text_duration) + ", {\n" + statements_body + "})" + value_modifier + ";\n";
  } else {
    var code = func + "(" + formatTimestamp(text_start) + ", " + formatTimestamp(getDuration(text_start, text_duration)) + ", {\n" + statements_body + "})" + value_modifier + ";\n";
  }

  return code;
};

Blockly.Tngl["window_2"] = function (block) {
  var text_from = block.getFieldValue("FROM");
  var text_to = block.getFieldValue("TO");
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  // addWindow(0, 5000, { ~modifiers~ }, {
  //   ~body~
  // });

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
    case "SCALE":
      func = "scaWindow";
      break;
    case "FIL":
      func = "filWindow";
      break;
  }

  var code = func + "(" + formatTimestamp(text_from) + ", " + formatTimestamp(getDuration(text_from, text_to)) + ", {\n" + statements_body + "})" + value_modifier + ";\n";
  return code;
};

Blockly.Tngl["modifier_brightness"] = function (block) {
  var text_variable_label = block.getFieldValue("VARIABLE_LABEL");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);

  var code = ".modifyBrightness(" + text_variable_label + ")" + value_modifier;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["modifier_timeline"] = function (block) {
  var dropdown_time_source = block.getFieldValue("TIME_SOURCE");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);

  var code = ".modifyTimeline(" + dropdown_time_source + ")" + value_modifier;
  return [code, Blockly.Tngl.ORDER_NONE];
};

// Blockly.Tngl["modifier_dafein"] = function (block) {
//   var text_duration = block.getFieldValue("DURATION");
//   var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);

//   var code = ".modifyFadeIn(" + formatTimestamp(text_duration) + ")" + value_modifier;
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["modifier_dafeout"] = function (block) {
//   var text_duration = block.getFieldValue("DURATION");
//   var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);

//   var code = ".modifyFadeOut(" + formatTimestamp(text_duration) + ")" + value_modifier;
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

Blockly.Tngl["modifier_color_switch"] = function (block) {
  var dropdown_option = block.getFieldValue("OPTION");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);

  var code = ".modifyColorSwitch(" + dropdown_option + ")" + value_modifier;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["modifier_timechange"] = function (block) {
  var text_from_time_unit = block.getFieldValue("FROM_TIME_UNIT");
  var text_to_time_unit = block.getFieldValue("TO_TIME_UNIT");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);
  // .modifyTimeChange(1000, 2000)
  var code = ".modifyTimeChange(" + formatTimestamp(text_from_time_unit) + ", " + formatTimestamp(text_to_time_unit) + ")" + value_modifier;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["modifier_timeloop"] = function (block) {
  var text_loop = block.getFieldValue("LOOP");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);
  // .modifyTimeLoop(1000)
  var code = ".modifyTimeLoop(" + formatTimestamp(text_loop) + ")" + value_modifier;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl['modifier_timescale'] = function(block) {
  var text_variable_label = block.getFieldValue("VARIABLE_LABEL");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);

   // .modifyTimeScale($var)
   var code = ".modifyTimeScale(" + formatLabel(text_variable_label) + ")" + value_modifier;
   return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["modifier_fade"] = function (block) {
  var dropdown_fade_type = block.getFieldValue("FADE_TYPE");
  var text_duration = block.getFieldValue("DURATION");
  var value_modifier = Blockly.Tngl.valueToCode(block, "MODIFIER", Blockly.Tngl.ORDER_NONE);

  let code = "";

  switch (dropdown_fade_type) {
    case "FADE_IN":
      code = ".modifyFadeIn(" + formatTimestamp(text_duration) + ")" + value_modifier;
      break;

    case "FADE_OUT":
      code = ".modifyFadeOut(" + formatTimestamp(text_duration) + ")" + value_modifier;
      break;

    default:
      console.error("Unknown dropdown type");
      break;
  }

  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["modifier_dummy_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl['modifier_settime'] = function(block) {
  var text_timestamp = block.getFieldValue('TIMESTAMP');
  var value_modifier = Blockly.Tngl.valueToCode(block, 'MODIFIER', Blockly.Tngl.ORDER_NONE);
  var code = ".modifyTimeSet(" + formatTimestamp(text_timestamp) + ")" + value_modifier;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["frame"] = function (block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");
  // frame(0, 5000, { });
  var code = "frame(" + formatTimestamp(text_start) + ", " + formatTimestamp(text_duration) + ", {\n" + statements_body + "});\n";
  return code;
};

// Blockly.Tngl["filter"] = function (block) {
//   var text_start = block.getFieldValue("START");
//   var text_duration = block.getFieldValue("DURATION");
//   var value_filter = Blockly.Tngl.valueToCode(block, "FILTER", Blockly.Tngl.ORDER_NONE);
//   // filterNone(0, 1000)
//   var code = value_filter.replace("%START", formatTimestamp(text_start)).replace("%DURATION", formatTimestamp(text_duration));
//   return code;
// };

// Blockly.Tngl["filter_blur"] = function (block) {
//   var number_blur = block.getFieldValue("BLUR");
//   // filterBlur(0, 1000, 10%)
//   var code = "filterBlur(%START, %DURATION, " + formatPercentage(number_blur) + ");\n";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["filter_color_shift"] = function (block) {
//   var dropdown_direction = block.getFieldValue("DIRECTION");
//   // filterColorShift(0, 1000, false)
//   var code = "filterColorShift(%START, %DURATION, " + dropdown_direction + ");\n";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["filter_mirror"] = function (block) {
//   var dropdown_mode = block.getFieldValue("MODE");
//   // filterMirror(0, 1000, true)
//   var code = "filterMirror(%START, %DURATION, " + dropdown_mode + ");\n";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["filter_add_dummy"] = function (block) {
//   // filterNone(0, 1000)
//   var code = "filterNone(%START, %DURATION);\n";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["filter_scatter"] = function (block) {
//   // filterScatter(0, 1000);
//   var code = "filterScatter(%START, %DURATION);\n";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

Blockly.Tngl["event_source"] = function (block) {
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var value_event = Blockly.Tngl.valueToCode(block, "EVENT", Blockly.Tngl.ORDER_NONE);
  // onEvent($evnt);
  var code = "handleEvent(" + formatLabel(text_event_label) + ")" + value_event + ";\n";
  return code;
};

Blockly.Tngl["event_replace_param"] = function (block) {
  var text_event_parameter = block.getFieldValue("EVENT_PARAMETER");
  var value_event = Blockly.Tngl.valueToCode(block, "EVENT", Blockly.Tngl.ORDER_NONE);
  // ->setEventParam()
  var code = "->setValue(" + text_event_parameter + ")" + value_event;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["event_dummy_add"] = function (block) {
  // ->emitLocalEvent($none)
  // var code = "->emitLocalEvent($none)";
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl['event_emit_code'] = function(block) {
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var value_event = Blockly.Tngl.valueToCode(block, 'EVENT', Blockly.Tngl.ORDER_NONE);
  // ->emitLocalEvent($evnt)
  var code = "->emitAs(" + formatLabel(text_event_label) + ")" + value_event;
  return [code, Blockly.Tngl.ORDER_NONE];
};

// Blockly.Tngl["event_emit_timeline"] = function (block) {
//   var text_timestamp = block.getFieldValue("TIMESTAMP");
//   var value_event = Blockly.Tngl.valueToCode(block, "EVENT", Blockly.Tngl.ORDER_NONE);
//   // emitAt(1000s)
//   var code = "emitAt(" + formatTimestamp(text_timestamp) + ")" + value_event + ";\n";
//   return code;
// };

Blockly.Tngl['handler_manual'] = function(block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");
 
  return "interactive(" + formatTimestamp(text_start) + ", " + formatTimestamp(text_duration) + ", " + formatLabel(text_event_label) + ", {\n" + statements_body + "});\n";
};

// Blockly.Tngl["channel_write"] = function (block) {
//   var number_channel = block.getFieldValue("CHANNEL");
//   var value_source = Blockly.Tngl.valueToCode(block, "SOURCE", Blockly.Tngl.ORDER_NONE);
//   // writeChannel(0x00, channel(0x01));
//   var code = "writeChannel(" + formatByte(number_channel) + ", " + value_source + ");\n";
//   return code;
// };

// Blockly.Tngl["channel_read"] = function (block) {
//   var number_channel = block.getFieldValue("CHANNEL");
//   // channel(0x01)
//   var code = "channel(" + formatByte(number_channel) + ")";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["channel_destination_ptr"] = function (block) {
// var number_channel = block.getFieldValue('CHANNEL');
// var value_source = Blockly.Tngl.valueToCode(block, 'SOURCE', Blockly.Tngl.ORDER_NONE);
//   // writeChannel(channel(0x01), genSmoothOut(value(0x00), channel(0x00)));

//   var code = "writeChannel(channel(" + formatByte(number_channel) + "), " + value_source + ");\n";
//   return code;
// };

// Blockly.Tngl["channel_ptr_read"] = function (block) {
//  var number_channel = block.getFieldValue('CHANNEL');
//   // channel(channel(0x00))

//   var code = "channel(channel(" + formatByte(number_channel) + "))";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["channel_dummy_add"] = function (block) {
//   var code = "value(0x00)";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["channel_constant"] = function (block) {
//   var number_channel = block.getFieldValue("CHANNEL");
//   var code = "value(" + formatByte(number_channel) + ")";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["channel_event_parameter_smoother"] = function (block) {
//   var text_event_label = block.getFieldValue("EVENT_LABEL");
//   var text_duration = block.getFieldValue("DURATION");
//   var code = "eventParameterValueSmoothed(" + formatLabel(text_event_label) + ", " + formatTimestamp(text_duration) + ")";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["channel_event_parameter"] = function (block) {
//   var text_event_label = block.getFieldValue("EVENT_LABEL");
//   var code = "eventParameterValue(" + formatLabel(text_event_label) + ")";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl["channel_gate_math"] = function (block) {
//   var dropdown_option = block.getFieldValue("OPTION");
//   var value_parameter_a = Blockly.Tngl.valueToCode(block, "PARAMETER_A", Blockly.Tngl.ORDER_NONE);
//   var value_parameter_b = Blockly.Tngl.valueToCode(block, "PARAMETER_B", Blockly.Tngl.ORDER_NONE);

//   var func = "";

//   switch (dropdown_option) {
//     case "ADD":
//       func = "addValues";
//       break;
//     case "SUB":
//       func = "subValues";
//       break;
//     case "MUL":
//       func = "mulValues";
//       break;
//     case "DIV":
//       func = "divValues";
//       break;
//     case "MOD":
//       func = "modValues";
//       break;
//     case "SCALE":
//       func = "scaValue";
//       break;

//     default:
//       break;
//   }

//   var code = func + "(" + value_parameter_a + ", " + value_parameter_b + ")";
//   // TODO: Change ORDER_NONE to the correct strength.
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

// Blockly.Tngl['channel_gate_map'] = function(block) {
//   var value_parameter_x = Blockly.Tngl.valueToCode(block, 'PARAMETER_X', Blockly.Tngl.ORDER_NONE);
//   var value_parameter_inmin = Blockly.Tngl.valueToCode(block, "PARAMETER_INMIN", Blockly.Tngl.ORDER_NONE);
//   var value_parameter_inmax = Blockly.Tngl.valueToCode(block, "PARAMETER_INMAX", Blockly.Tngl.ORDER_NONE);
//   var value_parameter_outmin = Blockly.Tngl.valueToCode(block, "PARAMETER_OUTMIN", Blockly.Tngl.ORDER_NONE);
//   var value_parameter_outmax = Blockly.Tngl.valueToCode(block, "PARAMETER_OUTMAX", Blockly.Tngl.ORDER_NONE);
//   // mapValue(channel(0x00), value(0x00), value(0xff), value(0xff), value(0x00))
//   var code = "mapValue(" + value_parameter_x + ", " + value_parameter_inmin + ", " + value_parameter_inmax+ ", " + value_parameter_outmin+ ", " + value_parameter_outmax + ")";
//   return [code, Blockly.Tngl.ORDER_NONE];
// };

Blockly.Tngl["clip"] = function (block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var value_marks = Blockly.Tngl.valueToCode(block, "MARKS", Blockly.Tngl.ORDER_NONE);
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  return "clip(" + formatTimestamp(text_start) + ", " + formatTimestamp(text_duration) + ", " + value_marks + ", {\n" + statements_body + "});\n";
};

Blockly.Tngl["clip_marks_definition"] = function (block) {
  var text_marks_label = block.getFieldValue("MARKS_LABEL");
  var statements_marks = Blockly.Tngl.statementToCode(block, "MARKS");

  var code = 'defMarks(' + formatLabel(text_marks_label) + ', {\n' + statements_marks + "});\n";
  return code;
};

Blockly.Tngl["clip_mark_timestamp"] = function (block) {
  var text_timestamp = block.getFieldValue("TIMESTAMP");
  var value_next_mark = Blockly.Tngl.valueToCode(block, "NEXT_MARK", Blockly.Tngl.ORDER_NONE);

  var code = ", " + formatTimestamp(text_timestamp) + value_next_mark;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["clip_marks"] = function (block) {
  var text_marks = block.getFieldValue("MARKS");

  var code = "" + formatLabel(text_marks) + "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["clip_mark"] = function (block) {
  var text_timestamp = block.getFieldValue("TIMESTAMP");
  var value_mark = Blockly.Tngl.valueToCode(block, "MARK", Blockly.Tngl.ORDER_NONE);

  var code = formatTimestamp(text_timestamp) + value_mark + "\n";
  return code;
};

Blockly.Tngl["clip_marks_inline"] = function (block) {
  var text_marks = block.getFieldValue("MARKS");

  var code = ", " + text_marks;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["clip_dummy_mark"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["clip_dummy_mark_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["tangle_definition"] = function (block) {
  var text_tangle_label = block.getFieldValue("TANGLE_LABEL");
  var value_pixels = Blockly.Tngl.valueToCode(block, "PIXELS", Blockly.Tngl.ORDER_NONE);

  var code = "defTangle(" + formatLabel(text_tangle_label) + ", {\n" + value_pixels + "});\n";
  return code;
};

Blockly.Tngl["tangle_port"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var checkbox_reverse = block.getFieldValue("REVERSE") == "TRUE";
  var value_pixels = Blockly.Tngl.valueToCode(block, "PIXELS", Blockly.Tngl.ORDER_NONE);

  var code = "  port(" + formatLabel(text_device_label) + ", " + (checkbox_reverse ? "-" : "") + dropdown_port + ");\n" + value_pixels;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["tangle_pixels"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var text_range_from = block.getFieldValue("RANGE_FROM");
  var text_range_count = block.getFieldValue("RANGE_COUNT");
  var text_range_step = block.getFieldValue("RANGE_STEP");
  var value_pixels = Blockly.Tngl.valueToCode(block, "PIXELS", Blockly.Tngl.ORDER_NONE);

  var code = '  slice(' + formatLabel(text_device_label) + ', ' + text_range_from + ", " + text_range_count + ", " + text_range_step + ");\n" + value_pixels;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["tangle_dummy_pixels_extend"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["tangle_dummy_pixels_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["group_port"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var text_shift = block.getFieldValue("SHIFT");
  var code = "tangle(" + dropdown_port + ", " + formatTimestamp(text_shift) + ");\n";
  return code;
};

Blockly.Tngl["group_definition"] = function (block) {
  var text_group_label = block.getFieldValue("GROUP_LABEL");
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");
  var code = 'defGroup(' + formatLabel(text_group_label) + ', {\n' + statements_body + "});\n";
  return code;
};

Blockly.Tngl["group_tangle"] = function (block) {
  var text_tangle_label = block.getFieldValue("TANGLE_LABEL");
  var text_shift = block.getFieldValue("SHIFT");
  var code = "tangle(" + formatLabel(text_tangle_label) + ", " + formatTimestamp(text_shift) + ");\n";
  return code;
};

Blockly.Tngl["group_dummy_tangle"] = function (block) {
  var code = "";
  return code;
};

Blockly.Tngl["siftcanvas_tangles"] = function (block) {
  var value_tangles = Blockly.Tngl.valueToCode(block, "TANGLES", Blockly.Tngl.ORDER_NONE);
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  var code = "siftTangles({\n" + value_tangles + "}, {\n" + statements_body + "});\n";
  return code;
};

Blockly.Tngl["siftcanvas_tangle"] = function (block) {
  var text_tangle_label = block.getFieldValue("TANGLE_LABEL");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  var code = '  tangle(' + formatLabel(text_tangle_label) + ');\n' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_dummy_tangle_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_groups"] = function (block) {
  var value_groups = Blockly.Tngl.valueToCode(block, "GROUPS", Blockly.Tngl.ORDER_NONE);
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  return "siftGroups({\n" + value_groups + "}, {\n" + statements_body + "});\n";
  return code;
};

Blockly.Tngl["siftcanvas_group"] = function (block) {
  var text_group_label = block.getFieldValue("GROUP_LABEL");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  var code = '  group(' + formatLabel(text_group_label) + ');\n' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_dummy_group_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_device"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  var code = '  device(' + formatLabel(text_device_label) + ');\n' + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_devices"] = function (block) {
  var value_devices = Blockly.Tngl.valueToCode(block, "DEVICES", Blockly.Tngl.ORDER_NONE);
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  return "siftDevices({\n" + value_devices + "}, {\n" + statements_body + "});\n";
};

Blockly.Tngl["siftcanvas_dummy_device_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_port"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var value_next = Blockly.Tngl.valueToCode(block, "NEXT", Blockly.Tngl.ORDER_NONE);

  var code = "  tangle(" + dropdown_port + ");\n" + value_next;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["siftcanvas_ports"] = function (block) {
  var value_ports = Blockly.Tngl.valueToCode(block, "PORTS", Blockly.Tngl.ORDER_NONE);
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  var code = "siftTangles({\n" + value_ports + "}, {\n" + statements_body + "});\n";
  return code;
};

Blockly.Tngl["siftcanvas_dummy_port_add"] = function (block) {
  var code = "";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["time_loop"] = function (block) {
  var text_loop = block.getFieldValue("LOOP");
  var statements_body = Blockly.Tngl.statementToCode(block, "BODY");

  var code = "timeloop(" + formatTimestamp(text_loop) + ", {\n" + statements_body + "});\n";
  return code;
};

Blockly.Tngl["code_inline"] = function (block) {
  var text_inline_code = block.getFieldValue("INLINE_CODE");
  var code = text_inline_code + "\n";
  return code;
};

Blockly.Tngl["commentary_block"] = function (block) {
  var text_comment = block.getFieldValue("COMMENT");
  var statements_canvas_commands = Blockly.Tngl.statementToCode(block, "CANVAS_COMMANDS");
  var code = "// " + text_comment + "\n" + statements_canvas_commands;
  return code;
};

Blockly.Tngl["commentary_line"] = function (block) {
  var text_comment = block.getFieldValue("COMMENT");
  var code = "// " + text_comment + "\n";
  return code;
};

Blockly.Tngl["commentary_inline"] = function (block) {
  // var text_comment = block.getFieldValue("COMMENT");
  var value_block = Blockly.Tngl.valueToCode(block, "BLOCK", Blockly.Tngl.ORDER_NONE);
  var code = value_block;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["commentary_spacer"] = function (block) {
  var code = "\n";
  return code;
};

Blockly.Tngl["device_4ports"] = function (block) {
  var text_device_label = block.getFieldValue('DEVICE_LABEL');
  var number_device_identifier = block.getFieldValue('DEVICE_IDENTIFIER');
  var text_device_brightness = block.getFieldValue('DEVICE_BRIGHTNESS');
  var checkbox_tangle_a = block.getFieldValue('TANGLE_A') == 'TRUE';
  var text_port_a_length = block.getFieldValue('PORT_A_LENGTH');
  var checkbox_tangle_b = block.getFieldValue('TANGLE_B') == 'TRUE';
  var text_port_b_length = block.getFieldValue('PORT_B_LENGTH');
  var checkbox_tangle_c = block.getFieldValue('TANGLE_C') == 'TRUE';
  var text_port_c_length = block.getFieldValue('PORT_C_LENGTH');
  var checkbox_tangle_d = block.getFieldValue('TANGLE_D') == 'TRUE';
  var text_port_d_length = block.getFieldValue('PORT_D_LENGTH');
  var statements_sensors = Blockly.Tngl.statementToCode(block, 'INPUTS');

  var portmask = 0x00;

  if (checkbox_tangle_a) {
    portmask |= 1 << 0;
  }
  if (checkbox_tangle_b) {
    portmask |= 1 << 1;
  }
  if (checkbox_tangle_c) {
    portmask |= 1 << 2;
  }
  if (checkbox_tangle_d) {
    portmask |= 1 << 3;
  }

  let active_ports = 4;

  if (text_port_d_length == "0px") {
    active_ports--;
    if (text_port_c_length == "0px") {
      active_ports--;
      if (text_port_b_length == "0px") {
        active_ports--;
      }
    }
  }

  var code =
    "defDevice(" +
    formatLabel(text_device_label) +
    ", " +
    formatByte(number_device_identifier) +
    ", " +
    formatBytePercentage(text_device_brightness) +
    ", " +
    formatByte(portmask) +
    (active_ports > 0 ? ", " + formatPixels(text_port_a_length) : "") +
    (active_ports > 1 ? ", " + formatPixels(text_port_b_length) : "") +
    (active_ports > 2 ? ", " + formatPixels(text_port_c_length) : "") +
    (active_ports > 3 ? ", " + formatPixels(text_port_d_length) : "") +
    ")" +
    statements_sensors +
    ";\n";

  return code;
};

Blockly.Tngl["device_8ports"] = function (block) {
  var text_device_label = block.getFieldValue('DEVICE_LABEL');
  var number_device_identifier = block.getFieldValue('DEVICE_IDENTIFIER');
  var text_device_brightness = block.getFieldValue('DEVICE_BRIGHTNESS');
  var checkbox_tangle_a = block.getFieldValue('TANGLE_A') == 'TRUE';
  var text_port_a_length = block.getFieldValue('PORT_A_LENGTH');
  var checkbox_tangle_b = block.getFieldValue('TANGLE_B') == 'TRUE';
  var text_port_b_length = block.getFieldValue('PORT_B_LENGTH');
  var checkbox_tangle_c = block.getFieldValue('TANGLE_C') == 'TRUE';
  var text_port_c_length = block.getFieldValue('PORT_C_LENGTH');
  var checkbox_tangle_d = block.getFieldValue('TANGLE_D') == 'TRUE';
  var text_port_d_length = block.getFieldValue('PORT_D_LENGTH');
  var checkbox_tangle_e = block.getFieldValue('TANGLE_E') == 'TRUE';
  var text_port_e_length = block.getFieldValue('PORT_E_LENGTH');
  var checkbox_tangle_f = block.getFieldValue('TANGLE_F') == 'TRUE';
  var text_port_f_length = block.getFieldValue('PORT_F_LENGTH');
  var checkbox_tangle_g = block.getFieldValue('TANGLE_G') == 'TRUE';
  var text_port_g_length = block.getFieldValue("PORT_G_LENGTH");
  var checkbox_tangle_h = block.getFieldValue("TANGLE_H") == "TRUE";
  var text_port_h_length = block.getFieldValue("PORT_H_LENGTH");
  var statements_sensors = Blockly.Tngl.statementToCode(block, "SENSORS");

  var portmask = 0x00;

  if (checkbox_tangle_a) {
    portmask |= 1 << 0;
  }
  if (checkbox_tangle_b) {
    portmask |= 1 << 1;
  }
  if (checkbox_tangle_c) {
    portmask |= 1 << 2;
  }
  if (checkbox_tangle_d) {
    portmask |= 1 << 3;
  }
  if (checkbox_tangle_e) {
    portmask |= 1 << 4;
  }
  if (checkbox_tangle_f) {
    portmask |= 1 << 5;
  }
  if (checkbox_tangle_g) {
    portmask |= 1 << 6;
  }
  if (checkbox_tangle_h) {
    portmask |= 1 << 7;
  }

  let active_ports = 8;

  if (text_port_h_length == "0px") {
    active_ports--;
    if (text_port_g_length == "0px") {
      active_ports--;
      if (text_port_f_length == "0px") {
        active_ports--;
        if (text_port_e_length == "0px") {
          active_ports--;
          if (text_port_d_length == "0px") {
            active_ports--;
            if (text_port_c_length == "0px") {
              active_ports--;
              if (text_port_b_length == "0px") {
                active_ports--;
              }
            }
          }
        }
      }
    }
  }

  var code =
    "defDevice(" +
    formatLabel(text_device_label) +
    ", " +
    formatByte(number_device_identifier) +
    ", " +
    formatBytePercentage(text_device_brightness) +
    ", " +
    formatByte(portmask) +
    (active_ports > 0 ? ", " + formatPixels(text_port_a_length) : "") +
    (active_ports > 1 ? ", " + formatPixels(text_port_b_length) : "") +
    (active_ports > 2 ? ", " + formatPixels(text_port_c_length) : "") +
    (active_ports > 3 ? ", " + formatPixels(text_port_d_length) : "") +
    (active_ports > 4 ? ", " + formatPixels(text_port_e_length) : "") +
    (active_ports > 5 ? ", " + formatPixels(text_port_f_length) : "") +
    (active_ports > 6 ? ", " + formatPixels(text_port_g_length) : "") +
    (active_ports > 7 ? ", " + formatPixels(text_port_h_length) : "") +
    ")" +
    statements_sensors +
    ";\n";

  return code;
};

Blockly.Tngl["variable_create"] = function (block) {
  var text_label = block.getFieldValue("LABEL");
  var value_source = Blockly.Tngl.valueToCode(block, "SOURCE", Blockly.Tngl.ORDER_NONE);
  // $var = 0xff;
  // var code = "$" + text_label + " = " + value_source + ";\n";
  // variable($var, 0xff);
  var code = "defVariable(" + formatLabel(text_label) + ", " + value_source + ");\n";
  return code;
};

// Blockly.Tngl["variable_modify"] = function (block) {
//   var text_label = block.getFieldValue("LABEL");
//   var value_source = Blockly.Tngl.valueToCode(block, "SOURCE", Blockly.Tngl.ORDER_NONE);
//   // $var = 0xff;
//   // var code = "$" + text_label + " = " + value_source + ";\n";
//   // variable($var, 0xff);
//   var code = "modVariable(" + formatLabel(text_label) + ", " + value_source + ");\n";
//   return code;
// };

Blockly.Tngl["value_dummy"] = function (block) {
  var code = "0%";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["value_math"] = function (block) {
  var dropdown_option = block.getFieldValue("OPTION");
  var value_parameter_a = Blockly.Tngl.valueToCode(block, "PARAMETER_A", Blockly.Tngl.ORDER_NONE);
  var value_parameter_b = Blockly.Tngl.valueToCode(block, "PARAMETER_B", Blockly.Tngl.ORDER_NONE);
  
  var func = "";

  switch (dropdown_option) {
    case "ADD":
      func = "addValues";
      break;
    case "SUB":
      func = "subValues";
      break;
    case "MUL":
      func = "mulValues";
      break;
    case "DIV":
      func = "divValues";
      break;

    default:
      break;
  }

  var code = func + "(" + value_parameter_a + ", " + value_parameter_b + ")";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["value_map"] = function (block) {
  var value_parameter_x = Blockly.Tngl.valueToCode(block, "PARAMETER_X", Blockly.Tngl.ORDER_NONE);
  var value_parameter_inmin = Blockly.Tngl.valueToCode(block, "PARAMETER_INMIN", Blockly.Tngl.ORDER_NONE);
  var value_parameter_inmax = Blockly.Tngl.valueToCode(block, "PARAMETER_INMAX", Blockly.Tngl.ORDER_NONE);
  var value_parameter_outmin = Blockly.Tngl.valueToCode(block, "PARAMETER_OUTMIN", Blockly.Tngl.ORDER_NONE);
  var value_parameter_outmax = Blockly.Tngl.valueToCode(block, "PARAMETER_OUTMAX", Blockly.Tngl.ORDER_NONE);
 // mapValue(channel(0x00), value(0x00), value(0xff), value(0xff), value(0x00))
 var code = "mapValue(" + value_parameter_x + ", " + value_parameter_inmin + ", " + value_parameter_inmax+ ", " + value_parameter_outmin+ ", " + value_parameter_outmax + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["value_read_variable"] = function (block) {
  var text_variable_label = block.getFieldValue("VARIABLE_LABEL");
  var code = "variable(" + formatLabel(text_variable_label) + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["value_constant"] = function (block) {
  var text_value = block.getFieldValue("VALUE");
  var code = text_value;
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["sensor_artnet"] = function (block) {
  var number_dmx_universe = block.getFieldValue("DMX_UNIVERSE");
  var number_dmx_channel = block.getFieldValue("DMX_CHANNEL");
  var number_dmx_channel_count = block.getFieldValue("DMX_CHANNEL_COUNT");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var code = "\n.attachSensArtNet(" + formatByte(number_dmx_universe) + ", " + formatByte(number_dmx_channel) + ", " + formatByte(number_dmx_channel_count) + " , " + formatLabel(text_event_label) + ")";
  return code;
};

Blockly.Tngl["sensor_touch"] = function (block) {
  var text_touch_label = block.getFieldValue("TOUCH_LABEL");
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var code = '\n.attachSensTouch(' + formatLabel(text_touch_label) + ', ' + dropdown_action + ', ' + formatLabel(text_event_label) + ')';
  return code;
};

Blockly.Tngl["sensor_gyro"] = function (block) {
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var code = '\n.attachSensGyroscope(' + dropdown_action + ', ' + formatLabel(text_event_label) + ')';
  return code;
};

Blockly.Tngl["sensor_acc"] = function (block) {
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var code = '\n.attachSensAccelerometer(' + dropdown_action + ', ' + formatLabel(text_event_label) + ')';
  return code;
};

Blockly.Tngl["sensor_gesture"] = function (block) {
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var code = '\n.attachSensGesture(' + dropdown_action + ', ' + formatLabel(text_event_label) + ')';
  return code;
};

Blockly.Tngl["sensor_button"] = function (block) {
  var text_button_label = block.getFieldValue("BUTTON_LABEL");
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var code = '\n.attachSensButton(' + formatLabel(text_button_label) + ', ' + dropdown_action + ', ' + formatLabel(text_event_label) + ')';
  return code;
};

Blockly.Tngl["sensor_dummy"] = function (block) {
  var code = "";
  return code;
};

Blockly.Tngl["generator_sin"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  var code = "genSine(" + formatTimestamp(text_period) + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["generator_last_event_parameter"] = function (block) {
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var code = "genLastEventParam(" + formatLabel(text_event_label) + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["generator_perlin_noise"] = function (block) {
  var code = "genPerlinNoise()";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["generator_saw"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  var code = "genSaw(" + formatTimestamp(text_period) + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["generator_triangle"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  var code = "genTriangle(" + formatTimestamp(text_period) + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};

Blockly.Tngl["generator_square"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  var code = "genSquare(" + formatTimestamp(text_period) + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};


Blockly.Tngl["generator_smoothout"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var value_smoothed_value = Blockly.Tngl.valueToCode(block, "SMOOTHED_VALUE", Blockly.Tngl.ORDER_NONE);
  var code = "genSmoothOut(" + value_smoothed_value + ", " + text_duration + ")";
  return [code, Blockly.Tngl.ORDER_NONE];
};
