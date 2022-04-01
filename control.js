import TangleMsgBox from "./lib/webcomponents/dialog-component.js";

// Just to make blockly interactive first and let libraries load in the background
window.onload = function () {
  window.alert = TangleMsgBox.alert;
  window.confirm = TangleMsgBox.confirm;
  window.prompt = TangleMsgBox.prompt;

  const content_control = document.querySelector("#content_control");
  const control_percentage_range = document.querySelector("#control_percentage_range");
  const control_destination = document.querySelector("#control_destination");
  const control_send = document.querySelector("#control_send");
  const control_sound = document.querySelector("#control_sound");

  const event_logs = document.querySelector("#event_logs");
  const control_label = document.querySelector("#control_label");
  const control_percentage_value = document.querySelector("#control_percentage_value");
  const control_timestamp_value = document.querySelector("#control_timestamp_value");
  const control_color_value = /** @type {HTMLInputElement} */ document.querySelector("#control_color_value");
  const control_color_picker = document.querySelector("#control_color_picker");

  const control_connector_select = document.querySelector("#control_connector_select");

  // CONTROL TYPE HANDLER
  let currentControlType = "percentage_control";
  document.querySelector("#control_type").onchange = e => {
    const controlType = e.target.options[e.target.selectedIndex].value;
    // Hide other controls
    document.querySelector(`#${currentControlType}`).style.display = "none";
    document.querySelector(`#${controlType}`).style.display = "block";

    currentControlType = controlType;
  };

  control_label.onchange = e => {
    control_label.value = control_label.value.replace(/\W/g, "");
    control_label.value = control_label.value.substring(0, 5);
  };

  control_color_picker.oninput = e => {
    control_color_value.value = control_color_picker.value;

    control_color_value.style.backgroundColor = control_color_value.value;
    control_color_value.style.color = lum(control_color_value.value);
  };

  control_color_value.oninput = e => {
    control_color_picker.value = getHexColor(control_color_value.value);

    control_color_value.style.backgroundColor = control_color_value.value;
    control_color_value.style.color = lum(control_color_value.value);
  };

  control_connector_select.onchange = e => {
    console.log(`Assigning ${control_connector_select.value} connector to the device`);
    Code.device.assignConnector(control_connector_select.value);
  };

  Code.device.on("event", event => {
    control_label.value = event.label;
    control_destination.value = event.id;

    if (event.value === null) {
      return;
    }

    if (event.value.toString().match(/#[\dabcdefABCDEF]{6}/g)) {
      control_color_value.value = event.value;
      control_color_picker.value = event.value;
    } else {
      if (event.value >= -100.0 && event.value <= 100.0) {
        control_percentage_value.value = event.value;
        control_percentage_range.value = event.value;
        control_timestamp_value.value = event.value;
      }

      if (event.value >= -2147483648 && event.value <= 2147483647) {
        control_timestamp_value.value = event.value;
      }
    }
  });

  // const timeline_toggle = document.querySelector("#timeline_toggle");
  const timeline_container = document.querySelector("#timeline_container");
  const wavesurfer_container = document.querySelector("#waveform_container");

  // timeline_toggle.addEventListener("click", function () {
  //   timeline_container.classList.toggle("openned");
  //   wavesurfer_container.classList.toggle("hidden");
  // });

  // !! problems with layout, so we need to do this somehow manually
  // TODO make it responsive on resize
  // TODO make wavesurfer rerenders only when openned
  // TODO add Zoom and time-line functionality like in Tangler
  window.wavesurfer = WaveSurfer.create({
    container: "#waveform",
    height: 60,
    plugins: [
      WaveSurfer.regions.create({
        // regions: [
        //   {
        //     start: 0,
        //     end: 5,
        //     color: 'hsla(400, 100%, 30%, 0.1)'
        //   },
        //   {
        //     start: 10,
        //     end: 20,
        //     color: 'hsla(200, 50%, 70%, 0.1)'
        //   }
        // ]
      }),
      WaveSurfer.timeline.create({
        container: "#timeline",
      }),
      WaveSurfer.cursor.create({
        showTime: true,
        opacity: 1,
        customShowTimeStyle: {
          "background-color": "#000",
          color: "#fff",
          padding: "2px",
          "font-size": "10px",
        },
      }),
    ],
  });

  // wavesurfer.setMute(true);
  //window.musicDebounce = false;
  // const playPause = document.querySelector("#playPause");
  // playPause.onclick = function () {
  //   if (wavesurfer.isPlaying()) {
  //     Code.device.timeline.pause();
  //     wavesurfer.pause();
  //     playPause.innerHTML = "Play";
  //   } else {
  //     Code.device.timeline.unpause();
  //     wavesurfer.play();
  //     playPause.innerHTML = "Pause";
  //   }
  //   Code.device.setTimeline();
  // };

  wavesurfer.on("interaction", function () {
    setTimeout(() => {
      if (wavesurfer.getDuration()) {
        const playing = wavesurfer.isPlaying();

        if (playing != !Code.device.timeline.paused()) {
          if (playing) {
            Code.device.timeline.unpause();
          } else {
            Code.device.timeline.pause();
          }
        }

        Code.device.timeline.setMillis(wavesurfer.getCurrentTime() * 1000);
      }

      Code.device.syncTimeline().catch(() => {
        console.log("Device Disconnected");
      });
    }, 1);
  });
  // wavesurfer.load('./elevator.mp3');

  document.addEventListener("keypress", function onPress(event) {
    if (event.key === " ") {
      wavesurfer.playPause();

      const dur = wavesurfer.getDuration();
      const pos = dur ? wavesurfer.getCurrentTime() / wavesurfer.getDuration() : 0;
      wavesurfer.seekAndCenter(pos);
    }
  });

  let count = 100;

  function handleAltZoom(e) {
    if (!e.altKey) {
      return;
    } else {
      e.preventDefault();
    }

    // TODO - implement debouncing to prevent render twice when zooming fast on long song
    debounce = false;

    if (!debounce) {
      // setTimeout(_ => {
      //   setZoom((zoom) => {
      //     debounce = false;
      //     count = zoom;
      //   });
      // }, 100)

      if (count - e.deltaY < 10) {
        count = 10;
      } else {
        count -= e.deltaY;
      }

      if (count > 1500) {
        count = 1500;
      }
      if (count <= 10) {
        count = 10;
      }

      console.log("zoom count", count);

      if (count >= 10 && count <= 1500) {
        wavesurfer.zoom(count);

        debounce = true;
      }
    }
  }

  document.querySelector("#waveform").addEventListener("wheel", handleAltZoom);

  function handlePercentageValueChange(e) {
    const value = e.target.value;
    handleControlSend(value);
  }

  function handleColorValueChange(e) {
    const value = e.target.value;
    handleControlSend(value);
  }

  function handleControlSend(value = null) {
    let log_value = "";
    if (currentControlType === "percentage_control") {
      if (value === null) {
        log_value = control_percentage_value.value + "%";
        Code.device.emitPercentageEvent(control_label.value, parseFloat(control_percentage_value.value), [control_destination.value], true, false).then(() => {
          console.log("Sent!");
        });
      } else {
        log_value = value + "%";
        Code.device.emitPercentageEvent(control_label.value, parseFloat(value), [control_destination.value], false, false);
      }
    } else if (currentControlType === "color_control") {
      // if (!value) {
      const hexColor = getHexColor(document.querySelector("#control_color_value").value);
      log_value = `<span style="color:${hexColor}">` + hexColor + `</span>`;
      Code.device.emitColorEvent(control_label.value, hexColor, [control_destination.value], true, false);

      // } else {
      // Code.device.bluetoothDevice.emitColorEvent(control_label.value, value, [control_destination.value]);
      // }
    } else if (currentControlType === "timestamp_control") {
      log_value = control_timestamp_value.value + " ms";
      // TODO parse timeparams (x seconds, x minutes, x hours, x days), like in block
      Code.device.emitTimestampEvent(control_label.value, control_timestamp_value.value, [control_destination.value], true, false);
    }

    const logmessageDOM = document.createElement("li");
    // TODO edit this message accordingly to each control type
    logmessageDOM.innerHTML = `${new Date().toString().slice(15, 24)} ${currentControlType}: $${control_label.value}, ${log_value} -> ${[control_destination.value]}`;
    event_logs.appendChild(logmessageDOM);
    event_logs.scrollTop = -999999999;
  }

  function handleControlSound(value = null) {
    var webaudio_tooling_obj = function () {
    
      // Uává velikost bloků ze kterých bude vypočítávána průměrná hlasitos.
      // Maximální velikost je 2048 vzorků.
      // Hodnota musí být vždy násobkem dvou.
      // Pokud bude buffer menší bude se také rychleji posílat výpočet efektivní hodnoty. 
      var BUFF_SIZE = 2048;

      var audioContext = new AudioContext();

      console.log("audio is starting up ...");

      var microphone_stream = null,
          gain_node = null,
          script_processor_get_audio_samples = null;


      // Dotaz na povolení přístupu k mikrofonu
      if (!navigator.getUserMedia)
              navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia){

          navigator.getUserMedia({audio:true}, 
            function(stream) {
                start_microphone(stream);
            },
            function(e) {
              alert('Error capturing audio.');
            }
          );

      } else { alert('getUserMedia not supported in this browser.'); }


      // Funkce pro zahajující naslouchání mikrofonu
      function start_microphone(stream){

        gain_node = audioContext.createGain();
        gain_node.connect( audioContext.destination );

        microphone_stream = audioContext.createMediaStreamSource(stream);

        script_processor_get_audio_samples = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_get_audio_samples.connect(gain_node);
        
        console.log("Sample rate of soundcard: " + audioContext.sampleRate);
        var fft = new FFT(BUFF_SIZE, audioContext.sampleRate);

        microphone_stream.connect(script_processor_get_audio_samples);

        // var bufferCount = 0;


        // Tato funkce se provede pokaždé když dojde k naplnění bufferu o velikosti 2048 vzorků.
        // Při vzorkovacím kmitočku 48 kHz se tedy zavolá jednou za cca 42 ms.
        script_processor_get_audio_samples.onaudioprocess = function(e) {
          
          var samples = e.inputBuffer.getChannelData(0);
          var rms_loudness_spectrum = 0;
          fft.forward(samples); //Vyypočtení fft ze vzorků.
          var spectrum = fft.spectrum; // Získání spektra o délce bufeer/2 v našem případě 1024 harmonických.
          
          

          // Zde se postupně sečte druhá mocnina všech 1024 vzorků.
          spectrum.forEach(element =>{
            rms_loudness_spectrum += Math.pow(element,2);
          });

          // Odmocnina součtu druhých mocnin nám dá efektivní hodnotu signálu "RMS"
          rms_loudness_spectrum = Math.sqrt(rms_loudness_spectrum);

          // Mapování efektivní hodnoty signálu na rozmezí 0-255 pro vhodný přenos dat.
          // Zde je zejmána nutné dobře nastavit mapovací prahy. Spodní pro odstranění šumu okolí a horní nám udává výslednou dynamiku.
          var out =  mapValue(rms_loudness_spectrum, 0.00001, 0.9, 0, 255)
                  
          console.log("spectrum avarge loudnes: "+ out);
          // console.log("spectrum avarge loudnes: "+ avarge_loudness_spectrum);
          handleControlSend(out);


          // if (bufferCount >= 5){
          //     bufferCount = 0;
          //     avarage_loudness = avarage_loudness/(BUFF_SIZE*6);
          //     avarge_loudness_spectrum = avarge_loudness_spectrum/(BUFF_SIZE*3);

          //     console.log("sample avarge loudnes: "+ mapValue(avarage_loudness,0.0005,0.05,0,255)); // This values set tresholds for noise and dynamics of signal.
          //     console.log("spectrum avarge loudnes: "+ mapValue(avarge_loudness_spectrum, 0.00001, 0.0001, 0, 255));
          //   } else {
          //     bufferCount++;
          // }
        };
      }

      function mapValue(x, in_min, in_max, out_min, out_max) {
        if (in_max == in_min) {
          return out_min / 2 + out_max / 2;
        }
    
        let minimum = Math.min(in_min, in_max);
        let maximum = Math.max(in_min, in_max);
    
        if (x < minimum) {
          x = minimum;
        } else if (x > maximum) {
          x = maximum;
        }
    
        let result = ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    
        minimum = Math.min(out_min, out_max);
        maximum = Math.max(out_min, out_max);
    
        if (result < minimum) {
          result = minimum;
        } else if (result > maximum) {
          result = maximum;
        }
    
        return result;
      }

  }();
  }

  control_percentage_range.oninput = handlePercentageValueChange;
  control_color_picker.onchange = handleColorValueChange;

  control_send.onclick = e => handleControlSend();
  control_sound.onclick = e => handleControlSound();

  const saveFile = document.querySelector("#saveFile");
  const loadFile = document.querySelector("#loadFile");

  saveFile.onclick = _ => {
    const zip = new JSZip();
    const data = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace));
    zip.file("version", "0.6.1");

    zip.file("content.xml", data);
    if (window.blockly_music) {
      zip.file("music.mp3", window.blockly_music);
    }
    // if (window.blockly_metronome) {
    //   zip.file("metronome.mp3", window.blockly_metronome);
    // }

    zip.generateAsync({ type: "blob", compression: "DEFLATE" }).then(function (content) {
      saveAs(content, document.querySelector("#filename").value.replace(/\.tgbl$/, "") + ".tgbl");
    });
  };

  loadFile.onclick = _ => {
    // Create once invisible browse button with event listener, and click it
    var selectFile = document.getElementById("select_file");
    if (selectFile === null) {
      var selectFileDom = document.createElement("INPUT");
      selectFileDom.type = "file";
      selectFileDom.id = "select_file";

      var selectFileWrapperDom = document.createElement("DIV");
      selectFileWrapperDom.id = "select_file_wrapper";
      selectFileWrapperDom.style.display = "none";
      selectFileWrapperDom.appendChild(selectFileDom);

      document.body.appendChild(selectFileWrapperDom);
      selectFile = document.getElementById("select_file");
      selectFile.addEventListener("change", e => parseInputXMLfile(e.target.files[0]), false);
    }
    selectFile.click();
  };

  // // MUSIC controls
  // wavesurfer.on('interaction', e => {
  //   if (!musicDebounce) {
  //     //Code.music.currentTime = wavesurfer.getCurrentTime()
  //     musicDebounce = true;
  //     setTimeout(_ => musicDebounce = false, 20)
  //   }
  // })

  // Code.music.onplay = _ => wavesurfer.play();
  // Code.music.onpause = _ => wavesurfer.pause();
  // Code.music.onstop = _ => wavesurfer.stop();

  setupOwnership();
};

