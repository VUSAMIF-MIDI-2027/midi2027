'use client';

import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapLocation {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category?: string;
  color?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MidiMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    maplibregl.setWorkerUrl('/maplibre-gl-worker.js');

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [25.2797, 54.6872], // Centruojam į Vilnių / Lietuvą
      zoom: 6,
      minZoom: 1.5,
      scrollZoom: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    map.on('load', async () => {
      map.resize();

      // Sienų stilizavimas MIDI spalva
      const layers = map.getStyle().layers || [];
      layers.forEach((layer) => {
        if (
          layer.type === 'line' &&
          (('source-layer' in layer && layer['source-layer'] === 'boundary') ||
            layer.id.toLowerCase().includes('boundary') ||
            layer.id.toLowerCase().includes('admin'))
        ) {
          const id = layer.id.toLowerCase();
          if (id.includes('outline') || id.includes('casing')) {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
            return;
          }

          map.setPaintProperty(layer.id, 'line-color', '#0075B5');
          map.setPaintProperty(layer.id, 'line-opacity', 0.9);
          map.setPaintProperty(layer.id, 'line-blur', 0);
          map.setPaintProperty(layer.id, 'line-width', [
            'interpolate',
            ['linear'],
            ['zoom'],
            1, 1,
            6, 1.4,
            12, 1.6,
          ]);
        }
      });

      // Gauname vietas iš .NET API
      try {
        const res = await fetch(`${API_URL}/api/locations`);
        if (!res.ok) throw new Error('Nepavyko gauti vietų');
        const locations: MapLocation[] = await res.json();

        locations.forEach((loc) => {
          const popupHtml = `
            <div style="color: #111; font-family: sans-serif; max-width: 220px;">
              ${loc.category ? `<span style="font-size: 11px; font-weight: bold; color: #0075B5; text-transform: uppercase;">${loc.category}</span>` : ''}
              <h3 style="margin: 2px 0 4px; font-size: 15px; font-weight: 700;">${loc.name}</h3>
              ${loc.description ? `<p style="margin: 0; font-size: 13px; color: #444;">${loc.description}</p>` : ''}
            </div>
          `;

          new maplibregl.Marker({ color: loc.color || '#3b82f6' })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupHtml))
            .addTo(map);
        });
      } catch (error) {
        console.error('Klaida kraunant žemėlapio vietas:', error);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-800 relative"
      style={{ height: '600px' }}
    >
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}