'use client';

import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MidiMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    maplibregl.setWorkerUrl('/maplibre-gl-worker.js');

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [20, 48],
      zoom: 3,
      minZoom: 1.5,
      scrollZoom: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    map.on('load', () => {
      map.resize();

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
    });

    new maplibregl.Marker({ color: '#3b82f6' })
      .setLngLat([25.2797, 54.6872])
      .setPopup(new maplibregl.Popup().setText('MIDI būstinė Vilniuje'))
      .addTo(map);

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