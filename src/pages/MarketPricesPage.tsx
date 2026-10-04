import React, { useState } from 'react';
import { TrendingUp, MapPin, Calendar, Info, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const MarketPricesPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Samba Grade A)');

  const mandiPrices = [
    {
      mandi: 'Thanjavur Regulated Market (DPC & Mandi)',
      district: 'Thanjavur',
      minPrice: 2240,
      modalPrice: 2320,
      maxPrice: 2380,
      unit: '75kg Bag',
      dailyArrivals: '1,450 Bags',
      trend: '+₹40 today',
    },
    {
      mandi: 'Kumbakonam Market Committee',
      district: 'Thanjavur',
      minPrice: 2210,
      modalPrice: 2280,
      maxPrice: 2340,
      unit: '75kg Bag',
      dailyArrivals: '980 Bags',
      trend: '+₹20 today',
    },
    {
      mandi: 'Tiruvarur Agriculture Market',
      district: 'Tiruvarur',
      minPrice: 2200,
      modalPrice: 2270,
      maxPrice: 2330,
      unit: '75kg Bag',
      dailyArrivals: '1,200 Bags',
      trend: 'Stable',
    },
    {
      mandi: 'Mayiladuthurai Regulated Market',
      district: 'Mayiladuthurai',
      minPrice: 2220,
      modalPrice: 2290,
      maxPrice: 2360,
      unit: '75kg Bag',
      dailyArrivals: '850 Bags',
      trend: '+₹30 today',
    },
    {
      mandi: 'Trichy Gandhi Market (Wholesale)',
      district: 'Tiruchirappalli',
      minPrice: 2250,
      modalPrice: 2310,
      maxPrice: 2400,
      unit: '75kg Bag',
      dailyArrivals: '2,100 Bags',
      trend: '+₹50 today',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'அரசு ஒழுங்குமுறை விற்பனைக் கூடங்கள்' : 'Agmarknet Regulated Market Telemetry'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'நேரடி சந்தை விலை நிலவரம்' : 'Live Mandi Procurement Prices'}
          </h1>
          <p className="text-xs text-ink-500">
            Tamil Nadu State Agricultural Marketing Board & Regulated Market Committees
          </p>
        </div>

        <button
          onClick={() => navigate('/offers')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'கொள்முதல் ஏலங்கள் காண்க' : 'View Buyer Bids'}
        </button>
      </div>

      {/* Demo Data Disclaimer (Phase 5 / 7) */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-harvest-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            {language === 'ta' ? 'விலை தகவல் வெளிப்படைத்தன்மை:' : 'Identified Demonstration Pricing:'}
          </p>
          <p className="text-ink-600 leading-relaxed">
            {language === 'ta'
              ? 'இந்த விலைகள் தமிழ்நாடு ஒழுங்குமுறை விற்பனைக் கூடங்களின் தற்போதைய சந்தை நிலவரத்தை அடிப்படையாகக் கொண்ட மாதிரி தகவல்கள் ஆகும். உத்தியோகபூர்வ விற்பனைக்கு நேரடி கொள்முதல் நிலையத்தை அணுகவும்.'
              : 'Agmarknet figures are demonstration benchmark models simulating active mandi arrivals and prices across Cauvery Delta districts.'}
          </p>
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-sage-200">
          <h3 className="font-display font-bold text-xl text-forest-900">
            {selectedCrop} — {language === 'ta' ? 'டெல்டா மாவட்டங்கள் விலை ஒப்பீடு' : 'Delta Mandi Price Matrix'}
          </h3>
          <span className="text-xs font-semibold text-paddy-700 bg-paddy-50 px-3 py-1 rounded-full">
            Govt MSP: ₹2,320 / Quintal
          </span>
        </div>

        <div className="divide-y divide-sage-200">
          {mandiPrices.map((item, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                  {item.district} District
                </span>
                <h4 className="font-bold text-base text-forest-900 mt-1">{item.mandi}</h4>
                <p className="text-xs text-ink-500 mt-0.5">
                  Daily Arrivals: {item.dailyArrivals} • Trend: <span className="font-semibold text-paddy-700">{item.trend}</span>
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 text-right">
                <div>
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Min Price</span>
                  <span className="font-bold text-xs text-ink-600">₹{item.minPrice}</span>
                </div>

                <div className="p-2 bg-cream-100 rounded-xl border border-sage-300">
                  <span className="text-[10px] font-bold text-forest-900 uppercase block">Modal / Common</span>
                  <span className="font-display font-black text-lg text-forest-900">
                    ₹{item.modalPrice}
                  </span>
                  <span className="text-[10px] text-ink-500 block">/ {item.unit}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Max Grade A</span>
                  <span className="font-bold text-xs text-paddy-700">₹{item.maxPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
