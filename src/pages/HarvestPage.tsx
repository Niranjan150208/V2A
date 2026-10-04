import React, { useState } from "react";
import {
  Wheat,
  Store,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  Warehouse,
  Truck,
  Droplets,
  Package,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { HarvestRecord } from "../types";

export const HarvestPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();

  const activeSeason = state.seasons.find(
    (season) => season.id === activeSeasonId,
  );

  const seasonHarvests = state.harvestRecords.filter(
    (h) => h.seasonId === activeSeasonId,
  );

  const summary = AppStore.getHarvestSummary(activeSeasonId);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<HarvestRecord | null>(null);
  const [deletingHarvestId, setDeletingHarvestId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState("");

  // Form states
  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [quantityBags, setQuantityBags] = useState("35");
  const [bagWeightKg, setBagWeightKg] = useState("75");
  const [unit, setUnit] = useState<"Bags" | "Quintals" | "Kgs">("Bags");
  const [moisturePct, setMoisturePct] = useState("13.5");
  const [qualityGrade, setQualityGrade] = useState("Grade A Super");
  const [damagedBags, setDamagedBags] = useState("0");
  const [labourExpense, setLabourExpense] = useState("3500");
  const [machineryExpense, setMachineryExpense] = useState("4500");
  const [storageDetails, setStorageDetails] = useState("Farm House Yard / Drying Floor");
  const [notes, setNotes] = useState("");
  const [selectedFarmId, setSelectedFarmId] = useState(state.farms[0]?.id || "");

  const handleOpenAdd = () => {
    setEditingHarvest(null);
    setHarvestDate(new Date().toISOString().split("T")[0]);
    setQuantityBags("35");
    setBagWeightKg("75");
    setUnit("Bags");
    setMoisturePct("13.5");
    setQualityGrade("Grade A Super");
    setDamagedBags("0");
    setLabourExpense("3500");
    setMachineryExpense("4500");
    setStorageDetails("Farm House Yard / Drying Floor");
    setNotes("");
    setSelectedFarmId(state.farms[0]?.id || "");
    setShowAddModal(true);
  };

  const handleOpenEdit = (h: HarvestRecord) => {
    setEditingHarvest(h);
    setHarvestDate(h.harvestDate);
    setQuantityBags(h.actualQuantityBags.toString());
    setBagWeightKg((h.bagWeightKg || 75).toString());
    setUnit(h.unit || "Bags");
    setMoisturePct((h.moistureContentPct || 14).toString());
    setQualityGrade(h.grainQualityGrade);
    setDamagedBags((h.damagedQuantity || 0).toString());
    setLabourExpense((h.labourExpense || 0).toString());
    setMachineryExpense((h.machineryExpense || 0).toString());
    setStorageDetails(h.storageDetails || "");
    setNotes(h.notes || "");
    setSelectedFarmId(h.farmId || state.farms[0]?.id || "");
    setShowAddModal(true);
  };

  const handleSubmitHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantityBags) || 0;
    const bw = parseFloat(bagWeightKg) || 75;
    const moist = parseFloat(moisturePct) || 14;
    const dmg = parseInt(damagedBags) || 0;
    const lab = parseFloat(labourExpense) || 0;
    const mach = parseFloat(machineryExpense) || 0;

    if (qty <= 0) return;

    const farmObj = state.farms.find((f) => f.id === selectedFarmId);
    const totalKg = qty * bw;
    const yieldPerAcre =
      activeSeason && activeSeason.areaAcres > 0
        ? Math.round((qty / activeSeason.areaAcres) * 10) / 10
        : qty;

    if (editingHarvest) {
      AppStore.updateHarvestRecord(editingHarvest.id, {
        harvestDate,
        actualQuantityBags: qty,
        bagWeightKg: bw,
        totalYieldKg: totalKg,
        yieldPerAcreBags: yieldPerAcre,
        moistureContentPct: moist,
        grainQualityGrade: qualityGrade,
        unit,
        damagedQuantity: dmg,
        labourExpense: lab,
        machineryExpense: mach,
        storageDetails,
        notes,
        farmId: farmObj?.id,
        farmName: farmObj?.farmName || farmObj?.name,
      });
    } else {
      AppStore.addHarvestRecord({
        seasonId: activeSeasonId,
        cropName: activeSeason?.cropName || "Paddy",
        farmId: farmObj?.id,
        farmName: farmObj?.farmName || farmObj?.name,
        parcelName: activeSeason?.parcelName,
        harvestDate,
        actualQuantityBags: qty,
        bagWeightKg: bw,
        totalYieldKg: totalKg,
        yieldPerAcreBags: yieldPerAcre,
        moistureContentPct: moist,
        grainQualityGrade: qualityGrade,
        unit,
        damagedQuantity: dmg,
        labourExpense: lab,
        machineryExpense: mach,
        transportToGodownExpense: 0,
        storageDetails,
        notes,
      });
    }

    setShowAddModal(false);
    triggerRefresh();
  };

  const handleDeleteHarvest = () => {
    if (!deletingHarvestId) return;
    AppStore.deleteHarvestRecord(deletingHarvestId);
    setDeletingHarvestId(null);
    triggerRefresh();
  };

  const handleBroadcastToBuyers = () => {
    const result = AppStore.broadcastHarvest(activeSeasonId);
    if (!result) {
      setActionNotice(
        "No unsold harvest is available for this season. Record a harvest lot first or check active listings in Direct Produce Selling.",
      );
      return;
    }
    setActionNotice("Harvest broadcast to buyers successfully! Viewing buyer bids...");
    triggerRefresh();
    setTimeout(() => navigate("/offers"), 1000);
  };

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
                : "Harvest Readiness & Yield Quality Management"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "அறுவடை பதிவு & மகசூல் கணக்கீடு"
              : "Harvest Records & Yield Tracker"}
          </h1>
          <p className="text-xs text-ink-500">
            {activeSeason
              ? `${activeSeason.cropName} • ${activeSeason.parcelName || "Main Field"} (${activeSeason.areaAcres} Acres)`
              : "Track multi-pick harvest lots, moisture grading, and stock available for sale"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-paddy-600 hover:bg-paddy-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === "ta" ? "அறுவடை சேர்க்க" : "Record New Harvest"}
            </span>
          </button>
          <button
            onClick={handleBroadcastToBuyers}
            className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2 transition-colors"
          >
            <Store className="w-4 h-4 text-harvest-400" />
            <span>
              {language === "ta"
                ? "ஆலைகளுக்கு விற்பனை அறிவிப்பு"
                : "Broadcast Lot to Buyers"}
            </span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div
          role="alert"
          className="rounded-xl border border-harvest-400 bg-harvest-50 px-4 py-3 text-sm text-forest-900 flex items-center justify-between"
        >
          <span>{actionNotice}</span>
          <button
            onClick={() => setActionNotice("")}
            className="text-xs font-bold text-forest-800 underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Harvest Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Harvested */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase">
            Total Harvested
          </span>
          <p className="font-display font-black text-3xl text-forest-900">
            {summary.totalHarvestedBags}{" "}
            <span className="text-sm font-semibold text-ink-500">Bags</span>
          </p>
          <p className="text-xs text-paddy-700 font-semibold">
            {summary.totalYieldKg.toLocaleString()} kg ({summary.harvestRecordsCount} lots recorded)
          </p>
        </div>

        {/* Available for Sale */}
        <div className="bg-white rounded-3xl p-5 border-2 border-paddy-500 shadow-agro space-y-1 bg-paddy-50/30">
          <span className="text-xs font-bold text-paddy-800 uppercase">
            Available for Sale
          </span>
          <p className="font-display font-black text-3xl text-paddy-700">
            {summary.availableForSaleBags}{" "}
            <span className="text-sm font-semibold text-ink-500">Bags</span>
          </p>
          <p className="text-[11px] text-ink-600 font-semibold">
            Total − Sold ({summary.soldBags}) − Damaged ({summary.totalDamagedBags})
          </p>
        </div>

        {/* Quantity Sold */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase">
            Quantity Sold
          </span>
          <p className="font-display font-black text-3xl text-forest-900">
            {summary.soldBags}{" "}
            <span className="text-sm font-semibold text-ink-500">Bags</span>
          </p>
          <p className="text-xs text-ink-500 font-semibold">
            Contracted & Invoiced
          </p>
        </div>

        {/* Remaining in Storage */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase">
            Remaining Stock
          </span>
          <p className="font-display font-black text-3xl text-harvest-600">
            {summary.remainingBags}{" "}
            <span className="text-sm font-semibold text-ink-500">Bags</span>
          </p>
          <p className="text-xs text-ink-500">
            In farm yard / godown
          </p>
        </div>
      </div>

      {/* Harvest Records List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sage-200">
          <div>
            <h3 className="font-display font-bold text-xl text-forest-900">
              {language === "ta"
                ? "பதிவு செய்யப்பட்ட அறுவடை தொகுதிகள்"
                : "Recorded Harvest Lots & Pickings"}
            </h3>
            <p className="text-xs text-ink-500">
              {seasonHarvests.length} lot(s) for current crop cycle
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 bg-paddy-50 border border-paddy-200 text-paddy-800 text-xs font-bold rounded-xl hover:bg-paddy-100 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Picking</span>
          </button>
        </div>

        {seasonHarvests.length === 0 ? (
          <div className="p-8 text-center bg-cream-50 rounded-2xl border border-dashed border-sage-300 space-y-3">
            <Wheat className="w-8 h-8 text-harvest-500 mx-auto" />
            <p className="text-sm font-bold text-forest-900">
              No harvest records entered for this season yet.
            </p>
            <p className="text-xs text-ink-500">
              Click &quot;Record New Harvest&quot; to log your harvested bags, moisture test, and storage details.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
            >
              Record First Harvest
            </button>
          </div>
        ) : (
          <div className="divide-y divide-sage-200">
            {seasonHarvests.map((h) => (
              <div
                key={h.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cream-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-900 text-base">
                      {h.actualQuantityBags} {h.unit || "Bags"} ({h.totalYieldKg.toLocaleString()} kg)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-paddy-100 text-paddy-800">
                      {h.grainQualityGrade}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage-100 text-ink-700">
                      Moisture: {h.moistureContentPct}%
                    </span>
                  </div>

                  <p className="text-xs text-ink-600">
                    Harvest Date: <span className="font-semibold text-ink-800">{h.harvestDate}</span>
                    {h.farmName && (
                      <>
                        {" "}• Farm: <span className="font-semibold text-ink-800">{h.farmName}</span>
                      </>
                    )}
                    {h.storageDetails && (
                      <>
                        {" "}• Storage: <span className="font-semibold text-ink-800">{h.storageDetails}</span>
                      </>
                    )}
                  </p>

                  {(h.labourExpense > 0 || h.machineryExpense > 0 || (h.damagedQuantity || 0) > 0) && (
                    <p className="text-[11px] text-ink-500">
                      Harvesting cost: ₹{(h.labourExpense + h.machineryExpense).toLocaleString()}
                      {h.damagedQuantity ? ` • Damaged: ${h.damagedQuantity} bags` : ""}
                      {h.notes ? ` • Notes: ${h.notes}` : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(h)}
                    className="p-2 text-ink-400 hover:text-forest-800 hover:bg-sage-100 rounded-lg transition-colors"
                    title="Edit harvest"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingHarvestId(h.id)}
                    className="p-2 text-ink-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors"
                    title="Delete harvest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produce Quality Guide */}
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
                Grade A Super
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
              Moisture &gt; 18% caused by unseasonal rain. Requires
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
          className="px-5 py-3 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl hover:bg-forest-900 shadow-agro transition-colors"
        >
          {language === "ta"
            ? "கிடங்கு சேமிப்பு பதிவு"
            : "Book WDRA Warehouse Storage"}
        </button>
        <button
          onClick={() => navigate("/logistics")}
          className="px-5 py-3 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl hover:bg-sage-100 transition-colors"
        >
          {language === "ta"
            ? "பண்ணை போக்குவரத்து லாரி"
            : "Book Transport Vehicle"}
        </button>
        <button
          onClick={() => navigate("/offers")}
          className="px-5 py-3 bg-harvest-400 text-forest-950 font-bold text-xs rounded-xl hover:bg-harvest-500 shadow-gold transition-colors"
        >
          {language === "ta"
            ? "கொள்முதல் ஏலங்கள் காண்க"
            : "View Incoming Buyer Offers"}
        </button>
      </div>

      {/* Add / Edit Harvest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-sage-200">
              <h3 className="font-display font-extrabold text-lg text-forest-900">
                {editingHarvest ? "Edit Harvest Record" : "Record New Harvest"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-ink-400 hover:text-ink-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHarvest} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Farm
                  </label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    {state.farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.farmName || f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantityBags}
                    onChange={(e) => setQuantityBags(e.target.value)}
                    required
                    min="1"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Bags">Bags</option>
                    <option value="Quintals">Quintals</option>
                    <option value="Kgs">Kgs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Bag Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={bagWeightKg}
                    onChange={(e) => setBagWeightKg(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePct}
                    onChange={(e) => setMoisturePct(e.target.value)}
                    placeholder="e.g. 13.5"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Grain Quality Grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Grade A Super">Grade A Super (&lt;14% moisture)</option>
                    <option value="Standard Common">Standard Common (MSP benchmark)</option>
                    <option value="Damaged / Wet">Damaged / Wet (&gt;18% moisture)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Damaged Quantity
                  </label>
                  <input
                    type="number"
                    value={damagedBags}
                    onChange={(e) => setDamagedBags(e.target.value)}
                    min="0"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Labour Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={labourExpense}
                    onChange={(e) => setLabourExpense(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Machinery Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={machineryExpense}
                    onChange={(e) => setMachineryExpense(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Storage Location / Yard Details
                </label>
                <input
                  type="text"
                  value={storageDetails}
                  onChange={(e) => setStorageDetails(e.target.value)}
                  placeholder="e.g. CWC Thanjavur Bin #4 or Farm Threshing Yard"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Harvest weather conditions, combine harvester operator notes..."
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600 hover:bg-sage-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro hover:bg-forest-900 transition-colors"
                >
                  {editingHarvest ? "Update Harvest Lot" : "Save Harvest Lot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingHarvestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-sage-300 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-terracotta-100 text-terracotta-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-base text-forest-900">
              Delete Harvest Record?
            </h3>
            <p className="text-xs text-ink-600">
              This harvest lot record and yield calculation will be removed. This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingHarvestId(null)}
                className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-700 hover:bg-sage-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHarvest}
                className="px-5 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
