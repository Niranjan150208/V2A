import React, { useState } from 'react';
import { FileSpreadsheet, CircleDollarSign, TrendingUp, Calculator, ArrowRight, ShieldCheck, PieChart } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const BudgetPlannerPage: React.FC = () => {
  const { language, navigate } = useNavigation();

  const [acres, setAcres] = useState(3.5);
  const [seedCost, setSeedCost] = useState(1800);
  const [ploughCost, setPloughCost] = useState(3200);
  const [plantingCost, setPlantingCost] = useState(4200);
  const [nutrientCost, setNutrientCost] = useState(4000);
  const [weedingCost, setWeedingCost] = useState(2800);
  const [harvestCost, setHarvestCost] = useState(4500);
  const [logisticsCost, setLogisticsCost] = useState(1000);

  // Revenue projections
  const [yieldBagsPerAcre, setYieldBagsPerAcre] = useState(32);
  const [pricePerBag, setPricePerBag] = useState(2280);

  // Mathematical Calculations
  const costPerAcre = seedCost + ploughCost + plantingCost + nutrientCost + weedingCost + harvestCost + logisticsCost;
  const totalCost = costPerAcre * acres;

  const totalBags = Math.round(yieldBagsPerAcre * acres);
  const totalKg = totalBags * 75;
  const grossRevenue = totalBags * pricePerBag;
  const netProfit = grossRevenue - totalCost;
  const roiPct = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;
  const costPerKg = totalKg > 0 ? (totalCost / totalKg).toFixed(2) : '0';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'சாகுபடி செலவு & லாபக் கணக்கீட்டாளர்' : 'Precision Crop Cultivation Budget Planner'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'சாகுபடி பட்ஜெட் கால்குலேட்டர்' : 'Per-Acre Farm Budget Calculator'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta' ? 'விதை முதல் அறுவடை வரை விரிவான செலவு மற்றும் லாப மதிப்பீடு' : 'Input variables and analyze expected returns, cost per kg, and seasonal ROI'}
          </p>
        </div>

        <button
          onClick={() => navigate('/crop-journey')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'உண்மையான பயிர் வரவு-செலவு' : 'View Actual Farm Ledger'}
        </button>
      </div>

      {/* Top Real-time Projected Margin Summary Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-paddy-900 rounded-3xl p-6 sm:p-8 text-cream-100 shadow-agro grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-xs font-bold text-sage-300 uppercase tracking-wider">{language === 'ta' ? 'மொத்த சாகுபடி செலவு' : 'Total Expenses'}</span>
          <p className="font-display font-black text-2xl sm:text-3xl text-cream-50 mt-1">₹{Math.round(totalCost).toLocaleString()}</p>
          <p className="text-[11px] text-sage-300 font-medium">₹{costPerAcre.toLocaleString()} / acre</p>
        </div>

        <div>
          <span className="text-xs font-bold text-sage-300 uppercase tracking-wider">{language === 'ta' ? 'எதிர்பார்க்கப்படும் விற்பனை' : 'Gross Revenue'}</span>
          <p className="font-display font-black text-2xl sm:text-3xl text-harvest-300 mt-1">₹{Math.round(grossRevenue).toLocaleString()}</p>
          <p className="text-[11px] text-sage-300 font-medium">{totalBags} bags @ ₹{pricePerBag}</p>
        </div>

        <div>
          <span className="text-xs font-bold text-sage-300 uppercase tracking-wider">{language === 'ta' ? 'நிகர லாபம் (Profit)' : 'Projected Net Margin'}</span>
          <p className="font-display font-black text-2xl sm:text-3xl text-paddy-400 mt-1">₹{Math.round(netProfit).toLocaleString()}</p>
          <p className="text-[11px] text-paddy-300 font-bold">ROI: {roiPct}% return</p>
        </div>

        <div>
          <span className="text-xs font-bold text-sage-300 uppercase tracking-wider">{language === 'ta' ? 'உற்பத்தி அடக்க விலை' : 'Cost of Production'}</span>
          <p className="font-display font-black text-2xl sm:text-3xl text-cream-50 mt-1">₹{costPerKg} <span className="text-xs font-normal">/ kg</span></p>
          <p className="text-[11px] text-sage-300 font-medium">MSP Benchmark: ₹23.20/kg</p>
        </div>
      </div>

      {/* Calculator Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Expense Parameters */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-sage-200">
            <h3 className="font-display font-bold text-lg text-forest-900">
              {language === 'ta' ? 'ஏக்கர் வாரியான செலவுகள் (திருத்தலாம்)' : 'Per-Acre Cost Variables (Editable)'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink-600">Land Area:</span>
              <input
                type="number"
                step="0.5"
                value={acres}
                onChange={(e) => setAcres(parseFloat(e.target.value) || 1)}
                className="w-20 px-2 py-1 bg-cream-50 border border-sage-300 rounded-lg text-xs font-bold text-center text-forest-900"
              />
              <span className="text-xs font-bold text-ink-600">Acres</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {language === 'ta' ? '1. விதை & நாற்றங்கால் செலவு' : '1. Seeds & Nursery Prep'}
              </label>
              <input
                type="number"
                value={seedCost}
                onChange={(e) => setSeedCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-ink-500 mt-1">Certified seed bags + Azospirillum + polythene sheet</p>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {language === 'ta' ? '2. உழவு & சேற்றுழவு இயந்திரம்' : '2. Tractor Ploughing & Puddling'}
              </label>
              <input
                type="number"
                value={ploughCost}
                onChange={(e) => setPloughCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-ink-500 mt-1">Summer dry rotavator + 2 passes puddle levelling</p>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {language === 'ta' ? '3. நடுவு (இயந்திரம் / கை நடுவு)' : '3. Transplanting / Planting Labour'}
              </label>
              <input
                type="number"
                value={plantingCost}
                onChange={(e) => setPlantingCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-ink-500 mt-1">Automatic transplanter rent + pulling labour</p>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {language === 'ta' ? '4. உரங்கள் & உயிரி ஊட்டச்சத்துக்கள்' : '4. Fertilizers & Bio-Nutrients'}
              </label>
              <input
                type="number"
                value={nutrientCost}
                onChange={(e) => setNutrientCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-ink-500 mt-1">Neem cake + basal SSP + split urea + Zinc sulphate</p>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {language === 'ta' ? '5. களையெடுத்தல் & பயிர் பாதுகாப்பு' : '5. Weeding & Bio-Protection'}
              </label>
              <input
                type="number"
                value={weedingCost}
                onChange={(e) => setWeedingCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-ink-500 mt-1">Cono-weeder + 1 hand weeding + Neem oil bio-spray</p>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
              <label className="block text-xs font-bold text-forest-900 mb-1">
                {language === 'ta' ? '6. இயந்திர அறுவடை & மூட்டை பிடித்தல்' : '6. Harvester Rental & Bagging'}
              </label>
              <input
                type="number"
                value={harvestCost}
                onChange={(e) => setHarvestCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-ink-500 mt-1">Combine harvester machine + gunny bagging wages</p>
            </div>
          </div>
        </div>

        {/* Right Col: Revenue & Harvest Yield Drivers */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
          <h3 className="font-display font-bold text-lg text-forest-900">
            {language === 'ta' ? 'மகசூல் & வருவாய் கணக்கீடு' : 'Yield & Revenue Forecast'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                {language === 'ta' ? 'எதிர்பார்க்கும் மகசூல் (மூட்டை/ஏக்கர்)' : 'Yield / Acre (75kg Bags)'}
              </label>
              <input
                type="number"
                value={yieldBagsPerAcre}
                onChange={(e) => setYieldBagsPerAcre(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-paddy-700 font-semibold mt-1">Total: {totalBags} bags ({totalKg.toLocaleString()} kg)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                {language === 'ta' ? 'மூட்டை ஒன்றுக்கான உத்தேச விலை (₹)' : 'Expected Price per Bag (₹)'}
              </label>
              <input
                type="number"
                step="20"
                value={pricePerBag}
                onChange={(e) => setPricePerBag(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
              />
              <p className="text-[10px] text-ink-500 mt-1">Direct Rice Mill benchmark: ₹2,280/bag</p>
            </div>

            <div className="p-4 bg-cream-100 rounded-2xl border border-sage-300 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-ink-600">Net Return / Acre:</span>
                <span className="text-paddy-800 font-extrabold text-base">
                  ₹{Math.round(netProfit / acres).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-ink-600">Return on Cost:</span>
                <span className="text-forest-900 font-extrabold">{roiPct}% ROI</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/crop-journey')}
              className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
            >
              {language === 'ta' ? 'பயிர் பயண பாஸ்போர்ட்டில் ஒப்பிட' : 'Compare with Actual Journey'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
