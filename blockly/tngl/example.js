/**
 * @author @10MINT (redpandadevs@gmail.com)
 */
'use strict';
goog.provide('Blockly.Constants.Border');

goog.require('Blockly');
goog.require('Blockly.Blocks');

const FIELDS = ["effect"];
const TYPES = ["effect"];

Blockly.Blocks['border'] = {

    init: function () {
        this.appendValueInput("ANIMATION")
            .setCheck(["effect", "animation"])
            .appendField("v čase")
            .appendField(new Blockly.FieldNumber(0, -2147483.648, 2147483.647, 0.001), "START")
            .appendField("s")
            .appendField("⌛")
            .appendField(new Blockly.FieldNumber(5, -2147483.648, 2147483.647, 0.001), "DURATION")
            .appendField("s ")
            .appendField(new Blockly.FieldDropdown([["PŘIDEJ", "ADD"], ["PŘEPIŠ", "SET"], ["ODEBER", "SUB"], ["VYFILTRUJ", "FILTER"]]), "DRAW_MODE");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "command");
        this.setNextStatement(true, ["command", "apply_effect"]);
        this.setColour(240);
        this.setTooltip("Tento blok vám dovoluje malovat na vaše LED plátno na které jsem připojený. Plátno můžete překreslit, ale taky ho zkombinovat s barvami které už na něm jsou.");
        this.setHelpUrl("https://tangle.matejsuchanek.cz/wiki/cz/brush stroke.png");

        this.jsonInit({ "mutator": "effect_mutator" });
        this.inputs_ = Array(FIELDS.length).fill("FALSE");
    }

};

Blockly.Blocks['effect_mutator'] = {
  init: function() {
    for (let i = 0; i < FIELDS.length; i++) {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(FIELDS[i])
        .appendField(new Blockly.FieldCheckbox(false), FIELDS[i]);
    }
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Constants.Border.BORDER_MUTATOR_MIXIN = {
  connections_: Array(FIELDS.length).fill(null),

  /**
   * Create XML to represent the number inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    for (let i = 0; i < this.inputs_.length; i++) {
      if (this.inputs_[i] == "TRUE") {
        container.setAttribute(FIELDS[i], this.inputs_[i]);
      }
    }
    return container;
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    for (let i = 0; i < this.inputs_.length; i++) {
      this.inputs_[i] = xmlElement.getAttribute(FIELDS[i].toLowerCase());
    }
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('effect_mutator');
    for (let i = 0; i < this.inputs_.length; i++) {
      containerBlock.setFieldValue(this.inputs_[i], FIELDS[i]);
    }
    containerBlock.initSvg();
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Get check box values
    for (let i = 0; i < this.inputs_.length; i++) {
      this.inputs_[i] = containerBlock.getFieldValue(FIELDS[i]);
    }
    this.updateShape_();
    // Reconnect any child blocks
    for (let i = 0; i < FIELDS.length; i++) {
      if (this.getInput(FIELDS[i])) {
        Blockly.Mutator.reconnect(this.connections_[i], this, FIELDS[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    for (let i = 0; i < this.inputs_.length; i++) {
      var input = this.getInput(FIELDS[i]);
      if (input) {
        this.connections_[i] = input && input.connection.targetConnection;
      }
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function() {
    // Delete everything.
    FIELDS.forEach(element => {
        if (this.getInput(element)) {
            this.removeInput(element);
        }
    });
    // Rebuild block.
    for (let i = 0; i < this.inputs_.length; i++) {
      if (this.inputs_[i] == "TRUE") {
        this.appendValueInput(FIELDS[i])
          //.setCheck(TYPES[i])
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Aplikuj EFEKT");
      }
    }
  }
};

Blockly.Extensions.registerMutator('effect_mutator', Blockly.Constants.Border.BORDER_MUTATOR_MIXIN, null, [""]);