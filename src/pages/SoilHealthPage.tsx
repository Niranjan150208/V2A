import React, { useState } from "react";
import {
  Activity,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  ArrowRight,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { compressImageToDataUrl } from "../utils/images";

export const SoilHealthPage: React.FC = () => {
  const { language, navigate, triggerRefresh } = useNavigation();
  const state = AppStore.getState();
  const soilReport = state.soilReports[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [phInput, setPhInput] = useState("7.2");
  const [nInput, setNInput] = useState("250");
  const [pInput, setPInput] = useState("21");
  const [kInput, setKInput] = useState("290");
  const [soilPhotoDataUrl, setSoilPhotoDataUrl] = useState("");
  const [soilPhotoName, setSoilPhotoName] = useState("");
  const [photoError, setPhotoError] = useState("");

  const handleSoilPhotoChange = async (file?: File) => {
    if (!file) return;
    setPhotoError("");
    try {
      setSoilPhotoDataUrl(await compressImageToDataUrl(file));
      setSoilPhotoName(file.name);
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : "Could not load this image.",
      );
    }
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const currentReport = AppStore.getState().soilReports[0];
    if (!currentReport) return;

    const ph = Number(phInput);
    const nitrogen = Number(nInput);
    const phosphorus = Number(pInput);
    const potassium = Number(kInput);
    if (
      ![ph, nitrogen, phosphorus, potassium].every(Number.isFinite) ||
      ph < 0 ||
      ph > 14
    )
      return;

    const statusFor = (
      value: number,
      lowLimit: number,
      mediumLimit: number,
    ): "Low" | "Medium" | "High" =>
      value < lowLimit ? "Low" : value < mediumLimit ? "Medium" : "High";
    const phDescription =
      ph < 6.5
        ? "Acidic"
        : ph <= 7.5
          ? "Neutral"
          : ph <= 8.5
            ? "Slightly Alkaline"
            : "Alkaline";

    AppStore.addSoilReport({
      ...currentReport,
      farmId: state.farm.id,
      parcelId: state.farm.parcels[0]?.id ?? currentReport.parcelId,
      sampleDate: new Date().toISOString().split("T")[0],
      labName: "Farmer-entered record (unverified)",
      photoDataUrl: soilPhotoDataUrl || undefined,
      ph,
      phDescription,
      nitrogenValueKgPerHa: nitrogen,
      nitrogenStatus: statusFor(nitrogen, 280, 560),
      phosphorusValueKgPerHa: phosphorus,
      phosphorusStatus: statusFor(phosphorus, 10, 25),
      potassiumValueKgPerHa: potassium,
      potassiumStatus: statusFor(potassium, 110, 280),
    });
    setShowAddModal(false);
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "டெமோ மண்வள பதிவு"
                : "Soil Health Demo Record"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "மண்வள அறிக்கை & ஊட்டச்சத்து மேலாண்மை"
              : "Sample Soil Nutrient Overview"}
          </h1>
          <p className="text-xs text-ink-500">
            {soilReport.labName} • Recorded on {soilReport.sampleDate}
          </p>
          <p className="text-xs text-ink-600">
            Photo is visual evidence only. pH and N/P/K values must come from a
            test kit or lab; this app does not measure soil chemistry from a
            picture.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>
            {language === "ta" ? "புதிய அறிக்கை சேர்க்க" : "Log New Soil Test"}
          </span>
        </button>
      </div>

      {soilReport.photoDataUrl && (
        <div className="flex items-center gap-4 rounded-2xl border border-sage-300 bg-white p-4">
          <img
            src={soilReport.photoDataUrl}
            alt="Saved soil sample photo"
            className="h-24 w-24 rounded-xl border border-sage-200 object-cover"
          />
          <div>
            <p className="font-bold text-forest-900">
              Soil sample photo attached
            </p>
            <p className="text-xs text-ink-600">
              Stored in this browser’s demo record; not lab analysis.
            </p>
          </div>
        </div>
      )}

      {/* Main Soil Gauge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* pH Card */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase">
              Soil pH Index
            </span>
            <span className="text-[10px] bg-paddy-100 text-paddy-800 font-bold px-2 py-0.5 rounded-full">
              {soilReport.phDescription}
            </span>
          </div>
          <p className="font-display font-black text-3xl text-forest-900">
            {soilReport.ph}
          </p>
          <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-paddy-600 h-full rounded-full"
              style={{ width: "71%" }}
            />
          </div>
          <p className="text-[11px] text-ink-600">
            {language === "ta"
              ? "நடுநிலை கார அமிலத்தன்மை (பயிருக்கு சிறந்தது)"
              : "Optimum range (6.5 - 7.5) for nutrient uptake"}
          </p>
        </div>

        {/* Nitrogen (N) */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase">
              Available Nitrogen (N)
            </span>
            <span className="text-[10px] bg-harvest-100 text-forest-900 font-bold px-2 py-0.5 rounded-full">
              {soilReport.nitrogenStatus}
            </span>
          </div>
          <p className="font-display font-black text-3xl text-forest-900">
            {soilReport.nitrogenValueKgPerHa}{" "}
            <span className="text-xs font-semibold text-ink-500">kg/ha</span>
          </p>
          <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-harvest-500 h-full rounded-full"
              style={{ width: "58%" }}
            />
          </div>
          <p className="text-[11px] text-ink-600">
            {language === "ta"
              ? "மிதமான தழைச்சத்து. 3 தவணைகளில் யூரியா இடவும்."
              : "Medium rating. Split nitrogen application advised."}
          </p>
        </div>

        {/* Phosphorus (P) */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase">
              Phosphorus (P₂O₅)
            </span>
            <span className="text-[10px] bg-harvest-100 text-forest-900 font-bold px-2 py-0.5 rounded-full">
              {soilReport.phosphorusStatus}
            </span>
          </div>
          <p className="font-display font-black text-3xl text-forest-900">
            {soilReport.phosphorusValueKgPerHa}{" "}
            <span className="text-xs font-semibold text-ink-500">kg/ha</span>
          </p>
          <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-paddy-500 h-full rounded-full"
              style={{ width: "62%" }}
            />
          </div>
          <p className="text-[11px] text-ink-600">
            {language === "ta"
              ? "சாம்பல் சத்து / மணிச்சத்து நல்ல நிலையில் உள்ளது."
              : "Adequate root development support."}
          </p>
        </div>

        {/* Potassium (K) */}
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase">
              Potassium (K₂O)
            </span>
            <span className="text-[10px] bg-paddy-100 text-paddy-800 font-bold px-2 py-0.5 rounded-full">
              {soilReport.potassiumStatus}
            </span>
          </div>
          <p className="font-display font-black text-3xl text-forest-900">
            {soilReport.potassiumValueKgPerHa}{" "}
            <span className="text-xs font-semibold text-ink-500">kg/ha</span>
          </p>
          <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-paddy-600 h-full rounded-full"
              style={{ width: "85%" }}
            />
          </div>
          <p className="text-[11px] text-ink-600">
            {language === "ta"
              ? "அதிக சாம்பல் சத்து (நோய் எதிர்ப்பு சக்தி அதிகம்)"
              : "High reserve, excellent lodging resistance"}
          </p>
        </div>
      </div>

      {/* Organic Carbon and Micronutrient Deficiencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organic Carbon Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
          <h3 className="font-display font-bold text-lg text-forest-900">
            {language === "ta"
              ? "கரிம வளம் & நுண்ணுயிர்கள்"
              : "Organic Carbon & Biological Life"}
          </h3>
          <div className="flex items-center gap-6 p-4 bg-cream-100 rounded-2xl border border-sage-300">
            <div className="text-center shrink-0">
              <p className="font-display font-black text-4xl text-forest-900">
                {soilReport.organicCarbonPct}%
              </p>
              <p className="text-xs font-bold text-paddy-700">
                Medium Organic C
              </p>
            </div>
            <p className="text-xs text-ink-700 leading-relaxed">
              {language === "ta"
                ? "டெல்டா வண்டல் மண்ணில் அங்கக கரிமத்தை 0.8% வரை உயர்த்த பசுந்தாள் உரம் (தக்கைப்பூண்டு / சணப்பை) அல்லது ஏக்கருக்கு 2 டன் மக்கிய தொழுவுரம் இடவும்."
                : "Target organic carbon is >0.75%. Green manuring with Sesbania (Daincha) or 2 tonnes composted FYM recommended before puddle ploughing."}
            </p>
          </div>

          <div className="p-4 bg-sage-50 rounded-2xl border border-sage-200 space-y-1">
            <p className="text-xs font-bold text-forest-900">
              Electrical Conductivity (EC): {soilReport.electricalConductivity}{" "}
              dS/m
            </p>
            <p className="text-xs text-ink-600">
              Sample record only; confirm salinity and nutrient levels with a
              test kit or lab.
            </p>
          </div>
        </div>

        {/* Micronutrients */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
          <h3 className="font-display font-bold text-lg text-forest-900">
            {language === "ta"
              ? "நுண் ஊட்டச்சத்துக்கள் (Micronutrients)"
              : "Micronutrient Status & Deficiencies"}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-terracotta-50 border border-terracotta-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-terracotta-600" />
                <div>
                  <h4 className="text-xs font-bold text-forest-900">
                    Zinc (Zn)
                  </h4>
                  <p className="text-[11px] text-terracotta-700 font-semibold">
                    Deficient (பற்றாக்குறை)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white text-terracotta-700 px-2 py-1 rounded-xl border border-terracotta-300">
                Action: Apply Zinc Sulphate 10kg/acre
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-50 border border-sage-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-paddy-600" />
                <div>
                  <h4 className="text-xs font-bold text-forest-900">
                    Iron (Fe)
                  </h4>
                  <p className="text-[11px] text-paddy-700 font-semibold">
                    Sufficient (போதுமானது)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-paddy-100 text-paddy-800 px-2 py-1 rounded-xl">
                Normal
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-50 border border-sage-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-paddy-600" />
                <div>
                  <h4 className="text-xs font-bold text-forest-900">
                    Boron (B)
                  </h4>
                  <p className="text-[11px] text-paddy-700 font-semibold">
                    Sufficient (போதுமானது)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-paddy-100 text-paddy-800 px-2 py-1 rounded-xl">
                Normal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Agronomic Recommendations (Requirement A) */}
      <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-lg text-forest-900">
          {language === "ta"
            ? "அரசு ஆய்வக பரிந்துரைகள்"
            : "Sample Soil Action Suggestions · Confirm with an Expert"}
        </h3>
        <div className="space-y-2">
          {(language === "ta"
            ? soilReport.tamilRecommendations
            : soilReport.recommendations
          ).map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-sage-300"
            >
              <span className="w-6 h-6 rounded-full bg-forest-800 text-harvest-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-forest-900 font-semibold leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Soil Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-forest-900">
              {language === "ta"
                ? "புதிய மண் பரிசோதனை பதிவு"
                : "Log New Soil Test Entry"}
            </h3>
            <form onSubmit={handleSaveReport} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-700">
                  Soil photo (camera or upload)
                </label>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-sage-300 bg-cream-50 p-3 text-center text-xs font-semibold text-forest-900 hover:bg-cream-100">
                  {soilPhotoName || "Take or choose a photo of the soil sample"}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(event) =>
                      void handleSoilPhotoChange(event.target.files?.[0])
                    }
                  />
                </label>
                {photoError && (
                  <p role="alert" className="mt-1 text-xs text-terracotta-700">
                    {photoError}
                  </p>
                )}
                {soilPhotoDataUrl && (
                  <img
                    src={soilPhotoDataUrl}
                    alt="Soil sample photo attached to this local soil record"
                    className="mt-2 max-h-40 w-full rounded-xl border border-sage-300 object-contain bg-cream-50"
                  />
                )}
                <p className="mt-1 text-[10px] text-ink-500">
                  Photo is saved with this browser’s demo record. It cannot
                  measure pH or N/P/K; enter readings from a test kit or lab.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Soil pH
                </label>
                <input
                  type="number"
                  min="0"
                  max="14"
                  step="0.1"
                  value={phInput}
                  required
                  onChange={(e) => setPhInput(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-ink-700 mb-1">
                    N (kg/ha)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={nInput}
                    required
                    onChange={(e) => setNInput(e.target.value)}
                    className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-ink-700 mb-1">
                    P (kg/ha)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pInput}
                    required
                    onChange={(e) => setPInput(e.target.value)}
                    className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-ink-700 mb-1">
                    K (kg/ha)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={kInput}
                    required
                    onChange={(e) => setKInput(e.target.value)}
                    className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-800 text-harvest-300 font-bold text-xs shadow-sm"
                >
                  Save Soil Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
