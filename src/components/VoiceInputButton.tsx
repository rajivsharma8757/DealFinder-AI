// src/components/VoiceInputButton.tsx - Interactive Voice Input with Dual-Language (EN/HI) Support
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Globe, AlertCircle, Volume2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function VoiceInputButton({
  onTranscript,
  className = '',
  size = 'md'
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close language menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge, or type your query.'
      );
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const spoken = finalTranscript || interimTranscript;
        if (spoken) {
          onTranscript(spoken);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser settings.');
        } else if (event.error === 'no-speech') {
          // No speech detected, quietly reset
        } else {
          setErrorMessage(`Voice recognition error (${event.error}). Please speak clearly into your microphone.`);
        }
        setTimeout(() => setErrorMessage(null), 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMessage('Could not initiate speech recognition. Please check microphone settings.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`relative flex items-center gap-1 ${className}`}>
      {/* Language Selector Pill */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-[#222B26] hover:bg-[#2A352F] text-[11px] font-bold text-gray-300 hover:text-white border border-[#2A352F] transition-colors"
          title="Change Voice Language"
        >
          <Globe className="w-3 h-3 text-emerald-400" />
          <span>{language === 'en-IN' ? 'EN' : 'HI'}</span>
        </button>

        {showLanguageMenu && (
          <div className="absolute right-0 bottom-full mb-1 w-28 bg-[#191F1C] border border-[#2A352F] rounded-xl shadow-xl p-1 z-50 text-xs">
            <button
              type="button"
              onClick={() => {
                setLanguage('en-IN');
                setShowLanguageMenu(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                language === 'en-IN'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-gray-300 hover:bg-[#222B26]'
              }`}
            >
              <span>English</span>
              <span className="text-[10px] text-gray-500">IN</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage('hi-IN');
                setShowLanguageMenu(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                language === 'hi-IN'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-gray-300 hover:bg-[#222B26]'
              }`}
            >
              <span>हिन्दी</span>
              <span className="text-[10px] text-gray-500">IN</span>
            </button>
          </div>
        )}
      </div>

      {/* Mic Button */}
      <button
        type="button"
        onClick={toggleListening}
        className={`relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
            : 'text-gray-400 hover:text-emerald-400 hover:bg-[#222B26]'
        }`}
        title={isListening ? 'Stop Listening' : `Speak in ${language === 'en-IN' ? 'English' : 'Hindi'}`}
      >
        {isListening ? (
          <>
            <Mic className="w-4 h-4 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Floating Listening Indicator */}
      {isListening && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-950/90 border border-red-700/80 rounded-full text-white text-[11px] font-medium flex items-center gap-2 shadow-2xl backdrop-blur-md whitespace-nowrap animate-in fade-in duration-200 z-50">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Listening in {language === 'en-IN' ? 'English' : 'Hindi'}... Speak now</span>
        </div>
      )}

      {/* Error Tooltip */}
      {errorMessage && (
        <div className="absolute bottom-full right-0 mb-2 w-64 p-2.5 bg-red-950/95 border border-red-800 rounded-xl text-red-200 text-xs shadow-2xl z-50 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
