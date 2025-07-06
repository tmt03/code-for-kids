// Quản lý âm thanh cho ứng dụng
const SOUND_CONFIG = {
  volume: 0.6, // Âm lượng mặc định
};

// Cache audio elements
const audioCache = new Map<string, HTMLAudioElement>();

// Tạo audio element
const createAudio = (soundName: string): HTMLAudioElement => {
  // Map tên logic sang tên file thật
  const fileMap: Record<string, string> = {
    success: "success_1",
    fail: "fail_1",
    error: "error_1",
  };
  const file = fileMap[soundName] || soundName;
  const audio = new Audio(`/sounds/${file}.mp3`);
  audio.volume = SOUND_CONFIG.volume;
  audio.preload = "auto";
  return audio;
};

// Lấy audio từ cache hoặc tạo mới
const getAudio = (soundName: string): HTMLAudioElement => {
  if (!audioCache.has(soundName)) {
    audioCache.set(soundName, createAudio(soundName));
  }
  return audioCache.get(soundName)!;
};

// Phát âm thanh
export const playSound = (soundName: "success" | "fail" | "error") => {
  try {
    const audio = getAudio(soundName);

    // Reset audio về đầu
    audio.currentTime = 0;

    // Phát âm thanh
    audio.play().catch((error) => {
      console.warn(`Failed to play sound ${soundName}:`, error);
    });
  } catch (error) {
    console.warn(`Error playing sound ${soundName}:`, error);
  }
};

// Dừng tất cả âm thanh
export const stopAllSounds = () => {
  audioCache.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
};

// Thay đổi âm lượng
export const setSoundVolume = (volume: number) => {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  SOUND_CONFIG.volume = clampedVolume;

  audioCache.forEach((audio) => {
    audio.volume = clampedVolume;
  });
};

// Bật/tắt âm thanh
export const toggleSound = (enabled: boolean) => {
  const volume = enabled ? SOUND_CONFIG.volume : 0;
  setSoundVolume(volume);
};
