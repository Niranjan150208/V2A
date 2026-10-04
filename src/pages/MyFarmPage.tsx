import React, { useState } from 'react';
import { Layers, MapPin, Droplets, Activity, Plus, ShieldCheck, ChevronRight, FileText } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const MyFarmPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();
  const [selectedParcel, setSelectedParcel] = useState(state.farm.parcels[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'நில உரிமை & பட்டா ஆவணங்கள்' : 'Farm Land Holdings & Digital Cadastre'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? state.farm.farmName : state.farm.farmName}
          </h1>
          <p className="text-xs text-ink-500">
            {state.farmer.village}, {state.farmer.taluk} Taluk, {state.farmer.district} District • {state.farmer.kisanCardNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/soil-health')}
            className="px-4 py-2.5 bg-paddy-700 hover:bg-paddy-800 text-cream-50 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            {language === 'ta' ? 'மண் பரிசோதனை அட்டை' : 'Soil Health Card'}
          </button>
        </div>
      </div>

      {/* Farm Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === 'ta' ? 'மொத்த பரப்பு' : 'Total Cadastral Area'}
          </span>
          <p className="font-display font-extrabold text-3xl text-forest-900 mt-1">
            {state.farm.totalAreaAcres} <span className="text-sm font-medium text-ink-500">{language === 'ta' ? 'ஏக்கர்' : 'Acres'}</span>
          </p>
          <p className="text-xs text-paddy-700 font-semibold mt-1">
            ✓ 100% {language === 'ta' ? 'நன்செய் பாசன நிலம்' : 'Wetland Cultivation'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === 'ta' ? 'நிலத் தொகுதிகள்' : 'Registered Land Parcels'}
          </span>
          <p className="font-display font-extrabold text-3xl text-forest-900 mt-1">
            {state.farm.parcels.length} <span className="text-sm font-medium text-ink-500">{language === 'ta' ? 'வயல்கள்' : 'Plots'}</span>
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Patta No: {state.farm.parcels[0].pattaNumber}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === 'ta' ? 'பாசன ஆதாரங்கள்' : 'Irrigation Infrastructure'}
          </span>
          <p className="font-display font-extrabold text-xl text-forest-900 mt-1">
            Canal + Solar Borewell
          </p>
          <p className="text-xs text-paddy-700 font-semibold mt-1">
            ✓ 5 HP Solar Submersible Installed
          </p>
        </div>
      </div>

      {/* Parcel Selection and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Parcel List */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base text-forest-900">
            {language === 'ta' ? 'நிலத் தொகுதிகள் தேர்வு' : 'Select Parcel to Inspect'}
          </h3>
          {state.farm.parcels.map((parcel) => (
            <div
              key={parcel.id}
              onClick={() => setSelectedParcel(parcel)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedParcel.id === parcel.id
                  ? 'bg-forest-800 text-cream-50 border-forest-900 shadow-agro'
                  : 'bg-white text-ink-900 border-sage-300 hover:border-paddy-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${selectedParcel.id === parcel.id ? 'text-harvest-400' : 'text-paddy-700'}`}>
                  Survey: {parcel.surveyNumber}
                </span>
                <span className={`text-xs font-black ${selectedParcel.id === parcel.id ? 'text-cream-100' : 'text-forest-900'}`}>
                  {parcel.acres} Acres
                </span>
              </div>
              <h4 className="font-bold text-sm">
                {parcel.locationName}
              </h4>
              <div className="flex items-center gap-2 mt-2 text-xs opacity-90">
                <span>{parcel.soilType}</span>
                <span>•</span>
                <span>{parcel.irrigationType}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detailed Parcel Card & Soil/Water Attributes */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
            <div>
              <span className="text-xs font-bold text-paddy-700 uppercase tracking-wider">
                {selectedParcel.pattaNumber} • Survey {selectedParcel.surveyNumber}
              </span>
              <h3 className="font-display font-extrabold text-xl text-forest-900">
                {selectedParcel.locationName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-paddy-100 text-paddy-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-paddy-600" />
                {language === 'ta' ? 'தமிழ் நிலம் சரிபார்க்கப்பட்டது' : 'Patta Aadhaar Linked'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
              <p className="text-xs font-bold text-ink-500 uppercase">{language === 'ta' ? 'மண் வகை' : 'Soil Classification'}</p>
              <p className="font-bold text-base text-forest-900">{selectedParcel.soilType}</p>
              <p className="text-xs text-ink-600">Rich delta clay loam with 48% water retention capacity.</p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
              <p className="text-xs font-bold text-ink-500 uppercase">{language === 'ta' ? 'பாசன வசதி' : 'Water Sourcing'}</p>
              <p className="font-bold text-base text-forest-900">{selectedParcel.irrigationType}</p>
              <p className="text-xs text-ink-600">Grand Anicut distribution canal with secondary solar borewell backup.</p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
              <p className="text-xs font-bold text-ink-500 uppercase">{language === 'ta' ? 'புவியியல் அமைவிடம்' : 'Geo-Coordinates'}</p>
              <p className="font-mono font-bold text-sm text-forest-900">
                {selectedParcel.geoCoordinates?.lat.toFixed(4)}° N, {selectedParcel.geoCoordinates?.lng.toFixed(4)}° E
              </p>
              <p className="text-xs text-ink-600">Thiruvaiyaru Revenue Firka, Cauvery Delta Basin.</p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
              <p className="text-xs font-bold text-ink-500 uppercase">{language === 'ta' ? 'பரிந்துரைக்கப்பட்ட பயிர்கள்' : 'Crop Rotation Plan'}</p>
              <p className="font-bold text-sm text-forest-900">Samba Paddy → Blackgram Fallow → Sesame</p>
              <p className="text-xs text-paddy-700 font-semibold">TNAU Delta Package of Practices</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/crop-planner')}
              className="px-5 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl hover:bg-forest-900 transition-colors"
            >
              {language === 'ta' ? 'இந்த நிலத்திற்கு பயிர் திட்டமிடுக' : 'Plan Crop on This Parcel'}
            </button>
            <button
              onClick={() => navigate('/irrigation')}
              className="px-5 py-2.5 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl hover:bg-sage-100 transition-colors"
            >
              {language === 'ta' ? 'பாசன அட்டவணை' : 'Irrigation Scheduler'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