function setupOwnership() {
  const owner_identifier = /** @type {HTMLInputElement} */ (document.querySelector("#owner_identifier"));
  const owner_signature = /** @type {HTMLInputElement} */ (document.querySelector("#owner_signature"));
  const owner_key = /** @type {HTMLInputElement} */ (document.querySelector("#owner_key"));

  owner_identifier.onchange = async e => {
    const encoder = new TextEncoder();
    const data = encoder.encode(owner_identifier.value);
    const hash = await crypto.subtle.digest("SHA-1", data);

    owner_signature.value = uint8ArrayToHexString(hash).slice(0, 32);
    owner_signature.onchange(null);
  };

  owner_signature.onchange = e => {
    try {
      Code.device.setOwnerSignature(owner_signature.value);

      // if event is not null, then the owner_signature was changed from the html input.
      // then erase owner_identifier
      if (e != null) {
        owner_identifier.value = "";
      }
    } catch {}

    owner_signature.value = Code.device.getOwnerSignature();

    console.log(`owner_signature: ${owner_signature.value}`);
  };

  owner_key.onchange = e => {
    try {
      Code.device.setOwnerKey(owner_key.value);
    } catch {}

    owner_key.value = Code.device.getOwnerKey();

    console.log(`owner_key: ${owner_key.value}`);
  };

  owner_identifier.onchange(null);
  owner_key.onchange(null);
}

