/**
 * @author
 */
"use strict";
goog.provide("Blockly.Constants.Tngl");

goog.require("Blockly");
goog.require("Blockly.Blocks");

/////////////////////////////////////////////////////////////////////

// Blockly.Blocks["device"].setMutators = function () {
//   this.jsonInit({ mutator: "device_mutator" });
// };

// Blockly.Blocks["device_mutator"] = {
//   init: function () {
//     this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color field").appendField(new Blockly.FieldCheckbox(false), "COLOR_MUTATION");
//     this.setColour(240);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   },
// };

// Blockly.Constants.Tngl.ANIMATION_FILL_MIXIN = {
//   connection_: null,
//   mutation_field_: null,
//   mutation_field_last_: null,
//   /**
//    * Create XML to represent the number inputs.
//    * @return {Element} XML storage element.
//    * @this Blockly.Block
//    */
//   mutationToDom: function () {
//     var container = document.createElement("mutation");

//     if (this.mutation_field_ == "TRUE") {
//       container.setAttribute("inline_color_field", this.mutation_field_);
//     }

//     return container;
//   },
//   /**
//    * Parse XML to restore the inputs.
//    * @param {!Element} xmlElement XML storage element.
//    * @this Blockly.Block
//    */
//   domToMutation: function (xmlElement) {
//     this.mutation_field_ = xmlElement.getAttribute("inline_color_field");

//     this.updateShape_();
//   },
//   /**
//    * Populate the mutator's dialog with this block's components.
//    * @param {!Blockly.Workspace} workspace Mutator's workspace.
//    * @return {!Blockly.Block} Root block in mutator.
//    * @this Blockly.Block
//    */
//   decompose: function (workspace) {
//     var containerBlock = workspace.newBlock("device_mutator");
//     containerBlock.setFieldValue(this.mutation_field_, "COLOR_MUTATION");

//     containerBlock.initSvg();
//     return containerBlock;
//   },
//   /**
//    * Reconfigure this block based on the mutator dialog's components.
//    * @param {!Blockly.Block} containerBlock Root block in mutator.
//    * @this Blockly.Block
//    */
//   compose: function (containerBlock) {
//     // Get check box values
//     this.mutation_field_ = containerBlock.getFieldValue("COLOR_MUTATION");

//     this.updateShape_();
//     // Reconnect any child blocks
//     if (this.getInput("NEXT")) {
//       Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
//     }
//   },
//   /**
//    * Store pointers to any connected child blocks.
//    * @param {!Blockly.Block} containerBlock Root block in mutator.
//    * @this Blockly.Block
//    */
//   saveConnections: function (containerBlock) {
//     var input = this.getInput("NEXT");
//     if (input) {
//       this.connection_ = input && input.connection.targetConnection;
//     }
//   },
//   /**
//    * Modify this block to have the correct number of inputs.
//    * @this Blockly.Block
//    * @private
//    */
//   updateShape_: function () {
//     if (this.mutation_field_last_ !== this.mutation_field_) {
//       this.mutation_field_last_ = this.mutation_field_;

//       // store field values
//       let color = this.getFieldValue("COLOR");
//       let duration = this.getFieldValue("DURATION");

//       // Remove the old input (so that you don't have inputs stack repeatedly)
//       if (this.getInput("NEXT")) {
//         this.removeInput("NEXT");
//       }

//       // Append the new input based on the checkbox
//       if (this.mutation_field_ == "TRUE") {
//         this.appendValueInput("NEXT").setCheck("animation").appendField("SOLIDNÍ BARVA ").appendField(new Blockly.FieldTextInput(), "COLOR").appendField(" ⌛").appendField(new Blockly.FieldTextInput(), "DURATION");
//       } else {
//         this.appendValueInput("NEXT").setCheck("animation").appendField("SOLIDNÍ BARVA ").appendField(new Blockly.FieldColour(), "COLOR").appendField("  ⌛").appendField(new Blockly.FieldTextInput(), "DURATION");
//       }

