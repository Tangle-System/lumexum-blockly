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

if (!navigator.bluetooth) {
  alert("Oops, bluetooth doesn't work here.");
}

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

Code.device = new TangleDevice("default");

Code.device.setDebugLevel(4);

const devices_textarea = document.querySelector("#devices_textarea");

Code.device.on("peer_connected", peer => {
  console.log("Peer connected", peer);

  var re = new RegExp(peer + "✅\\n", "gi");
  devices_textarea.value = devices_textarea.value.replace(re, "");

  devices_textarea.value += peer + "✅\n";
});

Code.device.on("peer_disconnected", peer => {
  console.log("Peer disconnected", peer);

  var re = new RegExp(peer + "✅\\n", "gi");
  devices_textarea.value = devices_textarea.value.replace(re, "");
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

Code.device.timeline = new TimeTrack();

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

  //   var init_blocks_xml =

  // Code.loadBlocks(init_blocks_xml);

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
      return Code.device
        .connect(/* [{name: "Manka"}] */ null, false, null, null, true)
        .catch(e => {
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
  // throw "NOT IMPLEMENTED";
  const deviceId = event.target.value;
  // const element = Code.music;
  attachSinkId(null, deviceId);
}

// function changeMetronomeDestination(event) {
//   const deviceId = event.target.value;
//   const element = Code.metronome;
//   attachSinkId(element, deviceId);
// }

// Attach audio output device to the provided media element using the deviceId.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== "undefined") {
    wavesurfer.setSinkId(sinkId).then(() => {
      console.log(`Success, audio output device attached: ${sinkId} to element with ${element.title} as source.`);
    })
    .catch(handleError);

    // element
    //   .setSinkId(sinkId)
    //   .then(() => {
    //     console.log(`Success, audio output device attached: ${sinkId} to element with ${element.title} as source.`);
    //   })
    //   .catch(handleError);
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
  return fetch("https://updates.tangle.cz/subdom/updates/firmware/list.php")
    .then(v => v.json())
    .then(v => v.files)
    .catch(() => {
      console.error("Failed to fetch stable FW versions");
    });
}

function fetchDailyFWVersions() {
  return fetch("https://updates.tangle.cz/subdom/updates/firmware/daily/list.php")
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
    url = "https://updates.tangle.cz/subdom/updates/firmware/daily/";
  } else {
    url = "https://updates.tangle.cz/subdom/updates/firmware/";
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
}

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
