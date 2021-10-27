Blockly.Blocks['frame_command'] = {
  init: function() {
    this.appendValueInput("ANIMATION")
        .setCheck("animation")
        .appendField("canvas")
        .appendField(new Blockly.FieldDropdown([["set","SET"], ["add","ADD"], ["sub","SUB"], ["mul","MUL"]]), "DRAW_MODE")
        .appendField("from")
        .appendField(new Blockly.FieldNumber(0, -2147483648, 2147483647), "FROM")
        .appendField("to")
        .appendField(new Blockly.FieldNumber(1000, -2147483648, 2147483647), "TO")
        .appendField("ms");
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['animation_single'] = {
  init: function() {
    this.appendValueInput("EFFECT")
        .setCheck(["effect", "effect_array"])
        .appendField("animate");
    this.setInputsInline(true);
    this.setOutput(true, "animation");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['animation_scene'] = {
  init: function() {
    this.appendValueInput("BEGIN")
        .setCheck(["effect", "effect_array"])
        .appendField("begin with");
    this.appendValueInput("LOOP")
        .setCheck(["effect", "effect_array"])
        .appendField("loop with");
    this.appendValueInput("END")
        .setCheck(["effect", "effect_array"])
        .appendField("end with");
    this.setInputsInline(true);
    this.setOutput(true, "animation");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_fill'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("FILL ")
        .appendField(new Blockly.FieldNumber(0, -2147483648, 2147483647), "DURATION");
    this.appendValueInput("COLOUR")
        .setCheck("colour")
        .appendField("ms");
    this.setInputsInline(true);
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("fill(int32_t duration, CRGB color)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_rainbow'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("RAINBOW  cycle")
        .appendField(new Blockly.FieldNumber(1000, -2147483648, 2147483647), "DURATION")
        .appendField("ms");
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("rainbow(int32_t duration)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_fade'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("FADE ")
        .appendField(new Blockly.FieldNumber(1000, -2147483648, 2147483647), "DURATION");
    this.appendValueInput("COLOUR1")
        .setCheck("colour")
        .appendField("ms from");
    this.appendValueInput("COLOUR2")
        .setCheck("colour")
        .appendField("to");
    this.setInputsInline(true);
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("fade(int32_t duration, CRGB color1, CRGB color2)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_plasma_shot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("PLASMA SHOT ")
        .appendField(new Blockly.FieldNumber(500, -2147483648, 2147483647), "DURATION")
        .appendField("ms colour");
    this.appendValueInput("COLOUR")
        .setCheck("colour");
    this.appendDummyInput()
        .appendField("with")
        .appendField(new Blockly.FieldNumber(5, -2147483648, 2147483647), "COUNT")
        .appendField("LEDs");
    this.setInputsInline(true);
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("plasma_shot(int32_t duration, CRGB color, int32_t count)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_loading_bar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("LOADING BAR ")
        .appendField(new Blockly.FieldNumber(1000, -2147483648, 2147483647), "DURATION")
        .appendField("ms");
    this.appendValueInput("COLOUR1")
        .setCheck("colour")
        .appendField("colour");
    this.appendValueInput("COLOUR2")
        .setCheck("colour")
        .appendField("background");
    this.setInputsInline(true);
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("loading_bar(int32_t duration, CRGB color)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_array2'] = {
  init: function() {
    this.appendValueInput("ONE")
        .setCheck("effect")
        .appendField("play");
    this.appendValueInput("TWO")
        .setCheck("effect")
        .appendField("and then");
    this.setInputsInline(true);
    this.setOutput(true, "effect_array");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_none'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("no effect");
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("fill(int32_t duration, CRGB color)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['manipulation_tool'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Description:")
        .appendField(new Blockly.FieldTextInput("write here your description"), "TEXT1");
    this.appendStatementInput("FRAME_COMMANDS")
        .setCheck(null);
    this.setColour(45);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['color_chooser'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldColour("#ff0000"), "COLOUR");
    this.setOutput(true, "colour");
    this.setColour(105);
 this.setTooltip("<r,g,b>");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['color_code'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("HTML")
        .appendField(new Blockly.FieldTextInput("#000000"), "COLOURCODE");
    this.setOutput(true, "colour");
    this.setColour(105);
 this.setTooltip("HTML code");
 this.setHelpUrl("https://www.google.com/search?sxsrf=ALeKk02e2cx8dwtWe-_8zpDX2W1YWASGzQ%3A1597589335975&ei=V0c5X5b5OtD4kwWhj6TACg&q=html+colour+picker&oq=html+colour+picker&gs_lcp=CgZwc3ktYWIQAzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQRzIECAAQR1DKEFjLF2CnGGgAcAF4AIABAIgBAJIBAJgBAKABAaoBB2d3cy13aXrAAQE&sclient=psy-ab&ved=0ahUKEwjWgPiG_J_rAhVQ_KQKHaEHCagQ4dUDCAw&uact=5");
  }
};

Blockly.Blocks['color_rgb'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("R")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "R")
        .appendField("G")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "G")
        .appendField("B")
        .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "B");
    this.setOutput(true, "colour");
    this.setColour(105);
 this.setTooltip("<r,g,b>");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_roll'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ROLL  cycle")
        .appendField(new Blockly.FieldNumber(1000, -2147483648, 2147483647), "DURATION")
        .appendField("ms");
    this.appendValueInput("COLOUR1")
        .setCheck("colour")
        .appendField("colour");
    this.appendValueInput("COLOUR2")
        .setCheck("colour")
        .appendField("colour");
    this.setInputsInline(true);
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("fade(int32_t duration, CRGB color1, CRGB color2)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['effect_palette_roll'] = {
  init: function() {
    this.appendValueInput("PALETTE")
        .setCheck("palette")
        .appendField("PALLETE ROLL  cycle")
        .appendField(new Blockly.FieldNumber(1000, -2147483647, 2147483648, 1), "DURATION")
        .appendField("palette");
    this.setInputsInline(true);
    this.setOutput(true, "effect");
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['palette_8'] = {
  init: function() {
    this.appendValueInput("COLOUR_0")
        .setCheck("colour")
        .appendField("PALETTE");
    this.appendValueInput("COLOUR_1")
        .setCheck("colour");
    this.appendValueInput("COLOUR_2")
        .setCheck("colour");
    this.appendValueInput("COLOUR_3")
        .setCheck("colour");
    this.appendValueInput("COLOUR_4")
        .setCheck("colour");
    this.appendValueInput("COLOUR_5")
        .setCheck("colour");
    this.appendValueInput("COLOUR_6")
        .setCheck("colour");
    this.appendValueInput("COLOUR_7")
        .setCheck("colour");
    this.setInputsInline(true);
    this.setOutput(true, "palette");
    this.setColour(105);
 this.setTooltip("insert colours");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['handler_ontouch'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("when the Light Ninja is TOUCHED play");
    this.appendStatementInput("SEQUENCE")
        .setCheck("command");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['handler_onimpact'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("when the Light Ninja sences IMPACT play");
    this.appendStatementInput("SEQUENCE")
        .setCheck("command");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['handler_ongesture'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("when the Light Ninja sees GESTURE play");
    this.appendStatementInput("SEQUENCE")
        .setCheck("command");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};