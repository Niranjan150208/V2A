import React, { useState } from 'react';
import { Store, Search, Filter, ShieldCheck, Star, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const BuyerDiscoveryPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();
  const [filterType, setFilterType] = useState('All');

  const buyers = state.buyers.filter((b) => filterType === 'All' || b.buyerType === filterType);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'நேரடி கொள்முதல் வாங்குவோர்' : 'Direct Institutional Buyers & Rice Mills'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'வாங்குவோர் வலையமைப்பு' : 'Buyer Discovery Network'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta'
              ? 'மாதிரி கொள்முதல் நிறுவனங்கள், உழவர் உற்பத்தியாளர் நிறுவனங்கள் மற்றும் நேரடி கொள்முதல் மையங்கள் (Demo)'
              : 'Demonstration catalog of regional food aggregators, millers, and procurement centers'}
          </p>
        </div>

        <button
          onClick={() => navigate('/offers')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'வந்திருக்கும் ஏலங்கள்' : 'Active Buyer Bids'}
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Modern Rice Mill', 'FPO Aggregator', 'Government DPC (Direct Purchase Centre)'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === type
                ? 'bg-forest-800 text-harvest-300 shadow-sm'
                : 'bg-white text-ink-700 border border-sage-300 hover:bg-sage-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Buyer Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buyers.map((buyer) => (
          <div
            key={buyer.id}
            className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro flex flex-col justify-between hover:border-paddy-500 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2.5 py-0.5 rounded-full">
                  {buyer.buyerType}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-forest-900 bg-harvest-200 px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-harvest-600 text-harvest-600" />
                  {buyer.rating}
                </span>
              </div>

              <h3 className="font-display font-extrabold text-lg text-forest-900 leading-snug">
                {language === 'ta' ? buyer.tamilName : buyer.name}
              </h3>
              <p className="text-xs text-ink-500 mt-1">{buyer.organization} • {buyer.district}</p>

              <div className="my-4 p-3 bg-cream-50 rounded-2xl border border-sage-200 space-y-1.5 text-xs text-ink-700">
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">GST Registration:</span>
                  <span className="font-mono font-bold text-forest-900">{buyer.gstNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Payment Turnaround:</span>
                  <span className="font-bold text-paddy-700">{buyer.averagePaymentDays} Days Settlement</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Procuring Crops:</span>
                  <span className="font-semibold text-forest-900">{buyer.targetCrops.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-sage-200">
              <button
                onClick={() => navigate('/offers')}
                className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'ta' ? 'விலை சலுகையை காண்க' : 'View Tender Offers'}</span>
                <ArrowRight className="w-4 h-4 text-harvest-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
