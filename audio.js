
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

}(); //  webaudio_tooling_obj = function()

// This function is copied from tangle.js Functions
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
