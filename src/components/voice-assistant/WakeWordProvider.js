import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import * as ort from "onnxruntime-web"

ort.env.wasm.wasmPaths = {
  "ort-wasm-simd-threaded.wasm": process.env.PUBLIC_URL + "/ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd.wasm": process.env.PUBLIC_URL + "/ort-wasm-simd.wasm",
  "ort-wasm.wasm": process.env.PUBLIC_URL + "/ort-wasm.wasm",
  "ort-wasm-threaded.wasm": process.env.PUBLIC_URL + "/ort-wasm-threaded.wasm",
};

export default function WakeWordProvider({ onListen, pause }) {
  const [sampleRate, setSampleRate] = useState(null);

  navigator.getUserMedia = (
    navigator.getUserMedia || 
    navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia
  );

  const websocketURL = `${process.env.REACT_APP_API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/open_wake_word`;

  const {
    sendMessage,
    readyState
  } = useWebSocket(
    websocketURL, 
    {
      onOpen: () => console.log('WebSocket connection is open'),
      onClose: () => console.log('WebSocket connection is closed'),
      onMessage: message => {
        console.log('message', message)
        const model_payload = JSON.parse(message.data);

        const {
          loaded_models,
          activations
        } = model_payload;

        if (loaded_models) {
          console.log('loaded_models', loaded_models)
        }

        if(activations) {
          console.log('activations', activations)
          if(!pause) onListen();
        }
      },
      shouldReconnect: closeEvent => true,
    }
  );

  useEffect(() => {
    if(sampleRate && readyState === 1) {
      sendMessage(sampleRate);
    }
  }, [sampleRate, readyState]);

  useEffect(() => {
    // Create microphone capture stream for 16-bit PCM audio data
    if (navigator.getUserMedia) { 
      navigator.getUserMedia(
        { audio: true },
        stream => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const volume = audioContext.createGain();

          setSampleRate(audioContext.sampleRate);
          
          const audioInput = audioContext.createMediaStreamSource(stream);
          audioInput.connect(volume);

          const bufferSize = 4096;
          const recorder = (audioContext.createScriptProcessor || audioContext.createJavaScriptNode).call(audioContext, bufferSize, 1, 1);

          recorder.onaudioprocess = (event) => {
            const samples = event.inputBuffer.getChannelData(0);
            const PCM16iSamples = samples.map(sample => {
              let val = Math.floor(32767 * sample);
              return (
                Math.min(
                  32767, 
                  Math.max(-32768, val)
                )
              );
            });

            // Push audio to websocket
            const int16Array = new Int16Array(PCM16iSamples);
            const blob = new Blob([int16Array], { type: 'application/octet-stream' });
            sendMessage(blob);
          };

          volume.connect(recorder);
          recorder.connect(audioContext.destination);
        },
        error => console.error('Error capturing audio:', error)
      )
    };
  }, []);
};