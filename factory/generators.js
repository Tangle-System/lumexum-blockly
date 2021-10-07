Blockly.JavaScript['frame_command'] = function(block) {
  var dropdown_draw_mode = block.getFieldValue('DRAW_MODE');
  var number_from = block.getFieldValue('FROM');
  var number_to = block.getFieldValue('TO');
  var value_animation = Blockly.JavaScript.valueToCode(block, 'ANIMATION', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['animation_single'] = function(block) {
  var value_effect = Blockly.JavaScript.valueToCode(block, 'EFFECT', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['animation_scene'] = function(block) {
  var value_begin = Blockly.JavaScript.valueToCode(block, 'BEGIN', Blockly.JavaScript.ORDER_ATOMIC);
  var value_loop = Blockly.JavaScript.valueToCode(block, 'LOOP', Blockly.JavaScript.ORDER_ATOMIC);
  var value_end = Blockly.JavaScript.valueToCode(block, 'END', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_fill'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  var value_colour = Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_rainbow'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_fade'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  var value_colour1 = Blockly.JavaScript.valueToCode(block, 'COLOUR1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour2 = Blockly.JavaScript.valueToCode(block, 'COLOUR2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_plasma_shot'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  var value_colour = Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_ATOMIC);
  var number_count = block.getFieldValue('COUNT');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_loading_bar'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  var value_colour1 = Blockly.JavaScript.valueToCode(block, 'COLOUR1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour2 = Blockly.JavaScript.valueToCode(block, 'COLOUR2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_array2'] = function(block) {
  var value_one = Blockly.JavaScript.valueToCode(block, 'ONE', Blockly.JavaScript.ORDER_ATOMIC);
  var value_two = Blockly.JavaScript.valueToCode(block, 'TWO', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_none'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['manipulation_tool'] = function(block) {
  var text_text1 = block.getFieldValue('TEXT1');
  var statements_frame_commands = Blockly.JavaScript.statementToCode(block, 'FRAME_COMMANDS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['color_chooser'] = function(block) {
  var colour_colour = block.getFieldValue('COLOUR');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['color_code'] = function(block) {
  var text_colourcode = block.getFieldValue('COLOURCODE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['color_rgb'] = function(block) {
  var number_r = block.getFieldValue('R');
  var number_g = block.getFieldValue('G');
  var number_b = block.getFieldValue('B');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_roll'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  var value_colour1 = Blockly.JavaScript.valueToCode(block, 'COLOUR1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour2 = Blockly.JavaScript.valueToCode(block, 'COLOUR2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['effect_palette_roll'] = function(block) {
  var number_duration = block.getFieldValue('DURATION');
  var value_palette = Blockly.JavaScript.valueToCode(block, 'PALETTE', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['palette_8'] = function(block) {
  var value_colour_0 = Blockly.JavaScript.valueToCode(block, 'COLOUR_0', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour_1 = Blockly.JavaScript.valueToCode(block, 'COLOUR_1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour_2 = Blockly.JavaScript.valueToCode(block, 'COLOUR_2', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour_3 = Blockly.JavaScript.valueToCode(block, 'COLOUR_3', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour_4 = Blockly.JavaScript.valueToCode(block, 'COLOUR_4', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour_5 = Blockly.JavaScript.valueToCode(block, 'COLOUR_5', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour_6 = Blockly.JavaScript.valueToCode(block, 'COLOUR_6', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour_7 = Blockly.JavaScript.valueToCode(block, 'COLOUR_7', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['handler_ontouch'] = function(block) {
  var statements_sequence = Blockly.JavaScript.statementToCode(block, 'SEQUENCE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['handler_onimpact'] = function(block) {
  var statements_sequence = Blockly.JavaScript.statementToCode(block, 'SEQUENCE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['handler_ongesture'] = function(block) {
  var statements_sequence = Blockly.JavaScript.statementToCode(block, 'SEQUENCE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};