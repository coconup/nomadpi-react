import { useState, useEffect } from 'react';
import { useMicVAD, utils } from "@ricky0123/vad-react";

export default function VadProvider({ onSpeechEnd, onTimeout }) {
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