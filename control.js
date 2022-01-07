const saveFile = document.querySelector("#saveFile");
const loadFile = document.querySelector("#loadFile");

function file_download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
saveFile.onclick = (_) => {
  var zip = new JSZip();
  const data = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace));
  zip.file("version", "0.5.3");

  zip.file("content.xml", data);
  if (window.blockly_music) {
    zip.file("music.mp3", window.blockly_music);
  }
  if (window.blockly_metronome) {
    zip.file("metronome.mp3", window.blockly_metronome);
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, document.querySelector("#filename").value.replace(/\.tgbl$/, "") + ".tgbl");
  });
  // file_download(Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Code.workspace)), 'BlocklyLCF.xml', 'text/plain;charset=utf-8');
};

loadFile.onclick = (_) => {
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
  var parseInputXMLfile = function (e) {
    var file = e.target.files[0];
    var filename = file.name;

    console.log("Loading file " + filename + "...");

    document.querySelector("#filename").value = filename;
    JSZip.loadAsync(file).then(async function (zip) {
      console.log("Loading blocks...");

      var xmlContent = await zip.file("content.xml").async("text");
      const success = replaceBlocksfromXml(xmlContent);

      console.log("Loading music...");

      if (zip.file("music.mp3")) {
        window.blockly_music = await zip.file("music.mp3").async("blob");
        Code.music.setAttribute("src", URL.createObjectURL(window.blockly_music));
      }

      console.log("Loading metronome...");

      if (zip.file("metronome.mp3")) {
        window.blockly_metronome = await zip.file("metronome.mp3").async("blob");
        Code.metronome.setAttribute("src", URL.createObjectURL(window.blockly_metronome));
      }

      if (success) {
        Code.renderContent();

        console.log("File " + filename + " is loaded");
      } else {
        alert("Ooops something went wrong during load. Try again with another file.");
      }
    });
  };

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
    selectFile.addEventListener("change", parseInputXMLfile, false);
  }
  selectFile.click();
};


window.onload = function () {
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

  window.wavesurfer.on("seek", () => {
    Code.music.currentTime = window.wavesurfer.getCurrentTime();
  });
};

