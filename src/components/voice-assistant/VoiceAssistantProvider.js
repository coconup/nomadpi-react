import { useState, useEffect, useCallback } from 'react';
import { getRandomArrayElement } from '../../utils';

import AudioPlayer from './AudioPlayer';
import ButterflyProvider from './ButterflyProvider';
import VadProvider from './VadProvider';
import VoiceProvider from './VoiceProvider';
import WakeWordProvider from './WakeWordProvider';
import WhisperProvider from './WhisperProvider';

export default function VoiceAssistantProvider() {
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
};