const THEME_DARKMODE = () => {
  setTimeout(() => {
    document.querySelector("#content_blocks > div > div").style.background = "#333"
    // document.querySelector("#waveform_container").style.background = "#111"
    document.querySelector("table").style.background = "#111"
    // document.querySelector(".tab_collapse").style.background = "#111"
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        color: #fff !important;
      }
      .tab_collapse {
        background: #333 !important;
        color: #fff !important;
        // border:0 !important;
      }
      .tab_collapse td {
        border-radius: 5px !important;
        overflow: hidden !important;
      }
      .tabon {
        background: #555 !important;
      }
      textarea {
        background: #333 !important;
        color: #fff !important;
      }
      #content_control {
        background: #333 !important;
      }
      body > table > tbody > tr:nth-child(1) > td:nth-child(1) > img {
        filter: invert();
      }
    `;
    document.head.appendChild(style);
  }, 0)

  return Blockly.Theme.defineTheme('dark', {
    // 'base': Blockly.Themes.Classic,
    'componentStyles': {
      'workspaceBackgroundColour': '#1e1e1e',
      'toolboxBackgroundColour': 'blackBackground',
      'toolboxForegroundColour': '#fff',
      'flyoutBackgroundColour': '#252526',
      'flyoutForegroundColour': '#ccc',
      'flyoutOpacity': 1,
      'scrollbarColour': '#797979',
      'insertionMarkerColour': '#fff',
      'insertionMarkerOpacity': 0.3,
      'scrollbarOpacity': 0.4,
      'cursorColour': '#d0d0d0',
      'blackBackground': '#333',
    },
  });
}

document.querySelector("body > table > tbody > tr:nth-child(1) > td:nth-child(1) > img").onclick = () => {
  // toggle darkmode in localstorage
  const darkmode = localStorage.getItem("darkmode")
  if (darkmode) {
    localStorage.removeItem("darkmode")
  }
  else {
    localStorage.setItem("darkmode", "true")
  }
  window.location.reload()

}

// disable eventListeners
