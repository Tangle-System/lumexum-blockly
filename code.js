/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */

/// <reference path="lib/tangle-js/TangleWebBluetoothConnector.js" />
/// <reference path="blockly/blockly_compressed.js" />
/// <reference path="lib/tangle-js/TangleParser.js" />
/// <reference path="lib/tangle-js/TimeTrack.js" />
/// <reference path="lib/tangle-js/functions.js" />

"use strict";

if (!("TextDecoder" in window)) {
  alert("Sorry, this browser does not support this app. TextDecoder isn't available.");
}

// if (!navigator.bluetooth) {
//   alert("Oops, bluetooth doesn't work here.");
// }

// document.addEventListener("DOMContentLoaded", () => {
//   // butConnect.addEventListener("click", clickConnect);

//   // CODELAB: Add feature detection here.
//   const notSupported = document.getElementById("notSupported");
//   notSupported.classList.toggle("hidden", "serial" in navigator);
// });

/**
 * Create a namespace for the application.
 */
var Code = {};

Code.revealConsole = function () {
  enableDebugMode();
};

Code.hideConsole = function () {
  deactivateDebugMode();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Code.device = new TangleDevice("default", 0);

Code.device.setDebugLevel(3);
setTimeout(() => {
  Code.device.setDebugLevel(3);
}, 1000);

const devices_textarea = document.querySelector("#devices_textarea");

Code.device.on("peer_connected", peer => {
  console.log("Peer connected", peer);

  var re = new RegExp(peer + "[✅❌]\\n", "gi");
  if (devices_textarea.value.match(re)) {
    devices_textarea.value = devices_textarea.value.replace(re, peer + "✅\n");
  } else {
    devices_textarea.value += peer + "✅\n";
  }
});

Code.device.on("peer_disconnected", peer => {
  console.log("Peer disconnected", peer);

  var re = new RegExp(peer + "[✅❌]\\n", "gi");
  if (devices_textarea.value.match(re)) {
    devices_textarea.value = devices_textarea.value.replace(re, peer + "❌\n");
  } else {
    devices_textarea.value += peer + "❌\n";
  }
});

Code.device.addEventListener("connected", event => {
  console.log("Tangle Device connected");

  Code.device.getConnectedPeersInfo().then(peers => {
    devices_textarea.value = "";

    for (let i = 0; i < peers.length; i++) {
      devices_textarea.value += peers[i].mac + "✅\n";
    }
  });

  const button = /** @type {HTMLButtonElement} */ (document.getElementById("connectBluetoothButton"));
  const icon = /** @type {Element} */ (button.childNodes[1]);
  icon.classList.remove("connect");
  icon.classList.add("disconnect");
});

Code.device.addEventListener("disconnected", event => {
  console.log("Tangle Device disconnected");

  devices_textarea.value = "Devices disconnected";

  const button = /** @type {HTMLButtonElement} */ (document.getElementById("connectBluetoothButton"));
  const icon = /** @type {Element} */ (button.childNodes[1]);
  icon.classList.remove("disconnect");
  icon.classList.add("connect");
});

Code.device.addEventListener("version", ver => {
  alert("Detected version: " + ver);
});

Code.device.addEventListener("ota_status", status => {
  const container = document.getElementById("otaProgress");
  const bar = document.getElementById("otaProgressBar");
  const timeleft = document.getElementById("otaTimeLeft");

  switch (status) {
    case "begin":
      container.style.display = "block";
      bar.style.width = "0%";
      bar.style.backgroundColor = "#008000";
      timeleft.style.display = "block";
      break;

    case "success":
      bar.style.width = "100%";
      bar.style.backgroundColor = "#00a000";
      alert("OTA update was successful");
      break;

    case "fail":
      bar.style.backgroundColor = "#a00000";
      alert("OTA update failed");
    default:
      break;
  }
});

Code.device.addEventListener("ota_timeleft", timeleft => {
  let min = Math.floor(timeleft / 60000);
  timeleft %= 60000;
  let sec = Math.floor(timeleft / 1000);

  const pad = (number, size) => {
    var s = String(number);
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  };

  document.getElementById("otaTimeLeft").innerHTML = "Time left: " + min + ":" + pad(sec, 2);
});

Code.device.addEventListener("ota_progress", percentage => {
  const bar = document.getElementById("otaProgressBar");
  bar.style.width = percentage + "%";
});

function toggleUIConnected(connected) {
  if (connected) {
    //$("#connectSerialButton img").attr("class", "disconnect icon21");
    document.getElementById("connectSerialButton").getElementsByTagName("img")[0].className = "disconnect icon21";
  } else {
    //$("#connectSerialButton img").attr("class", "connect icon21");
    document.getElementById("connectSerialButton").getElementsByTagName("img")[0].className = "connect icon21";
  }
}

function int32ToBytes(x) {
  // we want to represent the input as a 4-bytes array
  var byteArray = [0, 0, 0, 0];

  for (var index = 0; index < byteArray.length; index++) {
    var byte = x & 0xff;
    byteArray[index] = byte;
    x = (x - byte) / 256;
  }

  return byteArray;
}

function uint32ToBytes(x) {
  return int32ToBytes(x);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Code.deviceManager = new TangleDeviceManager();

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  ar: "العربية",
  "be-tarask": "Taraškievica",
  br: "Brezhoneg",
  ca: "Català",
  cs: "Česky",
  da: "Dansk",
  de: "Deutsch",
  el: "Ελληνικά",
  en: "English",
  es: "Español",
  et: "Eesti",
  fa: "فارسی",
  fr: "Français",
  he: "עברית",
  hrx: "Hunsrik",
  hu: "Magyar",
  ia: "Interlingua",
  is: "Íslenska",
  it: "Italiano",
  ja: "日本語",
  kab: "Kabyle",
  ko: "한국어",
  mk: "Македонски",
  ms: "Bahasa Melayu",
  nb: "Norsk Bokmål",
  nl: "Nederlands, Vlaams",
  oc: "Lenga d'òc",
  pl: "Polski",
  pms: "Piemontèis",
  "pt-br": "Português Brasileiro",
  ro: "Română",
  ru: "Русский",
  sc: "Sardu",
  sk: "Slovenčina",
  sr: "Српски",
  sv: "Svenska",
  ta: "தமிழ்",
  th: "ภาษาไทย",
  tlh: "tlhIngan Hol",
  tr: "Türkçe",
  uk: "Українська",
  vi: "Tiếng Việt",
  "zh-hans": "简体中文",
  "zh-hant": "正體中文",
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ["ar", "fa", "he", "lki"];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

Code.debug = {};
Code.debug.textarea = document.getElementById("content_debug");

Code.debug.setVisible = function (enable) {
  if (enable) {
    //console.log("enabling");
    Code.debug.textarea.style.display = "block";
  } else {
    //console.log("disabling");
    Code.debug.textarea.style.display = "none";
  }
};

Code.device.on("receive", message => {
  Code.debug.textarea.textContent += message.payload;
});

Code.device.on("event", event => {
  console.log("Catched event:", event);
});

Code.rssi = {};

Code.device.on("rssi_data", event => {
  Code.rssi[event.device_mac] = event.rssi;

  // console.log(Code.rssi);

  let array = [];

  for (let key in Code.rssi) {
    // console.log(key, Code.rssi[key]);

    let item = {};

    item.device_mac = key;
    item.rssi = Code.rssi[key];
    array.push(item);
  }

  console.log(array);
});

Code.control = {
  div: /** @type {HTMLDivElement} */ (document.querySelector("#content_control")),
};

Code.control.setVisible = function (enable) {
  if (enable) {
    //console.log("enabling");
    Code.control.div.style.display = "block";
  } else {
    //console.log("disabling");
    Code.control.div.style.display = "none";
  }
};

// Code.music = /** @type {HTMLAudioElement} */ (document.getElementById("timeline-old"));
// Code.metronome = new Audio();

// Code.device.timeline = new TimeTrack();

// Code.bank = 0;

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// setInterval(async function () {
//   Code.device.syncTimeline();
// }, 10000);

// Code.music.addEventListener("timeupdate", () => {
//   Code.device.timeline.setMillis(Code.music.currentTime * 1000);

//   Code.device.syncTimeline();
// });

// Code.music.addEventListener("play", () => {
//   Code.device.timeline.unpause();
//   Code.device.timeline.setMillis(Code.music.currentTime * 1000);

//   // if (Code.metronome.src) {
//   //   Code.metronome.currentTime = Code.music.currentTime;
//   //   Code.metronome.play();
//   // }

//   Code.device.syncTimeline();
// });

// Code.music.addEventListener("pause", () => {
//   Code.device.timeline.pause();
//   Code.device.timeline.setMillis(Code.music.currentTime * 1000);

//   // if (Code.metronome.src) {
//   //   Code.metronome.pause();
//   // }

//   Code.device.syncTimeline();
// });

Code.play = async function () {
  console.log("Play");

  Code.device.timeline.unpause();
  // Code.device.timeline.setMillis(wavesurfer.getCurrentTime() * 1000);

  wavesurfer.play();

  // Code.device.syncTimeline();
};

Code.cycle = async function () {
  console.log("Cycle");

  wavesurfer.seekAndCenter(0);

  Code.device.timeline.setMillis(0);

  // Code.device.syncTimeline();
};

Code.pause = async function () {
  console.log("Pause");

  Code.device.timeline.pause();
  // Code.device.timeline.setMillis(wavesurfer.getCurrentTime() * 1000);

  wavesurfer.pause();

  const dur = wavesurfer.getDuration();
  const pos = dur ? wavesurfer.getCurrentTime() / wavesurfer.getDuration() : 0;
  wavesurfer.seekAndCenter(pos);

  // Code.device.syncTimeline();
};

Code.stop = async function () {
  console.log("Stop");

  Code.device.timeline.pause();
  // Code.device.timeline.setMillis(0);

  wavesurfer.pause();
  wavesurfer.stop();

  // Code.device.syncTimeline();
};

Code.upload = async function () {
  console.log("Upload");

  let xml_code = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace));

  window.localStorage.setItem("blocks", xml_code);

  var code = Blockly.Tngl.workspaceToCode(Code.workspace);

  // console.log(tngl_bytes);
  //prompt("Copy to clipboard: Ctrl+C, Enter", tngl_bytes);

  Code.device.writeTngl(code).catch(e => console.error(e));
};

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if parameter not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function (name, defaultValue) {
  var val = location.search.match(new RegExp("[?&]" + name + "=([^&]+)"));
  return val ? decodeURIComponent(val[1].replace(/\+/g, "%20")) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function () {
  var lang = Code.getStringParamFromUrl("lang", "");
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to Czech.
    lang = "cs";
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function () {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function (defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ("BlocklyStorage" in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ("BlocklyStorage" in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Changes the output language by clicking the tab matching
 * the selected language in the codeMenu.
 */
Code.changeCodingLanguage = function () {
  var codeMenu = document.getElementById("code_menu");
  Code.tabClick(codeMenu.options[codeMenu.selectedIndex].value);
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function (el, func) {
  if (typeof el == "string") {
    el = document.getElementById(el);
  }
  el.addEventListener("click", func, true);
  //el.addEventListener('touchend', func, true);
};

// /**
//  * Load the Prettify CSS and JavaScript.
//  */
// Code.importPrettify = function () {
//   var script = document.createElement("script");
//   script.setAttribute("src", "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js");
//   document.head.appendChild(script);
// };

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function (element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y,
  };
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
//Code.TABS_ = ['blocks', 'javascript', 'php', 'python', 'dart', 'lua', 'xml'];
Code.TABS_ = ["blocks", "tngl", "xml", "debug", "control"];

/**
 * List of tab names with casing, for display in the UI.
 * @private
 */
Code.TABS_DISPLAY_ = [
  // 'Blocks', 'JavaScript', 'PHP', 'Python', 'Dart', 'Lua', 'XML',
  "Blocks",
  "Tngl",
  "XML",
  "Debug",
  "Control",
];

Code.selected = "blocks";

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function (clickedName) {
  // If the XML tab was open, save and render the content.
  if (document.getElementById("tab_xml").classList.contains("tabon")) {
    var xmlTextarea = document.getElementById("content_xml");
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q = window.confirm(MSG["badXml"].replace("%1", e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
  }

  if (document.getElementById("tab_blocks").classList.contains("tabon")) {
    Code.workspace.setVisible(false);
  }

  if (document.getElementById("tab_debug").classList.contains("tabon")) {
    Code.debug.setVisible(false);
  }

  // if (document.getElementById("tab_control").classList.contains("tabon")) {
  //   Code.control.setVisible(false);
  // }

  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    var tab = document.getElementById("tab_" + name);
    tab.classList.add("taboff");
    tab.classList.remove("tabon");
    document.getElementById("content_" + name).style.visibility = "hidden";
  }

  // Select the active tab.
  Code.selected = clickedName;
  var selectedTab = document.getElementById("tab_" + clickedName);
  selectedTab.classList.remove("taboff");
  selectedTab.classList.add("tabon");
  // Show the selected pane.
  document.getElementById("content_" + clickedName).style.visibility = "visible";
  Code.renderContent();
  // The code menu tab is on if the blocks tab is off.
  var codeMenuTab = document.getElementById("tab_code");
  if (clickedName == "blocks") {
    Code.workspace.setVisible(true);
    codeMenuTab.className = "taboff";
  } else {
    codeMenuTab.className = "tabon";
  }
  // Sync the menu's value with the clicked tab value if needed.
  var codeMenu = document.getElementById("code_menu");
  for (var i = 0; i < codeMenu.options.length; i++) {
    if (codeMenu.options[i].value == clickedName) {
      codeMenu.selectedIndex = i;
      break;
    }
  }
  //Blockly.svgResize(Code.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function () {
  var content = document.getElementById("content_" + Code.selected);

  // Initialize the pane.
  if (content.id == "content_xml") {
    var xmlTextarea = document.getElementById("content_xml");
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == "content_tngl") {
    var tnglTextarea = document.getElementById("content_tngl");

    tnglTextarea.value = "";
    if (Code.checkAllGeneratorFunctionsDefined(Blockly.Tngl)) {
      tnglTextarea.value = Blockly.Tngl.workspaceToCode(Code.workspace);
      // Remove the 'prettyprinted' class, so that Prettify will recalculate.
      //content.className = content.className.replace("prettyprinted", "");
    }

    tnglTextarea.focus();
  } else if (content.id == "content_debug") {
    Code.debug.setVisible(true);
    var debugTextarea = document.getElementById("content_debug");
    // var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    // var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    debugTextarea.focus();
  } else if (content.id == "content_control") {
    Code.control.setVisible(true);
  }
};

/**
 * Check whether all blocks in use have generator functions.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.checkAllGeneratorFunctionsDefined = function (generator) {
  var blocks = Code.workspace.getAllBlocks(false);
  var missingBlockGenerators = [];
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) == -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length == 0;
  if (!valid) {
    var msg = "The generator code for the following blocks not specified for " + generator.name_ + ":\n - " + missingBlockGenerators.join("\n - ");
    Blockly.alert(msg); // Assuming synchronous. No callback.
  }
  return valid;
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function () {
  Code.initLanguage();

  var rtl = Code.isRtl();
  var container = document.getElementById("content_area");

  var onresize = function (e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById("content_" + Code.TABS_[i]);
      el.style.top = bBox.y + "px";
      el.style.left = bBox.x + "px";
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + "px";
      el.style.height = 2 * bBox.height - el.offsetHeight + "px";
      el.style.width = bBox.width + "px";
      el.style.width = 2 * bBox.width - el.offsetWidth + "px";
    }
    // Make the 'Blocks' tab line up with the toolbox.
    if (Code.workspace && Code.workspace.getToolbox().width) {
      document.getElementById("tab_blocks").style.minWidth = Code.workspace.getToolbox().width - 38 + "px";
      // Account for the 19 pixel margin and on each side.
    }
  };
  window.addEventListener("resize", onresize, false);

  // The toolbox XML specifies each category name using Blockly's messaging
  // format (eg. `<category name="%{BKY_CATLOGIC}">`).
  // These message keys need to be defined in `Blockly.Msg` in order to
  // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
  // been defined for each language to import each category name message
  // into `Blockly.Msg`.
  // TODO: Clean up the message files so this is done explicitly instead of
  // through this for-loop.
  for (var messageKey in MSG) {
    if (messageKey.indexOf("cat") == 0) {
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }

  // Construct the toolbox XML, replacing translated variable names.
  var toolboxText = document.getElementById("toolbox").outerHTML;
  toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g, function (m, p1, p2) {
    return p1 + MSG[p2];
  });
  var toolboxXml = Blockly.Xml.textToDom(toolboxText);

  Code.workspace = Blockly.inject("content_blocks", {
    media: "blockly/media/",
    rtl: rtl,
    toolbox: toolboxXml,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },

    collapse: true,
    comments: false,
    disable: true,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: "start",
    css: true,
    scrollbars: true,
    sounds: false,
    theme: localStorage.getItem("darkmode") && THEME_DARKMODE(),
    //oneBasedIndex: false
  });

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  // Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  var init_blocks_xml = `
    
    <xml xmlns="https://developers.google.com/blockly/xml">
<block type="commentary_block" id="u8+l}ndTQk/vw:.yMdbm" x="1053" y="-143">
<field name="COMMENT">9127 batu</field>
<statement name="CANVAS_COMMANDS">
<block type="window" id="#s~jXdX?W!ldr=ZJ[_$3" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="(-!!h_j]ZO0(v,y$R;$t">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="DjJ.41(Jia0I/Gv[D9y3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="7_hIo9GWKq0J^K#$ICi$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="#/I/ogvQM^Su;Iy6,G2'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="WIDyUV#:Q=*P~he..fJl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Y_n-CiN'[k^@k5Rm(5XF">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_@mu3=wshV+9U.;0:k!I">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="i]Z2~2YoA27QVHmhKHP?">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$ZLQg+iWHA8h4!v(u}=P">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="oqTN]wYcJpdL~Y20[qp:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="p2%L!DO2|$q7znm(Am7U">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="PTIp{skshdyrF;Kw,X5^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="p4ZXKn|yL@yH#^R},Fr*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~T5^!1tG_zhrVT#q=r9T">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="V6{Xkpbtmd2_A2@q$Z9}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="[UT^Py:/z1)QL1G!QJ]G">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}(@?==-44;1'2aoJW7~n">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="(YAjf3:,M3jnJyXCVo5R">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Yz3BQe$JTRn%vgvaxx-B">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="}Y%~(ZB*t}7.=?Y9_13l">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="(5Bb+X7Gg.eW%:yT8'SK">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="F=I|VS;WVVv$}lF{1UJ?">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="KvfIX@fh^wq0DX^h6us1">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="yy9JDv*Z{#1hsFx!mGeU">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1Af(^f#AeH*A#DuV0AuQ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=":TQ|IH'orMx}!1O-j%LW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_@A|$[Xyf+ZXtWwfotg|">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="HPL2Hcn1dpK*99/5E1fS">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")DAbq2l;I}lSI~,r.@hf">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="t6XlNXjoS9:M:%5q?;W=">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="(9kBnUMA+'3!YH2bVb)G">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="F5'pW}0y;2T^hvD~6~uo">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="^}yc{Q$/.q#k*Rc9vFdX">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-,CwAf=0-/wdYl3$a}/3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="EA8nO@,?y}(fY=7~n~j:">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="o,*iUoAS(LT%PbPI/e9q">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ti#9yDzxCzJnA;X$tZ4/">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Zq-jH.]REm',BqJzd1/O">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=",;ndzgN(AMcg230%J?+m">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=".I.lp3V0QH?#LglJW!:m">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="KEA~oVW3Ug(bkbix@Dgl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="8DLPJ-*d6$SqUWl]e4v}">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="++e@26^6w$NNR43U(m9$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|iQ]W[mnFIYLz1R{Ua]x">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="jNt'^e4H!#2C4DcL5pBd">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|p'=UXjOyol#_}6Q8Z)^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="L%{)ph|lr3M88fH+x/uz">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="hD-30O2h=5J$uskop.Q-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="DR-iOq#GK}1q=r=m$VSF">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="@S~zuE52F3AXqC/9N{ZB">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="]Vvns,Tr9'WUM)05[{:q">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="lT]j^YHbzVn7j9EtBR!=">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="yZ-NlFe=2+3:YmvXraJ;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="1I*%dKb%K6N$d3Chkt%#">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="5P{L$/G_n#}Vsqx(21TM">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|}EUa!eKZW|+o{m?4ij_">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ft}W0rND*JkOeI}n_Dv[">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Y[=N+b+g^tcK(!s]E:'t">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Pa$mo|F~+d3PL!GPtasH">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="fq5'gy)x/{4+n)_h(VM6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".@1pxvHKvKc[z[PIE1d0">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="cHl-[+}/Q#0NU@SB7_yL">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="3R6[IGM.x%Ar3'CNuIJM">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="$L(a8E%W0O1B$4nWJ4T*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="lUeDOMlPAUpj7yVg7LU)">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="p=9Ip'}qm#xJ,UEb9NYG">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="|#1faienp5HO=-fRo;.h">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="u9rt=G|Dpv+AH6n;v5'H">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="2Rte%Ln#G[n|sQ@RGRe=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="iSXrJEu;;Yn/Qm#}*TNl">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="b}elKKOptt@'+HPha?_%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="wF'Qj@V=?,|dE!ec}Gx2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="jxeLwV4FXV{i'VbMUcW@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="W=KbyB^*DigLWCx(TI.d">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="W@5.H*+Y@49qAz#h8CM;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Q!$xnM9Fc)EGtb2fMT.$">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Do:f%M%4UzCd;ZReAUS)">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="miS9k^emSGS{0py^Bn~'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="H92(=JUY,XY?j-Ee+a;r">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="p]oln[H.zua~Ewgq[eod">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".[Pp%b{8JCf5nj7mzBsl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="yL}7d[31{VgO|c%sG,PL">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="M6@gFKkd4-f;30qQrZ%+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="C%k|K|2}X(jM7-%LTrvL">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Zu%M|pLeEl8EzP68BAu;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="X1D{S7/uDPmgYV$,@/pz">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="lc.h6$6(tmh6lp$sVNH%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="e]Mb{^QdXZ;|R##.SYxW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="+cNF(iUL[IYJRlkmFbF=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="yZ%2a2lh6JVCmxcvwf'E">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="rlS~SflcdUWX*;eR{oj.">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="{DKV[K86b(x+I?,?:mXW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="K$+X!gFZq00?Uk4p%i'n">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="D,g'/[*F{x-w,SBRr~,S">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$%xNfq|)b=H-Z=t3u_u3">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="P|odxEyY2{8RB^:Nj%U-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="VmLQNMBP9VO4llodN1+{">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|[B7[p6~$u[P{lqR$Xq-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="lq934{0mh'#7j^0g#a]g">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="5;SIq^2y.+nMU8UN^A,$">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="vFLZLHevP@%WJQ?hQqrV">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="SlV:TU]o3QsJj}oyT1Ro">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=NV%~4u{|9=7Mt8;3Dfx">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=V0#Nd$u%l*%=~}@R*jd">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="^2NKWFV{(!?8FQG.qi+l">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="AA0Iu'+IUnqpvc9s=!@A">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="3S08mj,T/mP!?aK_?^PY">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Db/[OwP4oWa|?HGa@%]6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Nc4S$SKxS__UK#d3((Lu">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")U%,_L6%;]!E-c|6d|k~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="/QdK~3K]OXgphfRl.h^c">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|FUw7h7sk^CshivD[h!V">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="#%=3r%v|iyGA7ySrVpOC" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="d$_vTo}CAe*W1jJ6#Z-G">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="unH]W1I$9S=]M7yEN$j6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Y^hWayM*Vs|p$8CiY:x]">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="1-Rvqv9w^j:_D|KCV|71">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="cgz*yhA$S;b}BgPGK-H~">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="F}4%Aaxk33:t#*^KvWI4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Vzs~7?v/?IIO^R)g^ww(">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="toK{jv|gP!boH^93JVai">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@6OLZXkQMEQ^k;]lHV1$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")EDhwG1MRW}CS=Qs6f|F">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hgR71Rbj7n1)dSA}9Z/]">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="FzqH!tQ4bK;Hp$F#MES4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?|)y/;7xX3'7TMsaU!3D">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="O7WCePYEv5T47E~DMHM4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="fB7N{6N;MYFU1b$T:9d=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7%Atgr?87wVbWt%%$'g$">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="jl-Tajh(5^x7zV!kj0sx">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=o!zITQT~|%3$y(|/$^b">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="M?Om_{BnT0P^9}]5j9sS">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="3G;03{Ocqrpk#TSCU4NH">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="eV4hFhU[Jt4^SdZqM5Zc">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="JlMY-'lC|o@(|GFOa9SN">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="i}7;ZOEWa(V}%f+P~CQp">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="T(Xx;9Xb(u#C'(exIYeV">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@xl,,po]clkTi}cxy7~v">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~3qb(kWmA1[sKSdxr.%F">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="I-p;c{(ELE,2.},F;sw4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ZaEp|4#B?Y6Y#fdOw+a-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zNx~zp0##|!wD8~!OXSJ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="]E'dOl~3]m31a5#$pi9%">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="uNyox~)4R72=eHGF){v6">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+.+FB:;Wz~OVQ~d~1fLI">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ZJVkjnX$cN}JtxLy?$;E">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="w%3fgdiknGo..@37S)5]">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="dqzgV2g3oPr4zmFNlgw{">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Y^GB/},ql5KT^IxBgSz}">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="iT%o=Zyoq+bExqC[(Y.?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")6,(a},WyBa%y.Goll_)">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="enHKzpE;qSlLlQ}CHla?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="8EW+cG!?BbGrS_Vl_#Z-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="8.8t%t^Z=2'dHN}rFPcR">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="cpnwXio:zY[L-'l?;3#y">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="%g)vU}QK4iBDOA[0d]%#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="reE]SGuMFvd,IuR-|Mu=">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="B0e_E0.P#neor6kNv.Lw">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="qkOYkD{%XdiK_fUCka$C">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="CKjn+8qRC#5sVRh-czC:">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="z-+-9p-GoT-}SW@T3]!W">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".-%(9iPT#5F[kxgn:dSf">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="PXdC;#6Z.aI5UXPT{?/,">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="FEKB3^,Kn10ZiMDO*8+n">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="qe(ZZbE;.S;icd^3Htr{">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="SZ9joK)6cg^tLMSFI*X:">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="nj?qgpdLRm1~Go_#5t(j">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="eXDc]^(P.~mqMOsC{ly-">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ar)!7^m+H94R'/%7[YIa">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="z%6[6(nDRj#w+$C5Uc-t">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="r3?9/%}2:8kwablE.#M{">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="z+}f~.O+'f#5%VP4nSs2">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="dx!rd|axfF)IfBFqC@pw">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="VeB.GK=N~{9f7jqYu6lN">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="fel(~}lTs:]{W]iw.OnY">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="X(=MVykf3F4:w*b2as{L">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="rOew.8RXw*~.c(nn+N]g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=75!;EUVeJIvzRI=PE9;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="aSDj7~uX7d=D$ssigff[">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="HQJpM7nlI}m8dmWf'v':">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="qFrwyYC2v#'Lxx^(1'z*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Z:zP:-'XR!Ab1$rXy^%)">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0l5_zt)8gETNq[*/Vj5q">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ny_!LIM@!3fDJB1k+(Q,">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="]j8Q!vb%MZ=Vzg.bJCFh">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!r;ZzcmRw_MY,,i5'n.y">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="z4p+O0%-*Y5?WI-xf.|3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="QYy%L3!-|*3gpi_/SWX8">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=":COyvVcMzlkgr_i7V.-o">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="*RF*t_*?JdocV|nIj!)/">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?mjFJiJ$*W^fhsfYo=:A">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="fVWJ0ojf+|NWr7*l;'pJ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="#Jh?Z!ipHy-H!XTNM$!x">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Q+Xv9)y%-Gk/:,AL|_,C">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7!Q^v3TIe@=FD)_8yRAf">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=",X{y@+k6kVS's)H2I0m2">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?fX$0(aaAub8!zy^psy@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="kTq;'ZHQE[=d*?'({yg-">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="qXD_eGm5TY~?_z?34FQe">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="mRH$)yY-DBwu3JCRcU)(">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="2ZZ~Tsu.}*kUc4T8P(W5">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="*1-+}VTN;5GKT@de9~eK">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="[n6!XxDwBt?c4E3}cdb2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="aeA,KI@DSKNc@f?ucGLh">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="3SD;P1s*,={m*SbO$BN2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="d#f~}|:2q!tMBogaTGJP">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="OdX5rTg5-Cv{EA_v-vH?">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="2@'41%7C!gG1SJ!2(6pQ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="p$k2U=,w/d,*RWmjG[^~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".(QQv3[Wezfgm^;w27VT">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="p5is#u5uWg,|uL%mo4|1">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="k'c0rbaa=NIywz=-GHEz">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="!V6?:iRm!uqWnf}L=|Gv">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="gaSs?5gy.5?kaL48*JXW">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0otyM5k[6(oSg[bwT,]]">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="o.gz^Tty[?5A@gUCoY}c">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="v*'%M7qIv#iZC~DIH[$Z">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="[)RSqp,a5x[t#xG*a(iL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="t,gEBF+43TWJ;j(LCIXq">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?w5kdmc5+V2%%{,.pC08">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="MH;,Qx5-*d(UTHt-GU:M">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")6ItvE%vR.C%,W0]I*r#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="fZ]mM$%Qx8NeddouJ;Cg">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="5UbN2.umD9_;E)d('vtg">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=":a[7l*Ok)*coy'QOp(X,">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="d-[ORvee:yLQ}'K%pFDd" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="XiA%SP|7XsX^4c8)V4._">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="u!9d.Z}/oP/!RO=u^6F2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="PjkK0s^E8-Lf1UH4s^0l">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="wy$_?Cf=;-bla#ZPQv)D">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="YXPrg.?bIX3l?Z}2O'f=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="PCZL~?c:3#2.^]2*,t9E">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="bx^^AM1ccSm'6N|fyZhl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?KM6F0EjdkY7jfMBFiE/">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="fkiq7=5B;ed,0sCotuxz">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="v]p%mLB!QNTJ)[@3~,ng">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="v{NOc%fHx-43@@qjug{R">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="x-Bnq|ymJbs:Y0)[zSzy">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="6#M89*1Oq#O*qC/JVg+w">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="t+V.E}?3^#PO92|0fNAb">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="c/W}oP7ooXb6Du,Y-M-Z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ZSPA6}B$=N[s-zM|MzRm">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="eKq(:V0;T5EAn_PSF7Z!">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="A4*K(mi#,On2:SE?S_Yn">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="gh'|+:ry'0NAmP=_D/=o">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="44#111,JBdvdwE[-'rU~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="xvK+u9'+x)HFd7_xr17N">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?P6tLTef=+_NmivwcGP2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="06y!~hCIEjBJ%4H1(?*=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="bidX$-+K=3d.(6'1M9/h">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0|Abbey-:SO+N~RuOjzv">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+^s.)+K|7]u?3E(hprL'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="4]1)mI+budk5;u*pxyM3">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~_NHgNKvi!@v)gU2$sF^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ZpE_kwA0S-KY;IVEUy.W">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="hP#^v#_x,5ln7%f+Wak}">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}BOWo(kishd3vL+@_|%i">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="bUsKf)4li2D.Yg5Y=0U?">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="2T'PMH~k]?*@G7kReNo5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="X@KZM'NHZ)S+sSCveRo;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Jbi8T'v0_2x;_5zqGM0R">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Afm0nsuEjjjqfFQ$TUqY">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{:q({N%E+h)un3u(m5If">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=".|cNP+CB%3EwRljx~gu'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="MJ;0FutYy08YI:z{?,)K">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=eJuXJIdL2u?*l,)1sU_">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Saas(Kzy~0]OYb01mpYJ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~}ECv4r+@RG'ki/qXA+p">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1+57q-k]u)Mo8#78GV8]">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_Dxh}NM_h'v3*GTpmFwP">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="f*E4Q7r/w)5C:'$zDDfK">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="iTKBJM4,nD,isBm4a]{/">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}z8%nvxjExL*h7ECtl]|">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="JTh2vW9'~CUOt8ERzC~_">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="iE=:4iMARWh#_)CI,$/P">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?,{9V)Fhwm[xwf'%%YI]">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hz%e0=Cu{Zj)wQnDVABj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="TxXQQ?d~(^'(nt[-(#Pw">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="t'-i:ButB=%9q}Wm1,11">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="So-|6)Ngp'h@+4c$l+yz">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="k9PB-S9ci?/I@p,htmVb">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="$u+N;:SS#ivTa~oW7NeZ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="xL3^(65#2yCa3j2*ykkd">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="{P%v?XhWb,1VdXHhilST">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="gx8IhtHEaYHb%qC+bi-'">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="N0jI!m8T/QKd3$PT~UTb">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="I/y,7kHB!D5'x=QRdka.">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="u~Gf?VVu;L$XYq-c,$6y">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@m@L:Ovf}K}]3Ix@_u{a">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="2o,z5i3l}podXjD$sJt{">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?/M(oW}'%-)%LUJ5!5ec">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^'QoV#gP;=Ye:%)!R^~F">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="OYGUB3X#4=zWfY8s|?R2">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="lKg3iHnMV;?/Wy0E-i=W">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="fL#.CWOA08$z:S/+@V$g">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="N}_ZkZ-Wikl2s#eWxWw~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="eqtjDxx=Hll+!QBm^d[+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?mr!6*dN$Y3nQ|~@/BT:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$i%s8*:oRg/Ej0|QF80|">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-~(krOhp1psfl6oKNaK*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="3Zk~QJqQe^}GH7CQiY3K">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^j+hfi+*k)~3mW~#dy0?">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0EB.J;?LhqBX2ssT[ugi">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")6K|AiKW@@!~2X$tl^By">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="T)GOwZOGn}kBnBNpbW},">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="}eb)H]ldvS1mvF;CDa5@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="bNe;n'#QpFQ_.1!,n?P$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="qC5gpBEMTTrv0J=*90OW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Txa+M-2,cx/n{juW!c6f">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="g!=3IDIb+6;]%}%n,.r}">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=3z,dBlt|9.R,ye/sj[J">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%|E@#}4q7rpNp_2+KS};">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="D~bA;2hhc{CnEN#GI-4m">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="@$%+?|}^p#8R|%mTqGU-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="IE_(8nE,+$fl;0eDuUZi">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=";ZSa|=bC?wvNkx@DI.U6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=GdoLZz9=CXU9vv/rz7x">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="q0|9;Z*t={J.=qjRma[r">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="RWWZ;EU|qGSTA4o#i-IV">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?k~(kv8k-s'I^rwK3ZJ:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="s$U@18Hn|ih^^)%2l{(5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%K/%~@+VCARq1a_c9xWN">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="qfo}upv#0uNn-Rq#$J~S">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="1!yQ#W/exkB?KUlpwS+]">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="NYp(FgEwO{HN|zmQ9!H]">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ZN8nnMRv84D^YDF~{GfV">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}oO3-O8D}G(hkl)JLhOo">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="a)-{TIIW./@jbr9$BXfO">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="uwY'BQ2F)/ShE8C8Q=;1">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="dkSn#gXBx=8:~#o}A:2S">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=",B4Nl}GRL0{S.AE|hoaD">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?|$yLB8!!RuL;lNDk4RF">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="FM1q8r%GCNP=g9d3vJ-=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="gvStMEJ80]?8CFswHT)E">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="x95*Hd[O~4+pKWpC7^jT">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="uFoJteno-Z[dj2wpZXCd">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="P],@s8EY,^Sik@.3H@-B">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="x+0mZi-45u{}WN%Z~-F8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="~J,tUxC/ts^_h87H;YmK" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="-q=|A?3JlhGQx9DTcC[O">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="hfFSQ^};I1+yO*OCb*wq">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$2lzxyn/k22iM^hZ(6mk">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="vnmh:C-fm}DDQP5gJBL0">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="fK)Dc.ec!V0ULkS4koDD">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="qXOu}4|3H-qX[fs}NG2J">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="z9zVN2'6GBEq6L*~{T$'">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ml}wWh_ar#oTZgTm!kv[">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ymbar6~K/cINiVw;n|dr">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="SAbY2o8_fg_KzC_1d!CD">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="AV5lc;qbaYBiA{1K#ymf">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="hm9V,WjVW:/W4Xg6_FRU">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="HX|ykYqj^8v-XcrYf(2J">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="b7a:dow^^nL{sr^1gu+H">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="[xIEF09@Yx~3[iJoDPsm">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="i+H)iIY9;Af(^Q^ZbEZ@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";JuUpY*s:$An_8jg[=w@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="u9Ud*48@ql(-K%wi_''_">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="iqltOJ6JHN3l+VCjaFS)">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="tzxH[#!RVwTJ6P}_R$aX">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="[oP+m/D'.h=frUWMG4?l">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="nc~Ru_gu$AZ8)lW)P@EU">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}E@Q?WTeD$XEP,m9+$Wc">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="C:6mLPcP?9DnHk_XQjDm">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="euirTMS{WB8Of5|c;6F;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="q+NEs1krgV3Pk91/IO%+">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="iN%H?)Ar)Z*KpYzYw'ql">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="jSD+VIbv$q_Bk:~_U]6S">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="*j'PKc78~jSl+mcIP#L4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="8BBzLoPYx}v]$xz{m[~M">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="+GAbb80[]CP|5LkMb0=M">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="2ZM@Z^e^(hQQ~im(s;F!">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="q=zvS3m3?v79|hkk?bIb">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="GLdaC7x1#?C{65-(Zmmy">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!*:+LKhO%7^N*Jbjmnlv">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ao*A4EIPP7yIfB]sh(:g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="q*u-ezJpqhP0HC%1/BWU">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="pguw6z(m~~;Obg~rTMTT">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="LmdWI;#1K5yC[mB5,)fk">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="B0?ZTb^uY33z81/S)AR2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}idpYFN!Fa{eadyE~gfz">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="a:%OtSrhQ/NHeBD/z$x[">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="+l+ey~uKs3Y@o.!xmwk{">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="dJ$3,90/6bVxrp@KYU0G">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="/i5gKKON*|Lry@cm}M6%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="(=!YYpqIn=H2fZk|-%tv">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ri(^};EJZxk#*!J-)#?)">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="i_rY-XfW$z#n@2tjZk'8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="^t@3a3Mk#Xc7/|*F!E'W">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="H??g=$~9/z(?br?U:zYF">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_3O+S)+{wqI.|@P1J$Ki">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="L[CvAF8itj2|;BY.HK4#">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="X?s1BY]c333YR}xLWG,L">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=";*tM_nb,,[r=Y1;JRrD(">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".[dn4ptHfmFtb5_kYpVb">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="sz}V]7I$j0BIjrx1='[e">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Y}uFrBp|[,;=d/y5d,'K">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ZfF9cw3HQzue=GgD3vAw">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="6l_Xd)C65(ew[}':Y9f=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*[@N.uXfGLQG$[~%_zd*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="eRWja#%0D3!h|r=lzuC@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="/;v5,(y6.cUz]pAW1])|">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="TJEauJXxIEeoWT)zH026">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="m4}?cx,_s~nq9v@gY_Cq">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";^{)o4!B|5gs![pGA}F#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*FMUQB0{ocD$YNs[+;^c">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?jdK1|_[1c*%SK?Y8mTl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="]v2^zmfskQ(Rh*]F3b=^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="^]1z0i~A9Amc}LVd)wFF">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="WIsuod3!|yl(G8s%WgK:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!.ma[ZQg57-fo,E,f=:?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="{tHb(y5t~;2q?bGc^Lkw">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="JI/PS^#F'Pv-REOZP_K-">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="RV4dau=rE;;c6+sY+hjX">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")lS7xcpM2l^nfOr9@M}H">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="WNTsQxS'M{6F*hH{p8Ky">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ytpzp88#qbEg/-ZX9~0#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="X35@W+HS{|/gV,'u.1;=">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="iR51Z97-i+v=+0dqAqBg">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="A{P3t2neENX9^]'$gj4T">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="5To7IdO(LiZBQhK%H3(P">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="zfL4D:o7z.XRAnx_h-*q">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Y)4MSC||3FQ.Q,Xc]EOw">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Un2h28f1D|or@?xWKxOJ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{0Z-?{[-To?q,,p20?b+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="2Kw]IAy^v,Qj+LkiAd_W">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="xI'tdU7CBH'xl2mtn+T5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="p1[Ljnw+Z^]HRt{3(pNm">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="UOW;@sT1M@/?nKHKs8z*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="BfQ_A/h,1.,Hrpf_UQ|u">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="oE75)obRB+E1]tQ3ugu/">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+kj@C15FRhb)oqSAA;:9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="f33c_u)v{A6b$6T0XV{B">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0)!wmb=4a:w1iyrUaL0b">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=":4c8mz#78U;}k~8Ep?%p">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*QPoHH#k]wB9endP3#z(">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="8AI/Uy*TuG5gI=K{|6rQ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="v))4d+k,0A8CBaULJ4w*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ub*0V3o]WDsXa08W1m+{">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Kh3-+%^7,-dYRDEA8iba">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="O.q;3^IRb}Y0_,OeL/wZ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="}8A%#@*n1aW(_ECW__Zs">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Q#,#3V==Q|S:Wo5ve@C_">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="q?69jaqwM|*G1S?otk)-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="M3KzOLheGDQ.gacNWmP?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="A~)8LWWMHA0?!-gmgqJ4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="7I:%BUq3@2/GH_S|'RHd">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_-7'DCL#KB=8Iu,YZL?i">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="07xqrOt^-GZ5a$oPBB92">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="nQw.PpwpMHmA+*G^'Q-r">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="c6mm*kj67YLNm=;A'KN*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="!]C^C%CjPqi'y*w!,z6j">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="1@@t4(0_Qu5Y~=Eq$K!b" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="klQUg[lJXIT![|P=vVVB">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="PZ.e/*MuY'=xG$D^p@5Y">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="U}@%+0Hj9^=u3}52a}cK">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~Hz!S_gX)@q/2u|xKY3^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".V=PJD%~56Qnrx=M/V,L">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="gxYRe7*xce.9d~sPb6_l">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Q:}V:xR5E;bAPqh36E2z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="@Yy3;Q}O,8067OaMGll+">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="QQM.*Vxz47h?O.DoH}VH">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ea_-%$nm$QKxa}R-X1hd">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="(g9UF8O-X:@xHH=_BIaA">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="baXd8n?otu?v@6z=tT]6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?oU2C?]lKTWe!KLrj$+r">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="![_w:!?wst}2f]0!95_#">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="I6X_='ZeWn(o(*K@@o{z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="}q^107{5dC1jq.~?_nez">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0'c.k-ON45o%m{N!@H2D">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Ri%$rwPjZGNOnY+@;JOD">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$]|nX0}7!_8)ek'S.^vP">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="A=;Eddc%TReB_{;DeUmy">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Xo04e_7jzG]nc;l%*N/$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Kk=D3c0@f0w+B8fC2H9Z">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="y9~G/kONG5AopRuh|G9+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="HL8,J=y#bDz;uk2U;c)?">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="85v26(6AN)yb_{hQS?7)">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="lH2Uk4+~Q2,$y/8/sEaq">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?#Tf}H9aXRu~TNZ-B;vt">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Ju-AjkLa:Yr$?{F,?ds9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#+iKtm~yU{$bl6aSvo^.">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="oS|QM)P4C{gkZyytB$.C">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="yqMso5MQs8:Rkn*qR'9/">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=Fp,8B;5FQ]j~V^-7+GO">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Muy+7CPI$W6Je,fJP@5e">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="6%Zw9rFU;C+E4T^U{aK[">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="y,]QJPTmn')|2}#3OCgB">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="]t[#:UeH0IAEl5?a;.|m">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?[V]xBHTO~oPvlmQNP8p">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="pt)G'eFC?l8dI}5Dg20r">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="i9xWUu5TtezSH|{jUw7@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0l-,j+pw(poi8/zD7[+E">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="CqmhfvgEh3}^QI^Qj8%b">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="/|*BgGa#vNe-[Uq8ZJe=">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";+;#0imxlScaXxJ(?I0X">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0^UmC@hhQOL6LvXAyW#_">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#YwN~SbXS^@=#|*qhh))">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ni*,:E7IqcguO#ztzKWy">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0?zP=a=zZj9sIA?T@1Y=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-ES1|U7LN=;:v[m?dY6$">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="i9u/M1KxeT/5$uEkGsnp">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="3r?=l77%wG3eL|V4oh7#">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9CCB/gjh^caW5^-$Dk|3">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="'Ta}^XA=D=!%Z:J^]gpy">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zJ(,pB4~BA]rx/MxNYg[">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="zJwt:OqD^r08{J/ovM(I">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="kPC[Akd5-Dm-H0ccXy0P">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="CQf3A}bG[QgB$4iGS2G$">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="i*2L=g^Ec?d~C%8ej#BR">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="pzZeI{KxQz7'?2qPW;~g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_vyV'(z;G|7'g4glSwe%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7|7Jt+|jq?SxsGQ|u4%1">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="f!TFiaP$mN#)vk_l_wfI">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="L5{?PdA6hV~OHRB[3KnN">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="piO^^hmP@rr$5y~jnyfp">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="si6TjU%j4s+3sIEN*7ci">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ED)b?Ia[9Pz@^)aIYrT5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ub%,v8S?D*x^(0ZSm1n3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="tjFdZPz(W~v=v'^k4nJ4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="q.MNrK+940H3m%I)-9e3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#p)nJkyf:Xna[#c2a99H">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="733QFKVBq2Bj$(_82:EU">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")t$sK%ovrY}4[D@gYV63">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Qj~TVZJ9*ZYmXUWU5#wA">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zb.^U;Vx.+Bs.,a06l?T">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Wmiseg_Mf.=@_1B1%Nh3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="h}bTOqY^=I_-~dy'C1Ko">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="T@)yK]q_F8k:Jm09aU~5">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="??=kEklKlvyX]#s9h#qf">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="NgVNT$Lvjqw9[aT+mnD@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="HanLl1[([Xh]xpjS.z5n">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^=.66%M~a:|*y8s|S6Qs">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="*UhfM{C?X#yDgCZP2Ug'">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="4WVaqt5=1s}!pfsqI)/)">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="r-UN~uZ|o!.pV8~itK|%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_dk?-ns%1}lkZT6eydqS">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="C^[kms+mVJau$qQWiUCR">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="{HsM$[qUltl=8h1erY[l">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="NSv]c~*jS5Z8VC'4LhP7">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="O']d:fKc[U@kgv|nP/:+">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="WJ]wfZuP0zQqP-'=?m+X">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="hoR[.I!9j$O?Z)rb$[[T">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="h2cW.n2,j5-%[r-0F3jX">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Uf$KPTql4AvHh0}hHuTn">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="s{{v1E%9;}a#aqP5eJ,s">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=RcoddtP~/=-g_7Uo6E6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9nn}T$T%A1g$)(jP3:Co">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="{43tpsvZ[+/_g4(1JzMq">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ou%Y(H;uhfC(M=KM9/AL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7Fi4u@tFwDyxCHo'WP%a">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";E(cFMY|]]hKAMt=h:QO">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=".z|5L?9|V85AUz^L$HeZ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="B.7f6nWT[}Zdfy5;t8iX">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="4!z!?O/aT^v]pepl;jdF">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1{RqD1b11pW,3p;9h_~5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Qv}~k#la:){wxeMkSw!a">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="*QEUP@O?6rLXsvY1vpr;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="F0E4zX621IEX4@3@^lo$">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="m#GaGcP)ew~+dn6-Ev9l">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|f:pvwPANOtJ_E^9iR:_">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="GVYvI~KdorMhpryG8qqs">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="(O+KGT!@vV[h%0}AQ1BY">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".G9D0NxF^?PtE~;KI#!e">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="'=gdCk[li$N%05n*X5i1">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="5'v=O9}PR!(a]{@S-:zZ" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="2#KIPrTP%}Tdwmge;Ia%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=",X?h-!XNuZ#btUd[Cffj">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="b#/sd)bV;TGv[t(]fYAY">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="!N01nE~'58*+%-yUE(14">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{1K%1c0FftPKc(g%y%93">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_S))-x7q;v;]jw+-x:.u">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")VB15Bweo?TVnLOq3nu=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?GMgoY+$j0%H=6}-L:NU">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}uDYsa4j;V3UWaR1sW6J">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="nP7Pq0)dU%wtKsY:C?e^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="WNBKFvx6z^KEMC.}x|/0">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-msNOZjOtMSo|z;ObUxn">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="g^I|G5%DBK*hXEXXloZP">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="OWX(nenx3v9ec7;dQQ@=">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="DU}^HzY$LT1dxA4~'ZuS">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="UVDwIXdMO0sXFO}QeItt">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="4fK!c/@[%6*pO+cZ6O[x">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="K9DLT#E;;CXu|J['t$n4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0v%Wfv]-'BkKTIJB0lC1">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%I$OGD4_lA5Td#D/:G._">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$/MsRzDH#IC3!-16%{Ny">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="6(mQTdjb1n!7b7|JRbRt">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="PIaC8^;Z0nXw{7aP,l?C">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="CveOUTb_E;XJ{_8fFKnA">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="XqO@bDamWLF}UXe##6^t">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="}K!#'w;GXoc]e}sw+s|W">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="GCU*%m3g%T/6RM3=pj#?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="rhwd._'rU-=.GsB1SNlg">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="gB/F/l6gin$_2AS93!I0">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="t!0uxCf6H-mz@3S,~ajy">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="bW23CPmlG~'qe!MoPR@R">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="l5ba.U2j0N3wGQ$4ourZ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="j9.ply12KcA5(!5W4X:D">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="h)qO@0,UFr/X)6Tr#uTC">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="l1+1WapDC6]I.TtJQg#!">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="2N3h8(Q^0LC=Fokyrs0C">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="fVaVT7#.fQ)'TJKNdgRV">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="e'?]}h-DPzFlwam|q}~J">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="s;6[?5OUJjyU7*0[Nx~Q">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="KQ{}aM+SbueI|AHjLSmS">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="o[5PuO4~DFd-?#!I*L0X">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="o62T?OxtgIi|Fw+h6;R4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="z%.$cIIk73DkqUkYSHlW">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="AA:p=wa^38Bk,(3P$IMN">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="pD$=LZOH3W~+ysm10cfy">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="F/Qpxmkga(U]dmqpKT:t">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="'tC?@ScS?{?ah2Y(I|hR">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%F2{{u~c#3N__hn!x:.;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="AWb=n,Z8_lU(K0TCr-S$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*Ds?XP{Cm:XdLlE5.~'@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="[p,,$3e.|=Y%^ixqBYDP">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="oT2m/1#CGrKuc?NFchpi">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_~}WE3QH,bwrz[.7pJaj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^~Wn%#l+Ah7x*-os+7bP">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="B2K7T3AeANtPdR*$.w-Y">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^YZjb|~QU{O?M*[9Xy/r">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="3}9h^In_Lq]3k'//BJK4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="5P3?[.^.Qt=fg{6fxtEE">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="MOI~R9(zL5:,ahb2KV.N">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="{yO]1s-!^GiN8-d4ue~{">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="GTR0'xeWKm0+f:#{#G[e">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="]g-PuB6n+G#gM2pXOrgc">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="U;)+AX},m!U-/I3sr}F_">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^)A56V2sb?ESIiT-NTT=">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ObB7Og[iX;vs7d,q8Z[#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="G0H1#Na~@N[{=C+YnnE0">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="cnrCxt%sQvXR!=),NZtH">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0Ji'gI_hL7(ABhuusr(8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="mhQ$[cOb9)Wk0lb+hA^C">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7@MV^ZYwlD!tlWF(+L(w">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$DK^?pI=$KI^r:|b!Fcl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="!MDY%(vv2Rq)LrB@m9g^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".#K#M@PctNnt1t)FHAK:">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="d[iJ?/^F*O9Zyf6TDX;'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="W+o=8_YG3n%5kFmZmCS$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="K;E*9Vi,h].ivgg_O5dh">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="p'%6+RmH]Y[lN0Fh!_;?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_}.C)}t'@s0Lu.Yp|DoS">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="X-(H9fX0KJ8'ISV*5O|i">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="NL{{Jo+RBcubnVcGRdXM">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="XTZI^Ek66QnDZxsEVv*T">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="HS#jakSN|xHP$2hm@]0+">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="D]IFRQgK=g*iQ.N!t?x#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="$)m8o5M'X[=0CGYK@K/0">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="V/lwbFp5tsl-*9P2JwWg">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|p-sfT#3=FX=|5+6}y#2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="'-VDzj=JL_W(.M4kj^RK">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="r$1bQ]cP=_Yfbx~$fB{S">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")S!-I/l2L~Vf;z@;pTe_">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="'Ko6:v?CP2,V!f(VMczE">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="-W?20~julKZ/%lZ@g~3M">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="}pwQ=afq3__dk.d%6mk-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="dE{*Qre}SHcnMf@z)7bs">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="TXIjk^SRoAsCiM2Y8ker">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Z@DwzY}-O|_kC'-AB;oe">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Lt{-5$GQwD:-$(!(m++a">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Wv(t#iJW/!W^=wC{!hAr">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="p$##b-qV/]^6NKU:a|HR">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="B1X-';u2!MK#=Swvnz#e">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="c$O_+;QxPmfc?K(L?Qvu">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zm@Q-x5G%dZN,ux2WBf2">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=":V-Fbiki-p-CdKA$Yx9-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hOmRj|,Nu|IVs_^[9VB*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=2Wc|T%Tk42Vq}rTyz5W">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="/!-0]Uy=Z+Ql*?gQstV}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="XxoY.BJebCjB?,i(C)7d">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="/p_K/AK.AolU)ZmJd7Oz">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="$=B6~_Sc!dnJlhUN9LHc">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Q]O,/_1@JHi}vZ$5diuL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="RU8g:L),;D0YBe{b87o#">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="qwX'V.nl:pOp-YP|;iT*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="P#:D)C~#:;aJ}p@@S;m8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="/*'k)y-v3Z33A(B7XMmZ" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="ht5}KorV(rX-.*XwTC'!">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="/9?^gpV6t#JHw7F^wb5|">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="5nyZ:8IE'1]*P(Aq6jg4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Nj'dFJB33Gz'FmKF:1l~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="H_oyYhYMyrXO7ZWnfR/9">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=",uwH+1B0QlH6GL$r:#(~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="e!p2jwGAdLzb)L5hU%!a">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="BPMPW@9,L,7!Sd_^23T5">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="o=Vi#wyP1:Lh!BKT'=D6">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="zoCOkz_L[zqtGrXzZ:o'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="'U?2,)C@A5S9GrJX:*ms">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")9!Df5voQ-]+Z+x/'),9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="QF=p2hhTcJwM/M8ji}h}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="8AIT'JwO5aJ.:'_G3n(9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="HA:+{H2yTby9/stjQXch">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="'sPI7ApnqVvljzHhORhd">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="(1ELF35,pN]DzqNWd;-5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^:}qBUo$GBMy4}@V]AYz">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="*gguX~7hOXK,U?a{b2uL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="3$V^dz,P8k.TZ_,(/@^u">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="X9juUf53mwrzFvkc!H2[">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="KUGVofBTNiu$AHaI2c2g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="gzrFGKNr.+eAByJ?7hid">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0Wy'q4+Z:8gMD|69tIhX">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!x#y-NfAavj^0s)/=tCu">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="L8y]p}K}s#bift}8Sj9H">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="P9ifoy==y{l3.dAc]A5c">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="G?IL!*q_53D-@$@}#4TL">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!Nj{snLu,syO@wzy|s:O">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="NYtc8}?fAc~ocqw}uWa4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="FcI(Y0V89{No6i5/d%ce">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="hse;vL{J(H]!q5WMD%Cr">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="K47dbWFbm5^obPqFph~c">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="'?brtUE+VJ,b_|M@OaP3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="nD$?M/cqc/tlNOG(iK!{">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="b-CUtD?!|7spP1oH_h*@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="5.G~knB?8DV.yL1-0JRB">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="}X;y0BUztB5]W|!3)W'g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";if'Ni[7P+wQB;]MM~=.">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="jPS[X)$2g0n#A:mQ4i3'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}DgQTxceGfn^kp6*b:Kp">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Hz;3%(=f)s+#Pw@lK=hY">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="X6MO)g!vYPzku0=8w2,?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%XFY@pO=zH!K!BdbnvaW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="+E!MW?|2}%y+w.[(zc!1">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="[aO]CRifz3gX.4u@?3Fk">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="|v]MQnRHzP#Rtsm::F::">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=".%}C=TM#I6eoRpUAN%B4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="g}F16pdj;*Auhuy;h/5m">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Y[zNl+GnG#IAHkDT^VeI">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="vB+4AdM^fQ5{|In@nGJo">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="nk+hgz9pAqTKT/9olts@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="a+Qi;/ExIj-,pYagDO4^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="6Xux)ar+IybyBqybUyuh">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="YhWwDIvWYEk?v_iyl#($">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=",|@9Yoy6LrE//XZ;_j*~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="6^MU@@{(USpy^Y87XH]H">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=":Ovt.n0=E#izKVFiFswx">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_o._ZNS$r|HCi|kKvs/9">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Lv#!m^!x7IZa)n)[NG6;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ciw^td61qtZeb[wLN_@G">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="mI;p0AgC8:~[4oT_YMn~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#fD$(r5oA*bt|e7SSRy}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+Vy?e]U-jsQF;#8+*VsW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="kYOWvb_gy8XI_qw{s~g]">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="W4{dE:M??G]J],V4.s3*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="l]3A{o}hzB#4^HuZh}G(">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=",PI{.O|Pi9zZ3tQuLWx;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Kxx,EW.'MSve8*{bQX27">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="X=}=(hDVl^Ri;waCq4~N">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!X)/+a]=;%[{H6vPtfhs">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*]VljE]?=1Vzx|tmL9J9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="J(B:YwT8:yKHi%fgr4/i">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="AQz$_Rf9Q@K|m6f.5UUp">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!UC=jd}_,{!%EN)$BFhL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="egCHPb]5C6)4o?]s.WmL">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";.{:c7fD*,mM@^1Du?o.">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="--mm!#s{*3x6%!{ihi,f">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="KaF=nn4j)DRD4}G#ePBk">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="1blpdnY,u.m%t6._JiQ;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!(2-pYPrNJ3j$q_#5@PP">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="d{P[DQG8;0AJ6%3s$j2:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="vt2CNjvnweA4BiFa(n1y">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="w_(]bELTa/FAnx;ep!~/">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="e'meu2p#8r$O*Tmat$j5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="F2IA)F44]O9xJSwm!$Vl">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="qHtA$m,^*;#Aa(N'Ph8-">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="(x1/xEZX[y:f:zrxL%V:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!r%ae8o)'rs}30vxSUgB">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="i%p3GkmKCvK'?gb*xK7E">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="-Q=evEBCeb/}!R#ULHsu">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="YDwrtK3DP+'E=Fdrp;GU">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="JW.OAy{|GV-nq9685n0v">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="H+7ZPPq=~{od1O|85*/+">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="6!bTRpIzhKGVzsr!Xlaj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_),r.?IL$$G(zI$Z,}*A">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="SKs#UvAQWec:Rsy#az-l">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%=jp/?fr_+]?oDX'3}io">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="',My}Xg=_z4?VS?gm{F!">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?9xDx:;#d)Y8murmCRah">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="5PH$gGO0;pRr9%+vk5=a">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="dZRz|.c.J|~muB,%]9EB">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1}9@Yf2Fib81A#TGsH5z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="6/!|tKcrE?PQVs{1'2[B">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="6G|l%z$9gSbAs0#edNbW">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="na_rBcN?OyxIzcz:()](">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="m)0;#6N|c,5.hw^X!m]r">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="L/g5YUca}_i,v|d6Ize)">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";KUZC#A@Qm'O%i,A:'Q*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="kOGWq$Y$bP-8@kY:Fp;n">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=":Nq5_|g{pJl]1R(Q=XyA">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="h?fX+[^h,d7h;W/]z)n0">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="@L7bc*MDQ40CX50|iCpC" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="u2R!pyvgMh9nk6_B*|/I">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^-DsC]P8MHU,ocMP#1C3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="-}@]|w_aeX}k8#K]|7A5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="D|ZOToGb'-=7OmoyNiP'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="r,40V@ojyGmEQe.86SY)">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-}V1##-5_)vNO?Z!V4!%">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="85qMaW#w$DWqAc2|E4Ib">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Cl|[V:=qjvZch+=QN|hn">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zoec]l@M(Saes0;s#6=t">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="aj4vs+!I'kxm@s(9CBhQ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="csf7PQlKw,X,^wlFXRMt">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="47dT58E?9lG.!,TMg@wQ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="MzfuG6XIaujkb:@Mdjv{">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="n^mul|t:{Aq-Hs~@h/67">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="|o}P|B[3F(~67[lLM1om">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="kHTGlHGVBfuR{$WJq}m,">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}eV-g3U{:Z/3qyeNgoc,">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~7|Va6CEL8nA75KOIK?M">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="HP]TOu%M}[U[USGSQhJ+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="bm!qNL((poX-'eho3;:2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="K@E(J{tNemShK:8sdDw;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="04)PF3R=mhP-=T/9M2)D">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="==Ft4qiv;MEv?B#{*=z4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|iz~FE)T.2/CLoAIzjS.">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="BH]y5yAZGnhv]n%xNSAF">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="]7SZ-@2)f$tVU41F+?1{">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="oi||hJuEMW9#|F%^Zt2D">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Q^Ii4AZ7w@h4=3|jCok?">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$|)u@;dE~Hj6Z^[x,vyH">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="gGK@F5l55#e#*~wCxOs!">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="74[jG/a,@NYY;OT]z5W%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="O/4)X+-pTOl,k=:Wif71">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="LC~d+2x6hY4=copPn=(N">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?{;_f!dzeNh6-!iIAh;t">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=":7?9V^v9yF!I5fb1^(aB">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="jUoUIY0[oY3k4Ub.+J?g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=":MpI,C2}3+8Xu0seSf(!">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="4a09?nl-I,e_a%=SNH%x">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="10b@FZOvO4'dIr~HS_%r">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="1PmO1vO[frE097mDUEC:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zS2'u!fi,bj~9ikK-dYU">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="/Jn!y!QL{)_qnoN/xKb|">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="eVbLB6n7:5j-ZTQPDh(N">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="@n6zH@8.gf#(MbWL8U*E">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@LyUSDyt+6b,+VR4+CWx">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="@WLw%#otqbD-/(%ja7:h">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="wWQ$*IbaSAEHZKuI'+)G">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="rX)pfHDH/L'LM9V)hjaa">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="S?5p-B)O.7qDo7_e.6V~">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="yqc2RsVa~u8}pS8k1#j]">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{?ylBQ}Z4!VdZXNje96W">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="wvL')9-QhpmTXPOtsbqi">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0[(R_=[HEN@t$d{xI;_x">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="N41)Q3-;olr0]EtN?!Iw">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0/NLxXKJg}*KLuO-:8Um">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="8A3-%Nvmnod@HefxM|{0">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=s!Q_ND,^+D6WZ8dc@A@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="9|Fk}}}loVMo6L'){pz_">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=@$5sh@$)YYk?*0VE?v@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~!?+T)CW31.],_VY-!;)">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="x1$5J||BUczy1jU4UE~I">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="R;1'#vaW:-$L9WGox}~J">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="+N,Q;#s_FB5QQhXz@P2N">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="J7Bh3qd#h7$fWAh%?Ftc">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="FHMeMuO=I/lvB~#WB$].">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="T-GL8?^V(;IH8XemB0kM">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="wx=t',UStmTX[~Q6dfyV">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="$[rGIKxE#ulv;@|D60gz">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="kA|[:/_F?I9:z:os-'RN">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="(My_H,XTiuuz?-]?}80@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="VJpE$4^u#f37uDZ8IJ0Z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="5QIaD'UFb,=NH+BmT}DV">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="[fFXI1U04bcdt]f+sbLO">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="c}pTC=zw_S~0MIwk6]IM">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="p~609wm#?@g(~=y'dK~n">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7yxj2bRQG8dt^4ZX/|Ub">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@8ByaXPN6n0'0+E+Oyq~">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="RAK*QIRwGRC(SSPqeI^#">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=",_=FBZ_cI8ak)ns3o{o!">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="5bs!VxB^*VanPjP#aFfh">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=)8QJu=T:B},fW;'W8M2">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")[KX7c(|+'uY.g8NzM)g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="UZ@^dw'DyFW]#t9muL1[">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+RbPq!gSqfAt/ZAcJau6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="O[o4gqf$-/H)OHOE+AG*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+4/6~1#Z:vNDe^OF0t;:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Y%2wZdXd[XO8xXX~Fzfy">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="mKMH[)2v7(EIFV(5wcfj">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0m3'KTj%U0B:w+(@q0f]">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="/mS]7EMd'Vi7l0:0/*,L">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ruOzokop%)l,M2T3_p(t">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="t~j7DhyjE*f6Kl1BeVwK">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#s'uzj]Fjp{jLKa##ExG">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="zQ-by3RcapnMg;tL.0zb">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hLc|_63=S#6+V5.'/Tyl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="K#^:[.)2ZGVz7ic1AjMZ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Yrycb!r|=#UGs9@b]q3Y">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="2pFHE:3|O@J.g}[f*W7a">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9IHF4lWSc0|e8OMj8fD?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="p*,:cTm%)s^EpsT/e0bj">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_DcD~!ME=:kb'EvN*.gG">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="(2j!K$W;eD,[x3|cX=~T">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Dj.qlbq+HEEfgE_4XW9d">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="'+zgu;T!,dxgMs9?{nW:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="B;SQM:Xn_V~h)ELL4{Y+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="lAB9p|AafFc3^9mXQs{Z">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="w:9SE1G#EjFJ[lIohSO0">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="B.qYpCmDmk=.G{a*Rhu6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="uiQ,v5~E5u#Wr/=jsL7}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="x:'RGAo*$kPYIsqt)LpF">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="DGw=:4Wyi,jWzN/j[4-P">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="O#K3oMR,9H2$zNS='w'x">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="window" id="P12E-WR4x;PK9Elz9/B+" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="5)fU@slG3=F0K@'_DrL:">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ap[0.4aXtmD2n5S)_nua">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".$VT,8-o=iN8]]kI|XY2">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="L~Cl0/i1O.G4QlH%qo-b">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1r4sAyO2MJ_/Lp3}VCQ^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="4+E[?$V:;$l)$oaAEz4(">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="3otyK6@Lc2?_CIfwq6$5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="i6$bMrsH6LRp!loh$T92">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="SSe66Rx~qa4!+L|uK3ck">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="53_Zkq$Q;SrR65a+B%)^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="fzyiktTg?)3X$u)=MIpL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="lUJ$O~3noiHACBPqnX[0">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ynz*4iw4fqxubi@|.;P4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^W9ZDr]_~DaVmS!Q~.DH">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$LUa~hw:io^F~j3@wYfL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_%1vgrbkOtl@K(@=s6pc">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}3[sW|3lx{y8m]|VB7sQ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-h^{FdI#|J^W}z,_lwAW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="mz=Y/0tMYpd92x0B~PQp">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=";0B4AqOFy6%:,81$(dFW">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="k[u/SD,Xwf2H,@c$[w?t">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="1GG)UVqXk0_g/s1rz1uH">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ffK_Rv=!wUlZ;G-@9n1(">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="9[E8ba2n6Q%=g).Sf_$G">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=w^P=EW|3F-yn13aMJb0">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="U:z_dQ1q{eIp7SSWr!0P">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="yImkbqB!VG:Vt,@^r+Zi">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="caL?8XbEd:A1cDQDRP[/">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="WC'k[]EV5+fVeqs$,H2*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="T0#cK*(i4d$euF(@,3CZ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".87MBOKS0J)-jzy@GsR@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ywJ}?rB[}n)IkUIujG=*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="OB#8K-FKiw4[89n}E@25">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Gm:10Y(BV(9XduU+|hwH">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="e#vaJ=z%wT8QblbT@lxl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ezOb^_V|'8;[Taz/lB[U">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="rrZ*k6:R-Y*LHe#C,7($">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="VVj@8z#PHm;e?72E*f!4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ll2n]xQ@Hk76?CUn4eTO">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="r-aAeP!A8;r_qU$Nqb9I">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@rYGj5n'CQ5l^%r0fiL6">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="g/#q-,-Fe}#jTM93)'Q!">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="r(BK+eu*G[veKk97Jt%a">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="AyCFTPi5@j/3,cJ{C3)Z">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="o,DtG'IgZ]k|)@5wQe0Z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=";cgNh[0@|(V[Ms{$YrKl">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="PAKHe^PRk$+yiQ)?V#;8">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Q/9$CX;tYyk9)$xIdL,Z">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1=UN};T679(cn!*s:+p3">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="**LjL2'S-97SZ#bqV]7d">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@ypi2FBqv?V(/Jc0sdp;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="xR74a1DLnK8bE{2]636*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="p3V~$/'cZ{FF2VhwSXcg">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="a[G8';ET6+Q1F;$#wQS^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="=L1_Eh15wrZgWu(fijQ[">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~3u:jXgPx]gxHQal;Q-o">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")0HHOGg*Z(JM326KOYRb">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="2@zcvW%Z]zsFiS_JtIYS">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="a9s1+LK?Z)HmM.LjFTml">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="lHo},dM1J^Ib{5r/Z3Ad">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="3cQ7guF^cSBeLYspAc93">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="DR4]U(TmJtteU'$8C#Rg">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="I'vX;ltPCa0GD{a~$Fj^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="gmJ!Km;BEpBFP-C-pC-%">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="F~)a;{U7!q.mlm5l2$AE">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Py($ft,H'eBSqOA:bcqp">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#~.!a9ky9R%UsAgBETy|">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="pe0yWq0rb}Srq/M%kaJz">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?yssKV,q_$,VI{)VuO#_">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="v,GnvA?n=gpNr9UKg(0s">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{ZMp%0)]5o@bi0AACsd5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="z8ZW9'FNu[aLYfkZe9Xf">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="KbCnT(P?E38WG9FFHyE5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="CcC2Rk5(3gaK0Nxuu|-a">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$q8hBA(_McKde.vrlC9t">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*/.p-a*pgp*OFk~:o_9G">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="d?R_7O].{8ibxjajJ_xn">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="fSNW:Syc4M=e)],'~(|A">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="*Hy0~;zHy(gKrIWA'Dj'">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|@^GC#%/QFQ1}bs/L!.]">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?se5s}LM-8A~;U26)0.8">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="c~L'd:$vs8Zs~V02k~.8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="JGq%DH@cTwB5Xk'8p^P#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="MNZpCSU!PUQT/{@)%}e+">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="qzYWI9QzAL-LVq]ZdQ*9">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%a6wk.gMV6sSP/j0Eh|O">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="c|O4!MJ88hch(f4G?U;5">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="gNniYO^{,5y76(21n;JH">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";lfL/C)EyQN}S[2|T2_X">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="C,|AD|78jr'!cDZ~RCcC">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="MmSA*+(*7+}:Bf~pZ]j#">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="y]_RIUP9{X3nC@@0#p#D">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="l.S0IrGa-er.8+()Q@|o">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="gF$I@l{SiVchBfR1CBJs">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ZZKpeR6%WzzHaDgZaA$U">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Xg}BHW*'g=vB}71p^y3o">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="E+t];cGK88I=pIs?BgIA">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="5C/k9aaEi/jH(@IBH|'e">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="vnOgoBE^S.o:~}NQp^hW">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|lbBgoc3='202Hc}T?$@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#(zZ8sz/{JkO*foHQ%]Z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="QYLe07(S2B$VBSDC-CB4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_B'#12-6JO,]1u1vY6t(">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+}~}5bfZz#B4}J)XNZ_B">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="un@3l2#JRx;TP3g10Xh-">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ceUp)^SCk8!#e#eI-X=P">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="i%U094-:#f7,xB(j$~)y">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="rAtr7cMl,w*4w9m2MjYw">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="w-+HDl]4*};Q,YcSK+Vs">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="!43P%PGOh@nVeL5:c5X3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="y0j+h(%|g_B;tDz'k-jc">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="U3X*20TMf/k]R{HGUadI">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
<next>
<block type="commentary_block" id="9)H_[^~JhY*4qu_jO8FY">
<field name="COMMENT">S timto je to 10139 batu</field>
<statement name="CANVAS_COMMANDS">
<block type="window" id="atE7un61gQp_alj{uea{" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="U7Excoka=J)?RDi$Z?CH">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Q+pn*43b0*ReM;?q-o;V">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ZZaL8WIPn/D?Lt''kU1(">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="4{.Sv$MAc?@1/L_TkD80">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Z^aAM7N1[!r[2/ia~n5{">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="V+rw2*KE~A%6lGS3fSCt">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="3~AuSm7}RTYp-UNE-)Zg">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="JxQ=4sFGJ!.i(F1-X+z~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{GHpaI[GNjsL5$FkpD*H">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ml-84pd@wZeSmpVq/MZN">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Zr}kGrvU:vuyT)bN$ohj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="r@c]T%KFyX![!dqpZ){4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="UJgZ_d-v*u}LH8H!;#Ug">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%'y7{bXIRYpv6y/+O9KH">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0GcxVT=)?yhf(orAa?bJ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="a_{dpTFxk3KjNuw#6caN">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="y$uVHXs~/^yY)O)nHO6+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="6)[,XqM3y'BN0rxuu4Zz">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="_*rE3v(T|4@!IEbir,KC">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="3u.S-3]%oRnCrStNYDt$">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="v)U-DJEk%jvgs1+RK)jL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="NX{qXf'L=0Zs*r^n1@68">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="RG(Rn},'Eiizuh2JRj;?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="[Ko*x3WTf'Qn12t0n+S)">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="+kPxZV3P71w{$,Jjr}5T">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="yV[KsZaMyt3IF4F1Ab8f">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="E:[yY,]=QK9Y!h{%ocNU">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*w!~[^,kp;-44dgF?or^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="4nlsNa)4bC9+I0bJDFWj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-fIs|_1C4|@#;Cr'eXBa">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";CwK#,qbsz.uZC(4eOBQ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="esxnLWt3~.khZl*%^A:N">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="gh,)7ucGeyEJ#.T1Is-6">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="CC+obUc#X!7F%)rEu[7)">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="y_bmLY)X#x7xPYieeopY">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=".rPEKrSj0N5Qf^s{wW8n">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="wW]$T*+NwWKl)y}COJ2*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7D-Z~dcigs%#D+fp~+Mo">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{uo~'{3o}SW%?Gqn^vF~">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="!wwukt.y9;_*lHXh.U',">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="QGf}.,SFH4WS+[f3=Cr}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="q%R:Jspj87VH{UryySw6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="DHjm54Gg$_dG^-~{o%n7">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="G[xch^wF$P4nY2asIc~4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="r'T$bLN:{}PrYXlr:W7?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="E0L#1Z9Y*lN~,HG0o9t:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="uO?._HA9Ui-Y^y/-}V)H">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="dIz$cfpz7]7x|-A(Gy,7">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=":eLVD5kVo5yzrqjQOKFd">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="CW3vS6}0T4tk%NB:lutd">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="R2%*LRE62f]8]}dAiNtx">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^'[Ml9nD.]46s#Y6k]GE">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="b20QDNXh3fl,N3[4p}ck">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="i4?e,hejP?ncV@~~~z{j">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".}|j.yY$E6PG$uH+!49z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="C*tEVMd2+VdZ532S,ux6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="T*Hhj=_bfB+N.UI#|,{}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")%A(fx_y!]Rd^$3X,6'%">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";wYK=*$YxOAO9DYOQKvD">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+},zS}su5dXAQ1YEI(/Z">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hb7J2QmB^FrE%HtUNP)u">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?pe5]A.ai/KQsILgFhQi">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="PPbf2nWG~J;#y9c'V{6R">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="zBg5$/hm:Xn/h#W#A#mT">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="o59^t[jW%kL+2MBxxCN%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="E0#F=xpvNVWhp$m=e7!;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="4)+rhKQ2MvOk.w9IugVy">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="fc}pA|zVj6HM*'s/N-Cc">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="r?-al}H2thodg?)r%S,I">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="NIV8C)v6X/(twq8uvWVQ">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="0;gBwS~R!{$JX7Sj0HQH">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="DYU*'cBU|Z{wi.r4$Irm">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="K=Vxki23,9Ap]1[~Otaj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="V-iiN-BRRjk4v_N#P[7~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="qd1{qhY*!gt~fy9IL#Md">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="wAThq1qyPpfsvAo.dWT#">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="cwkWb_hSCj)bkN2!Snil">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ij/D#TN3NbUbZcOVV0OC">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Y%2e@P6xj6d{bZ1Xv|8l">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="vlB_s+UjT_Aizr35iTjR">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="}}5*z9s9('Ub^LEo=:'}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="9M4dl9'wW{yxnI[9$:[D">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="4x(9i@X?ypJVX.0U4X$E">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0veQD@wC+w[y%t}ck#gE">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="^dJE#bS;BO^{RU:a2mc(">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="n(2Oo{=GzV|;p6Udr'co">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="z2$o3G4$y)v6w)fCu,B_">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="v0PXDEz+^FPezGJ@j'qL">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="PBj?0hT=dA$Sw)Zy%ja^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=",R?jcp[?a;%k4LBS0|(]">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="E=k5(yIh%gj:PNQ!ftG*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="_ovo2y^l)f7G//YsYrCD">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="YNQa~%SNRc=h.+[^NG4A">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="P{{6x_sM_-w)-~Ic?u@{">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9}%.]HV-tx,b?s!o*.,e">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7-8}MGch]9WbOiMts,9i">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{;]'+|o)u7-!Dbc'ow$S">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7WFOI/iAa8,lI;T;zu=o">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="UO-?y]9nK4BIR[_4T7Y|">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="OrYJ9[OLl^iIv=VBdkXY">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")/f(fgUD^PC+pB3:bW3:">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="D'I8.Ih%vDX?_;}7mkhy">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="d'Yb)3$F8B_NTUKC$^Aj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0[7b$'OIv71e0U(eXE/X">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!f3(!ODMcSz~X];{)dvC">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="H46Co)Qdjq]4MPqciDo}">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="TQQQYX8vpb/NeeerhFRA">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ehkKZswGs(ES1ukI(C~R">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Co8HoP!tVvm@/75A(1HG">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="._TFGqNn7Y%9F$LhB6xh">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="YHDKn8|/'9O,n93-.O$o">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="H}g,GF^;Hq=7px.(Fmc3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
</block>
</statement>
<next>
<block type="commentary_block" id="0lkt75DB,=GuyGWmrhH:" disabled="true">
<field name="COMMENT">S timto je to 11151 batu</field>
<statement name="CANVAS_COMMANDS">
<block type="window" id="w-SySWFv?_o}YXdln}8c" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="#OaaUt!E%#{[Z$y]Jor;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="8,Mkoe*7#l)Spn8ttC_h">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="JMD*d@T+9TPHGrUhh+7Z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~qonU'UL-Hm6=A~8{a:g">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Y+0BRHmt].VAb:C=-pl[">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="fH.hwiK_)U6BUax$mp!6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="a2EFn@4CQAwN;B:u'x?;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="kS}ZRcNE'L7$]?nqTosn">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="8avL96{zIZjt/!pnopH@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="O:a#fUK:p@hrc_o{%)@{">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hHlj:l=GYIG%7f5k~6%X">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="T7%cxpCg4F;4uAGd2{A'">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="aN'o@{X(6vDPG2nuz}qg">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="49*eK8V#{aI/pBA!t7I!">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="~0V;NHc~j[VxqzGtPM4L">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="S!$^7:~?@'4ccxT0$g/7">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="$._8u-cCNhBc_TBbf*EF">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=";Ij'[2DsUP24x)i4i07-">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="znUs)/:~,@'3!L|%C^wQ">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="+/@zNXR37GOEwujmMm0t">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="re|7hd;fP'@fh#BcN(:M">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="c-'TNvAKFo)'4XlarfN^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{_Z=~:C,6cr%)X?1'!+y">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="FMdl1[j7d~07aqhReQaB">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="GkCO,p5hz=Wmf}T1E||v">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="NZyK+{u7Ld6G[n,'F2(2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="k9+-^Y'?GBLHP0^{k6*l">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="5Pa:=#$5[6@(2DC{-cVx">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="YZuwlK9h4/6b,pz#7CG^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=";h~00HVb;a*P/IfNA7_A">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="-i;pga6%qULY~]KbP]*$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="TF}fs1(_|t%-a!DLiQjr">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!k6MByT:*!]jE6,-Nz'N">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ZHgyKW'R7+KduLrXFIwb">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="]C4'=Z6%PE5%)lx%jGnm">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="sS@z4TZLi{:VmE:yg(jX">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zDm8r#/)Mo{Gw%#$Rt1s">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="quzep(c0PSwsb*eGmaS^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="p2QM5dUbr01Q,uB?t~v[">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="h3kK~U@A8^|vqL^lB-3,">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="CJcX}im]w;/?HlGEtvek">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="nsA?uI|g~U.f;Wg7f60G">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="r%aMdtW}N*y^4XiiYbb@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="tmqk=;2!}FNV.]nc{Btt">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Hvw/u)3/]FSU2i{W?]V0">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="#w)ztD|!KH1~tWPnM5f:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{$'xYy6%P%W8g(*JQ#Or">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="21dh6qbWSo,Zb3kkRH%i">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="+8vDs*Y/]XK{}~.v]~^g">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="9XdtzUS(K5ftm(C*A^)k">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="zhQc7aG(nqFl9_?o0=KH">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=",{$@SjzVt*GBN_,Qg}A%">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9c%twp@x46xD-|b8mb^B">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")c4mlTXvd++X7tX.|~1z">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="FT#O=h0N7k#wF^G2qM,^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="GpTNp53@^uH7b^,2F}8o">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="O?xuy~mL;0YMNl,y+t=b">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")MY:IT~oL5*MQ0v6!G~;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1=lcm:AtzG/^Z#}e$3zL">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^=5LbWJ5,ZVNTgZ.^{O8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=":+@4]6-{|'hh6kixza*b">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="w5k!l;'xx!IQVvkq:C=%">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="q,Ssj]m9.qO[}0dSRTZ4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="BZNyGVg@JBjKwmUkpW:M">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Rn@^k{0M308$bSKeveNI">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="n;-*S4%!*o'?9AoES;Ys">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="TZuu9L4{}i=PO(:bF,Af">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="K_rT_j98O]vO'Z_QcZt:">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="2'|cyGWbtoGxYM{!a*6,">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=",hU_c[?6LjE{3R$DPX+x">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="r!dHdb)FIr@$K;xm7{B,">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="NsjQI%g^3Zy%9w0:fIZ%">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="SlMDhB#mkEKbQ4x!X9h*">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="w01V!Ezyv_tW).kmgjDG">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".|RG{}_425G+yg.q*OxY">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="J4$tz*V]~}s3[?4E_*@r">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9kKmar7,CJVSi|zdZZxt">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="rWL4dy]X8LwA*{UtW(Y}">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="~Jg|7,_'^6OxX=(rGlha">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="k]^ONn)=9xf[WmBWZ;GT">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hA[{4']Ijz2uS|^9xx,%">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="]|$ag3LIDg(*]w5TMwKa">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="kVPourT0TjH%[7{)+UC@">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Ty)O;9H(hspJ0U}IwS+6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="J3)R#vE':7*gK4/OcUN$">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="v@oL.xgX*kEU16bWv?fC">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="1f?(!=SBJno$RQ@HGWx8">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="wn]E]c'~fs*QX3c~k]fi">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="ral.7v15cgF$n#J.%jz;">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")+.pP.6O|9ywDp,tf:ox">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".z[:8=vkXi(@SqUZK6EM">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="FR0NH!xf:sxy3AN#b~t~">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ob6y4SIOD.7P_tDaa|#g">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%7E4(rq3[7BdzBZph=8^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="MaO=Kits.JT's@iG!ygI">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="HmJ8j(3WXCF[|cWRH1OS">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="lMt,#E,]Nyt84v}O~Wpv">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="T6KXI[L.jgS!M$hlVAZI">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Ro??l^o5%x+^ZXFFCx[?">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="G#!3=w;zzOzXD#D1Nv26">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="NC-]hoqVz(]m[XySTNfy">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="qP@SCR_4cm%hQUe?~Kya">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="m75F,k8fFtb75_nxbLyh">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="uaDfuTml:eL7V7{v=!lO">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="k/V4bF]Sf7qL:i'H7{BI">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="~HFtop9Knn]7.V-!@X'B">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?s}ZB)%MUz2]'ShzH:.y">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="WGK2SN-[SU@N8:m4%c0o">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hW:7Mw,h%85)_Yu?#a2z">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=".5JKyU7?8mW@Z.2f6FvC">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="5VT6Jly0$=330bU/p8_u">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?4s8=HU!9$~7tWJ|s*^*">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
</block>
</statement>
<next>
<block type="commentary_block" id="^Y_mh/T|nBdQ14^/y}vM" disabled="true">
<field name="COMMENT">S timto je to 12163 batu</field>
<statement name="CANVAS_COMMANDS">
<block type="window" id="JE}G[m*qZsE8H}.0,DcB" collapsed="true">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">ADD</field>
<statement name="BODY">
<block type="drawing" id="mh6K~Dtm?sxe.k5b)rNc">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id=")r,2.l0X}dC)+.*L;]5U">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="-O_{l;[J1z:dd}LhyG8x">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="|QHobx/nUFY|_/RFb2N6">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?LW%jl;X*/*zi%8H-?.B">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="FU{hj*6q-~|d]81;dGw^">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="k^WA]:$pD0%NRjI*^7wy">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="nMe^6ex|XE;+yr8sY0iL">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{/i#UDZX6=?5tqPm6(4G">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="[^wtUPE+Z1?gNO9hlnr;">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="4PCcbFmXr'2*nHe!1(i_">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="MJ4b$%uY1VP:1eIzHElM">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="GSa3g3iOhe[A7ZyIW|vE">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7q.-xCJ36R@t{!XNP9ML">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="2];;iaj{y/g50Sn6p$wK">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=1b:lt0Rh{qG!ei#s1[j">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="n;d@~_#p,2lBqG2*(?/M">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="*-Z^$SerB#unsSOerJkE">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="7s~g~Et12OLonGGl.Q+A">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Qc$17*~$Y:4j%Bqk;/)O">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="l355eMHiEH?8F4:oUebo">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^4h_lFmWQf_4*G8WI;1L">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".xwsr[b_Mk@=|]xo5_za">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="1UqLwz#aWM;fw39O?P!X">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=";Q#mK|d{sA8aKH:X@9.+">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="y@P!p,A?TGv5~|m{Qx6X">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="^%G:OZLk?ZH=vI.1tbW=">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="=5Ws%8h=Q%tYgP4g_AE3">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="te?B?(?nrT~cqw!K1_]i">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="V_rK|6M,!rIfX;aKE@1j">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="2iQ5hnlxdJ~T*I1:58[x">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?6]pLuFD7TL8gTl_i^(E">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=")m]HFtK=5u9W/Z?mO_X'">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="o!^wO7F$xGag$[T-e($I">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="/sh9K~q]6*nN$Wl7T;DD">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="0i$t9M!m9.7L5@%7ZyPY">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="{l!1yGwzel}6AVo:a3O^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="uv~8E$@G|!B)}QR,N_wp">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="EVMw+/AUDeIljtJhBL8K">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="e{|VJ0OKo,F%%|TD}t9D">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="lZ4YGuW;8;[9Su%_phxj">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="DlDUGl7,EWvja1Pk:#u2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=",vQyn'l%N,LDb0#XyW!U">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="%]%mOO$n_'.xIpb?AN{Q">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="d,V@e6Ak2Z+X]A)M7l9n">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="xK+Y~2RKu4m1Lo=$QUQp">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Fh/T:y0RH%vx~fs[@#mR">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="-4=WY;;)JYBW$[bRXhc9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="?-,)teX*i,OdE5fp{q?}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="c6GIx,d?@1Q@3CUQrlFr">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9!(2tElE(QRHz{opx[HT">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="C*Yh2u#on9_6Q*RR1kVt">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="K=[v}=k*s;;7|,}PzFZh">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="pGDn$i2#c?SK{gA;D$XE">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="S|[e}Y}+vWbBH/7hn0;L">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="?WLJI+uOfiyk'0g2|jx4">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="V;u9{eUJ[Kv32YCN2W}J">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="fI]mH;o[++KY!lqW|HR9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="'aq5E8C4+R9J7EfdhT6d">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Q{d;EcVEzs)]J(dauAwV">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#k^X#}oZ7_^i.T}/4L8M">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="L{_$l'ITvWSnRC(^oFuM">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="8S=.Vf9),6!mfa01BZld">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="izG/EhnE%-#.ps0BFuuq">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="n3QKCqOTHu7oM#+B0#.k">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="7MD:*wR/UAM=s6,v7i08">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="nWe[CR{2A!_V{}GRzhec">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="X=S_h0}k*?fC3btuOz);">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="@56r}]^/~L#0GO7o6PJT">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="afnorZQX~'AY.A;'sr}r">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="J,:(;[?Cwv3(Poa+%w5o">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="DLJEJGeFk(6N.Na%y8jw">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="byu+},?KW4S(duG:8#-.">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="v*@d/t+_^WRL;?LIEZhv">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="hIqboVJ0EQ(#hyn)Yky}">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="'@Q==.KSl1Of'@/1VRRr">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="oU=J:@j~|f|OE}y,J:,H">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="wooG%~v-TEXu-HO6D:vX">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="m3H*^f{WfWI-S]NclWC8">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="OS|5,dPz{5v17Gew1D4@">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="NH~2gI-tXw~ACI;t6,lI">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="R:4VO0mqy.%E:Y:r8h}[">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="!Mc19ZF5ljN.|kuD6GP2">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="Ndy9D47['@~L1;lE!ql9">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="#HhfL?7z0Q'6Cc11OaZe">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="[4iDx^^I:1g'#h_N47eO">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="9ERO1zcjlI{+R?:1sqGF">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="CZy7rT|IxdXD8p^PVh~D">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="u?'P^D3w^t3ixr7]pXOl">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="ia7p(Ygq$2ETI_,l+6LG">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="Kp+1Vy#ke'[2-jF]Oeu~">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="6=6qi:bp/bt;cT}I./?,">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="t@I;+CwtBQR*Xcnu?7h4">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="cEz6;87t0HfSaS+xG9a8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="RL?j61m.gE}rnEo1Z1dq">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="{SSmPEStU7B7Q_3@x_:!">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="u7M8Ej@#.O-GX)NiI~wK">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="VgVouhYfEpewx@Ef2-Qo">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="PVH4Px?o3Lzfe.d61qlk">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="V!mXX9?v,%,FW=2Hw/jA">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="^D?gP*F1BjWSjuu'Cv3~">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="L7'FDlN%5?'{$fwun=yT">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id=".v.qjJWR~;*|Z~LBpPDG">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="^(0n?b43yQf2A}QXqs^2">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="BYgqq|'t:Nys}$vBTm{^">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="FZdO-.68j22,P'HDr+Uz">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="/i'90R9CVsjkgism[lmx">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="lb@x4+Y*INxG8_|=e,yn">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="m%H^2~)?=[)yqI{OU%]E">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="miwVF2}s{sk%;yr-kA0a">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
<next>
<block type="drawing" id="z/T}VOpD^t:kGRVbpe_o">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="3=7BcMv%-.5Um{=?hZg8">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
</block>
</statement>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
<block type="drawing" id="6Iwfe?_(6C/}Si}*GAKr" x="1220" y="1405">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="oUNTniaR+_$HLKkB:xoO">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
<block type="drawing" id="6Iwfe?_(6C/}Si}*GAKr" x="1220" y="1405">
<field name="START">0s</field>
<field name="TIME_DEFINITION">DURATION</field>
<field name="DURATION">Infinity</field>
<field name="DRAW_MODE">SET</field>
<value name="ANIMATION">
<block type="animation_plasma_shot" id="oUNTniaR+_$HLKkB:xoO">
<field name="COLOR">#ff0000</field>
<field name="PERCENTAGE">25%</field>
<field name="DURATION">5s</field>
</block>
</value>
</block>
</xml>
    `;

  Code.loadBlocks(init_blocks_xml);

  //   if ("BlocklyStorage" in window) {
  //     // Hook a save function onto unload.
  //     BlocklyStorage.backupOnUnload(Code.workspace);
  //   }

  Code.simplify = function () {
    let blocks_xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace));

    //console.log(blocks_xml);
    blocks_xml = blocks_xml.replace(/<shadow [^\n]*><\/shadow>/g, "");
    //console.log(blocks_xml);

    //Code.discard();
    Code.workspace.clear();
    var xml = Blockly.Xml.textToDom(blocks_xml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);

    //Code.renderContent();
  };

  Code.removeOwner = function () {
    Code.device
      .removeOwner()
      .then(device => {
        // @ts-ignore
        window.alert("Mac " + device.mac + " removed", "Owner removed.");
      })
      .catch(e => {
        // @ts-ignore
        window.alert(e, "Failed to remove owner from the device.");
      });
  };

  Code.fwVersion = function () {
    Code.device
      .getFwVersion()
      .then(version => {
        window.alert(version);
      })
      .catch(e => {
        window.alert(e, "Failed get FW version");
      });
  };

  Code.syncTngl = function () {
    Code.device
      .syncTngl(Blockly.Tngl.workspaceToCode(Code.workspace))
      .then(() => {
        window.alert("Tngl synchronized on the connected device");
      })
      .catch(e => {
        window.alert(e, "Failed to sync tngl");
      });
  };

  Code.deviceFingerprint = function () {
    Code.device
      .getTnglFingerprint()
      .then(fingerprint => {
        let digest = btoa(String.fromCharCode(...new Uint8Array(fingerprint)));
        console.log(digest);
        window.alert(digest);
      })
      .catch(e => {
        window.alert(e, "Failed get TNGL fingerprint");
      });
  };

  Code.blocklyFingerprint = function () {
    var tngl_code = Blockly.Tngl.workspaceToCode(Code.workspace);

    return computeTnglFingerprint(new TnglCodeParser().parseTnglCode(tngl_code), "fingerprint")
      .then(fingerprint => {
        let digest = btoa(String.fromCharCode(...new Uint8Array(fingerprint)));
        console.log(digest);
        window.alert(digest);
      })
      .catch(e => {
        window.alert(e, "Failed get Blockly TNGL fingerprint");
      });
  };

  Code.rebootDevice = function () {
    Code.device.rebootDevice();
  };

  Code.rebootNetwork = function () {
    Code.device.rebootNetwork();
  };

  document.getElementById("otaFirmware").addEventListener("change", async function () {
    window.ota_uploadFrom = "file";
    window.ota_firmware = await this.files[0]
      .arrayBuffer()
      .then(function (firmware) {
        return firmware;
      })
      .catch(function (err) {
        console.warn("Something went wrong.", err);
      });
  });

  Code.otaUpdateDeviceFirmware = async function () {
    if (window.ota_uploadFrom === "cloud") {
      TangleMsgBox.alert(`Verze: ${fw_version_listDOM.value.replace(".enc", "")}`, "Probíhá stahování FW, uploadování se spustí po stažení FW.");
      window.ota_firmware = await downloadSelectedFW();
    }
    console.log(window.ota_firmware);
    return Code.device.updateDeviceFirmware(new Uint8Array(window.ota_firmware)).catch(e => {
      console.error(e);
    });
  };

  Code.otaUpdateNetworkFirmware = async function () {
    if (window.ota_uploadFrom === "cloud") {
      window.ota_firmware = await downloadSelectedFW();
      TangleMsgBox.alert(`Verze: ${fw_version_listDOM.value.replace(".enc", "")}`, "Probíhá stahování FW, uploadování se spustí po stažení FW.");
    }
    console.log(window.ota_firmware);
    return Code.device.updateNetworkFirmware(new Uint8Array(window.ota_firmware)).catch(e => {
      console.error(e);
    });
  };

  const config_textarea = document.querySelector("#config_textarea");

  Code.otaReadDeviceConfig = function () {
    Code.device
      .readDeviceConfig()
      .then(config => {
        try {
          const obj = JSON.parse(config);
          const consif_pretty = JSON.stringify(obj, null, 2);
          config_textarea.value = consif_pretty;
        } catch {
          config_textarea.value = config;
        }
      })
      .then(() => {
        window.alert("Config read SUCCESS");
      })
      .catch(e => {
        //@ts-ignore
        window.alert("Config read FAILED", e);
        console.error(e);
      });
  };

  Code.otaUpdateDeviceConfig = function () {
    try {
      const raw_config = config_textarea.value.replace(/\\"/g, '"');
      console.log(raw_config);
      const config_obj = JSON.parse(raw_config); // TODO - validate also json fields and it's datatypes
      const config = JSON.stringify(config_obj);
      return Code.device
        .updateDeviceConfig(config)
        .then(() => {
          window.alert("Config write SUCCESS");
        })
        .catch(e => {
          //@ts-ignore
          window.alert("Config write FAILED", e);
          console.error(e);
        });
    } catch (err) {
      //@ts-ignore
      window.alert("Something went wrong.", err);
    }
  };

  Code.otaUpdateNetworkConfig = function () {
    try {
      const raw_config = config_textarea.value.replace(/\\"/g, '"');
      console.log(raw_config);
      const config_obj = JSON.parse(raw_config); // TODO - validate also json fields and it's datatypes
      const config = JSON.stringify(config_obj);
      return Code.device
        .updateNetworkConfig(config)
        .then(() => {
          window.alert("Config write SUCCESS");
        })
        .catch(e => {
          window.alert("Config write FAILED");
          console.error(e);
        });
    } catch (err) {
      //@ts-ignore
      window.alert("Something went wrong.", err);
    }
  };

  Code.tabClick(Code.selected);

  Code.bindClick("simplifyButton", Code.simplify);
  Code.bindClick("rebootDevice", Code.rebootDevice);
  Code.bindClick("rebootNetwork", Code.rebootNetwork);
  Code.bindClick("removeOwnerButton", Code.removeOwner);
  Code.bindClick("fwVersionButton", Code.fwVersion);
  Code.bindClick("syncTnglButton", Code.syncTngl);
  Code.bindClick("deviceFingerprintButton", Code.deviceFingerprint);
  Code.bindClick("blocklyFingerprintButton", Code.blocklyFingerprint);
  Code.bindClick("otaUpdateDeviceFirmware", Code.otaUpdateDeviceFirmware);
  Code.bindClick("otaUpdateNetworkFirmware", Code.otaUpdateNetworkFirmware);
  Code.bindClick("otaReadDeviceConfig", Code.otaReadDeviceConfig);
  Code.bindClick("otaUpdateDeviceConfig", Code.otaUpdateDeviceConfig);
  Code.bindClick("otaUpdateNetworkConfig", Code.otaUpdateNetworkConfig);
  Code.bindClick("connectSerialButton", Code.connectSerial);
  Code.bindClick("connectBluetoothButton", Code.connectBluetooth);
  Code.bindClick("adoptBluetoothButton", Code.adoptBluetooth);
  Code.bindClick("uploadButton", Code.upload);
  Code.bindClick("playButton", Code.play);
  Code.bindClick("cycleButton", Code.cycle);
  Code.bindClick("pauseButton", Code.pause);
  Code.bindClick("stopButton", Code.stop);
  Code.bindClick("trashButton", function () {
    console.log("Trashing everything...");
    Code.discard();
    Code.renderContent();
  });

  // // Disable the link button if page isn't backed by App Engine storage.
  // var linkButton = document.getElementById('linkButton');
  // if ('BlocklyStorage' in window) {
  //   BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
  //   BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
  //   BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
  //   BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
  //   Code.bindClick(linkButton,
  //     function () { BlocklyStorage.link(Code.workspace); });
  // } else if (linkButton) {
  //   linkButton.className = 'disabled';
  // }

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick(
      "tab_" + name,
      (function (name_) {
        return function () {
          Code.tabClick(name_);
        };
      })(name),
    );
  }

  Code.bindClick("tab_code", function (e) {
    if (e.target !== document.getElementById("tab_code")) {
      // Prevent clicks on child codeMenu from triggering a tab click.
      return;
    }
    Code.changeCodingLanguage();
  });

  onresize();
  Blockly.svgResize(Code.workspace);

  // // Lazy-load the syntax-highlighting.
  // window.setTimeout(Code.importPrettify, 1);

  Code.workspace.addChangeListener(Code.onEvent);

  try {
    let blocks = window.localStorage.getItem("blocks");
    Code.loadBlocks(blocks);
  } catch {
    window.localStorage.clear();
    Code.loadBlocks("");
  }

  window.addEventListener("keypress", Code.onKeyPress);
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function () {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? "rtl" : "ltr";
  document.head.parentElement.setAttribute("lang", Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function (a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // // Populate the language selection menu.
  // var languageMenu = document.getElementById('languageMenu');
  // languageMenu.options.length = 0;
  // for (var i = 0; i < languages.length; i++) {
  //   var tuple = languages[i];
  //   var lang = tuple[tuple.length - 1];
  //   var option = new Option(tuple[0], lang);
  //   if (lang == Code.LANG) {
  //     option.selected = true;
  //   }
  //   languageMenu.options.add(option);
  // }
  // languageMenu.addEventListener('change', Code.changeLanguage, true);

  // Populate the coding language selection menu.
  var codeMenu = /** @type {any} */ (document.getElementById("code_menu"));
  codeMenu.options.length = 0;
  for (var i = 1; i < Code.TABS_.length; i++) {
    codeMenu.options.add(new Option(Code.TABS_DISPLAY_[i], Code.TABS_[i]));
  }
  codeMenu.addEventListener("change", Code.changeCodingLanguage);

  // Inject language strings.
  document.title += " " + MSG["title"];
  //document.getElementById('title').textContent = MSG['title'];
  document.getElementById("tab_blocks").textContent = MSG["blocks"];

  // document.getElementById('linkButton').title = MSG['linkTooltip'];
  // document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById("trashButton").title = MSG["trashTooltip"];

  document.getElementById("connectSerialButton").title = "Připojit se k Tangle přes USB";
  document.getElementById("adoptBluetoothButton").title = "Zadoptovat Tangle zařízení";
  document.getElementById("connectBluetoothButton").title = "Připojit se k Tangle";
  document.getElementById("uploadButton").title = "Nahrát projekt";
  document.getElementById("playButton").title = "Přehrát animaci";
  document.getElementById("cycleButton").title = "Opakovat animaci";
  document.getElementById("pauseButton").title = "Pozastavit animaci";
  document.getElementById("stopButton").title = "Resetovat animaci";
};
document.querySelector("#saveButton").onclick = _ => {
  let xml_code = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace));
  localStorage.setItem("blocks", xml_code);
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = async function () {
  var count = Code.workspace.getAllBlocks(false).length;
  if (count < 2 || (await window.confirm(Blockly.Msg["DELETE_ALL_BLOCKS"].replace("%1", count)))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = "";
    }
  }
};

// var port;

Code.adoptBluetooth = function () {
  return Code.device.adopt().then(device => {
    console.log("Adopted Device:", device);
  });
};

Code.connectBluetooth = function () {
  return Code.device.connected().then(connected => {
    if (!connected) {
      console.log("Connecting device...");
      return Code.device.connect(/* [{name: "Manka"}] */ null, false, null, null, true).catch(e => {
        console.error(e);
      });
    } else {
      console.log("Disconnecting device...");
      return Code.device.disconnect().catch(e => {
        console.error(e);
      });
    }
  });
};

Code.onKeyPress = function (e) {
  // let codes = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyY', 'KeyX', 'KeyC', 'KeyV', 'KeyZ'];
  let keys = ["Q", "W", "E", "R", "A", "S", "D", "F", "Y", "X", "C", "V", "Z", "T"];

  if (keys.includes(e.key) /*&& e.shiftKey*/) {
    console.log("Keypress " + e.key + " trigger");
    Code.device.emitEvent(e.key.charCodeAt(0), 255);
  }
};

// Load the Code demo's language strings.
// document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
// document.write('<script src="blockly/msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener("load", Code.init);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

setInterval(function () {
  let now = Code.device.timeline.millis();
  let min = Math.floor(now / 60000);
  now %= 60000;
  let sec = Math.floor(now / 1000);
  now %= 1000;
  let msec = Math.floor(now / 10);

  const pad = (number, size) => {
    var s = String(number);
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  };

  document.getElementById("revTime").innerHTML = "" + min + ":" + pad(sec, 2) + ":" + pad(msec, 2);
}, 100);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// document.getElementById("music").addEventListener("change", function () {
//   //var url = URL.createObjectURL(this.files[0]);
//   window.blockly_music = this.files[0];

//   // Code.music.setAttribute("src", url);
// });

// document.getElementById("metronome").addEventListener("change", function () {
//   var url = URL.createObjectURL(this.files[0]);
//   window.blockly_metronome = this.files[0];
//   Code.metronome.setAttribute("src", url);
// });

try {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(enumerateDevices).then(gotDevices).catch(handleError);
} catch (err) {
  alert("Please enable media if you want to access different audio outputs.");
}

function enumerateDevices() {
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  const masterOutputSelector = document.createElement("select");
  masterOutputSelector.style.width = "25%";

  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement("option");
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "audiooutput") {
      //console.info("Found audio output device: ", deviceInfo.label);
      option.text = deviceInfo.label || `speaker ${masterOutputSelector.length + 1}`;
      masterOutputSelector.appendChild(option);
    } else {
      //console.log("Found non audio output device: ", deviceInfo.label);
    }
  }

  const newMusicOutputSelector = masterOutputSelector.cloneNode(true);
  newMusicOutputSelector.addEventListener("change", changeMusicDestination);
  document.querySelector("select#musicOutputSelect").replaceWith(newMusicOutputSelector);

  // const newMetronomeOutputSelector = masterOutputSelector.cloneNode(true);
  // newMetronomeOutputSelector.addEventListener("change", changeMetronomeDestination);
  // document.querySelector("select#metronomeOutputSelect").replaceWith(newMetronomeOutputSelector);
}

function handleError(error) {
  console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
}

function changeMusicDestination(event) {
  throw "NOT IMPLEMENTED";
  // const deviceId = event.target.value;
  // const element = Code.music;
  // attachSinkId(element, deviceId);
}

// function changeMetronomeDestination(event) {
//   const deviceId = event.target.value;
//   const element = Code.metronome;
//   attachSinkId(element, deviceId);
// }

// Attach audio output device to the provided media element using the deviceId.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== "undefined") {
    element
      .setSinkId(sinkId)
      .then(() => {
        console.log(`Success, audio output device attached: ${sinkId} to element with ${element.title} as source.`);
      })
      .catch(handleError);
  } else {
    console.warn("Browser does not support output device selection.");
  }
}

// window.onbeforeunload = function (e) {
//   if (!e) e = window.event;

//   let xml_code = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace));

//   if (window.localStorage.getItem("blocks") !== xml_code) {
//     e.preventDefault();
//     e.cancelBubble = true;
//     e.returnValue = "Opravdu chcete opustit stránku, vaše rozpracovaná práce bude ztracena.";
//     window.confirm("Opravdu chcete opustit tuto stránku? Ztratíte svou rozdělanou práci.");
//   }
// };

function fetchStableFWVersions() {
  return fetch("https://updates.spectoda.com/subdom/updates/firmware/list.php")
    .then(v => v.json())
    .then(v => v.files)
    .catch(() => {
      console.error("Failed to fetch stable FW versions");
    });
}

function fetchDailyFWVersions() {
  return fetch("https://updates.spectoda.com/subdom/updates/firmware/daily/list.php")
    .then(v => v.json())
    .then(v => v.files)
    .catch(() => {
      console.error("Failed to fetch daily FW versions");
    });
}

const fw_version_listDOM = document.querySelector("#fw_version_list");

async function loadFWVersions() {
  function displayOptionsInGroup(selectDOM, versions, title) {
    const versionsGroup = document.createElement("optgroup");
    versionsGroup.label = title;

    versions.forEach(({ file }) => {
      const option = document.createElement("option");
      option.value = file;
      option.innerText = file.replace(".enc", "");
      versionsGroup.appendChild(option);
    });

    selectDOM.appendChild(versionsGroup);
  }

  const stableVersions = await fetchStableFWVersions();
  displayOptionsInGroup(fw_version_listDOM, stableVersions, "Stable versions");

  const dailyVersions = await fetchDailyFWVersions();
  displayOptionsInGroup(fw_version_listDOM, dailyVersions, "Daily builds");
}

loadFWVersions();

function downloadSelectedFW() {
  const version = fw_version_listDOM.value;
  const groupLabel = document.querySelector("select#fw_version_list option:checked").parentElement.label;
  let url;

  if (groupLabel.includes("Daily")) {
    url = "https://updates.spectoda.com/subdom/updates/firmware/daily/";
  } else {
    url = "https://updates.spectoda.com/subdom/updates/firmware/";
  }

  return fetch(url + version).then(res => res.arrayBuffer());
}

fw_version_listDOM.onchange = function () {
  window.ota_uploadFrom = "cloud";
};

Code.readDsparxBattery = function () {
  Code.device.readPinVoltage(34).then(voltage => {
    let percentage = ((voltage - 1000) / 380) * 100;
    //@ts-ignore
    window.alert(`${percentage}%`, "Battery voltage measurement");
  });
};

Code.testReactNativePing = async function () {
  var promise = null;

  if (!("tangleConnect" in window)) {
    // @ts-ignore
    window.tangleConnect = {};
  }

  await window.confirm("Starting ReactNative ping demo");

  const start = new Date().getTime();

  for (let i = 0; i < 1000; i++) {
    promise = new Promise((resolve, reject) => {
      // @ts-ignore
      window.tangleConnect.resolve = resolve;
      // @ts-ignore
      window.tangleConnect.reject = reject;
    });

    // console.log("Sending ping...");
    // @ts-ignore
    window.ReactNativeWebView.postMessage("ping");

    await promise;
  }

  const stop = new Date().getTime();
  const average = (stop - start) / 1000;

  window.alert("Average turnaroud time: " + average + " ms");
};

Code.testFlutterPing = async function () {
  var promise = null;

  if (!("tangleConnect" in window)) {
    // @ts-ignore
    window.tangleConnect = {};
  }

  await window.confirm("Starting Flutter ping demo");

  const start = new Date().getTime();

  for (let i = 0; i < 1000; i++) {
    promise = new Promise((resolve, reject) => {
      // @ts-ignore
      window.tangleConnect.resolve = resolve;
      // @ts-ignore
      window.tangleConnect.reject = reject;
    });

    // console.log("Sending ping...");
    // @ts-ignore
    window.flutter_inappwebview.callHandler("ping");

    await promise;
  }

  const stop = new Date().getTime();
  const average = (stop - start) / 1000;

  window.alert("Average turnaroud time: " + average + " ms");
};

Code.testJavaPing = async function () {
  var promise = null;

  if (!("tangleConnect" in window)) {
    // @ts-ignore
    window.tangleConnect = {};
  }

  await window.confirm("Starting java ping demo");

  const start = new Date().getTime();

  for (let i = 0; i < 1000; i++) {
    promise = new Promise((resolve, reject) => {
      // @ts-ignore
      window.tangleConnect.resolve = resolve;
      // @ts-ignore
      window.tangleConnect.reject = reject;
    });

    // console.log("Sending ping...");
    // @ts-ignore
    window.tangleConnect.ping();

    await promise;
  }

  const stop = new Date().getTime();
  const average = (stop - start) / 1000;

  window.alert("Average turnaroud time: " + average + " ms");
};

Code.testDummyPing = async function () {
  var promise = null;

  if (!("tangleConnect" in window)) {
    // @ts-ignore
    window.tangleConnect = {};
  }

  await window.confirm("Starting dummy ping demo");

  const start = new Date().getTime();

  for (let i = 0; i < 1000; i++) {
    promise = new Promise((resolve, reject) => {
      // @ts-ignore
      window.tangleConnect.resolve = resolve;
      // @ts-ignore
      window.tangleConnect.reject = reject;
    });

    // console.log("Sending ping...");
    // @ts-ignore
    window.tangleConnect.resolve();

    await promise;
  }

  const stop = new Date().getTime();
  const average = (stop - start) / 1000;

  window.alert("Average turnaroud time: " + average + " ms");
};

Code.sendLeft = function () {
  Code.device.emitTimestampEvent("lag", 0, 255);

  for (let i = 0; i < 8; i++) {
    Code.device.emitTimestampEvent("lag", 50 * i, i + 1);
  }
};

Code.sendMiddle = function () {
  Code.device.emitTimestampEvent("lag", 0, 255);

  Code.device.emitTimestampEvent("lag", 0, 4);
  Code.device.emitTimestampEvent("lag", 0, 5);

  Code.device.emitTimestampEvent("lag", 50, 3);
  Code.device.emitTimestampEvent("lag", 50, 6);

  Code.device.emitTimestampEvent("lag", 100, 2);
  Code.device.emitTimestampEvent("lag", 100, 7);

  Code.device.emitTimestampEvent("lag", 150, 1);
  Code.device.emitTimestampEvent("lag", 150, 8);
};

Code.sendRight = function () {
  Code.device.emitTimestampEvent("lag", 0, 255);

  for (let i = 0; i < 8; i++) {
    Code.device.emitTimestampEvent("lag", 50 * (7 - i), i + 1);
  }
};