//       // validators are deleted, so reconfigure them
//       this.setValidators();

//       // set back field values with the help of the validators
//       this.setFieldValue(color, "COLOR");
//       this.setFieldValue(duration, "DURATION");
//     }
//   },
// };

// Blockly.Extensions.registerMutator("device_mutator", Blockly.Constants.Tngl.DEVICE_MIXIN, null, [""]);

/////////////////////////////////////////////////////////////////////

Blockly.Blocks["animation_fill"].setMutators = function () {
  this.jsonInit({ mutator: "animation_fill_mutator" });
};

Blockly.Blocks["animation_fill_mutator"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color field").appendField(new Blockly.FieldCheckbox(false), "COLOR_MUTATION");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Constants.Tngl.ANIMATION_FILL_MIXIN = {
  connection_: null,
  mutation_field_: null,
  mutation_field_last_: null,
  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");

    if (this.mutation_field_ == "TRUE") {
      container.setAttribute("inline_color_field", this.mutation_field_);
    }

    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.mutation_field_ = xmlElement.getAttribute("inline_color_field");

    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("animation_fill_mutator");
    containerBlock.setFieldValue(this.mutation_field_, "COLOR_MUTATION");

    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    // Get check box values
    this.mutation_field_ = containerBlock.getFieldValue("COLOR_MUTATION");

    this.updateShape_();
    // Reconnect any child blocks
    if (this.getInput("NEXT")) {
      Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var input = this.getInput("NEXT");
    if (input) {
      this.connection_ = input && input.connection.targetConnection;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function () {
    if (this.mutation_field_last_ !== this.mutation_field_) {
      this.mutation_field_last_ = this.mutation_field_;

      // store field values
      let color = this.getFieldValue("COLOR");
      let duration = this.getFieldValue("DURATION");

      // Remove the old input (so that you don't have inputs stack repeatedly)
      if (this.getInput("NEXT")) {
        this.removeInput("NEXT");
      }

      // Append the new input based on the checkbox
      if (this.mutation_field_ == "TRUE") {
        this.appendValueInput("NEXT").setCheck("animation").appendField("SOLIDNÍ BARVA ").appendField(new Blockly.FieldTextInput(), "COLOR").appendField(" ⌛").appendField(new Blockly.FieldTextInput(), "DURATION");
      } else {
        this.appendValueInput("NEXT").setCheck("animation").appendField("SOLIDNÍ BARVA ").appendField(new Blockly.FieldColour(), "COLOR").appendField("  ⌛").appendField(new Blockly.FieldTextInput(), "DURATION");
      }

      // validators are deleted, so reconfigure them
      this.setValidators();

      // set back field values with the help of the validators
      this.setFieldValue(color, "COLOR");
      this.setFieldValue(duration, "DURATION");
    }
  },
};

Blockly.Extensions.registerMutator("animation_fill_mutator", Blockly.Constants.Tngl.ANIMATION_FILL_MIXIN, null, [""]);

/////////////////////////////////////////////////////////////////////

Blockly.Blocks["animation_fade"].setMutators = function () {
  this.jsonInit({ mutator: "animation_fade_mutator" });
};

Blockly.Blocks["animation_fade_mutator"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color A field").appendField(new Blockly.FieldCheckbox(false), "COLOR1_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color B field").appendField(new Blockly.FieldCheckbox(false), "COLOR2_MUTATION");

    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Constants.Tngl.ANIMATION_FADE_MIXIN = {
  connection_: null,
  mutation_fields_: [null, null],
  mutation_fields_last_: [null, null],
  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_[i] == "TRUE") {
        container.setAttribute("inline_color" + (i + 1) + "_field", this.mutation_fields_[i]);
      }
    }

    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = xmlElement.getAttribute("inline_color" + (i + 1) + "_field");
    }

    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("animation_fade_mutator");
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      containerBlock.setFieldValue(this.mutation_fields_[i], "COLOR" + (i + 1) + "_MUTATION");
    }
    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    // Get check box values
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = containerBlock.getFieldValue("COLOR" + (i + 1) + "_MUTATION");
    }
    this.updateShape_();
    // Reconnect any child blocks
    if (this.getInput("NEXT")) {
      Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var input = this.getInput("NEXT");
    if (input) {
      this.connection_ = input && input.connection.targetConnection;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function () {
    let skip = true;

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_last_[i] !== this.mutation_fields_[i]) {
        this.mutation_fields_last_ = [...this.mutation_fields_];
        skip = false;
      }
    }

    if (skip) {
      return;
    }

    // store field values
    let color1 = this.getFieldValue("COLOR1");
    let color2 = this.getFieldValue("COLOR2");
    let duration = this.getFieldValue("DURATION");

    // Remove the old input (so that you don't have inputs stack repeatedly)
    if (this.getInput("NEXT")) {
      this.removeInput("NEXT");
    }

    let field_color1, field_color2;

    // Append the new input based on the checkbox
    if (this.mutation_fields_[0] == "TRUE") {
      field_color1 = new Blockly.FieldTextInput();
    } else {
      field_color1 = new Blockly.FieldColour();
    }

    if (this.mutation_fields_[1] == "TRUE") {
      field_color2 = new Blockly.FieldTextInput();
    } else {
      field_color2 = new Blockly.FieldColour();
    }

    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("PŘECHOD  ")
      .appendField(field_color1, "COLOR1")
      .appendField("➤")
      .appendField(field_color2, "COLOR2")
      .appendField("  ⌛")
      .appendField(new Blockly.FieldTextInput(), "DURATION");

    // validators are deleted, so reconfigure them
    this.setValidators();

    // set back field values with the help of the validators
    this.setFieldValue(color1, "COLOR1");
    this.setFieldValue(color2, "COLOR2");
    this.setFieldValue(duration, "DURATION");
  },
};

