import React from 'react';
import { GitCompare, TrendingUp, CircleDollarSign, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const SeasonComparisonPage: React.FC = () => {
  const { language, navigate } = useNavigation();

  const seasonsData = [
    {
      name: 'Samba Season (Main Rabi)',
      tamilName: 'சம்பா பருவம் (நடப்பு)',
      crop: 'Paddy (CR 1009 Sub 1)',
      acres: 3.5,
      durationDays: 135,
      expenses: 75100,
      grossSales: 250800,
      netProfit: 166392,
      yieldBags: 110,
      roi: '221%',
      status: 'Sold & Settled',
    },
    {
      name: 'Kuruvai Season (Summer Kharif)',
      tamilName: 'குறுவை பருவம் (முந்தைய ஆண்டு)',
      crop: 'Paddy (Co 51)',
      acres: 3.5,
      durationDays: 105,
      expenses: 64200,
      grossSales: 218400,
      netProfit: 144800,
      yieldBags: 96,
      roi: '225%',
      status: 'Past Completed',
    },
    {
      name: 'Navarai Rice Fallow',
      tamilName: 'நவரை நெல் தரிசு (துவக்கம்)',
      crop: 'Blackgram (VBN 8)',
      acres: 2.0,
      durationDays: 70,
      expenses: 16800,
      grossSales: 59200,
      netProfit: 42400,
      yieldBags: 16,
      roi: '252%',
      status: 'Active Vegetative',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'பருவக்கால செயல்திறன் ஒப்பீடு' : 'Multi-Season Agribusiness Analytics'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'பருவக்கால ஒப்பீடு (சம்பா vs குறுவை vs உளுந்து)' : 'Season-on-Season Performance & ROI'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta'
              ? 'மகசூல், சாகுபடி செலவு, சந்தை விலை மற்றும் லாப விகிதத்தின் ஒப்பீட்டு பகுப்பாய்வு'
              : 'Benchmark farm margins across cropping cycles to identify highest return crop rotations'}
          </p>
        </div>

        <button
          onClick={() => navigate('/next-season')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'அடுத்த பருவ பயிர் திட்டம்' : 'Plan Next Rotation'}
        </button>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {seasonsData.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4 hover:border-paddy-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2.5 py-0.5 rounded-full">
                  {s.durationDays} Days • {s.acres} Acres
                </span>
                <span className="text-xs font-bold text-forest-900 bg-cream-200 px-2 py-0.5 rounded-lg">
                  ROI {s.roi}
                </span>
              </div>

              <h3 className="font-display font-extrabold text-xl text-forest-900">
                {language === 'ta' ? s.tamilName : s.name}
              </h3>
              <p className="text-xs text-paddy-700 font-semibold mt-0.5">{s.crop}</p>

              <div className="my-4 p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-500">Total Harvest:</span>
                  <span className="font-bold text-forest-900">{s.yieldBags} Bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Cultivation Cost:</span>
                  <span className="font-bold text-terracotta-600">₹{s.expenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Gross Sales Value:</span>
                  <span className="font-bold text-forest-900">₹{s.grossSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sage-200 text-sm">
                  <span className="font-bold text-forest-900">Net Farm Profit:</span>
                  <span className="font-display font-black text-paddy-700">₹{s.netProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs font-bold text-paddy-700 bg-paddy-100 px-3 py-1 rounded-full">
                Status: {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
