

// var { clearBackground, drawLine, drawGraph } = import("./graph.js");

class NoiseCancellationSimulator {
  constructor() {
    // this._canvas = document.querySelector(".noise-cancellation-canvas");
    this.isPlaying = false;
    this._outputWave = true;
    this._outputAntiWave = true;
    this._antiWaveAmplitude = 100.0; // Reduction level
    this._antiWavePhase = 0;

    this._microphoneStream = null;
    this._microphone = null;
    // this.audio = new Audio(`./media/0${Math.floor(Math.random() * 4) + 1}_Hekmate_Sadraei_Asalate_Vojood_aminikhaah.ir.mp3`);
    this.audio = null;
    this.loading = null;
  }

  create(src) {
    this.audio = new Audio(src);
    this.loading = new Promise(resolve => {
      this.audio.addEventListener('canplaythrough', resolve, false);

    });

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  }

  async play() {


    this.analyser1 = this.audioCtx.createAnalyser();
    this.analyser2 = this.audioCtx.createAnalyser();

    await this._initMicrophone();
    await this._initNoiseReducer();

    this._microphone.connect(this.noiseReducer);
    this.noiseReducer.connect(this.audioCtx.destination)

    if (this._outputWave) {
      this._microphone.connect(this.analyser1);
    }

    if (this._outputAntiWave) {
      this.noiseReducer.connect(this.analyser2);
    }
    requestAnimationFrame(i => this.audio.play())
    // this.visualize();
  }

  async _initMicrophone() {
    // initUserMediaFromBrowser();
    // if (!navigator.mediaDevices.getUserMedia) {
    //   console.log("getUserMedia not supported on your browser!");
    // }
    // let constraints = { audio: true };
    // this._microphoneStream = await navigator.mediaDevices.getUserMedia(
    //   constraints
    // );

    this._microphoneStream = this.audio.captureStream();
    this._microphone = this.audioCtx.createMediaStreamSource(
      this._microphoneStream
    );

  }

  async _initNoiseReducer() {
    await this.audioCtx.audioWorklet.addModule("./src/NoiseCancellationProcessor.js");
    this.noiseReducer = new AudioWorkletNode(
      this.audioCtx,
      "noise-cancellation-processor"
    );

    this.antiWaveAmplitude = this._antiWaveAmplitude;
    this.antiWavePhase = this._antiWavePhase;
  }

  stop() {
    this._disconnectMicrophone();
    this._disconnectNoiseReducer();
    window.cancelAnimationFrame(this.drawHandler);
    requestAnimationFrame(i => this.audio.pause())
  }

  _disconnectMicrophone() {
    this._microphoneStream.getTracks().forEach(function (track) {
      track.stop();
    });
    this._microphone.disconnect();
  }

  _disconnectNoiseReducer() {
    this.noiseReducer.disconnect();
  }

  async toggle() {
    await this.loading;

    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  set outputWave(value) {
    this._outputWave = value;
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  set outputAntiWave(value) {
    this._outputAntiWave = value;
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  set antiWavePhase(value) {
    this._antiWavePhase = value
    const phaseParam = this.noiseReducer.parameters.get('phase')
    phaseParam.setValueAtTime(this._antiWavePhase, this.audioCtx.currentTime)
  }

  set antiWaveAmplitude(value) {
    this._antiWaveAmplitude = value
    const amplitudeParam = this.noiseReducer.parameters.get('amplitude')
    amplitudeParam.setValueAtTime(this._antiWaveAmplitude, this.audioCtx.currentTime)
  }

  visualize() {
    this.analyser1.fftSize = 2048;
    this.analyser2.fftSize = 2048;
    var bufferLength = this.analyser1.fftSize;
    var buffer1 = new Uint8Array(bufferLength);
    var buffer2 = new Uint8Array(bufferLength);

    // clearBackground(this._canvas);

    this.draw = function () {
      // this.drawHandler = requestAnimationFrame(this.draw);
      // clearBackground(this._canvas);
      // if (this._outputWave) {
      //   this.analyser1.getByteTimeDomainData(buffer1);
      //   drawLine(this._canvas, bufferLength, buffer1, false, "blue");
      // }
      // if (this._outputAntiWave) {
      //   this.analyser2.getByteTimeDomainData(buffer2);
      //   drawLine(this._canvas, bufferLength, buffer2, false, "red");
      // }
    }.bind(this); // nice solution for requestAnimationFrame + this:  https://stackoverflow.com/a/32834390
    this.draw();
  }
}

export default NoiseCancellationSimulator;