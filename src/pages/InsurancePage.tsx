import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Calculator, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const InsurancePage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  const [acres, setAcres] = useState(3.5);
  const sumInsuredPerAcre = 37500;
  const farmerShareRate = 0.015; // 1.5% for Kharif/Rabi foodgrains

  const totalSumInsured = acres * sumInsuredPerAcre;
  const farmerPremium = totalSumInsured * farmerShareRate;
  const govtSubsidy = totalSumInsured * 0.085; // 8.5% paid by state & central govts

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம்' : 'Pradhan Mantri Fasal Bima Yojana (PMFBY)'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'பயிர் காப்பீடு & இழப்பீட்டு பாதுகாப்பு' : 'Crop Insurance & Disaster Safeguard'}
          </h1>
          <p className="text-xs text-ink-500">
            Government of Tamil Nadu Department of Agriculture • AIC of India Notified
          </p>
        </div>

        <span className="bg-paddy-100 text-paddy-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-paddy-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-paddy-700" />
          {language === 'ta' ? 'பாலிசி செயலில் உள்ளது' : 'Policy Active & Insured'}
        </span>
      </div>

      {/* Active Policy Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-paddy-600/40 shadow-agro space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
          <div>
            <span className="text-[10px] font-mono font-bold bg-cream-200 text-ink-700 px-2 py-0.5 rounded">
              POLICY-PMFBY-TN-2025-90412
            </span>
            <h3 className="font-display font-extrabold text-xl text-forest-900 mt-1">
              Samba Paddy Comprehensive Yield Protection
            </h3>
            <p className="text-xs text-ink-500">
              Keezha Theru Vayal (3.5 Acres) • Agriculture Insurance Company of India
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-ink-500 block uppercase">Sum Insured</span>
            <span className="font-display font-black text-2xl text-forest-900">
              ₹{totalSumInsured.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-cream-100 rounded-xl border border-sage-200">
            <span className="text-[10px] font-bold text-ink-500 uppercase block">Farmer Share (1.5%)</span>
            <p className="font-bold text-base text-forest-900 mt-0.5">₹{farmerPremium.toLocaleString()}</p>
            <p className="text-[10px] text-paddy-700 font-bold">Paid via KCC Bank ✓</p>
          </div>

          <div className="p-3 bg-cream-100 rounded-xl border border-sage-200">
            <span className="text-[10px] font-bold text-ink-500 uppercase block">Govt Subsidy Support</span>
            <p className="font-bold text-base text-forest-900 mt-0.5">₹{govtSubsidy.toLocaleString()}</p>
            <p className="text-[10px] text-paddy-700 font-bold">50:50 Centre & State</p>
          </div>

          <div className="p-3 bg-cream-100 rounded-xl border border-sage-200">
            <span className="text-[10px] font-bold text-ink-500 uppercase block">Risk Coverage</span>
            <p className="font-bold text-sm text-forest-900 mt-0.5">Flood / Cyclone / Pest</p>
            <p className="text-[10px] text-ink-500">Post-harvest lodging cover</p>
          </div>
        </div>
      </div>

      {/* Claim Filing Instructions & Eligibility */}
      <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-lg text-forest-900">
          {language === 'ta' ? 'இயற்கை பேரிடர் இழப்பீடு கோரும் வழிமுறைகள்' : 'Localized Disaster Claim Protocol'}
        </h3>
        <p className="text-xs text-ink-700 leading-relaxed">
          {language === 'ta'
            ? 'சூறாவளி காற்று அல்லது அடைமழையால் பயிர் நீரில் மூழ்கினால் 72 மணி நேரத்திற்குள் உழவன் செயலி அல்லது V2A வழியாக புகைப்பட ஆதாரத்துடன் VAO மற்றும் காப்பீட்டு அலுவலருக்கு தகவல் தெரிவிக்க வேண்டும்.'
            : 'In the event of unseasonal deluge or cyclone damage, intimation must be submitted within 72 hours with geotagged crop photos to initiate joint survey with Revenue Inspector and Agriculture Officer.'}
        </p>

        <button
          onClick={() => alert(language === 'ta' ? 'பயிர் ஆரோக்கியமாக உள்ளது. இழப்பீடு பதிவு தேவையில்லை.' : 'Crop is currently healthy and verified harvested. No active claim filed.')}
          className="px-5 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'இழப்பீட்டு கோரிக்கை பதிவு' : 'Initiate Claim Intimation'}
        </button>
      </div>
    </div>
  );
};
