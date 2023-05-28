import React from 'react';
import logo from './logo.svg';
import './App.css';
import NoiseCancellationProcessor from './libs/NoiseCancellationProcessor';
import NoiseCancellationSimulator from './libs/noise-cancellation';

let noiseCancellation = new NoiseCancellationSimulator();
console.log(noiseCancellation)
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}

        <input type='file' id="audio-input" name="audio" accept=".mp3" onChange={(e) => {
          //@ts-ignore
          const urlObj = URL.createObjectURL(e.target.files[0]);
          noiseCancellation.create(urlObj)
        }} />

        <input type="range" min="0" max="180" step="1" defaultValue="0"
          //@ts-ignore
          onInput={(e) => noiseCancellation.antiWavePhase = +e.target.value} style={{ width: "500px" }} />

        <input type="range" min="0" max="100" step="0.5" defaultValue="100"
          //@ts-ignore
          onInput={(e) => noiseCancellation.antiWaveAmplitude = +e.target.value} style={{ width: "500px" }} />

        <p onClick={() => {
          noiseCancellation.toggle()
        }}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div >
  );
}

export default App;