Blockly.Extensions.registerMutator("animation_fade_mutator", Blockly.Constants.Tngl.ANIMATION_FADE_MIXIN, null, [""]);

///////////////////////////////////////////////////////////////

Blockly.Blocks["animation_plasma_shot"].setMutators = function () {
  this.jsonInit({ mutator: "animation_plasma_shot_mutator" });
};

Blockly.Blocks["animation_plasma_shot_mutator"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color field").appendField(new Blockly.FieldCheckbox(false), "COLOR_MUTATION");
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Constants.Tngl.ANIMATION_FILL_MIXIN = {
  connection_: null,
  mutation_field_: null,
  mutation_field_last_: null,
  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");

    if (this.mutation_field_ == "TRUE") {
      container.setAttribute("inline_color_field", this.mutation_field_);
    }

    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.mutation_field_ = xmlElement.getAttribute("inline_color_field");

    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("animation_plasma_shot_mutator");
    containerBlock.setFieldValue(this.mutation_field_, "COLOR_MUTATION");

    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    // Get check box values
    this.mutation_field_ = containerBlock.getFieldValue("COLOR_MUTATION");

    this.updateShape_();
    // Reconnect any child blocks
    if (this.getInput("NEXT")) {
      Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var input = this.getInput("NEXT");
    if (input) {
      this.connection_ = input && input.connection.targetConnection;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function () {
    if (this.mutation_field_last_ !== this.mutation_field_) {
      this.mutation_field_last_ = this.mutation_field_;

      // store field values
      let color = this.getFieldValue("COLOR");
      let percentage = this.getFieldValue("PERCENTAGE");
      let duration = this.getFieldValue("DURATION");

      // Remove the old input (so that you don't have inputs stack repeatedly)
      if (this.getInput("NEXT")) {
        this.removeInput("NEXT");
      }

      // Append the new input based on the checkbox

      let field_color = null;

      if (this.mutation_field_ == "TRUE") {
        field_color = new Blockly.FieldTextInput();
      } else {
        field_color = new Blockly.FieldColour();
      }

      this.appendValueInput("NEXT")
        .setCheck("animation")
        .appendField("VÝSTŘEL  ")
        .appendField(field_color, "COLOR")
        .appendField("  délka")
        .appendField(new Blockly.FieldTextInput(), "PERCENTAGE")
        .appendField("pásku")
        .appendField(" ⌛")
        .appendField(new Blockly.FieldTextInput(), "DURATION");

      // validators are deleted, so reconfigure them
      this.setValidators();

      // set back field values with the help of the validators
      this.setFieldValue(color, "COLOR");
      this.setFieldValue(percentage, "PERCENTAGE");
      this.setFieldValue(duration, "DURATION");
    }
  },
};

Blockly.Extensions.registerMutator("animation_plasma_shot_mutator", Blockly.Constants.Tngl.ANIMATION_FILL_MIXIN, null, [""]);

/////////////////////////////////////////////////////////////////////
Blockly.Blocks["animation_loading_bar"].setMutators = function () {
  this.jsonInit({ mutator: "animation_loading_bar_mutator" });
};

Blockly.Blocks["animation_loading_bar_mutator"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color A field").appendField(new Blockly.FieldCheckbox(false), "COLOR1_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color B field").appendField(new Blockly.FieldCheckbox(false), "COLOR2_MUTATION");

    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Constants.Tngl.ANIMATION_LOADING_BAR_MIXIN = {
  connection_: null,
  mutation_fields_: [null, null],
  mutation_fields_last_: [null, null],
  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_[i] == "TRUE") {
        container.setAttribute("inline_color" + (i + 1) + "_field", this.mutation_fields_[i]);
      }
    }

    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = xmlElement.getAttribute("inline_color" + (i + 1) + "_field");
    }

    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("animation_loading_bar_mutator");
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      containerBlock.setFieldValue(this.mutation_fields_[i], "COLOR" + (i + 1) + "_MUTATION");
    }
    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    // Get check box values
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = containerBlock.getFieldValue("COLOR" + (i + 1) + "_MUTATION");
    }
    this.updateShape_();
    // Reconnect any child blocks
    if (this.getInput("NEXT")) {
      Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var input = this.getInput("NEXT");
    if (input) {
      this.connection_ = input && input.connection.targetConnection;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function () {
    let skip = true;

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_last_[i] !== this.mutation_fields_[i]) {
        this.mutation_fields_last_ = [...this.mutation_fields_];
        skip = false;
      }
    }

    if (skip) {
      return;
    }
    // store field values
    let color1 = this.getFieldValue("COLOR1");
    let color2 = this.getFieldValue("COLOR2");
    let duration = this.getFieldValue("DURATION");

    // Remove the old input (so that you don't have inputs stack repeatedly)
    if (this.getInput("NEXT")) {
      this.removeInput("NEXT");
    }

    let field_color1, field_color2;

    // Append the new input based on the checkbox
    if (this.mutation_fields_[0] == "TRUE") {
      field_color1 = new Blockly.FieldTextInput();
    } else {
      field_color1 = new Blockly.FieldColour();
    }

    if (this.mutation_fields_[1] == "TRUE") {
      field_color2 = new Blockly.FieldTextInput();
    } else {
      field_color2 = new Blockly.FieldColour();
    }

    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("NAČÍTÁNÍ  ")
      .appendField(field_color1, "COLOR1")
      .appendField("do")
      .appendField(field_color2, "COLOR2")
      .appendField("  ⌛")
      .appendField(new Blockly.FieldTextInput(), "DURATION");

    // validators are deleted, so reconfigure them
    this.setValidators();

    // set back field values with the help of the validators
    this.setFieldValue(color1, "COLOR1");
    this.setFieldValue(color2, "COLOR2");
    this.setFieldValue(duration, "DURATION");
  },
};

