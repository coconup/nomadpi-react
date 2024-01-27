import { useState, useEffect, useRef, useCallback } from 'react';
import * as ort from "onnxruntime-web"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useMicVAD, utils } from "@ricky0123/vad-react";

import { getRandomArrayElement } from '../../utils';

import axios from 'axios';

ort.env.wasm.wasmPaths = {
  "ort-wasm-simd-threaded.wasm": process.env.PUBLIC_URL + "/ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd.wasm": process.env.PUBLIC_URL + "/ort-wasm-simd.wasm",
  "ort-wasm.wasm": process.env.PUBLIC_URL + "/ort-wasm.wasm",
  "ort-wasm-threaded.wasm": process.env.PUBLIC_URL + "/ort-wasm-threaded.wasm",
};

export default function VoiceAssistantPipeline() {
  const [listening, setListening] = useState(false);
  const [processFile, setProcessFile] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [commands, setCommands] = useState([]);
  const [completedCommands, setCompletedCommands] = useState([]);
  const [audioAssets, setAudioAssets] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [ttsPrompts, setTtsPrompts] = useState([]);
  const [completedTtsPrompts, setCompletedTtsPrompts] = useState([]);
  const [commandConfirmations, setCommandConfirmations] = useState([]);

  useEffect(() => {
    const loadAudioAssets = async () => {
      console.log('loading audio assets')

      const audioAssetCategories = ["on_enter", "on_timeout", "on_processing", "on_error"];
      const audioAssetsBaseFolder = "/voice_assistant";

      const result = {};

      const fileExists = async (filePath, fileType) => {
        return await fetch(filePath).then(async (response) => {
          try {
            const blob = await response.blob();
            return blob.type === fileType;
          } catch(err) {
            return false  
          }
        });
      };

      const files = await Promise.all(
        audioAssetCategories.map(async (category) => {
          const categoryFiles = [];
          let fileIndex = 1;

          while (true) {
            const fileName = `${category}_${fileIndex}.mp3`;
            const customFilePath = process.env.PUBLIC_URL + `${audioAssetsBaseFolder}/custom/${fileName}`;
            const defaultFilePath = process.env.PUBLIC_URL + `${audioAssetsBaseFolder}/default/${fileName}`;
            
            if (await fileExists(customFilePath, 'audio/mpeg')) {
              categoryFiles.push(customFilePath);
              fileIndex++;
            } else {
              if (await fileExists(defaultFilePath, 'audio/mpeg')) {
                categoryFiles.push(defaultFilePath);
                fileIndex++;
              } else {
                break;
              }
            }
          }

          return {
            category,
            categoryFiles
          }
        })
      );

      files.forEach(({ category, categoryFiles }) => {
        result[category] = categoryFiles
      });

      setAudioAssets(result);
    }

    loadAudioAssets();
  }, []);

  console.log('audioAssets', audioAssets)

  const onTimeout = () => {
    console.log('timed out');
    setListening(false);
    setAudioFiles([getRandomArrayElement(audioAssets.on_timeout)]);
  }

  const onError = () => {
    setAudioFiles([getRandomArrayElement(audioAssets.on_error)]);
  }

  console.log('audioFiles', audioFiles)
  console.log('commandConfirmations', commandConfirmations)
  console.log('commands', commands)

  const completeCommand = useCallback(command => {
    setCompletedCommands((prevCompletedCommands) => (
      [
        ...prevCompletedCommands,
        command
      ]
    ));
  }, [completedCommands]);

  const addCommandConfirmation = useCallback(command => {
    setCommandConfirmations((prevCommandConfirmations) => (
      [
        ...prevCommandConfirmations,
        command
      ]
    ));
  }, [commandConfirmations]);

  if(commands.length > 0 && commands.every(command => !!completedCommands.find(c => command.index === c.index))) {
    setCommands([]);
    setCompletedCommands([]);
  };

  const addTtsPrompt = useCallback(text => {
    setTtsPrompts((prevTtsPrompts) => (
      [
        ...prevTtsPrompts,
        {
          text,
          index: prevTtsPrompts.length
        }
      ]
    ));
  }, [ttsPrompts]);

  const completeTtsPrompt = useCallback(ttsPrompt => {
    setCompletedTtsPrompts((prevTtsPrompts) => (
      [
        ...prevTtsPrompts,
        ttsPrompt
      ]
    ));
  }, [completedTtsPrompts]);

  const addAudioFile = useCallback(url => {
    setAudioFiles((prevAudioFiles) => (
      [
        ...prevAudioFiles,
        url
      ]
    ));
  }, [audioFiles]);

  if(ttsPrompts.length > 0 && ttsPrompts.every(ttsPrompt => !!completedTtsPrompts.find(p => ttsPrompt.index === p.index))) {
    setTtsPrompts([]);
    setCompletedTtsPrompts([]);
  };

  if(!!audioAssets) {
    return (
      <span>
        <WakeWordProvider
          onListen={() => {
            setAudioFiles([...audioFiles, getRandomArrayElement(audioAssets.on_enter)])
            setListening(true)
          }}
          pause={listening || processFile}
        />
        <AudioPlayer
          audioTrack={audioFiles[0]}
          onError={() => {
            setAudioFiles(audioFiles.slice(1));
            onError();
          }}
          onTrackEnd={() => {
            setAudioFiles(audioFiles.slice(1));
          }}
        />
        {
          listening && audioFiles.length === 0 && (
            <VadProvider
              onTimeout={onTimeout}
              onSpeechEnd={(blob) => {
                setProcessFile(blob);
                setListening(false);
              }}
            />
          )
        }
        {
          processFile && (
            <WhisperProvider
              file={processFile}
              onError={() => {
                setProcessFile(null);
                onError();
              }}
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
              onProcessing={() => addAudioFile(getRandomArrayElement(audioAssets.on_processing))}
              onError={() => {
                setPrompt(null);
                onError();
              }}
              onResponse={({ data }) => {
                setPrompt(null);
                setCommands(data.data.map((command, index) => ({ ...command, index })));
              }}
            />
          )
        }
        {
          commands.map((command) => {
            return (
              <ButterflyProvider
                key={`command-${command.index}`}
                command={command}
                onError={() => {
                  completeCommand(command);
                  onError();
                }}
                onResponse={({ data }) => {
                  completeCommand(command);
                  if(typeof data.data === 'string') {
                    addTtsPrompt(data.data);
                  } else {
                    addCommandConfirmation(command);
                  }
                }}
              />
            )
          })
        }
        {
          commands.length === 0 && commandConfirmations.length > 0 && (
            <ButterflyProvider
              commandConfirmations={commandConfirmations}
              onError={() => {
                setCommandConfirmations([]);
                onError();
              }}
              onResponse={({ data }) => {
                setCommandConfirmations([]);
                addTtsPrompt(data.data);
              }}
            />
          )
        }
        {
          ttsPrompts.map((ttsPrompt) => {
            return (
              <VoiceProvider
                key={`tts-prompt-${ttsPrompt.index}`}
                prompt={ttsPrompt}
                onError={() => {
                  completeTtsPrompt(ttsPrompt);
                  onError();
                }}
                onResponse={url => {
                  completeTtsPrompt(ttsPrompt);
                  addAudioFile(url);
                }}
              />
            )
          })
        }
      </span>
    )
  }
}

