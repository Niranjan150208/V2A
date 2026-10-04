import React, { useState } from "react";
import {
  Stethoscope,
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Send,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { compressImageToDataUrl } from "../utils/images";

export const CropDoctorPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();

  const [selectedCrop, setSelectedCrop] = useState("Paddy (CR 1009 Sub 1)");
  const [symptomText, setSymptomText] = useState(
    "Longitudinal folded leaves with white scraped patches",
  );
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState<any>(
    state.cropObservations[0]?.aiDiagnosis || null,
  );
  const [requestExpert, setRequestExpert] = useState(false);
  const [expertSubmitted, setExpertSubmitted] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [photoError, setPhotoError] = useState("");

  const sampleDiseases = [
    {
      name: "Paddy Leaf Folder (Cnaphalocrocis medinalis)",
      tamilName: "நெல் இலைச்சுருட்டுப் புழு",
      confidence: 89,
      severity: "Moderate",
      symptoms: [
        "Folded leaf blades",
        "White longitudinal feeding patches",
        "Presence of larvae silk",
      ],
      cause:
        "Aggravated by cloudy humidity and high split application of urea.",
      remedy: [
        "Release Trichogramma chilonis egg parasitoid cards @ 2 cc/acre",
        "Foliar spray of 10,000 ppm Neem Oil @ 2 ml/litre with sticker solution",
        "Avoid excessive top-dressing of inorganic nitrogen during peak overcast spells",
      ],
    },
    {
      name: "Bacterial Leaf Blight (Xanthomonas oryzae)",
      tamilName: "பாக்டீரியா இலைக்கருகல் நோய்",
      confidence: 84,
      severity: "High",
      symptoms: [
        "Wavy margins turning yellow and straw-colored",
        "Milky bacterial ooze on young cut stems",
      ],
      cause:
        "Warm temperature and cyclonic windy monsoon rain splashing bacteria.",
      remedy: [
        "Spray Streptocycline 15g + Copper Oxychloride 500g in 200L water per acre",
        "Drain excess standing water from field for 48 hours to aerate rootzone",
        "Apply additional 25 kg Muriate of Potash (MOP) to harden cell walls",
      ],
    },
  ];

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      const chosen = symptomText.toLowerCase().includes("blight")
        ? sampleDiseases[1]
        : sampleDiseases[0];
      const newDiag = {
        diseaseName: chosen.name,
        tamilDiseaseName: chosen.tamilName,
        confidencePct: chosen.confidence,
        severity: chosen.severity as any,
        scientificCause: chosen.cause,
        recommendedRemedy: chosen.remedy,
        isMockSimulation: true,
      };
      setActiveDiagnosis(newDiag);

      AppStore.addCropObservation({
        seasonId: activeSeasonId,
        date: new Date().toISOString().split("T")[0],
        stage: "Active Vegetative Tillering",
        symptoms: [symptomText],
        imageUrl: photoDataUrl || undefined,
        aiDiagnosis: newDiag,
        expertReviewRequested: requestExpert,
        status: "Reported",
      });
      triggerRefresh();
    }, 1200);
  };

  const handlePhotoChange = async (file?: File) => {
    if (!file) return;
    setPhotoError("");
    try {
      setPhotoDataUrl(await compressImageToDataUrl(file));
      setPhotoName(file.name);
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : "Could not load this image.",
      );
    }
  };

  const handleEscalateExpert = () => {
    AppStore.addExpertRequest({
      farmerId: state.farmer.id,
      seasonId: activeSeasonId,
      expertName: "Agronomy review queue (demo)",
      institution: "Local demo request queue",
      topic: `Crop observation: ${selectedCrop}`,
      question: `${symptomText}${photoName ? ` Photo attached: ${photoName}` : ""}`,
      status: "Pending Review",
      date: new Date().toISOString().split("T")[0],
    });
    setExpertSubmitted(true);
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta" ? "பயிர் அறிகுறி டெமோ" : "Crop Symptom Demo"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "பயிர் மருத்துவர் ஆலோசனை"
              : "Crop Doctor Advisory"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "இலை அறிகுறிகளை ஆய்வு செய்து இயற்கை உயிரி பாதுகாப்பு முறைகளை பரிந்துரைக்கும் தளம்"
              : "Attach a crop photo and symptoms to save a local advisory record. Diagnosis is a sample symptom-rule demo, not computer vision or expert validation."}
          </p>
        </div>

        <button
          onClick={() => navigate("/expert-advice")}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4 text-harvest-400" />
          <span>
            {language === "ta"
              ? "விஞ்ஞானியிடம் ஆலோசனை"
              : "KVK Agronomist Forum"}
          </span>
        </button>
        <button
          onClick={() => navigate("/soil-health")}
          className="px-4 py-2.5 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl shadow-sm"
        >
          {language === "ta"
            ? "மண் புகைப்படம் / பரிசோதனை"
            : "Soil Photo & Test Entry"}
        </button>
      </div>

      {/* Mandatory Disclaimer (Requirement E) */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-harvest-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            {language === "ta"
              ? "AI நோய் கண்டறிதல் வெளிப்படைத்தன்மை குறிப்பு:"
              : "Sample Advisory Limitations:"}
          </p>
          <p className="text-ink-600 leading-relaxed">
            {language === "ta"
              ? "இந்த ஆய்வு மாதிரி செயற்கை நுண்ணறிவு மாதிரியாகும் (Demo AI Result). இது விவசாயிகளுக்கு ஆரம்ப வழிகாட்டுதலை மட்டுமே வழங்குகிறது. முக்கியமான பூச்சி தாக்குதலுக்கு உள்ளூர் வேளாண் அதிகாரியை தொடர்பு கொள்ளவும்."
              : "The sample advisory below is selected from symptom text only; the photo is attached to your local record but is not analyzed. This is not a diagnosis. Ask a local agricultural expert before treating crops."}
          </p>
        </div>
      </div>

      {/* Upload & Symptom Form Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload & Input */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
          <h3 className="font-display font-bold text-base text-forest-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-paddy-600" />
            <span>
              {language === "ta"
                ? "இலை புகைப்படம் & அறிகுறிகள்"
                : "Capture Leaf Symptoms"}
            </span>
          </h3>

          <form onSubmit={handleDiagnose} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                Target Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
              >
                <option value="Paddy (CR 1009 Sub 1)">
                  Paddy (CR 1009 Sub 1)
                </option>
                <option value="Blackgram (VBN 8)">Blackgram (VBN 8)</option>
                <option value="Sesame">Sesame (TMV 7)</option>
                <option value="Banana">Grand Naine Banana</option>
              </select>
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                Leaf Photo
              </label>
              <label className="block border-2 border-dashed border-sage-300 rounded-2xl p-4 text-center bg-cream-50 hover:bg-cream-100 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-paddy-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-forest-900">
                  {photoName ||
                    (language === "ta"
                      ? "புகைப்படம் எடுக்க / பதிவேற்ற தட்டவும்"
                      : "Take or upload a crop photo")}
                </p>
                <p className="text-[10px] text-ink-500 mt-0.5">
                  Image stays in this browser demo and is not sent to an AI
                  service.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(event) =>
                    void handlePhotoChange(event.target.files?.[0])
                  }
                />
              </label>
              {photoError && (
                <p role="alert" className="text-xs text-terracotta-700">
                  {photoError}
                </p>
              )}
              {photoDataUrl && (
                <img
                  src={photoDataUrl}
                  alt="Selected crop for the local observation record"
                  className="max-h-56 w-full rounded-xl border border-sage-300 object-contain bg-cream-50"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-700 mb-1">
                Symptom Description
              </label>
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                rows={3}
                required
                className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold text-ink-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reqExp"
                checked={requestExpert}
                onChange={(e) => setRequestExpert(e.target.checked)}
                className="w-4 h-4 text-forest-800 rounded border-sage-300"
              />
              <label
                htmlFor="reqExp"
                className="text-xs font-semibold text-forest-900"
              >
                {language === "ta"
                  ? "KVK வேளாண் விஞ்ஞானி ஆய்வை கோருக"
                  : "Save Local Expert Review Request"}
              </label>
            </div>

            <button
              type="submit"
              disabled={isDiagnosing}
              className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-harvest-400" />
              <span>
                {isDiagnosing
                  ? "Analyzing Symptoms..."
                  : language === "ta"
                    ? "மாதிரி அறிகுறி ஆலோசனை காட்டு"
                    : "Show Sample Symptom Suggestion"}
              </span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Diagnostic Certificate Card */}
        <div className="lg:col-span-2 space-y-6">
          {activeDiagnosis ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-paddy-600/40 shadow-agro space-y-6">
              {/* Header with Uncertainty Metric */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                      Sample Symptom-Rule Match · Not AI
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        activeDiagnosis.severity === "Severe" ||
                        activeDiagnosis.severity === "High"
                          ? "bg-terracotta-100 text-terracotta-800"
                          : "bg-harvest-100 text-forest-900"
                      }`}
                    >
                      Severity: {activeDiagnosis.severity}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-forest-900 mt-2">
                    {language === "ta"
                      ? activeDiagnosis.tamilDiseaseName
                      : activeDiagnosis.diseaseName}
                  </h3>
                  <p className="text-xs text-ink-600 mt-0.5 italic">
                    {activeDiagnosis.scientificCause}
                  </p>
                </div>

                {/* AI Confidence Gauge */}
                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1.5 bg-forest-800 text-harvest-300 px-3.5 py-1.5 rounded-2xl font-black text-base shadow-sm">
                    <Sparkles className="w-4 h-4 text-harvest-400" />
                    <span>{activeDiagnosis.confidencePct}%</span>
                  </div>
                  <p className="text-[10px] font-bold text-ink-500 mt-1 uppercase">
                    Demo Rule Score
                  </p>
                </div>
              </div>

              {/* Prescribed Biological Protocol (Requirement E) */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-base text-forest-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-paddy-600" />
                  <span>
                    {language === "ta"
                      ? "பரிந்துரைக்கப்பட்ட உயிரி பாதுகாப்பு முறைகள்"
                      : "Recommended Integrated Pest Management (IPM)"}
                  </span>
                </h4>

                <div className="space-y-2">
                  {activeDiagnosis.recommendedRemedy.map(
                    (step: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl border border-sage-300 bg-cream-50/60"
                      >
                        <span className="w-6 h-6 rounded-full bg-paddy-700 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-semibold text-forest-900 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Action Buttons: Request Expert Validation or View Locker */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sage-200">
                <button
                  onClick={handleEscalateExpert}
                  className="flex items-center gap-2 px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
                >
                  <Send className="w-4 h-4 text-harvest-400" />
                  <span>
                    {expertSubmitted
                      ? language === "ta"
                        ? "உள்ளூர் டெமோ கோரிக்கை சேமிக்கப்பட்டது"
                        : "Saved to local demo request queue"
                      : language === "ta"
                        ? "உள்ளூர் மதிப்பாய்வு கோரிக்கையைச் சேமி"
                        : "Save Local Expert Review Request"}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/input-marketplace")}
                  className="px-4 py-2.5 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl hover:bg-sage-100 transition-colors"
                >
                  {language === "ta"
                    ? "உயிரி மருந்து வாங்க"
                    : "Buy Neem Oil / Bio-Pesticide"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-sage-300 shadow-agro">
              <p className="text-sm font-bold text-ink-600">
                Enter symptoms or upload a leaf photo to generate diagnostic
                advisory.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
