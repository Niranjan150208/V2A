import React, { useEffect, useRef, useState } from "react";
import {
  QrCode,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Save,
  Flag,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { SeedBatch } from "../types";

export const SeedPassportPage: React.FC = () => {
  const { language, navigate, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  const [batchInput, setBatchInput] = useState("TN-TSSCA-2025-P90412");
  const [selectedBatch, setSelectedBatch] = useState<SeedBatch | null>(
    state.seedBatches[0],
  );
  const selectedBatchIsExpired = selectedBatch
    ? new Date(`${selectedBatch.expiryDate}T23:59:59`).getTime() < Date.now()
    : false;
  const [isScanning, setIsScanning] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [scanError, setScanError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanControlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => () => scanControlsRef.current?.stop(), []);

  const stopCamera = () => {
    scanControlsRef.current?.stop();
    scanControlsRef.current = null;
    setIsScanning(false);
  };

  const handleVerifyBatch = (code: string) => {
    const normalizedCode = code.trim().toLowerCase();
    if (!normalizedCode) return;
    const currentBatches = AppStore.getState().seedBatches;
    const found = currentBatches.find(
      (batch) =>
        batch.batchNumber.toLowerCase() === normalizedCode ||
        batch.qrPayload.toLowerCase() === normalizedCode ||
        normalizedCode.includes(batch.batchNumber.toLowerCase()),
    );
    if (found) {
      setSelectedBatch(found);
      setScanError("");
    } else {
      setSelectedBatch(null);
      setScanError(
        "Code was read, but it does not match a batch in this local demo. No official seed verification service is connected.",
      );
    }
  };

  const startCameraScan = async () => {
    if (!videoRef.current) return;
    setScanError("");
    setIsScanning(true);
    try {
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const reader = new BrowserQRCodeReader();
      scanControlsRef.current = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (!result) return;
          const scannedCode = result.getText();
          setBatchInput(scannedCode);
          handleVerifyBatch(scannedCode);
          stopCamera();
        },
      );
    } catch {
      stopCamera();
      setScanError(
        "Camera access failed. Allow camera access on HTTPS, or use a sample batch/manual code.",
      );
    }
  };

  const handleSaveToFarm = () => {
    if (!selectedBatch) return;
    AppStore.addSeedBatch(selectedBatch);
    setSavedSuccess(true);
    triggerRefresh();
    setTimeout(() => {
      setSavedSuccess(false);
      navigate("/crop-journey");
    }, 1200);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    setReportText("");
    alert(
      language === "ta"
        ? "விதை குறைபாடு புகார் விதை ஆய்வு அதிகாரிகளுக்கு சமர்ப்பிக்கப்பட்டது."
        : "Seed discrepancy report logged for Department of Seed Inspection.",
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "சான்றளிக்கப்பட்ட விதை பாஸ்போர்ட்"
                : "Seed QR Lookup Demo"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "விதை தொகுதி விவரங்கள்"
              : "Seed Batch Details & Sample Lookup"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "தமிழ்நாடு விதை சான்றளிப்பு முகமை (TSSCA) மற்றும் TNAU சான்றிதழ் ஆய்வு முறை"
              : "Scans QR codes and matches them against sample batches stored in this browser. No official seed database is connected."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-ink-600 bg-cream-200 px-3 py-1.5 rounded-xl border border-sage-300">
            {language === "ta"
              ? "ஆய்வு நிலை: மாதிரி சேவை"
              : "Mock Verification Boundary Active"}
          </span>
        </div>
      </div>

      {/* Mandatory Regulatory Transparency Notice */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-harvest-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            {language === "ta"
              ? "வெளிப்படைத்தன்மை குறிப்பு (Mock Verification Protocol):"
              : "Regulatory Integration Boundary Notice:"}
          </p>
          <p className="text-ink-600 leading-relaxed">
            {language === "ta"
              ? "இந்த மாதிரி அமைப்பில் உள்ள சான்றிதழ் தகவல்கள் மாதிரி செயல்முறையை விளக்குவதற்காக மட்டுமே. உண்மையான அரசு API (TSSCA/NSCL) இணைக்கப்படும் வரை, இது போலி சான்றிதழை உண்மை என உரிமை கொண்டாடாது."
              : "Camera scanning reads real QR content. A match only confirms the sample exists in this browser; it is not official certificate verification."}
          </p>
        </div>
      </div>

      {/* QR Scanner & Batch Code Entry Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Camera QR Scanner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-5">
          <h3 className="font-display font-bold text-base text-forest-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-paddy-600" />
            <span>
              {language === "ta"
                ? "விதை பை QR குறியீடு ஸ்கேன்"
                : "Scan Seed Bag QR Code"}
            </span>
          </h3>

          <div className="space-y-3">
            <div className="relative aspect-video max-w-[420px] mx-auto overflow-hidden rounded-3xl bg-forest-950 border-4 border-forest-800 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover ${isScanning ? "" : "hidden"}`}
              />
              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <Camera className="h-10 w-10 text-harvest-400" />
                  <p className="px-4 text-xs text-sage-200">
                    Allow camera permission, then point at a QR code.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-2">
              {isScanning ? (
                <button
                  onClick={stopCamera}
                  className="rounded-xl bg-terracotta-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCameraScan}
                  className="rounded-xl bg-forest-800 px-4 py-2 text-xs font-bold text-harvest-300"
                >
                  Open Camera & Scan QR
                </button>
              )}
            </div>
            {scanError && (
              <p
                role="alert"
                className="rounded-xl bg-terracotta-50 p-3 text-xs font-semibold text-terracotta-800"
              >
                {scanError}
              </p>
            )}
          </div>

          {/* Quick Pre-Set Bag QRs to Test */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
              {language === "ta"
                ? "மாதிரி விதை பைகள் (தட்டவும்):"
                : "Sample Demo Seed Bags (Tap to look up):"}
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  setBatchInput("TN-TSSCA-2025-P90412");
                  handleVerifyBatch("TN-TSSCA-2025-P90412");
                }}
                className="w-full p-2.5 rounded-xl text-left bg-cream-50 hover:bg-forest-50 border border-sage-300 text-xs font-semibold text-forest-900 flex items-center justify-between"
              >
                <span>🌾 CR 1009 Sub 1 (Demo record)</span>
                <span className="text-[10px] bg-paddy-100 text-paddy-800 font-bold px-1.5 py-0.5 rounded">
                  94% Germ
                </span>
              </button>
              <button
                onClick={() => {
                  setBatchInput("TNAU-VBN-2026-B811");
                  handleVerifyBatch("TNAU-VBN-2026-B811");
                }}
                className="w-full p-2.5 rounded-xl text-left bg-cream-50 hover:bg-forest-50 border border-sage-300 text-xs font-semibold text-forest-900 flex items-center justify-between"
              >
                <span>🌱 VBN 8 Blackgram (Demo record)</span>
                <span className="text-[10px] bg-paddy-100 text-paddy-800 font-bold px-1.5 py-0.5 rounded">
                  91% Germ
                </span>
              </button>
            </div>
          </div>

          {/* Manual Entry */}
          <div className="pt-3 border-t border-sage-200 space-y-2">
            <label className="block text-xs font-bold text-ink-700">
              {language === "ta"
                ? "அல்லது பேட்ச் எண்ணை உள்ளிடுக:"
                : "Or enter Batch Tag Number manually:"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="e.g. TN-TSSCA-2025-P90412"
                className="flex-1 px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-mono font-bold uppercase text-forest-900"
              />
              <button
                onClick={() => handleVerifyBatch(batchInput)}
                className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-sm"
              >
                Verify
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: The Digital Seed Passport Certificate Card */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBatch ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-paddy-600/40 shadow-agro space-y-6 relative overflow-hidden">
              {/* Certificate Ribbon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-paddy-100 text-paddy-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-paddy-700" />
                      {selectedBatch.verificationStatus === "VERIFIED_OFFICIAL"
                        ? language === "ta"
                          ? "அரசு விதை சான்றளிப்பு சரிபார்க்கப்பட்டது"
                          : "Official Batch Verified"
                        : "Demo Record · Not Officially Verified"}
                    </span>
                    <span className="text-xs font-mono font-bold text-ink-500">
                      {selectedBatch.certNumber}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-forest-900 mt-2">
                    {language === "ta"
                      ? selectedBatch.tamilVariety
                      : selectedBatch.variety}
                  </h3>
                  <p className="text-xs text-ink-600">
                    {selectedBatch.cropName} • {selectedBatch.manufacturer} (
                    {selectedBatch.producerType})
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-bold text-ink-500 block uppercase">
                    Batch Code
                  </span>
                  <span className="font-mono text-sm font-black text-forest-900 bg-cream-200 px-3 py-1 rounded-lg">
                    {selectedBatch.batchNumber}
                  </span>
                </div>
              </div>

              {/* Lab Quality Test Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-cream-100 rounded-2xl border border-sage-300 text-center">
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
                    Germination Rate
                  </span>
                  <p className="font-display font-black text-3xl text-paddy-700 mt-1">
                    {selectedBatch.germinationRatePct}%
                  </p>
                  <p className="text-[9px] text-paddy-800 font-bold mt-0.5">
                    Min Standard: 80%
                  </p>
                </div>

                <div className="p-3.5 bg-cream-100 rounded-2xl border border-sage-300 text-center">
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
                    Physical Purity
                  </span>
                  <p className="font-display font-black text-3xl text-forest-900 mt-1">
                    {selectedBatch.physicalPurityPct}%
                  </p>
                  <p className="text-[9px] text-forest-700 font-bold mt-0.5">
                    Weed seeds: 0.0%
                  </p>
                </div>

                <div className="p-3.5 bg-cream-100 rounded-2xl border border-sage-300 text-center">
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
                    Genetic Purity
                  </span>
                  <p className="font-display font-black text-3xl text-forest-900 mt-1">
                    {selectedBatch.geneticPurityPct}%
                  </p>
                  <p className="text-[9px] text-forest-700 font-bold mt-0.5">
                    Breeder Pedigree
                  </p>
                </div>

                <div className="p-3.5 bg-cream-100 rounded-2xl border border-sage-300 text-center">
                  <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block">
                    Bag Weight / MRP
                  </span>
                  <p className="font-display font-black text-2xl text-forest-900 mt-1">
                    {selectedBatch.packageWeightKg} kg
                  </p>
                  <p className="text-[10px] text-terracotta-700 font-bold mt-0.5">
                    MRP: ₹{selectedBatch.mrp}
                  </p>
                </div>
              </div>

              {/* Chemical Treatment & Validity Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                  <span className="font-bold text-ink-600 block">
                    Lab Testing & Expiry Dates:
                  </span>
                  <p className="font-semibold text-forest-900 mt-0.5">
                    Tested: {selectedBatch.testingDate} •{" "}
                    {selectedBatchIsExpired ? "Expired on" : "Expires on"}:{" "}
                    {selectedBatch.expiryDate}
                  </p>
                </div>

                <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                  <span className="font-bold text-ink-600 block">
                    Fungicide Seed Treatment:
                  </span>
                  <p className="font-semibold text-forest-900 mt-0.5">
                    {selectedBatch.treatedWithPesticide
                      ? "Pre-treated with Carbendazim / Thiram (Safe for sowing)"
                      : "Untreated Organic Certified Seeds"}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Save to Farm vs Report Issue */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sage-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToFarm}
                    className="flex items-center gap-2 px-5 py-3 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
                  >
                    <Save className="w-4 h-4 text-harvest-400" />
                    <span>
                      {language === "ta"
                        ? "எனது பண்ணையில் சேமிக்கவும்"
                        : "Save Seed to Farmer's Farm"}
                    </span>
                  </button>

                  {savedSuccess && (
                    <span className="text-xs font-bold text-paddy-700 flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4" />
                      {language === "ta"
                        ? "சேமிக்கப்பட்டது!"
                        : "Saved to Active Season!"}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-terracotta-300 text-terracotta-700 font-bold text-xs hover:bg-terracotta-50 transition-colors"
                >
                  <Flag className="w-4 h-4 text-terracotta-600" />
                  <span>
                    {language === "ta"
                      ? "குறைபாடு புகார் செய்"
                      : "Report Issue / Defect"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-sage-300 shadow-agro">
              <p className="text-sm font-bold text-ink-600">
                Scan or select a seed bag to view the passport certificate.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-forest-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-terracotta-600" />
              <span>
                {language === "ta"
                  ? "விதை தரம் குறித்த புகார் பதிவு"
                  : "Report Seed Discrepancy"}
              </span>
            </h3>
            <p className="text-xs text-ink-600">
              {language === "ta"
                ? "முளைப்புத்திறன் குறைவாக இருந்தாலோ அல்லது போலி விதையாக சந்தேகம் இருந்தாலோ ஆய்வுத்துறைக்கு தகவல் அனுப்பலாம்."
                : "Describe a poor germination result or damaged tag. This demo stores the report locally; it does not contact an inspection authority."}
            </p>

            <form onSubmit={handleReportIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Issue Description
                </label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  required
                  rows={3}
                  placeholder="e.g. Germination rate observed below 60% after 6 days in nursery bed..."
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-terracotta-600 text-white font-bold text-xs shadow-sm"
                >
                  Save Demo Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