Blockly.Extensions.registerMutator("animation_loading_bar_mutator", Blockly.Constants.Tngl.ANIMATION_LOADING_BAR_MIXIN, null, [""]);

///////////////////////////////////////////////////////////////

Blockly.Blocks["animation_color_roll"].setMutators = function () {
  this.jsonInit({ mutator: "animation_color_roll_mutator" });
};

Blockly.Blocks["animation_color_roll_mutator"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color A field").appendField(new Blockly.FieldCheckbox(false), "COLOR1_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color B field").appendField(new Blockly.FieldCheckbox(false), "COLOR2_MUTATION");

    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Constants.Tngl.ANIMATION_COLOR_ROLL_MIXIN = {
  connection_: null,
  mutation_fields_: [null, null],
  mutation_fields_last_: [null, null],
  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_[i] == "TRUE") {
        container.setAttribute("inline_color" + (i + 1) + "_field", this.mutation_fields_[i]);
      }
    }

    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = xmlElement.getAttribute("inline_color" + (i + 1) + "_field");
    }

    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("animation_color_roll_mutator");
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      containerBlock.setFieldValue(this.mutation_fields_[i], "COLOR" + (i + 1) + "_MUTATION");
    }
    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    // Get check box values
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = containerBlock.getFieldValue("COLOR" + (i + 1) + "_MUTATION");
    }
    this.updateShape_();
    // Reconnect any child blocks
    if (this.getInput("NEXT")) {
      Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var input = this.getInput("NEXT");
    if (input) {
      this.connection_ = input && input.connection.targetConnection;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function () {
    let skip = true;

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_last_[i] !== this.mutation_fields_[i]) {
        this.mutation_fields_last_ = [...this.mutation_fields_];
        skip = false;
      }
    }

    if (skip) {
      return;
    }

    // store field values
    let color1 = this.getFieldValue("COLOR1");
    let color2 = this.getFieldValue("COLOR2");
    let duration = this.getFieldValue("DURATION");

    // Remove the old input (so that you don't have inputs stack repeatedly)
    if (this.getInput("NEXT")) {
      this.removeInput("NEXT");
    }

    let field_color1, field_color2;

    // Append the new input based on the checkbox
    if (this.mutation_fields_[0] == "TRUE") {
      field_color1 = new Blockly.FieldTextInput();
    } else {
      field_color1 = new Blockly.FieldColour();
    }

    if (this.mutation_fields_[1] == "TRUE") {
      field_color2 = new Blockly.FieldTextInput();
    } else {
      field_color2 = new Blockly.FieldColour();
    }

    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("CYKLUS BAREV  ")
      .appendField(field_color1, "COLOR1")
      .appendField("&")
      .appendField(field_color2, "COLOR2")
      .appendField("  ⌛")
      .appendField(new Blockly.FieldTextInput(), "DURATION");

    // validators are deleted, so reconfigure them
    this.setValidators();

    // set back field values with the help of the validators
    this.setFieldValue(color1, "COLOR1");
    this.setFieldValue(color2, "COLOR2");
    this.setFieldValue(duration, "DURATION");
  },
};

