'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { Send, Bot, Factory, Loader2 } from 'lucide-react';

export default function CommercialPage() {
  const [messages, setMessages] = useState([{ id: 1, role: 'assistant', content: "I am Agent Grey. Tell me about your facility." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // লোডিং স্টেট যুক্ত করা হয়েছে
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]); 
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/consultant', { 
        method: 'POST', 
        body: JSON.stringify({ messages: [...messages, userMsg] }) 
      });
      
      // বিল্ড এরর ফিক্স: ডাটা আলাদা ভেরিয়েবলে নিয়ে তারপর সেট করা হয়েছে
      const data = await res.text(); 
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data }]);
    } catch (error) {
      console.error("Consultant API Error:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Agent Grey is temporarily offline. Please call for industrial support." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
                <div className="bg-blue-600/20 text-blue-400 w-fit px-4 py-1 rounded-full text-sm font-bold mb-4 border border-blue-600/30 flex items-center gap-2">
                  <Factory size={16} /> Industrial Enterprise
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Predictive <br/>Maintenance</h1>
                <p className="text-xl text-slate-400 max-w-md italic border-l-4 border-blue-600 pl-4">
                  "We don't fix failures. We predict them."
                </p>
            </div>
            <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl h-[600px] flex flex-col border border-slate-200 overflow-hidden">
                {/* Agent Header */}
                <div className="bg-slate-100 p-4 border-b flex items-center gap-3">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Agent Grey</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Consultant</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {messages.map(m => (
                      <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`inline-block p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                          m.role === 'user' ? 'bg-blue-900 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'
                        }`}>
                          {m.content}
                        </span>
                      </div>
                    ))}
                    {loading && <div className="text-xs text-slate-400 animate-pulse">Agent Grey is analyzing...</div>}
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
                  <input 
                    className="flex-1 border-none bg-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none" 
                    value={input} 
                    onChange={e=>setInput(e.target.value)} 
                    placeholder="Describe facility issue..."
                  />
                  <button disabled={loading} className="bg-blue-900 text-white p-3 rounded-xl hover:bg-black transition-colors disabled:bg-slate-300">
                    <Send size={20} />
                  </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}