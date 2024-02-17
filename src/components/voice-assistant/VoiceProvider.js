import { useState, useEffect } from 'react';
import axios from 'axios';

import { useSelector } from 'react-redux';
import {
  selectServiceCredentials,
  selectSetting
} from '../../app/store';

export default function VoiceProvider({ prompt, onError, onResponse }) {
  const elevenLabsCredentials = useSelector(selectServiceCredentials('eleven-labs'));
  const { api_key: elevenLabsApiKey } = elevenLabsCredentials.value || {};

  const voiceAssistantVoiceIdSetting = useSelector(selectSetting('voice_assistant_voice_id')) || {};
  const voiceId = voiceAssistantVoiceIdSetting.value;

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
            timeout: 20000,
            headers: {
              accept: 'audio/mpeg',
              contentType: 'application/json',
              'xi-api-key': elevenLabsApiKey
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