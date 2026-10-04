import React, { useState } from "react";
import {
  Droplets,
  Calendar,
  Clock,
  Plus,
  Sun,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const IrrigationPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();

  const [showLogModal, setShowLogModal] = useState(false);
  const [source, setSource] = useState<
    "Cauvery River Canal" | "Borewell (Solar)"
  >("Cauvery River Canal");
  const [duration, setDuration] = useState(5);
  const [dieselCost, setDieselCost] = useState("0");

  const handleLogIrrigation = (e: React.FormEvent) => {
    e.preventDefault();
    AppStore.addIrrigation({
      seasonId: activeSeasonId,
      date: new Date().toISOString().split("T")[0],
      source,
      method: "Flood / Basin",
      durationHours: duration,
      electricityCost: 0,
      dieselCost: parseFloat(dieselCost) || 0,
      notes: `${source} operated for ${duration} hours.`,
    });

    if (parseFloat(dieselCost) > 0) {
      AppStore.addExpense({
        seasonId: activeSeasonId,
        category: "Irrigation",
        description: `Borewell Diesel Fuel (${duration} hrs)`,
        amount: parseFloat(dieselCost),
        date: new Date().toISOString().split("T")[0],
        paymentMode: "Cash",
        paidTo: "Fuel Depot Thiruvaiyaru",
      });
    }

    setShowLogModal(false);
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Droplets className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "பாசன மேலாண்மை & நீர் பாதுகாப்பு"
                : "Delta Water Management & Irrigation Log"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "பாசன அட்டவணை & சூரியசக்தி பம்புசெட்"
              : "Irrigation Scheduler & Solar Borewell"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "காவிரி பாசன முறை முறைப்பங்கீடு மற்றும் 5 HP சோலார் பம்புசெட் பயன்பாடு"
              : "Rotational canal turn management, water depth tracking, and solar energy offset"}
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-harvest-400" />
          <span>
            {language === "ta"
              ? "பாசனப் பதிவு சேர்க்க"
              : "Log Water Application"}
          </span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Active Water Depth
          </span>
          <p className="font-display font-black text-3xl text-forest-900 mt-1">
            2.5 cm
          </p>
          <p className="text-xs text-paddy-700 font-semibold mt-1">
            ✓ AWD (Alternate Wetting & Drying)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Total Canal Rounds
          </span>
          <p className="font-display font-black text-3xl text-forest-900 mt-1">
            {state.irrigations.length} Events
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Grand Anicut branch canal distribution
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Solar Energy Savings
          </span>
          <p className="font-display font-black text-3xl text-paddy-700 mt-1">
            ₹12,400 Saved
          </p>
          <p className="text-xs text-forest-800 font-semibold mt-1">
            Zero grid electricity or diesel burn
          </p>
        </div>
      </div>

      {/* Irrigation Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === "ta"
            ? "நடப்பு பருவ பாசனப் பதிவுகள்"
            : "Irrigation History & Fuel Ledger"}
        </h3>

        <div className="divide-y divide-sage-200">
          {state.irrigations.map((irr) => (
            <div
              key={irr.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-paddy-50 border border-paddy-200 flex items-center justify-center text-paddy-700 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-forest-900">
                    {irr.source}
                  </h4>
                  <p className="text-xs text-ink-500">
                    Date: {irr.date} • Method: {irr.method} • Duration:{" "}
                    {irr.durationHours} Hours
                  </p>
                  {irr.notes && (
                    <p className="text-xs text-forest-800 font-medium mt-1">
                      "{irr.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">
                    Energy Cost
                  </span>
                  <span className="font-display font-black text-sm text-paddy-700">
                    ₹{irr.dieselCost}
                  </span>
                </div>
                <span className="bg-paddy-100 text-paddy-800 font-bold text-xs px-3 py-1 rounded-full">
                  Logged ✓
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-forest-900">
              {language === "ta" ? "புதிய பாசனப் பதிவு" : "Log Irrigation Turn"}
            </h3>
            <form onSubmit={handleLogIrrigation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Water Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Cauvery River Canal">
                    Cauvery River Canal (கால்வாய் முறை நீர்)
                  </option>
                  <option value="Borewell (Solar)">
                    Borewell Solar Pump (சூரிய சக்தி ஆழ்துளை)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Fuel / Diesel Cost (₹)
                </label>
                <input
                  type="number"
                  value={dieselCost}
                  onChange={(e) => setDieselCost(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                />
                <p className="text-[10px] text-paddy-700 font-semibold mt-0.5">
                  Enter 0 if solar or gravity canal
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
