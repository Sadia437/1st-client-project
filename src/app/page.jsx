'use client';
import { useState } from 'react';
import ServiceIntake from '@/components/ServiceIntake';
import AmandaChat from '@/components/AmandaChat';
import { Zap, Shield, Clock, Phone } from 'lucide-react';

export default function Home() {
  const [userLocation, setUserLocation] = useState(null);

  const scrollToChat = () => {
    document.getElementById('amanda-chat-box')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Header */}
      <div className="w-full bg-slate-900 text-white py-12 px-4 text-center border-b-4 border-yellow-400">
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-yellow-400">Electric Doctor's</h1>
        <p className="text-gray-300 font-medium">Enterprise Grade Electrical Solutions</p>
        <div className="mt-4 flex justify-center">
           <a href="tel:3044109208" className="bg-red-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2">
             <Phone size={18} /> Emergency Call
           </a>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-10">
        {!userLocation ? (
          <div className="space-y-16">
            {/* জিপ কোড ইনপুট (Screenshot 2) */}
            <div className="flex items-center justify-center py-10">
              <ServiceIntake onLocationSet={(loc) => setUserLocation(loc)} />
            </div>

            {/* সার্ভিস কার্ডস (Client's choice request) */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <Zap className="mx-auto text-yellow-500 mb-4" size={32} />
                <h3 className="font-bold text-lg">Residential Repair</h3>
                <p className="text-sm text-gray-600">Quick fixes for outlets, lighting, and circuit breakers.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <Shield className="mx-auto text-blue-600 mb-4" size={32} />
                <h3 className="font-bold text-lg">Panel Upgrades</h3>
                <p className="text-sm text-gray-600">Ensuring home electrical systems meet modern safety codes.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <Clock className="mx-auto text-green-600 mb-4" size={32} />
                <h3 className="font-bold text-lg">24/7 Dispatch</h3>
                <p className="text-sm text-gray-600">Amanda AI and our team are ready to help anytime.</p>
              </div>
            </div>
          </div>
        ) : (
          /* জিপ কোড দেওয়ার পর ডাইনামিক ইন্টারফেস (Screenshot 5) */
          <div className="animate-in fade-in duration-700 space-y-12">
            <div id="amanda-chat-box" className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4 px-2">
                <p className="text-sm font-bold text-slate-700">📍 Dispatching for: {userLocation}</p>
                <button onClick={() => setUserLocation(null)} className="text-xs text-red-500 underline">Change Location</button>
              </div>
              <AmandaChat location={userLocation} />
            </div>

            {/* জেনারেটর সেকশন (Screenshot 5) */}
            <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Whole-Home Backup Generators</h2>
              <p className="text-slate-600 mb-6">Custom solutions for {userLocation}. Never lose power again.</p>
              <button onClick={scrollToChat} className="bg-yellow-400 hover:bg-yellow-500 font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95">
                Get a Quote
              </button>
            </section>

            {/* বুকিং ক্যালেন্ডার (Emergency-Electric-Repair... Screenshot) */}
            <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Schedule Service in {userLocation}</h2>
              <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-100">
                <iframe 
                  src="https://calendar.google.com/calendar/embed?src=c_1c63c21551704472585ed2730b77d70569fa4a6a891b636d4d455494c6e0d2f9%40group.calendar.google.com&ctz=America%2FNew_York" 
                  style={{ border: 0, width: '100%', height: '100%' }}
                  frameBorder="0" scrolling="no"
                ></iframe>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}