function loadBlocksfromXmlDom(blocksXmlDom) {
  try {
    Blockly.Xml.domToWorkspace(blocksXmlDom, Code.workspace);
  } catch (e) {
    return false;
  }
  return true;
}

function replaceBlocksfromXml(blocksXml) {
  var xmlDom = null;
  try {
    xmlDom = Blockly.Xml.textToDom(blocksXml);
  } catch (e) {
    return false;
  }
  Code.workspace.clear();
  var sucess = false;
  if (xmlDom) {
    sucess = loadBlocksfromXmlDom(xmlDom);
  }
  return true;
}

// Create File Reader event listener function
const parseInputXMLfile = function (file) {
  const filename = file.name;
  document.querySelector("#filename").value = filename;
  JSZip.loadAsync(file).then(async function (zip) {
    const xmlContent = await zip.file("content.xml").async("text");
    const success = replaceBlocksfromXml(xmlContent);

    if (zip.file("music.mp3")) {
      window.blockly_music = await zip.file("music.mp3").async("blob");
      const music_url = URL.createObjectURL(window.blockly_music);
      // Code.music.setAttribute("src", music_url);
      wavesurfer.load(music_url);
    }

    if (zip.file("metronome.mp3")) {
      window.blockly_metronome = await zip.file("metronome.mp3").async("blob");
      // Code.music.setAttribute("src", URL.createObjectURL(window.blockly_music));
    }

    console.log("File " + filename + " is loaded");

    // console.log("Trying to upload tngl...");
    // Code.device.writeTngl();

    if (success) {
      Code.renderContent();
    } else {
      alert("Ooops something went wrong during load. Try again with another file.");
    }
  });
};

