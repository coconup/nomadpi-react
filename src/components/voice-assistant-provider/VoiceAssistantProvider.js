import { useState, useEffect } from 'react';

import * as ort from "onnxruntime-web"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useMicVAD, utils } from "@ricky0123/vad-react"

import axios from 'axios';

ort.env.wasm.wasmPaths = {
  "ort-wasm-simd-threaded.wasm": process.env.PUBLIC_URL + "/ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd.wasm": process.env.PUBLIC_URL + "/ort-wasm-simd.wasm",
  "ort-wasm.wasm": process.env.PUBLIC_URL + "/ort-wasm.wasm",
  "ort-wasm-threaded.wasm": process.env.PUBLIC_URL + "/ort-wasm-threaded.wasm",
};

export default function VoiceAssistantPipeline() {
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [processFile, setProcessFile] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [commands, setCommands] = useState([]);

  // Set a timeout of 5s in case nothing
  // is said after the wake word.
  useEffect(() => {
    const handleTimeout = () => {
      console.log('timed out')
      setListening(false);
      setIsSpeaking(false);
    };

    if (!isSpeaking && listening) {
      const timeoutId = setTimeout(handleTimeout, 5000);
      console.log('setting timeout', timeoutId)

      // Clean up the timeout if isSpeaking becomes 
      // false before the timeout completes
      return () => {
        console.log('clearing timeout')
        clearTimeout(timeoutId);
      };
    }
  }, [isSpeaking, listening]); 

  return (
    <span>
      <WakeWordProvider
        onListen={() => setListening(true)}
        pause={listening || processFile}
      />
      {
        listening && (
          <VadProvider 
            onSpeechStart={() => setIsSpeaking(true)}
            onSpeechEnd={(blob) => {
              setProcessFile(blob);
              setListening(false);
              setIsSpeaking(false);
            }}
          />
        )
      }
      {
        processFile && (
          <WhisperProvider
            file={processFile}
            onTranscript={({ data }) => {
              setProcessFile(null);
              setPrompt(data.text);
            }}
          />
        )
      }
      {
        prompt && (
          <ButterflyProvider
            prompt={prompt}
            onResponse={({ data }) => {
              setPrompt(null);
              setCommands(data.data);
            }}
          />
        )
      }
      {
        commands.map((command, i) => {
          return (
            <ButterflyProvider
              key={`command-${i}`}
              command={command}
              onResponse={({ data }) => {
                setCommands(commands.filter(c => JSON.stringify(c) !== JSON.stringify(command)));
              }}
            />
          )
        })
      }
    </span>
  )
}

const WakeWordProvider = ({ onListen, pause }) => {
  const {
    sendMessage,
    readyState
  } = useWebSocket(
    'ws://localhost:9002/ws', 
    {
      onOpen: () => console.log('WebSocket connection is open'),
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
    navigator.getUserMedia = (
      navigator.getUserMedia || 
      navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia || 
      navigator.msGetUserMedia
    );

    // Create microphone capture stream for 16-bit PCM audio data
    if (navigator.getUserMedia) { 
      navigator.getUserMedia(
        { audio: true },
        stream => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const volume = audioContext.createGain();

          sendMessage(audioContext.sampleRate);
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
    }
  }, []);
};

const VadProvider = ({ onSpeechStart, onSpeechEnd }) => {
  useMicVAD({
    graphOptimizationLevel: 'disabled',
    workletURL: process.env.PUBLIC_URL + '/vad.worklet.bundle.min.js',
    modelURL: process.env.PUBLIC_URL + '/silero_vad.onnx',
    onVADMisfire: () => {
      console.log("Vad misfire")
    },
    onSpeechStart: () => {
      console.log("Speech start")
      onSpeechStart();
    },
    onSpeechEnd: (audio) => {
      console.log("Speech end")
      const wavBuffer = utils.encodeWAV(audio);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      onSpeechEnd(blob);
    },
  });
};

const WhisperProvider = ({ file, onTranscript }) => {
  useEffect(() => {
    const whisper = async () => {
      console.log('processing audio')
      let response;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'whisper-1');

      try {
        response = await axios.post(
          'https://api.openai.com/v1/audio/transcriptions',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Transcript:', response);
      } catch (error) {
        console.error('Error calling OpenAI Whisper API:', error);
        response = error;
      }

      onTranscript(response)
    }

    if(file) {
      whisper();
    };
  }, [file]);
}

const ButterflyProvider = ({ prompt, command, onResponse }) => {
  useEffect(() => {
    const butterfly = async () => {
      let response;

      if(prompt) {
        console.log('prompting butterfly')
        try {
          response = await axios.post(
            'http://localhost:3005/engine/intent',
            { prompt },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Butterfly:', response);
        } catch (error) {
          console.error('Error calling Butterfly API:', error);
          response = error;
        }
      } else if(command) {
        console.log('posting to butterfly service')
        const {
          service_id,
          function_name,
          function_arguments: body
        } = command;

        try {
          response = await axios.post(
            `http://localhost:3005/services/${service_id}/${function_name}`,
            body,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Butterfly:', response);
        } catch (error) {
          console.error('Error calling Butterfly API:', error);
          response = error;
        }
      }

      onResponse(response)
    }

    if(prompt || command) {
      butterfly();
    };
  }, [prompt, command]);
}