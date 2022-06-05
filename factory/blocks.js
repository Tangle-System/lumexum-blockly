Blockly.Blocks["animation_dummy_next"] = {
  init: function () {
    this.appendDummyInput().appendField("následující");
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_dummy_add"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte animaci");
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["drawing"] = {
  init: function () {
    this.appendValueInput("ANIMATION")
      .setCheck("animation")
      .appendField("v čase")
      .appendField(new Blockly.FieldTextInput("0s"), "START")
      .appendField(" ⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION")
      .appendField(
        new Blockly.FieldDropdown([
          ["PŘIDEJ", "ADD"],
          ["PŘEPIŠ", "SET"],
          ["ODEBER", "SUB"],
          ["ŠKÁLUJ", "SCALE"],
          ["VYFILTRUJ", "FIL"],
        ]),
        "DRAW_MODE"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["drawing_dummy"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte vykreslení");
    this.setPreviousStatement(true, "construct");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_definition"] = {
  init: function () {
    this.appendDummyInput().appendField("ANIMATION").appendField(new Blockly.FieldTextInput("$ani1"), "ANIMATION_LABEL").appendField(" ⌛").appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setInputsInline(false);
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_call"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("animation").appendField("ANIMATION").appendField(new Blockly.FieldTextInput("$ani1"), "ANIMATION_LABEL").appendField(" ⌛").appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_fill"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("animation").appendField("SOLIDNÍ BARVA ").appendField(new Blockly.FieldColour("#ffffff"), "COLOR").appendField("  ⌛").appendField(new Blockly.FieldTextInput("5s"), "DURATION");
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
      .appendField(new Blockly.FieldTextInput("100%"), "ZOOM")
      .appendField("spektra")
      .appendField("⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
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
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
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
      .appendField(new Blockly.FieldTextInput("25%"), "PERCENTAGE")
      .appendField("pásku")
      .appendField(" ⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
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
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["animation_none"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("animation").appendField("PRÁZDNÁ  ANIMACE").appendField("⌛").appendField(new Blockly.FieldTextInput("5s"), "DURATION").appendField("s");
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
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
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
      .appendField(new Blockly.FieldTextInput("100%"), "ZOOM")
      .appendField("spektra")
      .appendField("⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["window"] = {
  init: function () {
    this.appendValueInput("MODIFIER")
      .setCheck("modifier")
      .appendField("v čase")
      .appendField(new Blockly.FieldTextInput("0s"), "START")
      .appendField(" ⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION")
      .appendField(
        new Blockly.FieldDropdown([
          ["PŘIDEJ", "ADD"],
          ["PŘEPIŠ", "SET"],
          ["ODEBER", "SUB"],
          ["ŠKÁLUJ", "SCALE"],
          ["VYFILTRUJ", "FIL"],
        ]),
        "DRAW_MODE"
      );
    this.appendStatementInput("BODY").setCheck("construct");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["window_2"] = {
  init: function () {
    this.appendValueInput("MODIFIER")
      .setCheck("modifier")
      .appendField("v čase")
      .appendField(new Blockly.FieldTextInput("5s"), "FROM")
      .appendField("➡️")
      .appendField(new Blockly.FieldTextInput("5s"), "TO")
      .appendField(
        new Blockly.FieldDropdown([
          ["PŘIDEJ", "ADD"],
          ["PŘEPIŠ", "SET"],
          ["ODEBER", "SUB"],
          ["ŠKÁLUJ", "SCALE"],
          ["VYFILTRUJ", "FIL"],
        ]),
        "DRAW_MODE"
      );
    this.appendStatementInput("BODY").setCheck("construct");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_brightness"] = {
  init: function () {
    this.appendValueInput("MODIFIER").setCheck("modifier").appendField("BRIGHTNESS").appendField(new Blockly.FieldTextInput("$var1"), "VARIABLE_LABEL");
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("VARIABLE '$var1', COLOR '#ffaacc', TUPLE '[0xff,0xff,0xff,0x7f]', SCALE '90%'");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_timeline"] = {
  init: function () {
    this.appendValueInput("MODIFIER")
      .setCheck("modifier")
      .appendField("attach TIMELINE to")
      .appendField(
        new Blockly.FieldDropdown([
          ["Timeline 1", "0x01"],
          ["Timeline 2", "0x02"],
          ["Timeline 3", "0x03"],
          ["Timeline 4", "0x04"],
          ["Timeline 5", "0x05"],
          ["Timeline 6", "0x06"],
          ["Timeline 7", "0x07"],
          [" Timeline 8", "0x08"],
        ]),
        "TIME_SOURCE"
      );
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_color_switch"] = {
  init: function () {
    this.appendValueInput("MODIFIER")
      .setCheck("modifier")
      .appendField("SWITCH ")
      .appendField(
        new Blockly.FieldDropdown([
          ["R & G", "MODIFIER_SWITCH_RG"],
          ["G & B", "MODIFIER_SWITCH_GB"],
          ["B & R", "MODIFIER_SWITCH_BR"],
          ["NONE", "MODIFIER_SWITCH_NONE"],
        ]),
        "OPTION"
      );
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_timechange"] = {
  init: function () {
    this.appendValueInput("MODIFIER").setCheck("modifier").appendField("změna časové jednotky ").appendField(new Blockly.FieldTextInput("1s"), "FROM_TIME_UNIT").appendField("➤").appendField(new Blockly.FieldTextInput("1"), "TO_TIME_UNIT");
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_timeloop"] = {
  init: function () {
    this.appendValueInput("MODIFIER").setCheck("modifier").appendField("TIME LOOP").appendField(new Blockly.FieldTextInput("5s"), "LOOP");
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_timescale"] = {
  init: function () {
    this.appendValueInput("MODIFIER").setCheck("modifier").appendField("SCALE TIME").appendField(new Blockly.FieldTextInput("$var1"), "VARIABLE_LABEL");
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("SCALE '80%', VARIABLE '$var1'");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_fade"] = {
  init: function () {
    this.appendValueInput("MODIFIER")
      .setCheck("modifier")
      .appendField(
        new Blockly.FieldDropdown([
          ["FADE IN", "FADE_IN"],
          [" FADE OUT", "FADE_OUT"],
        ]),
        "FADE_TYPE"
      )
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["modifier_dummy_add"] = {
  init: function () {
    this.appendDummyInput().appendField("modifikátor");
    this.setOutput(true, "modifier");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["frame"] = {
  init: function () {
    this.appendDummyInput().appendField("v čase").appendField(new Blockly.FieldTextInput("0s"), "START").appendField(" ⌛").appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(160);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["event_source"] = {
  init: function () {
    this.appendValueInput("EVENT").setCheck("event").appendField("ON  🕹️").appendField(new Blockly.FieldTextInput("$evn1"), "EVENT_LABEL");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["event_replace_param"] = {
  init: function () {
    this.appendValueInput("EVENT").setCheck("event").appendField("🢂  SET VALUE ").appendField(new Blockly.FieldTextInput("100%"), "EVENT_PARAMETER");
    this.setOutput(true, "event");
    this.setColour(120);
    this.setTooltip("Set SCALE by '100%', TOUPLE '[0x01,0x02,0x03,0x04]' , COLOR '#ffaacc,' LABEL '$label'");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["event_dummy_add"] = {
  init: function () {
    this.appendDummyInput().appendField("🢂  event");
    this.setOutput(true, "event");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["event_emit_code"] = {
  init: function () {
    this.appendValueInput("EVENT").setCheck("event").appendField("🢂  EMIT as 🕹️").appendField(new Blockly.FieldTextInput("$evn1"), "EVENT_LABEL");
    this.setOutput(true, "event");
    this.setColour(120);
    this.setTooltip("Emit locally as another event");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["handler_manual"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("v čase")
      .appendField(new Blockly.FieldTextInput("0s"), "START")
      .appendField(" ⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION")
      .appendField(" ON  🕹️")
      .appendField(new Blockly.FieldTextInput("$evn1"), "EVENT_LABEL");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip"] = {
  init: function () {
    this.appendValueInput("MARKS")
      .setCheck("marks")
      .appendField("v čase")
      .appendField(new Blockly.FieldTextInput("0s"), "START")
      .appendField(" ⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION")
      .appendField(new Blockly.FieldDropdown([["PROVEĎ", "DO"]]), "TYPE")
      .appendField("v časech");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_marks_definition"] = {
  init: function () {
    this.appendDummyInput().appendField("ČASOVÉ ZNAČKY").appendField(new Blockly.FieldTextInput("$mrk1"), "MARKS_LABEL");
    this.appendStatementInput("MARKS").setCheck("mark");
    this.setInputsInline(false);
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_mark_timestamp"] = {
  init: function () {
    this.appendValueInput("NEXT_MARK").setCheck("mark").appendField(new Blockly.FieldTextInput("5s"), "TIMESTAMP");
    this.setInputsInline(false);
    this.setOutput(true, "mark");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_marks"] = {
  init: function () {
    this.appendDummyInput().appendField("MARKS").appendField(new Blockly.FieldTextInput("$mrk1"), "MARKS");
    this.setOutput(true, "marks");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_mark"] = {
  init: function () {
    this.appendValueInput("MARK").setCheck("mark").appendField("v čase").appendField(new Blockly.FieldTextInput("5s"), "TIMESTAMP");
    this.setInputsInline(false);
    this.setPreviousStatement(true, "mark");
    this.setNextStatement(true, "mark");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_marks_inline"] = {
  init: function () {
    this.appendDummyInput().appendField("MARKS").appendField(new Blockly.FieldTextInput("0s, 1s, 2s"), "MARKS");
    this.setOutput(true, "mark");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["clip_dummy_mark"] = {
  init: function () {
    this.appendDummyInput().appendField("další");
    this.setOutput(true, "mark");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["tangle_definition"] = {
  init: function () {
    this.appendValueInput("PIXELS").setCheck("pixels").appendField("definice TANGLE").appendField(new Blockly.FieldTextInput("$tng1"), "TANGLE_LABEL");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["tangle_port"] = {
  init: function () {
    this.appendValueInput("PIXELS")
      .setCheck("pixels")
      .appendField("PORT PIXELS")
      .appendField("port")
      .appendField(
        new Blockly.FieldDropdown([
          ["Port A", "'A'"],
          ["Port B", "'B'"],
          ["Port C", "'C'"],
          ["Port D", "'D'"],
          ["Port E", "'E'"],
          ["Port F", "'F'"],
          ["Port G", "'G'"],
          [" Port H", "'H'"],
        ]),
        "PORT"
      )
      .appendField(" zařízení")
      .appendField(new Blockly.FieldTextInput("$dev1"), "DEVICE_LABEL")
      .appendField(" obrátit směr")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "REVERSE");
    this.setOutput(true, "pixels");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["tangle_pixels"] = {
  init: function () {
    this.appendValueInput("PIXELS")
      .setCheck("pixels")
      .appendField("TANGLE PIXELS")
      .appendField("tangle")
      .appendField(new Blockly.FieldTextInput("$tan1"), "DEVICE_LABEL")
      .appendField(" |  from")
      .appendField(new Blockly.FieldTextInput("5px"), "RANGE_FROM")
      .appendField("count")
      .appendField(new Blockly.FieldTextInput("60px"), "RANGE_COUNT")
      .appendField("step")
      .appendField(new Blockly.FieldTextInput("1px"), "RANGE_STEP");
    this.setOutput(true, "pixels");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["tangle_dummy_pixels_extend"] = {
  init: function () {
    this.appendDummyInput().appendField("rozšiřující pixely");
    this.setOutput(true, "pixels");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_port"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("PORT")
      .appendField(
        new Blockly.FieldDropdown([
          ["Port A", "&PORTA"],
          ["Port B", "&PORTB"],
          ["Port C", "&PORTC"],
          ["Port D", "&PORTD"],
          ["Port E", "&PORTE"],
          ["Port F", "&PORTF"],
          ["Port G", "&PORTG"],
          [" Port H", "&PORTH"],
        ]),
        "PORT"
      )
      .appendField("  |   posun")
      .appendField(new Blockly.FieldTextInput("0s"), "SHIFT");
    this.setPreviousStatement(true, "group_item");
    this.setNextStatement(true, "group_item");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_definition"] = {
  init: function () {
    this.appendDummyInput().appendField("definice SKUPINY").appendField(new Blockly.FieldTextInput("$grp1"), "GROUP_LABEL");
    this.appendStatementInput("BODY").setCheck("group_item");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_tangle"] = {
  init: function () {
    this.appendDummyInput().appendField("TANGLE").appendField(new Blockly.FieldTextInput("$tan1"), "TANGLE_LABEL").appendField("  |   posun").appendField(new Blockly.FieldTextInput("0s"), "SHIFT");
    this.setPreviousStatement(true, "group_item");
    this.setNextStatement(true, "group_item");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["group_dummy_tangle"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte canvas");
    this.setPreviousStatement(true, "group_item");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_tangles"] = {
  init: function () {
    this.appendValueInput("TANGLES").setCheck("tangle").appendField("POKRAČUJ na tanglech");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_tangle"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("tangle").appendField("TANGLE").appendField(new Blockly.FieldTextInput("$tan1"), "TANGLE_LABEL");
    this.setOutput(true, "tangle");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_dummy_tangle_add"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte tangle");
    this.setOutput(true, "tangle");
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_groups"] = {
  init: function () {
    this.appendValueInput("GROUPS").setCheck("group").appendField("POKRAČUJ ve skupinách");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_group"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("group").appendField("SKUPINA").appendField(new Blockly.FieldTextInput("$grp1"), "GROUP_LABEL");
    this.setOutput(true, "group");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_dummy_group_add"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte skupinu");
    this.setOutput(true, "group");
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_device"] = {
  init: function () {
    this.appendValueInput("NEXT").setCheck("device").appendField("ZAŘÍZENÍ").appendField(new Blockly.FieldTextInput("$dev1"), "DEVICE_LABEL");
    this.setOutput(true, "device");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_devices"] = {
  init: function () {
    this.appendValueInput("DEVICES").setCheck("device").appendField("POKRAČUJ na zařízeních");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_dummy_device_add"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte zařízení");
    this.setOutput(true, "device");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_port"] = {
  init: function () {
    this.appendValueInput("NEXT")
      .setCheck("port")
      .appendField("PORT")
      .appendField(
        new Blockly.FieldDropdown([
          ["Port A", "$PORTA"],
          ["Port B", "$PORTB"],
          ["Port C", "$PORTC"],
          ["Port D", "$PORTD"],
          ["Port E", "$PORTE"],
          ["Port F", "$PORTF"],
          ["Port G", "$PORTG"],
          [" Port H", "$PORTH"],
        ]),
        "PORT"
      );
    this.setOutput(true, "port");
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_ports"] = {
  init: function () {
    this.appendValueInput("PORTS").setCheck("port").appendField("POKRAČUJ na portech");
    this.appendStatementInput("BODY").setCheck("construct");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["siftcanvas_dummy_port_add"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte port");
    this.setOutput(true, "port");
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["code_inline"] = {
  init: function () {
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["commentary_block"] = {
  init: function () {
    this.appendDummyInput().appendField("  ").appendField(new Blockly.FieldTextInput("This is a comment"), "COMMENT");
    this.appendStatementInput("CANVAS_COMMANDS").setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["commentary_line"] = {
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput("This is a comment"), "COMMENT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["commentary_inline"] = {
  init: function () {
    this.appendValueInput("BLOCK").appendField(new Blockly.FieldTextInput("This is a comment"), "COMMENT");
    this.setOutput(true, null);
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setValidators();
  },
};

Blockly.Blocks["commentary_spacer"] = {
  init: function () {
    this.appendDummyInput();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["device_4ports"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_CENTRE).appendField("TANGLE ZAŘÍZENÍ");
    this.appendDummyInput().appendField("Device label").appendField(new Blockly.FieldTextInput("device1"), "DEVICE_LABEL");
    this.appendDummyInput().appendField("Device address/id").appendField(new Blockly.FieldNumber(0, 0, 255), "DEVICE_IDENTIFIER");
    this.appendDummyInput().appendField("Device brightness").appendField(new Blockly.FieldNumber(255, 0, 255), "DEVICE_BRIGHTNESS");
    this.appendDummyInput().appendField("PORTA").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_A").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_A_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTB").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_B").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_B_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTC").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_C").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_C_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTD").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_D").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_D_LENGTH").appendField("px");
    this.appendDummyInput().appendField("  SENSORS:");
    this.appendStatementInput("SENSORS").setCheck("sensor");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["device_8ports"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_CENTRE).appendField("TANGLE ZAŘÍZENÍ");
    this.appendDummyInput().appendField("Device label").appendField(new Blockly.FieldTextInput("device1"), "DEVICE_LABEL");
    this.appendDummyInput().appendField("Device address/id").appendField(new Blockly.FieldNumber(0, 0, 255), "DEVICE_IDENTIFIER");
    this.appendDummyInput().appendField("Device brightness").appendField(new Blockly.FieldNumber(255, 0, 255), "DEVICE_BRIGHTNESS");
    this.appendDummyInput().appendField("PORTA").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_A").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_A_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTB").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_B").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_B_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTC").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_C").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_C_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTD").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_D").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_D_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTE").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_E").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_E_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTF").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_F").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_F_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTG").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_G").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_G_LENGTH").appendField("px");
    this.appendDummyInput().appendField("PORTH").appendField(new Blockly.FieldCheckbox("TRUE"), "TANGLE_H").appendField("size").appendField(new Blockly.FieldNumber(0, 0, 10000), "PORT_H_LENGTH").appendField("px");
    this.appendDummyInput().appendField("  SENSORS:");
    this.appendStatementInput("SENSORS").setCheck("sensor");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["variable_create"] = {
  init: function () {
    this.appendValueInput("SOURCE").setCheck("value").appendField("CREATE 📦").appendField(new Blockly.FieldTextInput("$var1"), "LABEL");
    this.setPreviousStatement(true, "construct");
    this.setNextStatement(true, "construct");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

// Blockly.Blocks["variable_modify"] = {
//   init: function () {
//     this.appendValueInput("SOURCE").setCheck("value").appendField("CAHNGE 📦").appendField(new Blockly.FieldTextInput("$var1"), "LABEL");
//     this.setPreviousStatement(true, "construct");
//     this.setNextStatement(true, "construct");
//     this.setColour(270);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   },
// };

Blockly.Blocks["value_dummy"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  value");
    this.setOutput(true, "value");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["value_math"] = {
  init: function () {
    this.appendValueInput("PARAMETER_A")
      .setCheck("value")
      .appendField("🢀 ")
      .appendField(
        new Blockly.FieldDropdown([
          ["+", "ADD"],
          ["-", "SUB"],
          ["*", "MUL"],
          ["/", "DIV"],
        ]),
        "OPTION"
      );
    this.appendValueInput("PARAMETER_B").setCheck("value");
    this.setOutput(true, "value");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["value_map"] = {
  init: function () {
    this.appendValueInput("PARAMETER_X").setCheck("value").appendField("🢀   MAP");
    this.appendValueInput("PARAMETER_INMIN").setCheck("value").setAlign(Blockly.ALIGN_RIGHT).appendField("from min");
    this.appendValueInput("PARAMETER_INMAX").setCheck("value").setAlign(Blockly.ALIGN_RIGHT).appendField("from max");
    this.appendValueInput("PARAMETER_OUTMIN").setCheck("value").setAlign(Blockly.ALIGN_RIGHT).appendField("to min");
    this.appendValueInput("PARAMETER_OUTMAX").setCheck("value").setAlign(Blockly.ALIGN_RIGHT).appendField("to max");
    this.setOutput(true, "value");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["value_read_variable"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  READ 📦").appendField(new Blockly.FieldTextInput("$var1"), "VARIABLE_LABEL");
    this.setOutput(true, "value");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["value_constant"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  VALUE").appendField(new Blockly.FieldTextInput(""), "VALUE");
    this.setOutput(true, "value");
    this.setColour(270);
    this.setTooltip("Set SCALE by '100%', TOUPLE '[0x01,0x02,0x03,0x04]' , COLOR '#ffaacc,' LABEL '$label'");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensor_artnet"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("ART-NET universe")
      .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "DMX_UNIVERSE")
      .appendField("channel")
      .appendField(new Blockly.FieldNumber(0, 1, 256, 1), "DMX_CHANNEL")
      .appendField("count")
      .appendField(new Blockly.FieldNumber(0, 1, 255, 1), "DMX_CHANNEL_COUNT")
      .appendField(" EMIT 🕹️")
      .appendField(new Blockly.FieldTextInput("$dmx1"), "EVENT_LABEL");
    this.setPreviousStatement(true, "sensor");
    this.setNextStatement(true, "sensor");
    this.setColour(105);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensor_touch"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("TOUCH")
      .appendField(new Blockly.FieldTextInput("$tou1"), "TOUCH_LABEL")
      .appendField(
        new Blockly.FieldDropdown([
          ["on PRESSED", "ON_PRESSED"],
          ["on RELEASED", "ON_RELEASED"],
          ["on PUSHED", "ON_PUSHED"],
          ["on HOLDED", "ON_HOLDED"],
        ]),
        "ACTION"
      )
      .appendField("EMIT 🕹️")
      .appendField(new Blockly.FieldTextInput("$tou1"), "EVENT_LABEL");
    this.setPreviousStatement(true, "sensor");
    this.setNextStatement(true, "sensor");
    this.setColour(105);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensor_gyro"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("GYROSCOPE")
      .appendField(
        new Blockly.FieldDropdown([
          ["XYZ as TUPLE", "AXIES"],
          ["X as SCALE", "OPTIONNAME"],
          ["Y as SCALE", "OPTIONNAME"],
          ["Z as SCALE", "OPTIONNAME"],
          ["IMPACT as SCALE", "IMPACT"],
        ]),
        "ACTION"
      )
      .appendField("EMIT 🕹️")
      .appendField(new Blockly.FieldTextInput("gyr1"), "EVENT_LABEL");
    this.setPreviousStatement(true, "sensor");
    this.setNextStatement(true, "sensor");
    this.setColour(105);
    this.setTooltip("event parameter gets a list of X,Y,Z axies");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensor_acc"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("ACCELEROMETER")
      .appendField(
        new Blockly.FieldDropdown([
          ["XYZ as TUPLE", "AXIES"],
          ["X as SCALE", "X"],
          ["Y as SCALE", "Y"],
          ["Z as SCALE", "Z"],
        ]),
        "ACTION"
      )
      .appendField("EMIT 🕹️")
      .appendField(new Blockly.FieldTextInput("$acc1"), "EVENT_LABEL");
    this.setPreviousStatement(true, "sensor");
    this.setNextStatement(true, "sensor");
    this.setColour(105);
    this.setTooltip("Event parameter gets a list of X,Y,Z values");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensor_gesture"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("GESTURE")
      .appendField(
        new Blockly.FieldDropdown([
          ["PROXIMITY", "GESTURE_PROXIMITY"],
          ["LEFT to RIGHT", "GESTURE_LEFT_RIGHT"],
          ["RIGHT to LEFT", "GESTURE_RIGHT_LEFT"],
          ["FRONT to BACK", "GESTURE_FRONT_BACK"],
          ["BACK to FRONT", "GESTURE_BACK_FRONT"],
        ]),
        "ACTION"
      )
      .appendField("EMIT 🕹️")
      .appendField(new Blockly.FieldTextInput("$ges1"), "EVENT_LABEL");
    this.setPreviousStatement(true, "sensor");
    this.setNextStatement(true, "sensor");
    this.setColour(105);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensor_button"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("BUTTON")
      .appendField(new Blockly.FieldTextInput("$btn1"), "BUTTON_LABEL")
      .appendField(
        new Blockly.FieldDropdown([
          ["on PRESSED", "ON_PRESSED"],
          ["on RELEASED", "ON_RELEASED"],
          ["on PUSHED", "ON_PUSHED"],
          ["on HOLDED", "ON_HOLDED"],
        ]),
        "ACTION"
      )
      .appendField("EMIT 🕹️")
      .appendField(new Blockly.FieldTextInput("$btn1"), "EVENT_LABEL");
    this.setPreviousStatement(true, "sensor");
    this.setNextStatement(true, "sensor");
    this.setColour(105);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensor_dummy"] = {
  init: function () {
    this.appendDummyInput().appendField("přidejte input");
    this.setPreviousStatement(true, "sensor");
    this.setNextStatement(true, "sensor");
    this.setColour(105);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_sin"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  SINE WAVE  period").appendField(new Blockly.FieldTextInput("0s"), "PERIOD");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_last_event_parameter"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  LAST VALUE of 🕹️").appendField(new Blockly.FieldTextInput("$evt1"), "EVENT_LABEL");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_perlin_noise"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  PERLIN NOISE");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_saw"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  SAW WAVE  period").appendField(new Blockly.FieldTextInput("5s"), "PERIOD");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_triangle"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  TRIANGLE WAVE  period").appendField(new Blockly.FieldTextInput("5s"), "PERIOD");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_square"] = {
  init: function () {
    this.appendDummyInput().appendField("🢀  SQUARE WAVE  period").appendField(new Blockly.FieldTextInput("5s"), "PERIOD");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_smoothout"] = {
  init: function () {
    this.appendValueInput("SMOOTHED_VALUE").setCheck("value").appendField("🢀  SMOOTH OUT over").appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["generator_lag"] = {
  init: function () {
    this.appendValueInput("LAGGED_VALUE").setCheck("value").appendField("🢀  LAG ").appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.setOutput(true, "value");
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks['animation_color_gradient'] = {
  init: function() {
    this.appendValueInput("NEXT")
        .setCheck("animation")
        .appendField("GRADIENT ")
        .appendField(new Blockly.FieldColour("#000000"), "COLOR1")
        .appendField(new Blockly.FieldColour("#000000"), "COLOR2")
        .appendField(new Blockly.FieldColour("#000000"), "COLOR3")
        .appendField(new Blockly.FieldColour("#000000"), "COLOR4")
        .appendField(new Blockly.FieldColour("#000000"), "COLOR5")
        .appendField(" ")
        .appendField(new Blockly.FieldTextInput("100%"), "SMOOTHING")
        .appendField("smoothing  ")
        .appendField(new Blockly.FieldTextInput("100%"), "SCALE")
        .appendField("of spectrum")
        .appendField("⌛")
        .appendField(new Blockly.FieldTextInput("5s"), "DURATION");
    this.setInputsInline(false);
    this.setOutput(true, "animation");
    this.setColour(240);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};