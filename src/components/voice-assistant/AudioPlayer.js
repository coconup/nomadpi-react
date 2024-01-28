import { useRef, useEffect } from 'react';

export default function AudioPlayer({ audioTrack, onTrackEnd, onError }) {
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