// Code.music.addEventListener("timeupdate", () => {
//   console.log("timeupdate");

//   if (!musicDebounce && Code.music.paused) {
//    Code.device.timeline.setMillis(Code.music.currentTime * 1000);
//     wavesurfer.setCurrentTime(Code.music.currentTime);
//     Code.device.syncTimeline();
//     musicDebounce = true
//     setTimeout(_ => musicDebounce = false, 20)
//   }
// });

document.getElementById("music").addEventListener("change", function () {
  var url = URL.createObjectURL(this.files[0]);
  window.blockly_music = this.files[0];
  // Code.music.setAttribute("src", url);
  wavesurfer.load(url);

  Code.device.timeline.pause();
  Code.device.timeline.setMillis(wavesurfer.getCurrentTime() * 1000);
  Code.device.syncTimeline();
});

function getHexColor(colorStr) {
  const a = document.createElement("div");
  a.style.color = colorStr;
  const colors = window
    .getComputedStyle(document.body.appendChild(a))
    .color.match(/\d+/g)
    .map(function (a) {
      return parseInt(a, 10);
    });
  document.body.removeChild(a);
  return colors.length >= 3 ? "#" + ((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1) : false;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
}

function lum(hex) {
  var rgb = hexToRgb(hex);

  if ((rgb[0] > 200 && rgb[1] > 200 && rgb[2] > 200) || (rgb[0] > 140 && rgb[1] > 215 && rgb[2] > 140) || (rgb[1] > 220 && (rgb[0] > 120 || rgb[2] > 120))) {
    return "#000000";
  }

  return "#ffffff";
}

document.body.ondrop = function (e) {
  console.log("ondrop", e);
  e.preventDefault();
};

function handleFileDrop(e) {
  console.log("ondrop", e);
  console.log(e.dataTransfer.files);
  parseInputXMLfile(e.dataTransfer.files[0]);
  e.preventDefault();
}

document.querySelector("#filename").ondrop = handleFileDrop;
document.querySelector("#loadFile").ondrop = handleFileDrop;
document.querySelector("#saveFile").ondrop = handleFileDrop;
//document.querySelector(".blocklySvg").ondrop = handleFileDrop; // This doesn't work
