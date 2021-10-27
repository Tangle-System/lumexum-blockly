/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper functions for generating Tngl for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Tngl');
goog.require('Blockly.FieldColour');

goog.require('Blockly.Generator');
goog.require('Blockly.utils.global');
goog.require('Blockly.utils.string');

Blockly.FieldColour.COLOURS = [
  // '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ff7f00', '#00ff7f', '#7f00ff', '#7fff00', '#007fff', '#ff007f',
  // '#dd0000', '#00dd00', '#0000bb', '#bbbb00', '#00bbbb', '#bb00bb', '#dd6600', '#00dd66', '#6600dd', '#66dd00', '#0066dd', '#dd0066',
  // '#990000', '#009900', '#000099', '#999900', '#009999', '#990099', '#bb5500', '#00bb55', '#5500bb', '#55bb00', '#0055bb', '#bb0055',
  // '#0f0000', '#000f00', '#00000f', '#0f0f00', '#000f0f', '#0f000f', '#552200', '#005522', '#220055', '#225500', '#002255', '#550022',
  // '#010000', '#000100', '#000001', '#010100', '#000101', '#010001', '#020100', '#000201', '#010002', '#010200', '#000102', '#020001', 
  // '#ffffff', '#eaeaea', '#d5d5d5', '#c0c0c0', '#ababab', '#969696', '#767676', '#565656', '#363636', '#101010', '#010101', '#000000'];

  '#ff0000', '#ea0000', '#d50000', '#c00000', '#ab0000', '#960000', '#760000', '#560000', '#360000', '#100000', '#040000', '#020000', 
  '#ff007f', '#ea0075', '#d5006a', '#c00060', '#ab0055', '#96004b', '#76003b', '#56002b', '#36001b', '#100008', '#040008', '#020001', 
  '#ff7f00', '#ea7500', '#d56a00', '#c06000', '#ab5500', '#964b00', '#763b00', '#562b00', '#361b00', '#100800', '#040800', '#020100', 
  '#ffff00', '#eaea00', '#d5d500', '#c0c000', '#abab00', '#969600', '#767600', '#565600', '#363600', '#101000', '#040400', '#020200', 
  '#7fff00', '#75ea00', '#6ad500', '#60c000', '#55ab00', '#4b9600', '#3b7600', '#2b5600', '#1b3600', '#081000', '#080400', '#010200', 
  '#00ff00', '#00ea00', '#00d500', '#00c000', '#00ab00', '#009600', '#007600', '#005600', '#003600', '#001000', '#000400', '#000200', 
  '#00ff7f', '#00ea75', '#00d56a', '#00c060', '#00ab55', '#00964b', '#00763b', '#00562b', '#00361b', '#001008', '#000408', '#000201', 
  '#00ffff', '#00eaea', '#00d5d5', '#00c0c0', '#00abab', '#009696', '#007676', '#005656', '#003636', '#001010', '#000404', '#000202', 
  '#007fff', '#0075ea', '#006ad5', '#0060c0', '#0055ab', '#004b96', '#003b76', '#002b56', '#001b36', '#000810', '#000804', '#000102', 
  '#0000ff', '#0000ea', '#0000d5', '#0000c0', '#0000ab', '#000096', '#000076', '#000056', '#000036', '#000010', '#000004', '#000002', 
  '#7f00ff', '#7500ea', '#6a00d5', '#6000c0', '#5500ab', '#4b0096', '#3b0076', '#2b0056', '#1b0036', '#080010', '#080004', '#010002', 
  '#ff00ff', '#ea00ea', '#d500d5', '#c000c0', '#ab00ab', '#960096', '#760076', '#560056', '#360036', '#100010', '#040004', '#020002', 
  '#ffffff', '#eaeaea', '#d5d5d5', '#c0c0c0', '#ababab', '#969696', '#767676', '#565656', '#363636', '#101010', '#010101', '#000000'];

Blockly.FieldColour.TITLES = [];

Blockly.FieldColour.COLUMNS = 12;

