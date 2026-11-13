'use client';

import React from 'react';
import MidiMap from '@/compoments/MidiMap'; // Pakeisk kelią, jei tavo komponentas kitur

export default function PagrindinisPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">MIDI Žemėlapis</h1>
        <p className="text-gray-400 mb-6">
          Čia yra istorinis MIDI renginių ir vietų žemėlapis.
        </p>
        
        {/* Čia įsikelia tavo žemėlapis */}
        <MidiMap />
      </div>
    </main>
  );
}