Blockly.Extensions.registerMutator("animation_color_roll_mutator", Blockly.Constants.Tngl.ANIMATION_COLOR_ROLL_MIXIN, null, [""]);

///////////////////////////////////////////////////////////////

Blockly.Blocks["animation_color_gradient3"].setMutators = function () {
  this.jsonInit({ mutator: "animation_color_gradient3_mutator" });
};

Blockly.Blocks["animation_color_gradient3_mutator"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color A field").appendField(new Blockly.FieldCheckbox(false), "COLOR1_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color B field").appendField(new Blockly.FieldCheckbox(false), "COLOR2_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color C field").appendField(new Blockly.FieldCheckbox(false), "COLOR3_MUTATION");

    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Constants.Tngl.ANIMATION_COLOR_GRADIENT3_MIXIN = {
  connection_: null,
  mutation_fields_: [null, null, null],
  mutation_fields_last_: [null, null, null],
  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_[i] == "TRUE") {
        container.setAttribute("inline_color" + (i + 1) + "_field", this.mutation_fields_[i]);
      }
    }

    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = xmlElement.getAttribute("inline_color" + (i + 1) + "_field");
    }

    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("animation_color_gradient3_mutator");
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      containerBlock.setFieldValue(this.mutation_fields_[i], "COLOR" + (i + 1) + "_MUTATION");
    }
    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    // Get check box values
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = containerBlock.getFieldValue("COLOR" + (i + 1) + "_MUTATION");
    }
    this.updateShape_();
    // Reconnect any child blocks
    if (this.getInput("NEXT")) {
      Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var input = this.getInput("NEXT");
    if (input) {
      this.connection_ = input && input.connection.targetConnection;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function () {
    let skip = true;

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_last_[i] !== this.mutation_fields_[i]) {
        this.mutation_fields_last_ = [...this.mutation_fields_];
        skip = false;
      }
    }

    if (skip) {
      return;
    }

    // store field values
    let color1 = this.getFieldValue("COLOR1");
    let color2 = this.getFieldValue("COLOR2");
    let color3 = this.getFieldValue("COLOR3");
    let smoothing = this.getFieldValue("SMOOTHING");
    let scale = this.getFieldValue("SCALE");
    let duration = this.getFieldValue("DURATION");

    // Remove the old input (so that you don't have inputs stack repeatedly)
    if (this.getInput("NEXT")) {
      this.removeInput("NEXT");
    }

    let fields = [null, null, null, null, null];

    for (let j = 0; j < fields.length; j++) {
      // Append the new input based on the checkbox
      if (this.mutation_fields_[j] == "TRUE") {
        fields[j] = new Blockly.FieldTextInput();
      } else {
        fields[j] = new Blockly.FieldColour();
      }
    }

    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("GRADIENT ")
      .appendField(fields[0], "COLOR1")
      .appendField(fields[1], "COLOR2")
      .appendField(fields[2], "COLOR3")
      .appendField("  smoothing")
      .appendField(new Blockly.FieldTextInput("100%"), "SMOOTHING")
      .appendField(" scale")
      .appendField(new Blockly.FieldTextInput("100%"), "SCALE")
      .appendField("⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");

    // validators are deleted, so reconfigure them
    this.setValidators();

    // set back field values with the help of the validators
    this.setFieldValue(color1, "COLOR1");
    this.setFieldValue(color2, "COLOR2");
    this.setFieldValue(color3, "COLOR3");
    this.setFieldValue(smoothing, "SMOOTHING");
    this.setFieldValue(scale, "SCALE");
    this.setFieldValue(duration, "DURATION");
  },
};

