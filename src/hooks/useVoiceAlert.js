import { useState, useRef, useCallback } from 'react';

const useVoiceAlert = () => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const synth = window.speechSynthesis;

  const speak = useCallback((message, priority = 'normal') => {
    if (!isVoiceEnabled || !synth) return;
    
    // Stop ongoing speech for urgent alerts
    if (priority === 'urgent') {
        synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.volume = 1;
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1;
    
    synth.speak(utterance);
  }, [isVoiceEnabled, synth]);

  const toggleVoice = () => setIsVoiceEnabled(prev => !prev);
  
  const playSound = (type = 'chime') => {
      // Placeholder for actual sound playback
      // const audio = new Audio('/sounds/chime.mp3');
      // audio.play().catch(e => console.log('Audio play failed', e));
      console.log(`Playing sound: ${type}`);
  }

  return { speak, playSound, isVoiceEnabled, toggleVoice };
};

export default useVoiceAlert;
