import React from 'react';
import { UserCheck, ShieldCheck, Star, Clock, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const BuyersPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட நிறுவன வாங்குவோர்' : 'Verified Buyer Profiles & KYC'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'கொள்முதல் ஆலைகள் & வர்த்தகர்கள்' : 'Procurement Partners Directory'}
          </h1>
          <p className="text-xs text-ink-500">
            Food Safety & Standards Authority of India (FSSAI) licensed procurement units
          </p>
        </div>

        <button
          onClick={() => navigate('/offers')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'விலை சலுகைகள் (Bids)' : 'Active Buyer Bids'}
        </button>
      </div>

      <div className="space-y-4">
        {state.buyers.map((buyer) => (
          <div
            key={buyer.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-paddy-100 text-paddy-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-paddy-600" />
                    GST & FSSAI Verified
                  </span>
                  <span className="text-xs font-semibold text-ink-500">
                    {buyer.buyerType}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-forest-900 mt-2">
                  {language === 'ta' ? buyer.tamilName : buyer.name}
                </h3>
                <p className="text-xs text-ink-600">
                  {buyer.organization} • {buyer.district} District
                </p>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div className="p-3 bg-cream-100 rounded-2xl border border-sage-300">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Settlement Speed</span>
                  <span className="font-display font-extrabold text-base text-forest-900">
                    {buyer.averagePaymentDays} Days
                  </span>
                </div>
                <div className="p-3 bg-cream-100 rounded-2xl border border-sage-300">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Farmer Rating</span>
                  <span className="font-display font-extrabold text-base text-forest-900 flex items-center justify-end gap-1">
                    <Star className="w-4 h-4 fill-harvest-500 text-harvest-500" />
                    {buyer.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="font-bold text-ink-600 block">FSSAI Licence:</span>
                <span className="font-mono font-semibold text-forest-900">{buyer.fssaiNumber}</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="font-bold text-ink-600 block">GST Identification:</span>
                <span className="font-mono font-semibold text-forest-900">{buyer.gstNumber}</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="font-bold text-ink-600 block">Target Procurement:</span>
                <span className="font-semibold text-forest-900">{buyer.targetCrops.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
