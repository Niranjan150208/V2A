import React, { useState } from "react";
import { Wheat, Store } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const HarvestPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();
  const activeSeason = state.seasons.find(
    (season) => season.id === activeSeasonId,
  );
  const harvest = state.harvestRecords.find(
    (record) => record.seasonId === activeSeasonId,
  );

  const [broadcastDone, setBroadcastDone] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  const handleBroadcastToBuyers = () => {
    const result = AppStore.broadcastHarvest(activeSeasonId);
    if (!result) {
      setActionNotice(
        "No unsold harvest is available for this season. Start a fresh demo from the dashboard or choose a season with a harvest record.",
      );
      return;
    }
    setBroadcastDone(true);
    triggerRefresh();
    navigate("/offers");
  };

  if (!harvest || !activeSeason) {
    return (
      <div className="rounded-3xl border border-sage-300 bg-white p-8 text-center shadow-agro">
        <Wheat className="mx-auto mb-3 h-8 w-8 text-paddy-700" />
        <h1 className="font-display text-xl font-bold text-forest-900">
          No harvest record for this season
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Select a season with a recorded harvest before creating a buyer
          listing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Wheat className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "அறுவடை மேலாண்மை & மகசூல் பதிவு"
                : "Harvest Readiness & Yield Quality Certification"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "அறுவடை தயார்நிலை & தானிய தரம்"
              : "Harvest Readiness & Yield Tracker"}
          </h1>
          <p className="text-xs text-ink-500">
            {activeSeason.cropName} • {activeSeason.parcelName} (
            {activeSeason.areaAcres} Acres)
          </p>
        </div>

        <button
          onClick={handleBroadcastToBuyers}
          className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <Store className="w-4 h-4 text-harvest-400" />
          <span>
            {broadcastDone
              ? "Listing created"
              : language === "ta"
                ? "ஆலைகளுக்கு விற்பனை அறிவிப்பு"
                : "Broadcast Lot to Buyers"}
          </span>
        </button>
      </div>

      {actionNotice && (
        <div
          role="alert"
          className="rounded-xl border border-harvest-400 bg-harvest-50 px-4 py-3 text-sm text-forest-900"
        >
          {actionNotice}
        </div>
      )}

      {/* Harvest Record Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase">
            Actual Harvest
          </span>
          <p className="font-display font-black text-3xl text-forest-900">
            {harvest.actualQuantityBags}{" "}
            <span className="text-sm font-semibold text-ink-500">Bags</span>
          </p>
          <p className="text-xs text-paddy-700 font-semibold">
            {harvest.totalYieldKg.toLocaleString()} kg (31.4 bags/acre)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase">
            Grain Moisture Content
          </span>
          <p className="font-display font-black text-3xl text-paddy-700">
            {harvest.moistureContentPct}%
          </p>
          <p className="text-[11px] text-paddy-800 font-bold">
            ✓ Within 14% max threshold (No discount!)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase">
            Quality Classification
          </span>
          <p className="font-display font-black text-2xl text-forest-900">
            {harvest.grainQualityGrade}
          </p>
          <p className="text-xs text-forest-800 font-semibold">
            Premium long bold grain lustre
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase">
            Harvesting Cost
          </span>
          <p className="font-display font-black text-2xl text-forest-900">
            ₹
            {(
              harvest.labourExpense + harvest.machineryExpense
            ).toLocaleString()}
          </p>
          <p className="text-xs text-ink-500">Harvester + Bagging labour</p>
        </div>
      </div>

      {/* Produce Quality Guide (Requirement F) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === "ta"
            ? "தானிய தர நிர்ணய வழிகாட்டி"
            : "Produce Quality Benchmark & Price Multiplier"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-paddy-50 border-2 border-paddy-500 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-paddy-900">
                Grade A Super (Current)
              </span>
              <span className="bg-paddy-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                100% Price
              </span>
            </div>
            <p className="text-ink-700">
              Moisture &lt; 14%, clean grain lustre, foreign matter &lt; 0.5%,
              zero chalky or broken grains.
            </p>
            <p className="font-bold text-paddy-800">
              Target Buyer: Modern Rice Mills & Export Mills
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-sage-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-forest-900">
                Standard Common
              </span>
              <span className="bg-sage-200 text-forest-800 font-bold px-2 py-0.5 rounded text-[10px]">
                MSP Rate
              </span>
            </div>
            <p className="text-ink-700">
              Moisture 14% - 17%, minor chaff or unhusked grain. Suitable for
              Government DPC procurement centres.
            </p>
            <p className="font-bold text-forest-900">
              Target Buyer: TNCSC Direct Purchase Centers
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-sage-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-terracotta-700">
                Damaged / High Moisture
              </span>
              <span className="bg-terracotta-100 text-terracotta-800 font-bold px-2 py-0.5 rounded text-[10px]">
                -15% Penalty
              </span>
            </div>
            <p className="text-ink-700">
              Moisture &gt; 18% caused by rain during harvest. Requires
              mandatory mechanical yard drying.
            </p>
            <p className="font-bold text-terracotta-700">
              Target Buyer: Cattle feed or parboiling plants
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Harvest & Post-Harvest Workflow Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate("/storage")}
          className="px-5 py-3 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl hover:bg-forest-900 shadow-agro"
        >
          {language === "ta"
            ? "கிடங்கு சேமிப்பு பதிவு"
            : "Book WDRA Warehouse Storage"}
        </button>
        <button
          onClick={() => navigate("/logistics")}
          className="px-5 py-3 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl hover:bg-sage-100"
        >
          {language === "ta"
            ? "பண்ணை போக்குவரத்து லாரி"
            : "Book Transport Vehicle"}
        </button>
        <button
          onClick={() => navigate("/offers")}
          className="px-5 py-3 bg-harvest-400 text-forest-950 font-bold text-xs rounded-xl hover:bg-harvest-500 shadow-gold"
        >
          {language === "ta"
            ? "கொள்முதல் ஏலங்கள் காண்க"
            : "View Incoming Buyer Offers"}
        </button>
      </div>
    </div>
  );
};