const WakeWordProvider = ({ onListen, pause }) => {
  const websocketURL = `${process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, 'ws://')}/ws/open_wake_word`;

  const {
    sendMessage,
    readyState
  } = useWebSocket(
    websocketURL, 
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

const VadProvider = ({ onSpeechEnd, onTimeout }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isSpeaking) {
      const timeoutId = setTimeout(onTimeout, 5000);
      console.log('setting timeout', timeoutId)

      // Clean up the timeout if isSpeaking becomes 
      // false before the timeout completes
      return () => {
        console.log('clearing timeout')
        clearTimeout(timeoutId);
      };
    }
  }, [isSpeaking]);

  useMicVAD({
    graphOptimizationLevel: 'disabled',
    workletURL: process.env.PUBLIC_URL + '/vad.worklet.bundle.min.js',
    modelURL: process.env.PUBLIC_URL + '/silero_vad.onnx',
    onVADMisfire: () => {
      setIsSpeaking(false);
      console.log("Vad misfire")
    },
    onSpeechStart: () => {
      setIsSpeaking(true);
      console.log("Speech start")
    },
    onSpeechEnd: (audio) => {
      console.log("Speech end")
      const wavBuffer = utils.encodeWAV(audio);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      onSpeechEnd(blob);
    },
  });
};

