export const speak = (text: string) => {
  if ("speechSynthesis" in window) {
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find((v) => v.lang === "vi-VN");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = vietnameseVoice || null;
    utterance.lang = "vi-VN";
    utterance.rate = 1.7;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }
};
