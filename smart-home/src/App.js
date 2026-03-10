import React, { useState } from 'react';
import TVRemote from './components/TVRemote';
import CCTVPlayer from './components/CCTVPlayer';

export default function App() {
  const [activePanel, setActivePanel] = useState('CCTV');

  return (
    <div className="flex h-screen font-sans">
      <div className="w-60 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Smart Home</h1>
        <button
          onClick={() => setActivePanel('CCTV')}
          className="w-full mb-2 p-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          CCTV
        </button>
        <button
          onClick={() => setActivePanel('TV')}
          className="w-full mb-2 p-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          TV Remote
        </button>
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        {activePanel === 'CCTV' && <CCTVPlayer />}
        {activePanel === 'TV' && <TVRemote />}
      </div>
    </div>
  );
}
