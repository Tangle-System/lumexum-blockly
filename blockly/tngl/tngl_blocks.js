"use strict";

goog.require("Blockly");
goog.require("Blockly.Blocks");
goog.require("Blockly.FieldDropdown");
goog.require("Blockly.FieldImage");
goog.require("Blockly.FieldMultilineInput");
goog.require("Blockly.FieldTextInput");
goog.require("Blockly.FieldVariable");
goog.require("Blockly.Mutator");

//

Blockly.Blocks["animation_fill"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("SOLIDNÍ BARVA ")
      .appendField(new Blockly.FieldColour("#ffffff"), "COLOR")
      .appendField("  ⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_rainbow"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("DUHOVÝ CYKLUS  ")
      .appendField(new Blockly.FieldNumber(100, 0.1, 100, 0.1), "ZOOM")
      .appendField("% spektra")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_fade"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("PŘECHOD  ")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR1")
      .appendField("➤")
      .appendField(new Blockly.FieldColour("#ffffff"), "COLOR2")
      .appendField("  ⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_plasma_shot"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("VÝSTŘEL  ")
      .appendField(new Blockly.FieldColour("#ffffff"), "COLOR")
      .appendField("  délka")
      .appendField(new Blockly.FieldNumber(10, 0, 100, 0.1), "PERCENTAGE")
      .appendField("% pásku")
      .appendField(" ⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_loading_bar"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("NAČÍTÁNÍ  ")
      .appendField(new Blockly.FieldColour("#ffffff"), "COLOR1")
      .appendField("do")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR2")
      .appendField("  ⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_none"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("animation").appendField("PRÁZDNÁ  ANIMACE").appendField("⌛").appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION").appendField("s");
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_color_roll"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("CYKLUS BAREV  ")
      .appendField(new Blockly.FieldColour("#ffffff"), "COLOR1")
      .appendField("&")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR2")
      .appendField("  ⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_palette_roll"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("CYKLUS PALETY  ")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR1")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR2")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR3")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR4")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR5")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR6")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR7")
      .appendField(new Blockly.FieldColour("#000000"), "COLOR8")
      .appendField(" ")
      .appendField(new Blockly.FieldNumber(100, 0.1, 100, 0.1), "ZOOM")
      .appendField("% spektra")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["handler_ontouch"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(3600, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(new Blockly.FieldDropdown([["PROVEĎ", "DO"]]), "TYPE")
      .appendField("PŘI DOTYKU")
      .appendField(
        new Blockly.FieldDropdown([
          ["Touch A", "'A'"],
          ["Touch B", "'B'"],
          ["Touch C", "'C'"],
          [" Touch D", "'D'"],
        ]),
        "TOUCH_PORT"
      )
      .appendField(" na zařízení")
      .appendField(new Blockly.FieldTextInput(""), "DEVICE_LABEL");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["handler_onimpact"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(3600, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(new Blockly.FieldDropdown([["PROVEĎ", "DO"]]), "TYPE")
      .appendField("PŘI OTŘESU")
      .appendField(new Blockly.FieldDropdown([["Adaptivním", "0x01"]]), "INTENSITY")
      .appendField(" na zařízení")
      .appendField(new Blockly.FieldTextInput(""), "DEVICE_LABEL");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["handler_onkeypress"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(3600, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(new Blockly.FieldDropdown([["PROVEĎ", "DO"]]), "TYPE")
      .appendField("PŘI STISKU")
      .appendField(
        new Blockly.FieldDropdown([
          ["shift + Q", "'Q'"],
          ["shift + W", "'W'"],
          ["shift + E", "'E'"],
          ["shift + R", "'R'"],
          ["shift + A", "'A'"],
          ["shift + S", "'S'"],
          ["shift + D", "'D'"],
          ["shift + F", "'F'"],
          ["shift + Z", "'Z'"],
          ["shift + X", "'X'"],
          ["shift + C", "'C'"],
          ["shift + V", "'V'"],
          [" shift + Y", "'Y'"],
        ]),
        "KEY"
      )
      .appendField(" na zařízení")
      .appendField(new Blockly.FieldTextInput(""), "DEVICE_LABEL");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["commentary_block"] = {
  init: function () {
    this.appendDummyInput().appendField("  ").appendField(new Blockly.FieldTextInput("napiš si vlastní komentář!"), "COMMENT");
    this.appendStatementInput("CANVAS_COMMANDS").setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour("#cdcdcd");
  },
};

Blockly.Blocks["commentary_line"] = {
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput("okomentuj si bloky!"), "COMMENT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour("#cdcdcd");
  },
};

Blockly.Blocks["dummy_animation_next"] = {
  init: function () {
    this.appendDummyInput().appendField("následující");
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_add_animation"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte animaci");
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["commentary_spacer"] = {
  init: function () {
    this.appendDummyInput();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour("#cdcdcd");
  },
};

Blockly.Blocks["window"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(5, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(
        new Blockly.FieldDropdown([
          ["⠀", "NONE"],
          ["PŘIDEJ", "ADD"],
          ["PŘEPIŠ", "SET"],
          ["ODEBER", "SUB"],
          ["VYNÁSOB", "MUL"],
          ["VYFILTRUJ", "FIL"],
        ]),
        "DRAW_MODE"
      );
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["tangle_definition"] = {
  init: function () {
    this.appendValueInput("PIXELS").setCheck("pixels").appendField("definice TANGLE").appendField(new Blockly.FieldTextInput("tangle1"), "TANGLE_ID");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["tangle_pixels"] = {
  init: function () {
    this.appendValueInput("PIXELS")
      .setCheck("pixels")
      .appendField("PIXELS")
      .appendField(
        new Blockly.FieldDropdown([
          ["Port A", "'A'"],
          ["Port B", "'B'"],
          ["Port C", "'C'"],
          [" Port D", "'D'"],
        ]),
        "PORT"
      )
      .appendField(" device")
      .appendField(new Blockly.FieldTextInput(""), "DEVICE_LABEL")
      .appendField(" |  from")
      .appendField(new Blockly.FieldNumber(0, 0, 32767, 1), "RANGE_FROM")
      .appendField("count")
      .appendField(new Blockly.FieldNumber(60, -32768, 32767, 1), "RANGE_COUNT")
      .appendField("step")
      .appendField(new Blockly.FieldNumber(1, -32768, 32767, 1), "RANGE_STEP");
    this.setOutput(true, "pixels");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_tangle_pixels_extend"] = {
  init: function () {
    this.appendDummyInput().appendField("rozšiřující pixely");
    this.setOutput(true, "pixels");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["drawing"] = {
  init: function () {
    this.appendValueInput("ANIMATION")
      .setCheck("animation")
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(5, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(
        new Blockly.FieldDropdown([
          ["PŘIDEJ", "ADD"],
          ["PŘEPIŠ", "SET"],
          ["ODEBER", "SUB"],
          ["VYNÁSOB", "MUL"],
          ["VYFILTRUJ", "FIL"],
        ]),
        "DRAW_MODE"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_drawing_add"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte vykreslení");
    this.setPreviousStatement(true, "drawable");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_neopixels"] = {
  init: function () {
    this.appendValueInput("NEOPIXELS").setCheck("neopixel").appendField("POKRAČUJ na neopixelech");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_neopixel"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("neopixel")
      .appendField("NEOPIXEL")
      .appendField(
        new Blockly.FieldDropdown([
          ["Port A", "__porta__"],
          ["Port B", "__portb__"],
          ["Port C", "__portc__"],
          [" Port D", "__portd__"],
        ]),
        "TANGLE"
      );
    this.setOutput(true, "neopixel");
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_siftcanvas_neopixel"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte neopixel");
    this.setOutput(true, "neopixel");
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_tangles"] = {
  init: function () {
    this.appendValueInput("TANGLES").setCheck("tangle").appendField("POKRAČUJ na tanglech");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_tangle"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("tangle").appendField("TANGLE").appendField(new Blockly.FieldTextInput("tangle1"), "TANGLE_ID");
    this.setOutput(true, "tangle");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_siftcanvas_tangle"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte tangle");
    this.setOutput(true, "tangle");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_definition"] = {
  init: function () {
    this.appendDummyInput().appendField("definice SKUPINY").appendField(new Blockly.FieldTextInput("group1"), "GROUP_ID");
    this.appendStatementInput("TANGLES").setCheck(["group_tangle", "group_device"]);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_tangle"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("TANGLE")
      .appendField(new Blockly.FieldTextInput("tangle1"), "TANGLE_ID")
      .appendField("  |   posun")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "SHIFT")
      .appendField("s");
    this.setPreviousStatement(true, "group_tangle");
    this.setNextStatement(true, "group_tangle");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_group_tangle"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte tangle");
    this.setPreviousStatement(true, "group_tangle");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_groups"] = {
  init: function () {
    this.appendValueInput("GROUPS").setCheck("group").appendField("POKRAČUJ ve skupinách");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_group"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("group").appendField("SKUPINA").appendField(new Blockly.FieldTextInput("group1"), "GROUP_ID");
    this.setOutput(true, "group");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_siftcanvas_group"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte skupinu");
    this.setOutput(true, "group");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_neopixel"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("NEOPIXEL")
      .appendField(
        new Blockly.FieldDropdown([
          ["Port A", "__porta__"],
          ["Port B", "__portb__"],
          ["Port C", "__portc__"],
          [" Port D", "__portd__"],
        ]),
        "TANGLE_ID"
      )
      .appendField("  |   posun")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "SHIFT")
      .appendField("s");
    this.setPreviousStatement(true, "group_tangle");
    this.setNextStatement(true, "group_tangle");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["handler"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(3600, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(new Blockly.FieldDropdown([["PROVEĎ", "DO"]]), "TYPE")
      .appendField(
        new Blockly.FieldDropdown([
          ["PŘI STISKU   Shift+Q", "handlerKeyPress['Q']"],
          ["PŘI STISKU   Shift+A", "handlerKeyPress['A']"],
          ["PŘI STISKU   Shift+S", "handlerKeyPress['S']"],
          ["PŘI STISKU   Shift+D", "handlerKeyPress['D']"],
          ["PŘI STISKU   Shift+F", "handlerKeyPress['F']"],
          ["PŘI OTŘESU", "handlerMovement[0x01]"],
          ["PŘI POHYBU", "handlerMovement[0x02]"],
          ["PŘI KLIDU", "handlerMovement[0x03]"],
          ["PŘI DOTYKU   Portu A", "handlerTouch['A']"],
          ["PŘI DOTYKU   Portu B", "handlerTouch['B']"],
        ]),
        "HANDLER_TYPE"
      )
      .appendField("na zařízení")
      .appendField(new Blockly.FieldTextInput(""), "DEVICE_LABEL");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks['device'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("TANGLE ZAŘÍZENÍ");
    this.appendDummyInput()
        .appendField("Device label")
        .appendField(new Blockly.FieldTextInput("device1"), "DEVICE_LABEL");
    this.appendDummyInput()
        .appendField("Device address/id")
        .appendField(new Blockly.FieldNumber(0, 0, 255), "DEVICE_IDENTIFIER");
    this.appendDummyInput()
        .appendField("Device brightness")
        .appendField(new Blockly.FieldNumber(255, 0, 255), "DEVICE_BRIGHTNESS");
    this.appendDummyInput()
        .appendField("Port A")
        .appendField("count")
        .appendField(new Blockly.FieldNumber(60, 0, 10000), "PORT_A_LENGTH")
        .appendField("px");
    this.appendDummyInput()
        .appendField("Port B")
        .appendField("count")
        .appendField(new Blockly.FieldNumber(60, 0, 10000), "PORT_B_LENGTH")
        .appendField("px");
    this.appendDummyInput()
        .appendField("Port C")
        .appendField("count")
        .appendField(new Blockly.FieldNumber(60, 0, 10000), "PORT_C_LENGTH")
        .appendField("px");
    this.appendDummyInput()
        .appendField("Port D")
        .appendField("count")
        .appendField(new Blockly.FieldNumber(60, 0, 10000), "PORT_D_LENGTH")
        .appendField("px");
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks["siftcanvas_device"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("device").appendField("ZAŘÍZENÍ").appendField(new Blockly.FieldTextInput("device1"), "DEVICE_LABEL");
    this.setOutput(true, "device");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_devices"] = {
  init: function () {
    this.appendValueInput("DEVICES").setCheck("device").appendField("POKRAČUJ na zařízeních");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_siftcanvas_device"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte zařízení");
    this.setOutput(true, "device");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_device"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("ZAŘÍZENÍ")
      .appendField(new Blockly.FieldTextInput("device1"), "DEVICE_LABEL")
      .appendField("  |   shift")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "SHIFT")
      .appendField("s");
    this.setPreviousStatement(true, "group_device");
    this.setNextStatement(true, "group_device");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["code_inline"] = {
  init: function () {
    this.appendDummyInput().appendField("code").appendField(new Blockly.FieldTextInput(""), "INLINE_CODE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(60, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(new Blockly.FieldDropdown([["PROVEĎ", "DO"]]), "TYPE")
      .appendField("v časech")
      .appendField(new Blockly.FieldTextInput("marks1"), "MARKS");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_marks_definition"] = {
  init: function () {
    this.appendDummyInput().appendField("ČASOVÉ ZNAČKY").appendField(new Blockly.FieldTextInput("marks1"), "MARKS_LABEL");
    this.appendStatementInput("MARKS").setCheck("mark");
    this.setInputsInline(false);
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_clip_mark_add"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte čas");
    this.setOutput(true, "mark");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["dummy_clip_mark"] = {
  init: function () {
    this.appendDummyInput().appendField("další");
    this.setOutput(true, "mark");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_mark_timestamp"] = {
  init: function () {
    this.appendValueInput("NEXT_MARK").setCheck("mark").appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "TIMESTAMP").appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "mark");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_marks"] = {
  init: function () {
    this.appendValueInput("MARKS").setCheck("mark").appendField("");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["handler_manual"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
      .appendField("s")
      .appendField("⌛")
      .appendField(new Blockly.FieldNumber(3600, 0, 2147483.647, 0.001), "DURATION")
      .appendField("s ")
      .appendField(new Blockly.FieldDropdown([["PROVEĎ", "DO"]]), "TYPE")
      .appendField("PŘI")
      .appendField(
        new Blockly.FieldDropdown([
          ["KEYPRESS", "handlerKeyPress"],
          ["MOVEMENT", "handlerMovement"],
          ["TOUCH", "handlerTouch"],
        ]),
        "HANDLER_TRIGGER"
      )
      .appendField(" parametr")
      .appendField(new Blockly.FieldTextInput("'Q'"), "HANDLER_PARAM")
      .appendField(" na zařízení")
      .appendField(new Blockly.FieldTextInput(""), "DEVICE_LABEL");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["tangle_neopixel"] = {
  init: function () {
    this.appendValueInput("PIXELS")
      .setCheck("pixels")
      .appendField("NEOPIXEL")
      .appendField(
        new Blockly.FieldDropdown([
          ["Port A", "'A'"],
          ["Port B", "'B'"],
          ["Port C", "'C'"],
          [" Port D", "'D'"],
        ]),
        "PORT"
      )
      .appendField(" zařízení")
      .appendField(new Blockly.FieldTextInput(""), "DEVICE_LABEL")
      .appendField(" obrátit směr")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "REVERSE");
    this.setOutput(true, "pixels");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["film_definition"] = {
  init: function () {
    this.appendDummyInput().appendField("FILM").appendField(new Blockly.FieldTextInput("film1"), "FILM_LABEL").appendField(" ⌛").appendField(new Blockly.FieldNumber(5, 0, 2147483.647, 0.001), "DURATION").appendField("s");
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setInputsInline(false);
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["film_call"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("FILM")
      .appendField(new Blockly.FieldTextInput("film1"), "FILM_LABEL")
      .appendField(" ⌛")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
      .appendField("s");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["time_manipulator"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("změna časové jednotky ")
      .appendField(new Blockly.FieldNumber(1, 0, 2147483.647, 0.001), "FROM_TIME_UNIT")
      .appendField("s ➤")
      .appendField(new Blockly.FieldNumber(1, 0, 2147483.647, 0.001), "TO_TIME_UNIT")
      .appendField("s");
    this.appendStatementInput("DRAWABLES").setCheck("drawable");
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["window_2"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "FROM")
      .appendField("s")
      .appendField("➡️")
      .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "TO")
      .appendField("s ")
      .appendField(
        new Blockly.FieldDropdown([
          ["⠀", "NONE"],
          ["PŘIDEJ", "ADD"],
          ["PŘEPIŠ", "SET"],
          ["ODEBER", "SUB"],
          ["VYNÁSOB", "MUL"],
          ["VYFILTRUJ", "FIL"],
        ]),
        "DRAW_MODE"
      );
    this.appendStatementInput("SEQUENCE").setCheck("drawable");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "drawable");
    this.setNextStatement(true, "drawable");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};