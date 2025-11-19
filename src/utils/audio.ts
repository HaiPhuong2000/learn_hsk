export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN'; // Set language to Chinese
  utterance.rate = 0.8; // Slightly slower rate for learners

  // Try to find a Chinese voice
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(voice => voice.lang.includes('zh'));
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  window.speechSynthesis.speak(utterance);
};
