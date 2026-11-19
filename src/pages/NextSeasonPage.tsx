import React from 'react';
import { RotateCw, Sprout, ShieldCheck, ArrowRight, CheckCircle2, Layers, Calendar, ShoppingCart } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const NextSeasonPage: React.FC = () => {
  const { language, navigate } = useNavigation();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <RotateCw className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'அடுத்த பருவ சுழற்சி உத்திகள்' : 'Regenerative Crop Rotation Strategy'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'அடுத்த பருவ பயிர் திட்டமிடல் & மண்வளம்' : 'Next-Season Crop Planning & Soil Replenishment'}
          </h1>
          <p className="text-xs text-ink-500">
            Post-Samba paddy residual moisture utilization and nitrogen fixation roadmap
          </p>
        </div>

        <button
          onClick={() => navigate('/crop-planner')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'பயிர் திட்ட ஆலோசகர்' : 'Open Crop Planner'}
        </button>
      </div>

      {/* Recommended Crop Rotation Sequence */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === 'ta' ? 'டெல்டா மண்வள பயிர் சுழற்சி முறை' : 'Cauvery Delta 3-Tier Cropping Sequence'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-3xl bg-cream-50 border border-sage-300 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Tier 1 • Completed ✓</span>
            <h4 className="font-display font-extrabold text-lg text-forest-900">
              Samba Long Duration Paddy
            </h4>
            <p className="text-xs text-ink-600">CR 1009 Sub 1 • 135 Days • 110 Bags harvested @ ₹2,280/bag.</p>
            <p className="text-xs font-bold text-paddy-700">Realized Profit: ₹1,66,392</p>
          </div>

          <div className="p-5 rounded-3xl bg-paddy-50 border-2 border-paddy-500 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-800 bg-paddy-100 px-2 py-0.5 rounded-full">
              Tier 2 • Recommended Next
            </span>
            <h4 className="font-display font-extrabold text-lg text-forest-900">
              Rice Fallow Blackgram (VBN 8)
            </h4>
            <p className="text-xs text-ink-600">Sown directly into standing paddy stubble 7-10 days before harvest utilizing residual dew moisture.</p>
            <p className="text-xs font-bold text-forest-800">
              🌱 Natural Benefit: Fixes 35 kg atmospheric Nitrogen/ha, reducing urea requirement for next year by 30%!
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50 border border-sage-300 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Tier 3 • Summer Cash Crop</span>
            <h4 className="font-display font-extrabold text-lg text-forest-900">
              Summer Sesame (TMV 7)
            </h4>
            <p className="text-xs text-ink-600">Low water demand, drought hardy, fetches premium oil mill rate (&gt;₹10,000/quintal) in summer markets.</p>
            <p className="text-xs font-bold text-paddy-700">Est. Net Margin: ₹38,000 / Acre</p>
          </div>
        </div>
      </div>

      {/* Advance Input & Seed Booking Action Card */}
      <div className="bg-gradient-to-r from-forest-900 to-paddy-900 rounded-3xl p-6 sm:p-8 text-cream-100 shadow-agro flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-harvest-400 uppercase tracking-wider">
            Advance Seed Booking Active
          </span>
          <h3 className="font-display font-extrabold text-2xl text-cream-50">
            {language === 'ta' ? 'அடுத்த பருவ சான்றளிக்கப்பட்ட விதைகளை இப்போதே முன்பதிவு செய்க' : 'Reserve Certified VBN 8 Pulse Seeds in Advance'}
          </h3>
          <p className="text-xs text-sage-200">
            Direct allocation from TNAU National Pulses Research Centre, Vamban. Guarantees 90%+ germination rate.
          </p>
        </div>

        <button
          onClick={() => navigate('/seed-passport')}
          className="px-6 py-3.5 bg-harvest-400 hover:bg-harvest-500 text-forest-950 font-bold text-xs rounded-xl shadow-gold transition-all shrink-0"
        >
          {language === 'ta' ? 'விதை பாஸ்போர்ட் திறக்க' : 'Reserve Certified Seeds'}
        </button>
      </div>
    </div>
  );
};
