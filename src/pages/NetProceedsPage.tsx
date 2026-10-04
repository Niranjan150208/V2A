import React, { useState } from 'react';
import { CircleDollarSign, Calculator, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Minus, Plus } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const NetProceedsPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  const [bags, setBags] = useState(110);
  const [ratePerBag, setRatePerBag] = useState(2280);
  const [mandiCessPct, setMandiCessPct] = useState(1.0);
  const [baggingRate, setBaggingRate] = useState(30);
  const [freightCost, setFreightCost] = useState(3500);
  const [moisturePenalty, setMoisturePenalty] = useState(0); // 0 because 13.8% moisture

  // Financial Computations
  const grossSale = bags * ratePerBag;
  const mandiCess = Math.round((grossSale * mandiCessPct) / 100);
  const totalBagging = bags * baggingRate;
  const totalDeductions = mandiCess + totalBagging + freightCost + moisturePenalty;
  const netProceeds = grossSale - totalDeductions;

  // Cultivation Cost from active season
  const totalExpenses = 75100;
  const finalProfit = netProceeds - totalExpenses;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <CircleDollarSign className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'வெளிப்படையான நிகர வருமானக் கணக்கீடு' : 'Transparent Realized Proceeds Engine'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'நிகர விற்பனை வரவு கால்குலேட்டர்' : 'Net Proceeds & Deductions Calculator'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta'
              ? 'மொத்த விற்பனைத் தொகையிலிருந்து செஸ், மூட்டை பிடித்தல் மற்றும் போக்குவரத்து கழிவுகள்'
              : 'Audit every single statutory deduction between gross buyer invoice and bank settlement'}
          </p>
        </div>

        <button
          onClick={() => navigate('/crop-journey')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'பயிர் பயணம் (Crop Journey)' : 'View Crop Journey'}
        </button>
      </div>

      {/* Top Net Result Cards */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-paddy-900 rounded-3xl p-6 sm:p-8 text-cream-100 shadow-agro grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-xs font-bold text-sage-300 uppercase tracking-wider block">Gross Produce Invoice</span>
          <p className="font-display font-black text-3xl sm:text-4xl text-cream-50 mt-1">
            ₹{grossSale.toLocaleString()}
          </p>
          <p className="text-xs text-sage-200 mt-1">{bags} Bags @ ₹{ratePerBag}/bag</p>
        </div>

        <div>
          <span className="text-xs font-bold text-sage-300 uppercase tracking-wider block">Total Deductions</span>
          <p className="font-display font-black text-3xl sm:text-4xl text-terracotta-400 mt-1">
            -₹{totalDeductions.toLocaleString()}
          </p>
          <p className="text-xs text-sage-200 mt-1">Cess + Bagging + Freight</p>
        </div>

        <div>
          <span className="text-xs font-bold text-sage-300 uppercase tracking-wider block">Net Sale in Bank</span>
          <p className="font-display font-black text-3xl sm:text-4xl text-harvest-400 mt-1">
            ₹{netProceeds.toLocaleString()}
          </p>
          <p className="text-xs text-paddy-300 font-bold mt-1">
            Realized Margin: ₹{finalProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Detailed Deduction Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === 'ta' ? 'கழிவுகள் விபரம் (Itemized Deductions)' : 'Statutory & Logistic Deductions Breakdown'}
        </h3>

        <div className="divide-y divide-sage-200 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-forest-900 text-sm">1. Gross Produce Value</span>
              <p className="text-ink-500">110 bags x 75 kg = 8,250 kg @ contracted rate</p>
            </div>
            <span className="font-display font-black text-base text-forest-900">
              ₹{grossSale.toLocaleString()}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-forest-900 text-sm">2. Regulated Market Cess / Mandi Fee (1.0%)</span>
              <p className="text-ink-500">Tamil Nadu Agricultural Marketing Board statutory fee</p>
            </div>
            <span className="font-bold text-sm text-terracotta-700">
              -₹{mandiCess.toLocaleString()}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-forest-900 text-sm">3. Gunny Bags & Machine Stitching</span>
              <p className="text-ink-500">110 standard jute bags @ ₹30 / bag</p>
            </div>
            <span className="font-bold text-sm text-terracotta-700">
              -₹{totalBagging.toLocaleString()}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-forest-900 text-sm">4. Freight & Transport to Mill</span>
              <p className="text-ink-500">Medium Truck Eicher 4T transport from Thiruvaiyaru to Mill</p>
            </div>
            <span className="font-bold text-sm text-terracotta-700">
              -₹{freightCost.toLocaleString()}
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-forest-900 text-sm">5. Moisture Content Penalty</span>
              <p className="text-paddy-700 font-semibold">Tested 13.8% (Below 14% max threshold - Zero penalty applied!)</p>
            </div>
            <span className="font-bold text-sm text-paddy-700">
              ₹0
            </span>
          </div>

          <div className="py-4 flex items-center justify-between bg-cream-100 px-4 rounded-2xl border border-sage-300">
            <div>
              <span className="font-display font-black text-forest-900 text-base">Net Proceeds Realized</span>
              <p className="text-ink-600">Contracted payable balance in bank NEFT</p>
            </div>
            <span className="font-display font-black text-2xl text-paddy-800">
              ₹{netProceeds.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Net Profit Realization vs Total Expenses */}
        <div className="p-6 bg-sage-50 rounded-3xl border border-sage-300 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink-600 uppercase">Season Total Field Expenses:</span>
            <span className="font-bold text-forest-900 text-sm">₹{totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink-600 uppercase">Net Realized Proceeds:</span>
            <span className="font-bold text-forest-900 text-sm">₹{netProceeds.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-sage-300">
            <div>
              <span className="font-display font-black text-forest-900 text-lg">Final Farm Net Margin (Profit)</span>
              <p className="text-[11px] text-ink-600">After all field inputs, machinery, labour, and marketing costs</p>
            </div>
            <span className="font-display font-black text-3xl text-paddy-700">
              ₹{finalProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
