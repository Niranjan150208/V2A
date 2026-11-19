import React, { useState } from 'react';
import {
  Sprout,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Send,
  GitCompare
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const CropPlannerPage: React.FC = () => {
  const { language, navigate } = useNavigation();
  const state = AppStore.getState();

  // User input criteria
  const [district, setDistrict] = useState('Thanjavur');
  const [soilType, setSoilType] = useState('Clay Loam');
  const [landAcres, setLandAcres] = useState(3.5);
  const [waterAvailability, setWaterAvailability] = useState<'High' | 'Medium' | 'Low'>('High');
  const [targetSeason, setTargetSeason] = useState('Samba (Main-Rabi)');
  const [budgetPerAcre, setBudgetPerAcre] = useState(22000);

  // Expert question state
  const [expertQuestion, setExpertQuestion] = useState('');
  const [expertSubmitted, setExpertSubmitted] = useState(false);

  // Active tab for Comparison vs Suitability
  const [activeTab, setActiveTab] = useState<'advisory' | 'compare' | 'prices'>('advisory');

  // Interactive suitability logic with explicit explanation
  const calculateSuitability = (crop: any) => {
    let score = 70;
    const reasons: string[] = [];

    if (crop.idealSoilTypes.includes(soilType)) {
      score += 15;
      reasons.push(language === 'ta' ? `மண் வகை (${soilType}) இந்த பயிருக்கு மிகவும் பொருத்தமானது.` : `Matches ideal soil profile (${soilType}).`);
    } else {
      score -= 10;
      reasons.push(language === 'ta' ? `மண் வகைக்கு கூடுதல் அங்கக உரம் தேவைப்படலாம்.` : `Suboptimal soil type; requires organic amendment.`);
    }

    if (waterAvailability === 'High' && crop.waterRequirement === 'High') {
      score += 10;
      reasons.push(language === 'ta' ? 'கால்வாய் பாசன வசதி நெல் வளர்ச்சிக்கு உகந்தது.' : 'Ample canal water availability aligns with high water demand.');
    } else if (waterAvailability === 'Low' && crop.waterRequirement === 'Low') {
      score += 15;
      reasons.push(language === 'ta' ? 'குறைந்த நீரில் அதிக லாபம் தரும் பயிர்.' : 'Drought-hardy crop fits water scarcity.');
    } else if (waterAvailability === 'Low' && crop.waterRequirement === 'High') {
      score -= 25;
      reasons.push(language === 'ta' ? 'நீர் பற்றாக்குறை ஆபத்து அதிகம்.' : 'Severe water deficit risk.');
    }

    if (crop.recommendedSeasons.includes(targetSeason)) {
      score += 10;
      reasons.push(language === 'ta' ? `பருவகால வெப்பநிலை (${targetSeason}) உகந்தது.` : `Recommended season (${targetSeason}) maximizes grain filling.`);
    }

    return {
      score: Math.min(Math.max(score, 45), 98),
      reasons,
    };
  };

  const handleAskExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertQuestion) return;
    setExpertSubmitted(true);
    setTimeout(() => {
      setExpertQuestion('');
      setExpertSubmitted(false);
      alert(language === 'ta' ? 'உங்கள் கேள்வி KVK வேளாண் விஞ்ஞானிக்கு அனுப்பப்பட்டது.' : 'Your query has been submitted to ICAR-KVK Agronomist.');
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'அறிவார்ந்த பயிர் திட்டமிடல்' : 'Agronomic Crop Suitability Engine'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'பயிர் தேர்வு & சாத்தியக்கூறுகள்' : 'Crop Advisory & Feasibility Matrix'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta'
              ? 'மண்வளம், பாசன வசதி, மற்றும் சந்தை மதிப்பீட்டின் அடிப்படையில் வெளிப்படையான பரிந்துரை'
              : 'Deterministic recommendations based on soil test, water availability, and agro-climatic zones'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('advisory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'advisory' ? 'bg-forest-800 text-harvest-300' : 'bg-white text-ink-700 border border-sage-300'
            }`}
          >
            {language === 'ta' ? 'பரிந்துரைகள்' : 'Suitability'}
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'compare' ? 'bg-forest-800 text-harvest-300' : 'bg-white text-ink-700 border border-sage-300'
            }`}
          >
            {language === 'ta' ? 'பயிர் ஒப்பீடு' : 'Crop Comparison'}
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prices' ? 'bg-forest-800 text-harvest-300' : 'bg-white text-ink-700 border border-sage-300'
            }`}
          >
            {language === 'ta' ? 'விலை வரலாறு' : 'Mandi Trends'}
          </button>
        </div>
      </div>

      {/* Input Parameter Form Card */}
      <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sage-200">
          <h3 className="font-display font-bold text-base text-forest-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-harvest-600" />
            <span>{language === 'ta' ? 'உங்கள் பண்ணை விபரங்களை மாற்றியமைக்க:' : 'Configure Farm Parameters:'}</span>
          </h3>
          <span className="text-[11px] font-semibold text-paddy-700 bg-paddy-50 px-2.5 py-0.5 rounded-full">
            {language === 'ta' ? 'டெல்டா பகுதி மாதிரி தர்க்கம்' : 'Delta Demo Logic Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-ink-600 mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
            >
              <option value="Thanjavur">Thanjavur</option>
              <option value="Tiruvarur">Tiruvarur</option>
              <option value="Nagapattinam">Nagapattinam</option>
              <option value="Madurai">Madurai</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-600 mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
            >
              <option value="Clay Loam">Clay Loam</option>
              <option value="Alluvial">Alluvial</option>
              <option value="Red Sandy Loam">Red Sandy Loam</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-600 mb-1">Land (Acres)</label>
            <input
              type="number"
              value={landAcres}
              onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
              className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-600 mb-1">Water Supply</label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value as any)}
              className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
            >
              <option value="High">High (Canal + Bore)</option>
              <option value="Medium">Medium (Borewell)</option>
              <option value="Low">Low (Rainfed)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-600 mb-1">Season</label>
            <select
              value={targetSeason}
              onChange={(e) => setTargetSeason(e.target.value)}
              className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
            >
              <option value="Samba (Main-Rabi)">Samba (Main-Rabi)</option>
              <option value="Kuruvai (Summer-Kharif)">Kuruvai (Kharif)</option>
              <option value="Navarai (Summer)">Navarai (Summer)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-600 mb-1">Budget / Acre (₹)</label>
            <input
              type="number"
              step="1000"
              value={budgetPerAcre}
              onChange={(e) => setBudgetPerAcre(parseFloat(e.target.value) || 10000)}
              className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: Advisory Recommendations */}
      {activeTab === 'advisory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.crops.map((crop) => {
              const suitability = calculateSuitability(crop);
              const estCost = crop.avgCostPerAcre * landAcres;
              const estYieldBags = crop.avgYieldBagsPerAcre * landAcres;
              const estGross = estYieldBags * (crop.marketRateRange.max * 0.95);
              const estNet = estGross - estCost;

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro hover:border-paddy-500 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header with Suitability Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                          {crop.category} • {crop.durationDays} Days
                        </span>
                        <h3 className="font-display font-extrabold text-xl text-forest-900 mt-1">
                          {language === 'ta' ? crop.tamilName : crop.name}
                        </h3>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 bg-forest-800 text-harvest-300 px-3 py-1 rounded-xl font-black text-sm">
                          <span>{suitability.score}%</span>
                        </div>
                        <p className="text-[10px] text-ink-500 font-semibold mt-0.5">
                          {language === 'ta' ? 'பொருத்தம்' : 'Suitability Match'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-ink-600 mb-4">
                      {language === 'ta' ? crop.tamilDescription : crop.description}
                    </p>

                    {/* Why this crop appears (Requirement A) */}
                    <div className="p-3 bg-cream-100 rounded-2xl border border-sage-300 space-y-1.5 mb-4">
                      <p className="text-[11px] font-bold text-forest-900 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-paddy-600" />
                        <span>{language === 'ta' ? 'ஏன் இந்த பயிர் பரிந்துரைக்கப்படுகிறது?' : 'Why this crop was suggested:'}</span>
                      </p>
                      <ul className="space-y-1 text-xs text-ink-700">
                        {suitability.reasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-paddy-600 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial Projection on this Parcel */}
                    <div className="grid grid-cols-3 gap-2 text-center p-3 bg-sage-50 rounded-2xl border border-sage-200 mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-ink-500 uppercase">{language === 'ta' ? 'மதிப்பீட்டு செலவு' : 'Est. Expenses'}</p>
                        <p className="font-bold text-sm text-forest-900">₹{Math.round(estCost).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-500 uppercase">{language === 'ta' ? 'எதிர்பார்க்கும் மகசூல்' : 'Est. Yield'}</p>
                        <p className="font-bold text-sm text-forest-900">{Math.round(estYieldBags)} Bags</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-500 uppercase">{language === 'ta' ? 'நிகர வரவு' : 'Est. Margin'}</p>
                        <p className="font-bold text-sm text-paddy-700">₹{Math.round(estNet).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => navigate('/budget-planner')}
                      className="flex-1 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl hover:bg-forest-900 transition-colors text-center"
                    >
                      {language === 'ta' ? 'வரவு-செலவு கணக்கிடு' : 'Budget Calculator'}
                    </button>
                    <button
                      onClick={() => navigate('/seed-passport')}
                      className="py-2.5 px-3 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl hover:bg-sage-100 transition-colors"
                    >
                      {language === 'ta' ? 'விதை பாஸ்போர்ட்' : 'Seed QR'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Crop Comparison Matrix */}
      {activeTab === 'compare' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
          <h3 className="font-display font-bold text-xl text-forest-900">
            {language === 'ta' ? 'பயிர் ஒப்பீட்டு அட்டவணை (Comparison)' : 'Crop Side-by-Side Comparison'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sage-300 bg-cream-100">
                  <th className="p-3 font-bold text-forest-900">Parameters</th>
                  {state.crops.map((c) => (
                    <th key={c.id} className="p-3 font-bold text-forest-900">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-200">
                <tr>
                  <td className="p-3 font-bold text-ink-600">Duration (Days)</td>
                  {state.crops.map(c => <td key={c.id} className="p-3 font-semibold">{c.durationDays} days</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink-600">Water Requirement</td>
                  {state.crops.map(c => <td key={c.id} className="p-3 font-semibold">{c.waterRequirement}</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink-600">Avg Cost / Acre</td>
                  {state.crops.map(c => <td key={c.id} className="p-3 font-semibold">₹{c.avgCostPerAcre.toLocaleString()}</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink-600">Average Yield / Acre</td>
                  {state.crops.map(c => <td key={c.id} className="p-3 font-semibold">{c.avgYieldBagsPerAcre} bags</td>)}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink-600">Govt MSP / Benchmark</td>
                  {state.crops.map(c => <td key={c.id} className="p-3 font-semibold text-paddy-700">₹{c.mspPerQuintal}/Qtl</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Historical Market Price Trends (Demo Data) */}
      {activeTab === 'prices' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-forest-900">
              {language === 'ta' ? 'வரலாற்று சந்தை விலை நிலவரம் (மாதிரி தகவல்)' : 'Historical Agmarknet Mandi Price Trends (Demo Data)'}
            </h3>
            <span className="text-xs text-ink-500">Thanjavur & Delta Regulated Markets</span>
          </div>

          <p className="text-xs text-ink-600">
            {language === 'ta'
              ? 'குறிப்பு: இந்த வரைபடம் கடந்த 6 மாத டெல்டா மண்டல மாதிரி விலைகளை காட்டுகிறது. நேரடி அரசு இணையதள தகவலாக கருத வேண்டாம்.'
              : 'Clearly Identified Demo Data: Shows representative modal procurement prices per 75kg bag over the last 6 months.'}
          </p>

          <div className="grid grid-cols-6 gap-2 pt-4 items-end h-48 bg-cream-50 p-4 rounded-2xl border border-sage-200">
            {[
              { month: 'Aug', price: 2180, height: '65%' },
              { month: 'Sep', price: 2210, height: '70%' },
              { month: 'Oct', price: 2190, height: '68%' },
              { month: 'Nov', price: 2250, height: '78%' },
              { month: 'Dec', price: 2270, height: '82%' },
              { month: 'Jan', price: 2320, height: '90%' },
            ].map((p, idx) => (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-forest-900 mb-1 group-hover:scale-110 transition-transform">
                  ₹{p.price}
                </span>
                <div
                  className="w-full bg-forest-800 hover:bg-paddy-600 rounded-t-xl transition-all"
                  style={{ height: p.height }}
                />
                <span className="text-[10px] font-bold text-ink-500 mt-2">{p.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Advice Request Form (Requirement A) */}
      <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-lg text-forest-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-paddy-600" />
          <span>{language === 'ta' ? 'வேளாண் விஞ்ஞானியிடம் ஆலோசனை கேட்க' : 'Request Agronomist / KVK Consultation'}</span>
        </h3>
        <p className="text-xs text-ink-600">
          {language === 'ta'
            ? 'மண்வளம், விதை ரகங்கள் மற்றும் பயிர் சுழற்சி குறித்து TNAU / KVK விஞ்ஞானிகளிடம் நேரடியாக கேள்வி கேட்கலாம்.'
            : 'Submit questions regarding variety selection, flood tolerance, or rotation directly to ICAR-KVK agricultural scientists.'}
        </p>

        <form onSubmit={handleAskExpert} className="space-y-3">
          <textarea
            value={expertQuestion}
            onChange={(e) => setExpertQuestion(e.target.value)}
            rows={3}
            required
            placeholder={
              language === 'ta'
                ? 'உங்கள் கேள்வியை இங்கே எழுதுங்கள்... (உதாரணம்: சம்பா பருவத்தில் CR 1009 Sub 1 விதைக்கு எவ்வளவு தழைச்சத்து தேவை?)'
                : 'Type your agronomist query here... (e.g., Optimal nitrogen split doses for flood-tolerant CR 1009 Sub 1 in clay loam?)'
            }
            className="w-full p-3 bg-white border border-sage-300 rounded-2xl text-xs font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'ta' ? 'கேள்வியை சமர்ப்பிக்கவும்' : 'Submit Consultation Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
