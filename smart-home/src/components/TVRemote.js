import React from 'react';

export default function TVRemote() {
  const handleClick = (key) => {
    alert(`Command sent: ${key}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">TV Remote</h2>
      <div className="grid grid-cols-3 gap-4 max-w-xs">
        <button className="p-4 bg-blue-500 text-white rounded" onClick={() => handleClick('POWER')}>Power</button>
        <button className="p-4 bg-blue-500 text-white rounded" onClick={() => handleClick('VOLUP')}>Vol+</button>
        <button className="p-4 bg-blue-500 text-white rounded" onClick={() => handleClick('VOLDOWN')}>Vol-</button>
        <button className="p-4 bg-blue-500 text-white rounded" onClick={() => handleClick('CHUP')}>CH+</button>
        <button className="p-4 bg-blue-500 text-white rounded" onClick={() => handleClick('CHDOWN')}>CH-</button>
        <button className="p-4 bg-blue-500 text-white rounded" onClick={() => handleClick('MUTE')}>Mute</button>
      </div>
    </div>
  );
}
