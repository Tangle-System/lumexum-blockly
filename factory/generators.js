Blockly.JavaScript["animation_dummy_next"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_dummy_add"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["drawing"] = function (block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var value_animation = Blockly.JavaScript.valueToCode(block, "ANIMATION", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["drawing_dummy"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["animation_definition"] = function (block) {
  var text_animation_label = block.getFieldValue("ANIMATION_LABEL");
  var text_duration = block.getFieldValue("DURATION");
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["animation_call"] = function (block) {
  var text_animation_label = block.getFieldValue("ANIMATION_LABEL");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_fill"] = function (block) {
  var colour_color = block.getFieldValue("COLOR");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_rainbow"] = function (block) {
  var text_zoom = block.getFieldValue("ZOOM");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_fade"] = function (block) {
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_plasma_shot"] = function (block) {
  var colour_color = block.getFieldValue("COLOR");
  var text_percentage = block.getFieldValue("PERCENTAGE");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_loading_bar"] = function (block) {
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_none"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_color_roll"] = function (block) {
  var colour_color1 = block.getFieldValue("COLOR1");
  var colour_color2 = block.getFieldValue("COLOR2");
  var text_duration = block.getFieldValue("DURATION");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["animation_palette_roll"] = function (block) {
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
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["window"] = function (block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["window_2"] = function (block) {
  var text_from = block.getFieldValue("FROM");
  var text_to = block.getFieldValue("TO");
  var dropdown_draw_mode = block.getFieldValue("DRAW_MODE");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["modifier_brightness"] = function (block) {
  var text_variable_label = block.getFieldValue("VARIABLE_LABEL");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["modifier_timeline"] = function (block) {
  var dropdown_time_source = block.getFieldValue("TIME_SOURCE");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["modifier_color_switch"] = function (block) {
  var dropdown_option = block.getFieldValue("OPTION");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["modifier_timechange"] = function (block) {
  var text_from_time_unit = block.getFieldValue("FROM_TIME_UNIT");
  var text_to_time_unit = block.getFieldValue("TO_TIME_UNIT");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["modifier_timeloop"] = function (block) {
  var text_loop = block.getFieldValue("LOOP");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["modifier_timescale"] = function (block) {
  var text_variable_label = block.getFieldValue("VARIABLE_LABEL");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["modifier_fade"] = function (block) {
  var dropdown_fade_type = block.getFieldValue("FADE_TYPE");
  var text_duration = block.getFieldValue("DURATION");
  var value_modifier = Blockly.JavaScript.valueToCode(block, "MODIFIER", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["modifier_dummy_add"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["frame"] = function (block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["event_source"] = function (block) {
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var value_event = Blockly.JavaScript.valueToCode(block, "EVENT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["event_replace_param"] = function (block) {
  var text_event_parameter = block.getFieldValue("EVENT_PARAMETER");
  var value_event = Blockly.JavaScript.valueToCode(block, "EVENT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["event_dummy_add"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["event_emit_code"] = function (block) {
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var value_event = Blockly.JavaScript.valueToCode(block, "EVENT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["handler_manual"] = function (block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["clip"] = function (block) {
  var text_start = block.getFieldValue("START");
  var text_duration = block.getFieldValue("DURATION");
  var dropdown_type = block.getFieldValue("TYPE");
  var value_marks = Blockly.JavaScript.valueToCode(block, "MARKS", Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["clip_marks_definition"] = function (block) {
  var text_marks_label = block.getFieldValue("MARKS_LABEL");
  var statements_marks = Blockly.JavaScript.statementToCode(block, "MARKS");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["clip_mark_timestamp"] = function (block) {
  var text_timestamp = block.getFieldValue("TIMESTAMP");
  var value_next_mark = Blockly.JavaScript.valueToCode(block, "NEXT_MARK", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["clip_marks"] = function (block) {
  var text_marks = block.getFieldValue("MARKS");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["clip_mark"] = function (block) {
  var text_timestamp = block.getFieldValue("TIMESTAMP");
  var value_mark = Blockly.JavaScript.valueToCode(block, "MARK", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["clip_marks_inline"] = function (block) {
  var text_marks = block.getFieldValue("MARKS");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["clip_dummy_mark"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["tangle_definition"] = function (block) {
  var text_tangle_label = block.getFieldValue("TANGLE_LABEL");
  var value_pixels = Blockly.JavaScript.valueToCode(block, "PIXELS", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["tangle_port"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var checkbox_reverse = block.getFieldValue("REVERSE") == "TRUE";
  var value_pixels = Blockly.JavaScript.valueToCode(block, "PIXELS", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["tangle_pixels"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var text_range_from = block.getFieldValue("RANGE_FROM");
  var text_range_count = block.getFieldValue("RANGE_COUNT");
  var text_range_step = block.getFieldValue("RANGE_STEP");
  var value_pixels = Blockly.JavaScript.valueToCode(block, "PIXELS", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["tangle_dummy_pixels_extend"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["group_port"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var text_shift = block.getFieldValue("SHIFT");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["group_definition"] = function (block) {
  var text_group_label = block.getFieldValue("GROUP_LABEL");
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["group_tangle"] = function (block) {
  var text_tangle_label = block.getFieldValue("TANGLE_LABEL");
  var text_shift = block.getFieldValue("SHIFT");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["group_dummy_tangle"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["siftcanvas_tangles"] = function (block) {
  var value_tangles = Blockly.JavaScript.valueToCode(block, "TANGLES", Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["siftcanvas_tangle"] = function (block) {
  var text_tangle_label = block.getFieldValue("TANGLE_LABEL");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["siftcanvas_dummy_tangle_add"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["siftcanvas_groups"] = function (block) {
  var value_groups = Blockly.JavaScript.valueToCode(block, "GROUPS", Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["siftcanvas_group"] = function (block) {
  var text_group_label = block.getFieldValue("GROUP_LABEL");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["siftcanvas_dummy_group_add"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["siftcanvas_device"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["siftcanvas_devices"] = function (block) {
  var value_devices = Blockly.JavaScript.valueToCode(block, "DEVICES", Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["siftcanvas_dummy_device_add"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["siftcanvas_port"] = function (block) {
  var dropdown_port = block.getFieldValue("PORT");
  var value_next = Blockly.JavaScript.valueToCode(block, "NEXT", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["siftcanvas_ports"] = function (block) {
  var value_ports = Blockly.JavaScript.valueToCode(block, "PORTS", Blockly.JavaScript.ORDER_ATOMIC);
  var statements_body = Blockly.JavaScript.statementToCode(block, "BODY");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["siftcanvas_dummy_port_add"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["code_inline"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["commentary_block"] = function (block) {
  var text_comment = block.getFieldValue("COMMENT");
  var statements_canvas_commands = Blockly.JavaScript.statementToCode(block, "CANVAS_COMMANDS");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["commentary_line"] = function (block) {
  var text_comment = block.getFieldValue("COMMENT");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["commentary_inline"] = function (block) {
  var text_comment = block.getFieldValue("COMMENT");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["commentary_spacer"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["device_4ports"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var number_device_identifier = block.getFieldValue("DEVICE_IDENTIFIER");
  var number_device_brightness = block.getFieldValue("DEVICE_BRIGHTNESS");
  var checkbox_tangle_a = block.getFieldValue("TANGLE_A") == "TRUE";
  var number_port_a_length = block.getFieldValue("PORT_A_LENGTH");
  var checkbox_tangle_b = block.getFieldValue("TANGLE_B") == "TRUE";
  var number_port_b_length = block.getFieldValue("PORT_B_LENGTH");
  var checkbox_tangle_c = block.getFieldValue("TANGLE_C") == "TRUE";
  var number_port_c_length = block.getFieldValue("PORT_C_LENGTH");
  var checkbox_tangle_d = block.getFieldValue("TANGLE_D") == "TRUE";
  var number_port_d_length = block.getFieldValue("PORT_D_LENGTH");
  var statements_sensors = Blockly.JavaScript.statementToCode(block, "SENSORS");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["device_8ports"] = function (block) {
  var text_device_label = block.getFieldValue("DEVICE_LABEL");
  var number_device_identifier = block.getFieldValue("DEVICE_IDENTIFIER");
  var number_device_brightness = block.getFieldValue("DEVICE_BRIGHTNESS");
  var checkbox_tangle_a = block.getFieldValue("TANGLE_A") == "TRUE";
  var number_port_a_length = block.getFieldValue("PORT_A_LENGTH");
  var checkbox_tangle_b = block.getFieldValue("TANGLE_B") == "TRUE";
  var number_port_b_length = block.getFieldValue("PORT_B_LENGTH");
  var checkbox_tangle_c = block.getFieldValue("TANGLE_C") == "TRUE";
  var number_port_c_length = block.getFieldValue("PORT_C_LENGTH");
  var checkbox_tangle_d = block.getFieldValue("TANGLE_D") == "TRUE";
  var number_port_d_length = block.getFieldValue("PORT_D_LENGTH");
  var checkbox_tangle_e = block.getFieldValue("TANGLE_E") == "TRUE";
  var number_port_e_length = block.getFieldValue("PORT_E_LENGTH");
  var checkbox_tangle_f = block.getFieldValue("TANGLE_F") == "TRUE";
  var number_port_f_length = block.getFieldValue("PORT_F_LENGTH");
  var checkbox_tangle_g = block.getFieldValue("TANGLE_G") == "TRUE";
  var number_port_g_length = block.getFieldValue("PORT_G_LENGTH");
  var checkbox_tangle_h = block.getFieldValue("TANGLE_H") == "TRUE";
  var number_port_h_length = block.getFieldValue("PORT_H_LENGTH");
  var statements_sensors = Blockly.JavaScript.statementToCode(block, "SENSORS");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["variable_create"] = function (block) {
  var text_label = block.getFieldValue("LABEL");
  var value_source = Blockly.JavaScript.valueToCode(block, "SOURCE", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

// Blockly.JavaScript["variable_modify"] = function (block) {
//   var text_label = block.getFieldValue("LABEL");
//   var value_source = Blockly.JavaScript.valueToCode(block, "SOURCE", Blockly.JavaScript.ORDER_ATOMIC);
//   // TODO: Assemble JavaScript into code variable.
//   var code = "...;\n";
//   return code;
// };

Blockly.JavaScript["value_dummy"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["value_math"] = function (block) {
  var dropdown_option = block.getFieldValue("OPTION");
  var value_parameter_a = Blockly.JavaScript.valueToCode(block, "PARAMETER_A", Blockly.JavaScript.ORDER_ATOMIC);
  var value_parameter_b = Blockly.JavaScript.valueToCode(block, "PARAMETER_B", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["value_map"] = function (block) {
  var value_parameter_x = Blockly.JavaScript.valueToCode(block, "PARAMETER_X", Blockly.JavaScript.ORDER_ATOMIC);
  var value_parameter_inmin = Blockly.JavaScript.valueToCode(block, "PARAMETER_INMIN", Blockly.JavaScript.ORDER_ATOMIC);
  var value_parameter_inmax = Blockly.JavaScript.valueToCode(block, "PARAMETER_INMAX", Blockly.JavaScript.ORDER_ATOMIC);
  var value_parameter_outmin = Blockly.JavaScript.valueToCode(block, "PARAMETER_OUTMIN", Blockly.JavaScript.ORDER_ATOMIC);
  var value_parameter_outmax = Blockly.JavaScript.valueToCode(block, "PARAMETER_OUTMAX", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["value_read_variable"] = function (block) {
  var text_variable_label = block.getFieldValue("VARIABLE_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["value_constant"] = function (block) {
  var text_value = block.getFieldValue("VALUE");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["sensor_artnet"] = function (block) {
  var number_dmx_universe = block.getFieldValue("DMX_UNIVERSE");
  var number_dmx_channel = block.getFieldValue("DMX_CHANNEL");
  var number_dmx_channel_count = block.getFieldValue("DMX_CHANNEL_COUNT");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["sensor_touch"] = function (block) {
  var text_touch_label = block.getFieldValue("TOUCH_LABEL");
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["sensor_gyro"] = function (block) {
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["sensor_acc"] = function (block) {
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["sensor_gesture"] = function (block) {
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["sensor_button"] = function (block) {
  var text_button_label = block.getFieldValue("BUTTON_LABEL");
  var dropdown_action = block.getFieldValue("ACTION");
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["sensor_dummy"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly.JavaScript["generator_sin"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["generator_last_event_parameter"] = function (block) {
  var text_event_label = block.getFieldValue("EVENT_LABEL");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["generator_perlin_noise"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["generator_saw"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["generator_triangle"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["generator_square"] = function (block) {
  var text_period = block.getFieldValue("PERIOD");
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["generator_smoothout"] = function (block) {
  var text_duration = block.getFieldValue("DURATION");
  var value_smoothed_value = Blockly.JavaScript.valueToCode(block, "SMOOTHED_VALUE", Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "...";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};
