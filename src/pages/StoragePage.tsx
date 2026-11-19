import React, { useState } from 'react';
import { Warehouse, ShieldCheck, MapPin, Phone, CheckCircle2, CircleDollarSign, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const StoragePage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  const [selectedStorage, setSelectedStorage] = useState<any>(null);
  const [bagsToStore, setBagsToStore] = useState(110);
  const [months, setMonths] = useState(2);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Warehouse className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'அங்கீகரிக்கப்பட்ட சேமிப்புக் கிடங்குகள்' : 'WDRA Accredited Warehousing & Godowns'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'கிடங்கு இருப்பு & தானிய அடைமானக் கடன்' : 'Agri Warehouses & e-NWR Financing'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta'
              ? 'அறுவடைக்கு பின் விலை உயரும் வரை பாதுகாப்பாக சேமித்து கடன் பெறும் வசதி'
              : 'Hold produce during harvest market glut and secure pledge financing with e-NWR receipts'}
          </p>
        </div>

        <button
          onClick={() => navigate('/logistics')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'போக்குவரத்து வாகனம் ஏற்பாடு' : 'Farm Logistics & Trucks'}
        </button>
      </div>

      {/* Storage Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.storageListings.map((storage) => {
          const estimatedCost = storage.ratePerBagPerMonth * bagsToStore * months;

          return (
            <div
              key={storage.id}
              className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro flex flex-col justify-between hover:border-paddy-500 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2.5 py-0.5 rounded-full">
                    {storage.type}
                  </span>
                  <span className="text-xs font-bold text-forest-900 bg-cream-200 px-2 py-0.5 rounded-lg">
                    {storage.distanceKm} km from farm
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-lg text-forest-900">
                  {language === 'ta' ? storage.tamilName : storage.name}
                </h3>
                <p className="text-xs text-ink-500 mt-1">{storage.location}</p>

                <div className="my-4 p-3 bg-cream-50 rounded-2xl border border-sage-200 space-y-2 text-xs text-ink-700">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Total Capacity:</span>
                    <span className="font-bold text-forest-900">{storage.capacityMetricTons} MT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">Available Vacancy:</span>
                    <span className="font-bold text-paddy-700">{storage.availableSpaceTons} MT Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">e-NWR Warehouse Loan:</span>
                    <span className="font-bold text-forest-900">Available (70% Value) ✓</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-sage-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-ink-500 uppercase font-bold block">Monthly Storage Fee</span>
                    <span className="font-display font-black text-2xl text-forest-900">
                      ₹{storage.ratePerBagPerMonth}
                    </span>
                    <span className="text-xs text-ink-500"> / bag / month</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-ink-500 uppercase font-bold block">For {bagsToStore} bags ({months} mo)</span>
                    <span className="font-bold text-sm text-paddy-700">₹{estimatedCost.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(language === 'ta' ? `கிடங்கு இடம் முன்பதிவு செய்யப்பட்டது (${storage.name}).` : `Storage space booked at ${storage.name}.`)}
                  className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
                >
                  {language === 'ta' ? 'கிடங்கு இடம் முன்பதிவு செய்' : 'Reserve Godown Space'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
