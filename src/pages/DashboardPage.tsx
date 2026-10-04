import React, { useState } from "react";
import {
  Wheat,
  Activity,
  CloudSun,
  ShieldCheck,
  TrendingUp,
  CircleDollarSign,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  ScrollText,
  Layers,
  RotateCcw,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { translations } from "../translations";

export const DashboardPage: React.FC = () => {
  const {
    navigate,
    language,
    activeSeasonId,
    setActiveSeasonId,
    triggerRefresh,
  } = useNavigation();
  const t = translations[language];

  const state = AppStore.getState();
  const isDemoAccount = state.currentUser.id === "USER-VIJAY-DEMO";
  const activeSeason =
    state.seasons.find((s) => s.id === activeSeasonId) || state.seasons[0];
  const financials = AppStore.calculateSeasonFinancials(activeSeason.id);

  // Quick Expense modal state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCategory, setNewExpCategory] = useState<any>("Bio-Inputs");

  const handleAddQuickExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc || !newExpAmount) return;

    AppStore.addExpense({
      seasonId: activeSeason.id,
      category: newExpCategory,
      description: newExpDesc,
      amount: parseFloat(newExpAmount),
      date: new Date().toISOString().split("T")[0],
      paymentMode: "Cash",
      paidTo: "Local Agri Vendor",
    });

    setNewExpDesc("");
    setNewExpAmount("");
    setShowExpenseModal(false);
    triggerRefresh();
  };

  const handleResetDemo = () => {
    const confirmed = window.confirm(
      "Reset this browser's demo data? Local edits and trade records will be cleared.",
    );
    if (!confirmed) return;
    const resetState = AppStore.resetToDemo();
    setActiveSeasonId(resetState.activeSeasonId);
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Active Season Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-forest-900 via-forest-800 to-paddy-900 rounded-3xl p-6 sm:p-8 text-cream-100 shadow-agro border border-forest-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-harvest-400 text-forest-950 font-bold px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider">
                {activeSeason.seasonCode}
              </span>
              <span className="text-xs text-sage-200">
                {state.farmer.village}, {state.farmer.district}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-cream-50">
              {language === "ta"
                ? state.farmer.tamilFullName
                : state.farmer.fullName}{" "}
              —{" "}
              <span className="text-harvest-400">
                {language === "ta"
                  ? activeSeason.tamilCropName || activeSeason.cropName
                  : activeSeason.cropName}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-sage-200">
              {activeSeason.parcelName} • {activeSeason.areaAcres}{" "}
              {language === "ta" ? "ஏக்கர்" : "Acres"} • {activeSeason.variety}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {language === "ta" ? "செலவு சேர்க்க" : "Add Field Expense"}
              </span>
            </button>

            <button
              onClick={() => navigate("/crop-journey")}
              className="flex items-center gap-2 px-4 py-2.5 bg-harvest-400 hover:bg-harvest-500 text-forest-950 font-bold text-xs rounded-xl shadow-gold transition-all"
            >
              <ScrollText className="w-4 h-4 text-forest-900" />
              <span>
                {language === "ta"
                  ? "பயிர் பயணம் (Passport)"
                  : "Crop Journey Passport"}
              </span>
            </button>

            {isDemoAccount && (
              <button
                onClick={handleResetDemo}
                title="Clear local demo edits and restart the harvest-to-sale walkthrough"
                className="flex items-center gap-2 rounded-xl border border-cream-100/30 bg-forest-950/30 px-4 py-2.5 text-xs font-bold text-cream-100 transition-colors hover:bg-forest-950/60"
              >
                <RotateCcw className="h-4 w-4" />
                <span>
                  {language === "ta"
                    ? "டெமோவை மீட்டமை"
                    : "Reset demo journey"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Season Stage Progress Bar */}
        <div className="mt-6 pt-4 border-t border-forest-700/80">
          <div className="flex items-center justify-between text-xs text-sage-200 mb-2">
            <span className="font-semibold text-harvest-300">
              {language === "ta" ? "சாகுபடி நிலை:" : "Current Lifecycle Stage:"}{" "}
              {activeSeason.stage}
            </span>
            <span>
              {language === "ta" ? "அறுவடை இலக்கு: " : "Target: "}{" "}
              {activeSeason.targetYieldBags}{" "}
              {language === "ta" ? "மூட்டைகள்" : "Bags"}
            </span>
          </div>
          <div className="w-full h-3 bg-forest-950/60 rounded-full overflow-hidden p-0.5 border border-forest-600">
            <div
              className="h-full bg-gradient-to-r from-paddy-500 via-harvest-400 to-harvest-300 rounded-full transition-all duration-500"
              style={{
                width: activeSeason.stage === "Sold & Settled" ? "100%" : "65%",
              }}
            />
          </div>
        </div>
      </div>

      {/* 4 Core Financial & Field Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Land */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.metrics.activeAcres}
            </span>
            <div className="p-2 bg-paddy-50 text-paddy-700 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-forest-900">
              {activeSeason.areaAcres}{" "}
              <span className="text-sm font-semibold text-ink-500">
                {language === "ta" ? "ஏக்கர்" : "Acres"}
              </span>
            </p>
            <p className="text-xs text-paddy-700 font-medium mt-1">
              ✓ {activeSeason.seasonName}
            </p>
          </div>
        </div>

        {/* Card 2: Total Cultivation Expenses */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.metrics.investedCost}
            </span>
            <div className="p-2 bg-terracotta-50 text-terracotta-700 rounded-xl">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-forest-900">
              ₹{financials.totalExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-ink-500 font-medium mt-1">
              {financials.expenseCount}{" "}
              {language === "ta" ? "செலவு பதிவுகள்" : "Recorded entries"}
            </p>
          </div>
        </div>

        {/* Card 3: Realized Net Cashflow */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              {t.metrics.netProfit}
            </span>
            <div className="p-2 bg-forest-50 text-forest-800 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-paddy-700">
              ₹{financials.realizedCashflow.toLocaleString()}
            </p>
            <p className="text-xs text-paddy-800 font-semibold mt-1">
              {language === "ta"
                ? "வரவு பெற்ற தொகை - செலவுகள்"
                : "Received payments - expenses"}
            </p>
          </div>
        </div>

        {/* Card 4: Pending Payments (SEPARATE!) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-harvest-400 shadow-agro flex flex-col justify-between bg-harvest-50/40">
          <div className="flex items-center justify-between text-ink-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
              {t.metrics.pendingDues}
            </span>
            <div className="p-2 bg-harvest-400 text-forest-950 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-2xl text-terracotta-600">
              ₹{financials.pendingPayments.toLocaleString()}
            </p>
            <p className="text-[10px] text-ink-600 font-bold mt-1">
              ⚠{" "}
              {language === "ta"
                ? "வங்கியில் வரவு வைக்கப்படாத தொகை"
                : "Not counted as received income"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Weather Alert + Field Tasks + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Urgent Alerts & Tasks (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hyperlocal Weather Alert Card */}
          <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cream-200 text-harvest-600 flex items-center justify-center border border-harvest-400/40 shrink-0">
                <CloudSun className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-forest-900">
                    {state.farmer.village} / {state.farmer.district}
                  </span>
                  <span className="bg-paddy-100 text-paddy-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {language === "ta" ? "அறுவடைக்கு உகந்தது" : "Dry & Sunny"}
                  </span>
                </div>
                <p className="font-display font-black text-2xl text-forest-900 mt-0.5">
                  29°C{" "}
                  <span className="text-sm font-normal text-ink-600">
                    • Humidity 68% • Wind 12 km/h
                  </span>
                </p>
                <p className="text-xs text-ink-600 mt-1">
                  {language === "ta"
                    ? "அடுத்த 4 நாட்களுக்கு மிதமான வெயில். நெல் அறுவடை மற்றும் உலர்த்துவதற்கு உகந்த காலம்."
                    : "Clear skies forecast for next 4 days. Optimal window for mechanical harvesting and sun drying."}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/weather")}
              className="shrink-0 px-4 py-2 rounded-xl bg-forest-800 text-harvest-300 font-bold text-xs hover:bg-forest-700 transition-colors"
            >
              {language === "ta" ? "வானிலை விபரம்" : "7-Day Forecast"}
            </button>
          </div>

          {/* Connected Operational Tasks */}
          <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-forest-900">
                  {language === "ta"
                    ? "நடப்பு பருவ களப் பணிகள்"
                    : "Active Season Field Checklist"}
                </h3>
                <p className="text-xs text-ink-500">
                  {language === "ta"
                    ? "விதைப்பு முதல் அறுவடை வரை திட்டமிடப்பட்ட பணிகள்"
                    : "Chronological agronomic operations for active parcel"}
                </p>
              </div>
              <button
                onClick={() => navigate("/farm-calendar")}
                className="text-xs font-bold text-paddy-700 hover:text-paddy-900 flex items-center gap-1"
              >
                <span>
                  {language === "ta" ? "முழு நாட்காட்டி" : "Full Calendar"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {state.tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-sage-200 bg-cream-50/50 hover:bg-cream-100/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {task.status === "Completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-paddy-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-harvest-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-forest-900">
                        {language === "ta"
                          ? task.tamilTitle || task.title
                          : task.title}
                      </h4>
                      <p className="text-[11px] text-ink-500">
                        {task.cropStage} • {task.scheduledDate}{" "}
                        {task.actualCost ? `• Cost: ₹${task.actualCost}` : ""}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === "Completed"
                        ? "bg-paddy-100 text-paddy-800"
                        : "bg-harvest-100 text-forest-900"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Action Grid & Soil Health Summary */}
        <div className="space-y-6">
          {/* Quick Action Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4">
            <h3 className="font-display font-bold text-base text-forest-900">
              {language === "ta" ? "விரைவு செயல்பாடுகள்" : "Quick Actions"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/seed-passport")}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-sage-300 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-800 text-harvest-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-forest-900">
                  {language === "ta" ? "விதை QR ஆய்வு" : "Verify Seed QR"}
                </span>
                <span className="text-[10px] text-ink-500 mt-0.5">
                  TSSCA Certified
                </span>
              </button>

              <button
                onClick={() => navigate("/crop-doctor")}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-sage-300 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-paddy-700 text-cream-50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-forest-900">
                  {language === "ta" ? "AI பயிர் மருத்துவர்" : "AI Crop Doctor"}
                </span>
                <span className="text-[10px] text-ink-500 mt-0.5">
                  Leaf Diagnosis
                </span>
              </button>

              <button
                onClick={() => navigate("/offers")}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-sage-300 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-harvest-400 text-forest-950 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Wheat className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-forest-900">
                  {language === "ta" ? "கொள்முதல் ஏலம்" : "Buyer Offers"}
                </span>
                <span className="text-[10px] text-paddy-700 font-bold mt-0.5">
                  {language === "ta" ? "சலுகைகளைப் பார்க்க" : "Review bids"}
                </span>
              </button>

              <button
                onClick={() => navigate("/net-proceeds")}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-sage-300 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-900 text-cream-50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-forest-900">
                  {language === "ta" ? "நிகர லாபக் கணக்கு" : "Net Proceeds"}
                </span>
                <span className="text-[10px] text-ink-500 mt-0.5">
                  Post deductions
                </span>
              </button>
            </div>
          </div>

          {/* Soil Health Card Mini Widget */}
          <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-paddy-600" />
                <h4 className="font-bold text-sm text-forest-900">
                  {language === "ta"
                    ? "மண் பரிசோதனை சுருக்கம்"
                    : "Soil Health Status"}
                </h4>
              </div>
              <button
                onClick={() => navigate("/soil-health")}
                className="text-xs font-bold text-paddy-700 hover:underline"
              >
                {language === "ta" ? "முழு அறிக்கை" : "View Card"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-cream-100 rounded-xl border border-sage-200">
                <p className="text-[10px] font-bold text-ink-500">pH Level</p>
                <p className="text-sm font-extrabold text-paddy-700">7.1</p>
                <p className="text-[9px] text-forest-800">Neutral (சரியானது)</p>
              </div>

              <div className="p-2 bg-cream-100 rounded-xl border border-sage-200">
                <p className="text-[10px] font-bold text-ink-500">Org Carbon</p>
                <p className="text-sm font-extrabold text-forest-900">0.68%</p>
                <p className="text-[9px] text-forest-800">Medium</p>
              </div>

              <div className="p-2 bg-cream-100 rounded-xl border border-sage-200">
                <p className="text-[10px] font-bold text-ink-500">Zinc (Zn)</p>
                <p className="text-sm font-extrabold text-terracotta-600">
                  Deficient
                </p>
                <p className="text-[9px] text-terracotta-700">Treated ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-forest-900">
              {language === "ta"
                ? "புதிய விவசாய செலவு பதிவு"
                : "Record New Field Expense"}
            </h3>
            <form onSubmit={handleAddQuickExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta" ? "செலவு வகை (Category)" : "Category"}
                </label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Seeds">Seeds (விதை)</option>
                  <option value="Fertilizers">Fertilizers (உரம்)</option>
                  <option value="Bio-Inputs">Bio-Inputs (உயிரி உரங்கள்)</option>
                  <option value="Labour">Labour (கூலி)</option>
                  <option value="Machinery">Machinery (இயந்திர வாடகை)</option>
                  <option value="Irrigation">Irrigation (பாசனம்)</option>
                  <option value="Transport">Transport (போக்குவரத்து)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta" ? "விளக்கம் (Description)" : "Description"}
                </label>
                <input
                  type="text"
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  required
                  placeholder="e.g. Zinc Sulphate 10kg + Neem Cake"
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  {language === "ta" ? "தொகை (Amount in ₹)" : "Amount (₹)"}
                </label>
                <input
                  type="number"
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  required
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600 hover:bg-sage-100"
                >
                  {t.actions.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-800 text-harvest-300 font-bold text-xs hover:bg-forest-900 shadow-sm"
                >
                  {t.actions.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
