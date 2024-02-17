import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { selectServiceCredentials } from '../../app/store';

export default function WhisperProvider({ file, onTranscript, onError }) {
  const openAiCredentials = useSelector(selectServiceCredentials('open-ai'));
  const { api_key: openAiApiKey } = openAiCredentials.value || {};

  useEffect(() => {
    const whisper = async () => {
      console.log('processing audio')
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
            timeout: 10000,
            headers: {
              'Authorization': `Bearer ${openAiApiKey}`,
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