Blockly.Extensions.registerMutator("animation_color_gradient3_mutator", Blockly.Constants.Tngl.ANIMATION_COLOR_GRADIENT3_MIXIN, null, [""]);

///////////////////////////////////////////////////////////////

Blockly.Blocks["animation_color_gradient5"].setMutators = function () {
  this.jsonInit({ mutator: "animation_color_gradient5_mutator" });
};

Blockly.Blocks["animation_color_gradient5_mutator"] = {
  init: function () {
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color A field").appendField(new Blockly.FieldCheckbox(false), "COLOR1_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color B field").appendField(new Blockly.FieldCheckbox(false), "COLOR2_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color C field").appendField(new Blockly.FieldCheckbox(false), "COLOR3_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color D field").appendField(new Blockly.FieldCheckbox(false), "COLOR4_MUTATION");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Inline color E field").appendField(new Blockly.FieldCheckbox(false), "COLOR5_MUTATION");

    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Constants.Tngl.ANIMATION_COLOR_GRADIENT5_MIXIN = {
  connection_: null,
  mutation_fields_: [null, null, null, null, null],
  mutation_fields_last_: [null, null, null, null, null],
  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_[i] == "TRUE") {
        container.setAttribute("inline_color" + (i + 1) + "_field", this.mutation_fields_[i]);
      }
    }

    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = xmlElement.getAttribute("inline_color" + (i + 1) + "_field");
    }

    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("animation_color_gradient5_mutator");
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      containerBlock.setFieldValue(this.mutation_fields_[i], "COLOR" + (i + 1) + "_MUTATION");
    }
    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    // Get check box values
    for (let i = 0; i < this.mutation_fields_.length; i++) {
      this.mutation_fields_[i] = containerBlock.getFieldValue("COLOR" + (i + 1) + "_MUTATION");
    }
    this.updateShape_();
    // Reconnect any child blocks
    if (this.getInput("NEXT")) {
      Blockly.Mutator.reconnect(this.connection_, this, "NEXT");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var input = this.getInput("NEXT");
    if (input) {
      this.connection_ = input && input.connection.targetConnection;
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function () {
    let skip = true;

    for (let i = 0; i < this.mutation_fields_.length; i++) {
      if (this.mutation_fields_last_[i] !== this.mutation_fields_[i]) {
        this.mutation_fields_last_ = [...this.mutation_fields_];
        skip = false;
      }
    }

    if (skip) {
      return;
    }

    // store field values
    let color1 = this.getFieldValue("COLOR1");
    let color2 = this.getFieldValue("COLOR2");
    let color3 = this.getFieldValue("COLOR3");
    let color4 = this.getFieldValue("COLOR4");
    let color5 = this.getFieldValue("COLOR5");
    let smoothing = this.getFieldValue("SMOOTHING");
    let scale = this.getFieldValue("SCALE");
    let duration = this.getFieldValue("DURATION");

    // Remove the old input (so that you don't have inputs stack repeatedly)
    if (this.getInput("NEXT")) {
      this.removeInput("NEXT");
    }

    let fields = [null, null, null, null, null];

    for (let j = 0; j < fields.length; j++) {
      // Append the new input based on the checkbox
      if (this.mutation_fields_[j] == "TRUE") {
        fields[j] = new Blockly.FieldTextInput();
      } else {
        fields[j] = new Blockly.FieldColour();
      }
    }

    this.appendValueInput("NEXT")
      .setCheck("animation")
      .appendField("GRADIENT ")
      .appendField(fields[0], "COLOR1")
      .appendField(fields[1], "COLOR2")
      .appendField(fields[2], "COLOR3")
      .appendField(fields[3], "COLOR4")
      .appendField(fields[4], "COLOR5")
      .appendField("  smoothing")
      .appendField(new Blockly.FieldTextInput("100%"), "SMOOTHING")
      .appendField(" scale")
      .appendField(new Blockly.FieldTextInput("100%"), "SCALE")
      .appendField("⌛")
      .appendField(new Blockly.FieldTextInput("5s"), "DURATION");

    // validators are deleted, so reconfigure them
    this.setValidators();

    // set back field values with the help of the validators
    this.setFieldValue(color1, "COLOR1");
    this.setFieldValue(color2, "COLOR2");
    this.setFieldValue(color3, "COLOR3");
    this.setFieldValue(color4, "COLOR4");
    this.setFieldValue(color5, "COLOR5");
    this.setFieldValue(smoothing, "SMOOTHING");
    this.setFieldValue(scale, "SCALE");
    this.setFieldValue(duration, "DURATION");
  },
};

Blockly.Extensions.registerMutator("animation_color_gradient5_mutator", Blockly.Constants.Tngl.ANIMATION_COLOR_GRADIENT5_MIXIN, null, [""]);