/**
 * Tngl code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Tngl = new Blockly.Generator('Tngl');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Tngl.addReservedWords(
    // https://developer.mozilla.org/en-US/docs/Web/Tngl/Reference/Lexical_grammar#Keywords
    'break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,in,instanceof,new,return,super,switch,this,throw,try,typeof,var,void,while,with,yield,' +
    'enum,' +
    'implements,interface,let,package,private,protected,public,static,' +
    'await,' +
    'null,true,false,' +
    // Magic variable.
    'arguments,' +
    // Everything in the current environment (835 items in Chrome, 104 in Node).
    Object.getOwnPropertyNames(Blockly.utils.global).join(','));

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/Tngl/Reference/Operators/Operator_Precedence
 */
Blockly.Tngl.ORDER_ATOMIC = 0;           // 0 "" ...
Blockly.Tngl.ORDER_NEW = 1.1;            // new
Blockly.Tngl.ORDER_MEMBER = 1.2;         // . []
Blockly.Tngl.ORDER_FUNCTION_CALL = 2;    // ()
Blockly.Tngl.ORDER_INCREMENT = 3;        // ++
Blockly.Tngl.ORDER_DECREMENT = 3;        // --
Blockly.Tngl.ORDER_BITWISE_NOT = 4.1;    // ~
Blockly.Tngl.ORDER_UNARY_PLUS = 4.2;     // +
Blockly.Tngl.ORDER_UNARY_NEGATION = 4.3; // -
Blockly.Tngl.ORDER_LOGICAL_NOT = 4.4;    // !
Blockly.Tngl.ORDER_TYPEOF = 4.5;         // typeof
Blockly.Tngl.ORDER_VOID = 4.6;           // void
Blockly.Tngl.ORDER_DELETE = 4.7;         // delete
Blockly.Tngl.ORDER_AWAIT = 4.8;          // await
Blockly.Tngl.ORDER_EXPONENTIATION = 5.0; // **
Blockly.Tngl.ORDER_MULTIPLICATION = 5.1; // *
Blockly.Tngl.ORDER_DIVISION = 5.2;       // /
Blockly.Tngl.ORDER_MODULUS = 5.3;        // %
Blockly.Tngl.ORDER_SUBTRACTION = 6.1;    // -
Blockly.Tngl.ORDER_ADDITION = 6.2;       // +
Blockly.Tngl.ORDER_BITWISE_SHIFT = 7;    // << >> >>>
Blockly.Tngl.ORDER_RELATIONAL = 8;       // < <= > >=
Blockly.Tngl.ORDER_IN = 8;               // in
Blockly.Tngl.ORDER_INSTANCEOF = 8;       // instanceof
Blockly.Tngl.ORDER_EQUALITY = 9;         // == != === !==
Blockly.Tngl.ORDER_BITWISE_AND = 10;     // &
Blockly.Tngl.ORDER_BITWISE_XOR = 11;     // ^
Blockly.Tngl.ORDER_BITWISE_OR = 12;      // |
Blockly.Tngl.ORDER_LOGICAL_AND = 13;     // &&
Blockly.Tngl.ORDER_LOGICAL_OR = 14;      // ||
Blockly.Tngl.ORDER_CONDITIONAL = 15;     // ?:
Blockly.Tngl.ORDER_ASSIGNMENT = 16;      // = += -= **= *= /= %= <<= >>= ...
Blockly.Tngl.ORDER_YIELD = 17;           // yield
Blockly.Tngl.ORDER_COMMA = 18;           // ,
Blockly.Tngl.ORDER_NONE = 99;            // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.Tngl.ORDER_OVERRIDES = [
  // (foo()).bar -> foo().bar
  // (foo())[0] -> foo()[0]
  [Blockly.Tngl.ORDER_FUNCTION_CALL, Blockly.Tngl.ORDER_MEMBER],
  // (foo())() -> foo()()
  [Blockly.Tngl.ORDER_FUNCTION_CALL, Blockly.Tngl.ORDER_FUNCTION_CALL],
  // (foo.bar).baz -> foo.bar.baz
  // (foo.bar)[0] -> foo.bar[0]
  // (foo[0]).bar -> foo[0].bar
  // (foo[0])[1] -> foo[0][1]
  [Blockly.Tngl.ORDER_MEMBER, Blockly.Tngl.ORDER_MEMBER],
  // (foo.bar)() -> foo.bar()
  // (foo[0])() -> foo[0]()
  [Blockly.Tngl.ORDER_MEMBER, Blockly.Tngl.ORDER_FUNCTION_CALL],

  // !(!foo) -> !!foo
  [Blockly.Tngl.ORDER_LOGICAL_NOT, Blockly.Tngl.ORDER_LOGICAL_NOT],
  // a * (b * c) -> a * b * c
  [Blockly.Tngl.ORDER_MULTIPLICATION, Blockly.Tngl.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [Blockly.Tngl.ORDER_ADDITION, Blockly.Tngl.ORDER_ADDITION],
  // a && (b && c) -> a && b && c
  [Blockly.Tngl.ORDER_LOGICAL_AND, Blockly.Tngl.ORDER_LOGICAL_AND],
  // a || (b || c) -> a || b || c
  [Blockly.Tngl.ORDER_LOGICAL_OR, Blockly.Tngl.ORDER_LOGICAL_OR]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Tngl.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Tngl.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Tngl.functionNames_ = Object.create(null);

  if (!Blockly.Tngl.variableDB_) {
    Blockly.Tngl.variableDB_ =
        new Blockly.Names(Blockly.Tngl.RESERVED_WORDS_);
  } else {
    Blockly.Tngl.variableDB_.reset();
  }

  Blockly.Tngl.variableDB_.setVariableMap(workspace.getVariableMap());

  var defvars = [];
  // Add developer variables (not created or named by the user).
  var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  for (var i = 0; i < devVarList.length; i++) {
    defvars.push(Blockly.Tngl.variableDB_.getName(devVarList[i],
        Blockly.Names.DEVELOPER_VARIABLE_TYPE));
  }

  // Add user variables, but only ones that are being used.
  var variables = Blockly.Variables.allUsedVarModels(workspace);
  for (var i = 0; i < variables.length; i++) {
    defvars.push(Blockly.Tngl.variableDB_.getName(variables[i].getId(),
        Blockly.VARIABLE_CATEGORY_NAME));
  }

  // Declare all of the variables.
  if (defvars.length) {
    Blockly.Tngl.definitions_['variables'] =
        'var ' + defvars.join(', ') + ';';
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Tngl.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.Tngl.definitions_) {
    definitions.push(Blockly.Tngl.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Tngl.definitions_;
  delete Blockly.Tngl.functionNames_;
  Blockly.Tngl.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Tngl.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Tngl string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Tngl string.
 * @private
 */
Blockly.Tngl.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Encode a string as a properly escaped multiline Tngl string, complete
 * with quotes.
 * @param {string} string Text to encode.
 * @return {string} Tngl string.
 * @private
 */
Blockly.Tngl.multiline_quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  var lines = string.split(/\n/g).map(Blockly.Tngl.quote_);
  return lines.join(' + \'\\n\' +\n');
};

/**
 * Common tasks for generating Tngl from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Tngl code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Tngl code with comments and subsequent blocks added.
 * @private
 */
Blockly.Tngl.scrub_ = function(block, code, opt_thisOnly) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      comment = Blockly.utils.string.wrap(comment,
          Blockly.Tngl.COMMENT_WRAP - 3);
      commentCode += Blockly.Tngl.prefixLines(comment + '\n', '// ');
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = Blockly.Tngl.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Tngl.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = opt_thisOnly ? '' : Blockly.Tngl.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.Tngl.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.Tngl.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.Tngl.valueToCode(block, atId,
        Blockly.Tngl.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.Tngl.valueToCode(block, atId,
        Blockly.Tngl.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.Tngl.valueToCode(block, atId,
        Blockly.Tngl.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.Tngl.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = Number(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.Tngl.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.Tngl.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.Tngl.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
