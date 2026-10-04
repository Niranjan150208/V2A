import React from 'react';
import { Satellite, Activity, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Sprout } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const CropHealthPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  const stages = [
    { name: 'Nursery Bed', status: 'Completed', date: 'Aug 28' },
    { name: 'Machine Transplanting', status: 'Completed', date: 'Sep 15' },
    { name: 'Active Tillering (AWD)', status: 'Completed', date: 'Oct 15' },
    { name: 'Panicle Emergence', status: 'Completed', date: 'Nov 20' },
    { name: 'Grain Filling & Maturity', status: 'Completed', date: 'Dec 25' },
    { name: 'Golden Harvest Ready', status: 'Harvested', date: 'Jan 12' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Satellite className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'செயற்கைக்கோள் கண்காணிப்பு' : 'Sentinel-2 Satellite Agro-Telemetry'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'பயிர் வளர்ச்சி & NDVI பசுமை குறியீடு' : 'NDVI Crop Vigor & Growth Stages'}
          </h1>
          <p className="text-xs text-ink-500">
            {state.farm.parcels[0].locationName} • 10m Multispectral Surface Reflectance
          </p>
        </div>

        <button
          onClick={() => navigate('/crop-doctor')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'AI பயிர் மருத்துவர்' : 'Open Crop Doctor'}
        </button>
      </div>

      {/* Top NDVI Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase">NDVI Canopy Index</span>
            <span className="bg-paddy-100 text-paddy-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Healthy Vigor
            </span>
          </div>
          <p className="font-display font-black text-3xl text-paddy-700">0.78</p>
          <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div className="bg-paddy-600 h-full rounded-full" style={{ width: '78%' }} />
          </div>
          <p className="text-[11px] text-ink-600">Dense chlorophyll absorption; zero nitrogen starvation.</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase">Leaf Area Index (LAI)</span>
            <span className="bg-paddy-100 text-paddy-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <p className="font-display font-black text-3xl text-forest-900">4.6 m²/m²</p>
          <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div className="bg-forest-700 h-full rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[11px] text-ink-600">Uniform canopy closure across 3.5 acres.</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase">Crop Water Stress</span>
            <span className="bg-paddy-100 text-paddy-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Hydrated
            </span>
          </div>
          <p className="font-display font-black text-3xl text-forest-900">0.12</p>
          <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div className="bg-paddy-500 h-full rounded-full" style={{ width: '15%' }} />
          </div>
          <p className="text-[11px] text-paddy-700 font-semibold">Zero root drought stress detected.</p>
        </div>
      </div>

      {/* Growth Stage Progression Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === 'ta' ? 'பயிர் வளர்ச்சி நிலைகள்' : 'Phenological Growth Milestones'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stg, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-cream-50 border border-sage-300 text-center space-y-2"
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-forest-800 text-harvest-300 font-bold flex items-center justify-center text-xs">
                {idx + 1}
              </div>
              <p className="font-bold text-xs text-forest-900 leading-tight">{stg.name}</p>
              <span className="inline-block text-[10px] font-bold text-paddy-800 bg-paddy-100 px-2 py-0.5 rounded-full">
                {stg.status}
              </span>
              <p className="text-[10px] text-ink-500">{stg.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