const WhisperProvider = ({ file, onTranscript, onError }) => {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (processing) {
      const timeoutId = setTimeout(onError, 10000);
      console.log('setting whisper timeout', timeoutId);

      return () => {
        console.log('clearing whisper timeout')
        clearTimeout(timeoutId);
      };
    }
  }, [processing]);

  useEffect(() => {
    const whisper = async () => {
      console.log('processing audio')
      setProcessing(true);
      let response;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

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
        onError();
        return
      }

      onTranscript(response)
    }

    if(file) {
      whisper();
    };
  }, [file]);
}

const ButterflyProvider = ({ prompt, command, commandConfirmations, onProcessing=()=>{}, onError, onResponse }) => {
  const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/butterfly`;

  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (processing && !processed) {
      const timeoutId = setTimeout(onError, 10000);
      console.log('setting butterfly timeout', timeoutId);

      return () => {
        console.log('clearing butterfly timeout')
        clearTimeout(timeoutId);
      };
    }
  }, [processing, processed]);

  useEffect(() => {
    const butterfly = async () => {
      console.log('calling butterfly', prompt || command || commandConfirmations)
      setProcessing(true);
      setProcessed(false);
      onProcessing();

      let url;
      let payload;

      if(prompt) {
        url = `${baseUrl}/engine/intent`;
        payload = { prompt };
      } else if (command) {
        const {
          original_prompt,
          service_id,
          function_name,
          function_arguments: body
        } = command;

        url = `${baseUrl}/services/${service_id}/${function_name}`;
        payload = {
          original_prompt,
          ...body
        };
      } else if(commandConfirmations) {
        url = `${baseUrl}/engine/command_confirmation`;
        payload = { commands: commandConfirmations };
      }

      try {
        const response = await axios.post(
          url,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('butterfly response', response);
        onResponse(response);
        setProcessed(true);
      } catch (error) {
        console.error('Error calling Butterfly API:', error);
        onError();
        setProcessed(true);
      }
    };

    if(prompt || command || commandConfirmations) {
      butterfly();
    };
  }, [prompt, command, commandConfirmations]);
}

const AudioPlayer = ({ audioTrack, onTrackEnd, onError }) => {
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (audioTrack) {
      audioRef.current.src = audioTrack;
      audioRef.current.play().then(() => {
        // ...
      }).catch((error) => {
        onError();
      });
    }
  }, [audioTrack]);

  useEffect(() => {
    audioRef.current.addEventListener('ended', onTrackEnd);

    return () => {
      audioRef.current.removeEventListener('ended', onTrackEnd);
    };
  }, [onTrackEnd]);
};

const VoiceProvider = ({ prompt, onError, onResponse }) => {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (processing) {
      const timeoutId = setTimeout(onError, 15000);
      console.log('setting elevenlabs timeout', timeoutId);

      return () => {
        console.log('clearing elevenlabs timeout')
        clearTimeout(timeoutId);
      };
    }
  }, [processing]);

  useEffect(() => {
    const elevenlabs = async () => {
      try {
        const response = await axios.post(
          'https://api.elevenlabs.io/v1/text-to-speech/JFEEeeDJFfkQ7CFhBTSM', 
          {
            text: prompt.text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.8,
              similarity_boost: 0.2,
              style: 0.5,
              use_speaker_boost: true
            }
          },
          { 
            headers: {
              accept: 'audio/mpeg',
              contentType: 'application/json',
              'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY
            },
            responseType: 'blob'
          }
        );
        
        const url = URL.createObjectURL(response.data);
        onResponse(url);
      } catch (error) {
        console.error('Error downloading audio file:', error);
        onError();
      }
    }

    if(prompt) {
      elevenlabs();
    };
  }, [prompt]);
};