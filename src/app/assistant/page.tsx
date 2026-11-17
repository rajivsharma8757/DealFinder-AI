// src/app/assistant/page.tsx - Conversational AI Shopping Intelligence Interface
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Layers, 
  RefreshCw
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { processAssistantMessage, AssistantResponse } from '@/lib/engine/assistant';
import { ChatMessage } from '@/types';
import ProductCard from '@/components/ProductCard';
import VoiceInputButton from '@/components/VoiceInputButton';

export default function AssistantPage() {
  const { selectedBank, addToComparison } = useApp();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; data?: AssistantResponse }>>([
    {
      role: 'assistant',
      text: `Hello! I am your **DealFinder AI Shopping Assistant**.\n\n` +
            `I continuously monitor 20+ verified stores (Amazon India, Flipkart, Croma, Reliance Digital, Myntra, etc.) and calculate real-time savings with your credit cards and coupon codes.\n\n` +
            `You can talk to me via microphone or type in **English, Hindi, or Hinglish** — for example:\n` +
            `• *"Compare iPhone 16 on Amazon vs Croma"*\n` +
            `• *"Best gaming laptop under ₹60,000 with HDFC card offer"*\n` +
            `• *"Mujhe 25,000 ke andar sabse achha phone batao"*\n` +
            `• *"Show me top running shoes with maximum discount"*`,
      data: {
        message: '',
        suggestedFollowUps: [
          'iPhone 16 under ₹80,000',
          'Gaming laptop with 16GB RAM under 60k',
          'Nike running shoes under ₹3,000',
          'HDFC credit card electronic offers'
        ]
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyItems: ChatMessage[] = messages.map((m, idx) => ({
        id: `msg_${idx}`,
        sender: m.role,
        text: m.text,
        timestamp: new Date().toISOString()
      }));

      const res = await processAssistantMessage(textToSend, historyItems, selectedBank);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: res.message,
          data: res
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I encountered an issue analyzing the stores. Please try asking again!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(text);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-5rem)]">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2A352F] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>DealFinder AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h1>
            <p className="text-xs text-gray-400">
              Active Optimization Card: <strong className="text-emerald-400">{selectedBank}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="p-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-[#222B26] border border-[#2A352F] transition-colors flex items-center gap-1.5"
          title="Reset Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow overflow-y-auto py-6 space-y-6 pr-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`space-y-3 max-w-2xl ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-500 text-black font-semibold rounded-tr-none'
                    : 'bg-[#191F1C] border border-[#2A352F] text-gray-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>

              {/* Recommended Product Cards from Engine */}
              {m.data?.recommendedProducts && m.data.recommendedProducts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Recommended Multi-Store Options
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {m.data.recommendedProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Comparison Trigger */}
              {m.data?.comparisonTrigger && (
                <div className="p-3 rounded-xl bg-[#141816] border border-emerald-500/40 flex items-center justify-between gap-4">
                  <div className="text-xs text-gray-300">
                    <span className="font-bold text-white block">Ready for head-to-head comparison</span>
                    <span className="text-gray-400 text-[11px]">{m.data.comparisonTrigger.highlightReason}</span>
                  </div>
                  <button
                    onClick={() => {
                      m.data?.comparisonTrigger?.productIds.forEach(id => addToComparison(id));
                      window.location.href = '/compare';
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 whitespace-nowrap"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Open Matrix</span>
                  </button>
                </div>
              )}

              {/* Suggested Follow-Up Pills */}
              {m.data?.suggestedFollowUps && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.data.suggestedFollowUps.map((pill, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSend(pill)}
                      className="px-3 py-1 rounded-xl bg-[#222B26] hover:bg-[#2A352F] text-[11px] text-emerald-400 border border-[#2A352F] hover:border-emerald-500/40 transition-colors"
                    >
                      {pill} &rarr;
                    </button>
                  ))}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[#222B26] border border-[#2A352F] flex items-center justify-center text-gray-300 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[#191F1C] border border-[#2A352F] text-xs text-gray-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Analyzing 20+ retailers, calculating bank deductions and coupon stacking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box with Dual-Language Voice Support */}
      <div className="pt-4 border-t border-[#2A352F] flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl bg-[#191F1C] border border-[#2A352F] focus-within:border-emerald-500 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask DealFinder AI or click mic to speak (EN/HI)..."
            className="flex-grow bg-transparent border-none text-white text-xs sm:text-sm px-3 focus:outline-none placeholder-gray-500"
          />

          {/* Voice Input with Language Selector */}
          <VoiceInputButton onTranscript={handleVoiceTranscript} />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
