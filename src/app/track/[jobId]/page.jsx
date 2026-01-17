'use client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { use } from 'react'; 

const containerStyle = { width: '100%', height: '100vh' };
const center = { lat: 38.3498, lng: -81.6326 }; 

export default function TrackPage({ params }) {
 
  const resolvedParams = use(params);
  const jobId = resolvedParams.jobId;

  const techLocation = { lat: 38.35, lng: -81.63 }; 
  
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
      <div className="relative h-screen w-full">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
          <Marker position={techLocation} />
        </GoogleMap>
        
      
        <div className="absolute bottom-10 left-4 right-4 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anthony" alt="Tech" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dr. Anthony is In Route</h2>
                <p className="text-sm text-slate-500 font-medium">Job ID: {jobId}</p>
             </div>
          </div>
          <p className="text-green-600 font-black text-lg flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            ETA: 12 Minutes
          </p>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
             <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-600 uppercase">WV Lic #235157333</span>
             <a href="tel:3044109208" className="text-blue-600 font-bold text-sm">Contact Tech</a>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}