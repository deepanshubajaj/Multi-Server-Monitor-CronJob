'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import splashAudio from '../../src/assets/YesM.mp3';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleScreenClick = () => {
    if (audioRef.current) {
      // Reset audio to start
      audioRef.current.currentTime = 0;
      // Set volume to max
      audioRef.current.volume = 1;
      // Play the audio
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error);
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 cursor-pointer"
      onClick={handleScreenClick}
    >
      <audio
        ref={audioRef}
        src={splashAudio}
        preload="auto"
      />
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto animate-bounce-slow">
          <Image
            src="/cron.png"
            alt="Cron Job Monitor"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-white animate-pulse">
          Server Monitor
        </h1>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-400 text-sm">Click anywhere to play sound</p>
      </div>
    </div>
  );
} 