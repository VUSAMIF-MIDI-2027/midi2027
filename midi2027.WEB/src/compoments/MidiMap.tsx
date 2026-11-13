'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MidiMap() {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg z-0">
      <MapContainer 
        center={[54.6872, 25.2797]} // Vilnius
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ width: '100%', height: '100%' }}
      >
        {/* Openstreet pagrindas*/}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[54.6872, 25.2797]} icon={defaultIcon}>
          <Popup>MIDI būstinė Vilniuje</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}