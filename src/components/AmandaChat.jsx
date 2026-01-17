'use client';
import { Send, Bot, Camera, Loader2, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AmandaChat({ location }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input && !selectedImage) return;

    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      content: input, 
      experimental_attachments: selectedImage ? [{ url: selectedImage }] : undefined 
    };

    setMessages(prev => [...prev, userMsg]);
    setInput(''); 
    setSelectedImage(null); 
    setLoading(true);

    try {
      const res = await fetch('/api/chat', { 
        method: 'POST', 
        body: JSON.stringify({ messages: [...messages, userMsg], location, siteId: 'main' }) 
      });

      if (!res.ok) throw new Error('API Offline');
      
      const data = await res.text();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data }]);
    } catch (error) { 
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: `System offline. Call 304-410-9208 for immediate assistance in ${location || 'your area'}.` 
      }]);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col h-[550px] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg">
            <Bot className="text-slate-900 w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none">Amanda</p>
            <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online Dispatcher
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-gray-400 uppercase tracking-widest font-bold">
          {location || 'National'}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <Bot size={40} className="text-slate-300" />
            <p className="text-sm text-slate-500 max-w-[200px]">Describe your electrical issue or upload a photo for a quick estimate.</p>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm ${
              m.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              <p className="leading-relaxed">{m.content}</p>
              
              {m.experimental_attachments?.map((att, i) => (
                <img key={i} src={att.url} className="mt-3 rounded-xl h-32 w-full object-cover border border-black/10" alt="upload" />
              ))}

              {/* Stripe Payment Link UI */}
              {m.content.includes("https://checkout.stripe.com") && (
                <a 
                  href={m.content.match(/https:\/\/checkout\.stripe\.com[^\s]+/)[0]} 
                  target="_blank" 
                  className="flex items-center justify-center gap-2 mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                >
                  <Shield size={16} /> Secure Slot & Pay
                </a>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-xs text-slate-500 font-medium">Amanda is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <Camera size={22} />
        </button>
        
        <div className="flex-1 relative">
          <input 
            className="w-full bg-slate-100 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Describe the problem..." 
          />
          {selectedImage && (
            <div className="absolute -top-16 left-0 bg-white p-1 rounded-lg shadow-xl border border-blue-200">
              <img src={selectedImage} className="h-12 w-12 rounded object-cover" alt="preview" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">×</button>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || (!input && !selectedImage)}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-90"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}