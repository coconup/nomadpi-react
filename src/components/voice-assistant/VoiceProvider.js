import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VoiceProvider({ prompt, onError, onResponse, voiceId="JFEEeeDJFfkQ7CFhBTSM" }) {
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
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, 
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