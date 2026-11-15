'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapLocation {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category?: string;
  color?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminMapPage() {
  const [adminKey, setAdminKey] = useState('');
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formos būsena
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#0075B5');
  const [lat, setLat] = useState('54.6872');
  const [lng, setLng] = useState('25.2797');

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const previewMarkerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('midi_admin_key');
    if (savedKey) setAdminKey(savedKey);
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/locations`);
      const data = await res.json();
      setLocations(data);
    } catch {
      setError('Nepavyko užkrauti vietų iš API. Patikrinkite ar veikia backend (port 5000).');
    } finally {
      setLoading(false);
    }
  };

  // Mažas žemėlapis paspaudimui ir koordinačių parinkimui
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    maplibregl.setWorkerUrl('/maplibre-gl-worker.js');
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [25.2797, 54.6872],
      zoom: 11,
    });

    const marker = new maplibregl.Marker({ color: '#ef4444' })
      .setLngLat([25.2797, 54.6872])
      .addTo(map);
    previewMarkerRef.current = marker;

    map.on('click', (e) => {
      const clickedLng = Number(e.lngLat.lng.toFixed(6));
      const clickedLat = Number(e.lngLat.lat.toFixed(6));
      setLng(clickedLng.toString());
      setLat(clickedLat.toString());
      marker.setLngLat([clickedLng, clickedLat]);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Atnaujinaa raudoną žymeklį, kai keičiamos koordinatės ranka
  useEffect(() => {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    if (!isNaN(numLat) && !isNaN(numLng) && previewMarkerRef.current && mapRef.current) {
      previewMarkerRef.current.setLngLat([numLng, numLat]);
    }
  }, [lat, lng]);

  const handleSaveKey = (val: string) => {
    setAdminKey(val);
    localStorage.setItem('midi_admin_key', val);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setCategory('');
    setColor('#0075B5');
  };

  const handleEditClick = (loc: MapLocation) => {
    setEditingId(loc.id);
    setName(loc.name);
    setDescription(loc.description || '');
    setCategory(loc.category || '');
    setColor(loc.color || '#0075B5');
    setLat(loc.lat.toString());
    setLng(loc.lng.toString());
    mapRef.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 14 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name,
      description,
      category,
      color,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const url = editingId ? `${API_URL}/api/locations/${editingId}` : `${API_URL}/api/locations`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setError('Neteisingas Admin raktas! Patikrinkite appsettings.json.');
        return;
      }
      if (!res.ok) throw new Error('Klaida išsaugant vietą');

      resetForm();
      await fetchLocations();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Įvyko klaida');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ar tikrai norite ištrinti šią vietą?')) return;

    try {
      const res = await fetch(`${API_URL}/api/locations/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': adminKey,
        },
      });

      if (res.status === 401) {
        setError('Neteisingas Admin raktas!');
        return;
      }
      if (!res.ok) throw new Error('Nepavyko ištrinti');

      await fetchLocations();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Klaida trinant');
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold">MIDI Žemėlapio Administravimas</h1>
            <p className="text-gray-400 text-sm mt-1">Pridėkite, redaguokite arba trinkite žemėlapio taškus</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Admin raktas:</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => handleSaveKey(e.target.value)}
              placeholder="Įveskite AdminApiKey"
              className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#0075B5]"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kairė pusė: Forma ir žeėlapis paspaudimui */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 space-y-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Redaguoti vietą' : 'Pridėti naują vietą'}
            </h2>

            <p className="text-xs text-gray-400">
              Paspauskite ant žemėlapio žemiau, kad automatiškai parinktumėte koordinates:
            </p>
            <div ref={mapContainer} className="w-full h-64 rounded border border-gray-700" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Pavadinimas *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="pvz., VU MIF Naugarduko rūmai"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Kategorija</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="pvz., Renginys, Būstinė"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Žymeklio spalva</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-9 bg-gray-900 border border-gray-700 rounded px-1 py-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Platuma (Lat) *</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Ilguma (Lng) *</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Aprašymas</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trumpa informacija lankytojams..."
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-[#0075B5] hover:bg-[#005f94] text-white font-semibold px-5 py-2 rounded text-sm transition"
                >
                  {editingId ? 'Išsaugoti pakeitimus' : 'Pridėti vietą'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition"
                  >
                    Atšaukti
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Dešinė pusė: Esamų vietų sąrašas */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Esamos vietos ({locations.length})</h2>
            {loading ? (
              <p className="text-gray-400">Kraunama...</p>
            ) : locations.length === 0 ? (
              <p className="text-gray-400">Vietų sąrašas tuščias.</p>
            ) : (
              <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="bg-gray-900 border border-gray-800 p-4 rounded flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: loc.color || '#0075B5' }}
                        />
                        <h3 className="font-bold">{loc.name}</h3>
                        {loc.category && (
                          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                            {loc.category}
                          </span>
                        )}
                      </div>
                      {loc.description && (
                        <p className="text-sm text-gray-400 mt-1">{loc.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {loc.lat}, {loc.lng}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditClick(loc)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded"
                      >
                        Redaguoti
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="text-xs bg-red-900/50 hover:bg-red-800 text-red-200 px-2.5 py-1.5 rounded"
                      >
                        Trinti
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}