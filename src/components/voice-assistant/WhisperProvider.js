import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WhisperProvider({ file, onTranscript, onError }) {
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