import React from 'react';

export default function CCTVPlayer() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">CCTV Live Stream</h2>
      <video controls className="w-full rounded shadow-lg">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
