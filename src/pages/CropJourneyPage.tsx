import React, { useState } from "react";
import {
  ScrollText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  CircleDollarSign,
  TrendingUp,
  Clock,
  Plus,
  Printer,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Scale,
  Wheat,
  Sprout,
  Truck,
  Store,
  Receipt,
  FileCheck,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { JourneyEvent } from "../types";

export const CropJourneyPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();
  const activeSeason =
    state.seasons.find((s) => s.id === activeSeasonId) || state.seasons[0];
  const financials = AppStore.calculateSeasonFinancials(activeSeason.id);
  const seasonSales = state.sales.filter(
    (sale) => sale.seasonId === activeSeason.id,
  );
  const seasonBagsSold = seasonSales.reduce(
    (total, sale) => total + sale.bagsSold,
    0,
  );
  const seasonSaleRate =
    seasonBagsSold > 0
      ? Math.round(
          seasonSales.reduce((total, sale) => total + sale.grossAmount, 0) /
            seasonBagsSold,
        )
      : 0;

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStage, setNewEventStage] = useState<any>("Crop Nutrition");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventCost, setNewEventCost] = useState("");

  const events = state.journeyEvents.filter(
    (ev) => ev.seasonId === activeSeason.id,
  );

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    AppStore.addJourneyEvent({
      seasonId: activeSeason.id,
      stage: newEventStage,
      title: newEventTitle,
      tamilTitle: newEventTitle,
      date: new Date().toISOString().split("T")[0],
      description: newEventDesc,
      costImpact: parseFloat(newEventCost) || 0,
      badge: "Farmer Logged",
    });

    if (parseFloat(newEventCost) > 0) {
      AppStore.addExpense({
        seasonId: activeSeason.id,
        category: "Bio-Inputs",
        description: newEventTitle,
        amount: parseFloat(newEventCost),
        date: new Date().toISOString().split("T")[0],
        paymentMode: "Cash",
        paidTo: "Field Log",
      });
    }

    setShowAddEventModal(false);
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventCost("");
    triggerRefresh();
  };

  const handleExportPassport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <ScrollText className="w-4 h-4 text-paddy-600" />
            <span>★ V2A Signature Agricultural Passport</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "பயிர் பயண பாஸ்போர்ட் (Crop Journey)"
              : "Crop Season Journey Passport"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "விதை தேர்வு முதல் வங்கி வரவு வரை இணைக்கப்பட்ட காலவரிசை டிஜிட்டல் ஆவணம்"
              : "Local demo timeline connecting sample seed, field, harvest, sale, and payment records"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddEventModal(true)}
            className="px-4 py-2.5 bg-paddy-700 hover:bg-paddy-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{language === "ta" ? "நிகழ்வு சேர்க்க" : "Add Event"}</span>
          </button>

          <button
            onClick={handleExportPassport}
            className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-harvest-400" />
            <span>
              {language === "ta"
                ? "பாஸ்போர்ட் அச்சிடுக"
                : "Print Demo Passport"}
            </span>
          </button>
        </div>
      </div>

      {/* Demo Passport Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 text-forest-900 shadow-agro border-2 border-harvest-400/70 relative overflow-hidden">
        {/* Subtle decorative grain background */}
        <div className="absolute inset-0 opacity-10 bg-paddy-contour pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-sage-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-harvest-400 text-forest-950 px-3 py-1 rounded-lg uppercase tracking-wider">
                PASSPORT: {activeSeason.seasonCode}
              </span>
              <span className="bg-sage-100 text-forest-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-paddy-700" />
                Demo profile · not verified
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 pt-1">
              {language === "ta"
                ? activeSeason.tamilCropName || activeSeason.cropName
                : activeSeason.cropName}
            </h2>
            <p className="text-sm font-semibold text-paddy-800">
              Variety: {activeSeason.variety}
            </p>
            <p className="text-xs text-ink-700">
              Farmer:{" "}
              <span className="font-bold text-forest-900">
                {state.farmer.fullName}
              </span>
              <br />
              Farm:{" "}
              <span className="font-bold text-forest-900">
                {state.farm.farmName}
              </span>{" "}
              ({activeSeason.areaAcres} Acres • {state.farmer.village},{" "}
              {state.farmer.district})
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-600 block">
              Lifecycle Timeline
            </span>
            <p className="font-mono text-xs font-bold text-forest-900">
              Sown: {activeSeason.sowingDate}
            </p>
            <p className="font-mono text-xs font-bold text-paddy-800">
              Harvested:{" "}
              {activeSeason.actualHarvestDate ||
                activeSeason.plannedHarvestDate}
            </p>
            <span className="inline-block mt-2 bg-paddy-100 text-paddy-900 font-black text-xs px-3 py-1 rounded-full">
              STATUS: {activeSeason.stage}
            </span>
          </div>
        </div>

        {/* Financial Bottomline Section (Requirement J & Strict Accounting Formula) */}
        <div className="relative z-10 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Expenses Formula */}
          <div className="p-4 bg-cream-50 rounded-2xl border border-sage-300 space-y-1">
            <span className="text-[10px] font-bold text-ink-700 uppercase tracking-wider block">
              Total Field Expenses
            </span>
            <p className="font-display font-black text-2xl text-terracotta-400">
              ₹{financials.totalExpenses.toLocaleString()}
            </p>
            <p className="text-[10px] text-ink-700">
              Inputs + Labour + Machinery + Logistics
            </p>
          </div>

          {/* Gross Sales */}
          <div className="p-4 bg-cream-50 rounded-2xl border border-sage-300 space-y-1">
            <span className="text-[10px] font-bold text-ink-700 uppercase tracking-wider block">
              Gross Produce Sale
            </span>
            <p className="font-display font-black text-2xl text-forest-950">
              ₹{financials.grossSales.toLocaleString()}
            </p>
            <p className="text-[10px] text-ink-700">
              {seasonBagsSold} bags
              {seasonBagsSold > 0
                ? ` @ ₹${seasonSaleRate.toLocaleString()} / bag`
                : " sold this season"}
            </p>
          </div>

          {/* Realized Net Farm Cashflow */}
          <div className="p-4 bg-paddy-50 rounded-2xl border-2 border-paddy-400 space-y-1">
            <span className="text-[10px] font-bold text-paddy-900 uppercase tracking-wider block">
              Realized Net Farm Cashflow
            </span>
            <p className="font-display font-black text-2xl text-paddy-900">
              ₹{financials.realizedCashflow.toLocaleString()}
            </p>
            <p className="text-[10px] text-paddy-900 font-bold">
              Formula: Received payments - expenses
            </p>
          </div>

          {/* Pending Buyer Dues (Must be shown separately!) */}
          <div className="p-4 bg-harvest-50 rounded-2xl border-2 border-harvest-500 space-y-1">
            <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider block">
              Pending Buyer Dues
            </span>
            <p className="font-display font-black text-2xl text-forest-950">
              ₹{financials.pendingPayments.toLocaleString()}
            </p>
            <p className="text-[10px] text-forest-900 font-bold">
              ⚠ Not counted as income until received
            </p>
          </div>
        </div>
      </div>

      {/* Connected Chronological Timeline of Events (Requirement J) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sage-200">
          <div>
            <h3 className="font-display font-black text-xl text-forest-900">
              {language === "ta"
                ? "காலவரிசை நிகழ்வுகள் & சான்றுகள்"
                : "Chronological Lifecycle Timeline"}
            </h3>
            <p className="text-xs text-ink-500">
              {language === "ta"
                ? "விதை ஆய்வு முதல் வங்கி தீர்வு வரை ஒவ்வொரு படியும் பதிவு செய்யப்பட்டுள்ளது"
                : "Complete chronological history linking all 10 stages of cultivation"}
            </p>
          </div>
          <span className="text-xs font-bold text-forest-800 bg-cream-200 px-3 py-1 rounded-full">
            {events.length} Demo Milestones
          </span>
        </div>

        {/* Timeline Event Cards */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-sage-300">
          {events.map((ev, idx) => (
            <div key={ev.id} className="relative group">
              {/* Timeline Circle Bullet */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm transition-transform group-hover:scale-110 ${
                  ev.incomeImpact
                    ? "bg-paddy-600 text-white"
                    : ev.costImpact
                      ? "bg-forest-800 text-harvest-300"
                      : "bg-harvest-400 text-forest-950"
                }`}
              >
                {idx + 1}
              </div>

              {/* Event Body */}
              <div className="p-5 rounded-3xl border border-sage-300 bg-cream-50/50 hover:bg-cream-100/60 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-100 px-2 py-0.5 rounded-full">
                      {ev.stage}
                    </span>
                    <span className="text-xs font-mono font-bold text-ink-500">
                      {ev.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.costImpact ? (
                      <span className="text-xs font-bold text-terracotta-700 bg-terracotta-50 px-2.5 py-0.5 rounded-lg border border-terracotta-200">
                        Cost: -₹{ev.costImpact.toLocaleString()}
                      </span>
                    ) : null}

                    {ev.incomeImpact ? (
                      <span className="text-xs font-bold text-paddy-800 bg-paddy-100 px-2.5 py-0.5 rounded-lg border border-paddy-300">
                        Invoiced: +₹{ev.incomeImpact.toLocaleString()}
                      </span>
                    ) : null}

                    {ev.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-forest-800 text-harvest-300">
                        {ev.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-display font-extrabold text-base text-forest-900">
                  {language === "ta" ? ev.tamilTitle || ev.title : ev.title}
                </h4>

                <p className="text-xs text-ink-700 leading-relaxed font-medium">
                  {language === "ta"
                    ? ev.tamilDescription || ev.description
                    : ev.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Timeline Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-forest-900">
              {language === "ta"
                ? "புதிய பயண நிகழ்வு சேர்க்க"
                : "Add Journey Passport Milestone"}
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Stage
                </label>
                <select
                  value={newEventStage}
                  onChange={(e) => setNewEventStage(e.target.value as any)}
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Crop Nutrition">
                    Crop Nutrition (உரமிடுதல்)
                  </option>
                  <option value="Protection">
                    Protection (பயிர் பாதுகாப்பு)
                  </option>
                  <option value="Harvesting">Harvesting (அறுவடை)</option>
                  <option value="Storage & Logistics">
                    Storage & Logistics (கிடங்கு & லாரி)
                  </option>
                  <option value="Market Sale">
                    Market Sale (விற்பனை ஒப்பந்தம்)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  required
                  placeholder="e.g. Zinc Sulphate foliar nutrition applied"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Description & Details
                </label>
                <textarea
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  required
                  rows={3}
                  placeholder="Details of application, dosage, workers..."
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Cost Impact (₹, optional)
                </label>
                <input
                  type="number"
                  value={newEventCost}
                  onChange={(e) => setNewEventCost(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
