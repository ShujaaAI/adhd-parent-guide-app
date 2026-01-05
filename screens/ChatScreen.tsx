import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface ChatScreenProps {
  chatSession: Chat | null;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ chatSession }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !chatSession) return;
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
        const response = await chatSession.sendMessage({ message: input });
        const modelMessage: ChatMessage = { role: 'model', text: response.text ?? "Sorry, I couldn't process that." };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: ChatMessage = { role: 'model', text: "Oops! Something went wrong. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-yellow-100 text-yellow-800 text-xs text-center border-b border-yellow-200">
        <p>
          <strong>Disclaimer:</strong> Spark is an AI assistant and does not provide medical advice. Please consult a qualified professional for diagnosis and treatment.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
            <div className="bg-teal-100 text-teal-800 p-3 rounded-lg max-w-xs">
              <p>Hi! I'm Spark, your AI assistant. How can I help you today?</p>
            </div>
        </div>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-200 p-3 rounded-lg">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Spark anything..."
            className="flex-1 p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input}
            className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center disabled:bg-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
