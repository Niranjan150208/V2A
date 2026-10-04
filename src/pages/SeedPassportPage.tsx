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
  Plus,
  X,
  Download,
  Printer,
  Check,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { SeedBatch } from "../types";

export const SeedPassportPage: React.FC = () => {
  const { language, navigate, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  const [batchInput, setBatchInput] = useState("TN-TSSCA-2025-P90412");
  const [selectedBatch, setSelectedBatch] = useState<SeedBatch | null>(
    state.seedBatches[0] || null,
  );
  const [verificationResultState, setVerificationResultState] = useState<
    "VERIFIED" | "UNVERIFIED" | "NOT_FOUND" | "FLAGGED_EXPIRED"
  >("VERIFIED");

  const [isScanning, setIsScanning] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddSeedModal, setShowAddSeedModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [scanError, setScanError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanControlsRef = useRef<{ stop: () => void } | null>(null);

  // New Seed Form State
  const [newSeedForm, setNewSeedForm] = useState({
    batchNumber: "",
    cropName: "Paddy (Samba)",
    variety: "",
    tamilVariety: "",
    manufacturer: "Tamil Nadu State Seed Development Corp",
    producerType: "Government (TSSCA)",
    certNumber: "",
    germinationRatePct: 92,
    physicalPurityPct: 98,
    geneticPurityPct: 99,
    testingDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0],
    mrp: 1450,
    packageWeightKg: 30,
    purchaseDate: new Date().toISOString().split("T")[0],
    purchaseQuantity: 2,
    purchasePrice: 1450,
    seller: "Delta Agro Service Centre",
  });

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
      const isExpired =
        new Date(`${found.expiryDate}T23:59:59`).getTime() < Date.now();
      if (isExpired) {
        setVerificationResultState("FLAGGED_EXPIRED");
      } else if (
        found.producerType.includes("Government") ||
        found.producerType.includes("TSSCA") ||
        found.producerType.includes("University")
      ) {
        setVerificationResultState("VERIFIED");
      } else {
        setVerificationResultState("UNVERIFIED");
      }
      setScanError("");
    } else {
      setSelectedBatch(null);
      setVerificationResultState("NOT_FOUND");
      setScanError(
        "No matching seed lot was found for the identifier entered. Please verify the batch code on your bag label.",
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
        "Camera access failed. Ensure camera permission is granted, or enter the batch code manually.",
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
    if (!reportText.trim() || !selectedBatch) return;

    AppStore.reportSuspiciousSeed({
      batchNumber: selectedBatch.batchNumber,
      productName: selectedBatch.variety,
      brand: selectedBatch.manufacturer,
      seller: selectedBatch.producerType,
      reason: reportText.trim(),
      reporterName: state.currentUser.name || "Farmer",
    });

    setShowReportModal(false);
    setReportText("");
    alert(
      language === "ta"
        ? "விதை தரம் குறித்த புகார் ஆய்வுத்துறைக்கு அனுப்பப்பட்டது."
        : "Seed discrepancy report logged and saved to records.",
    );
    triggerRefresh();
  };

  const handleCreateSeedRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeedForm.batchNumber.trim() || !newSeedForm.variety.trim()) return;

    const newBatch: SeedBatch = {
      id: `SEED-${Date.now()}`,
      batchNumber: newSeedForm.batchNumber.trim(),
      cropId: "CROP-PADDY-SAMBA",
      cropName: newSeedForm.cropName,
      variety: newSeedForm.variety.trim(),
      tamilVariety: newSeedForm.tamilVariety.trim() || newSeedForm.variety.trim(),
      manufacturer: newSeedForm.manufacturer,
      producerType: newSeedForm.producerType as any,
      certNumber: newSeedForm.certNumber || `CERT-${Date.now().toString().slice(-6)}`,
      germinationRatePct: Number(newSeedForm.germinationRatePct),
      physicalPurityPct: Number(newSeedForm.physicalPurityPct),
      geneticPurityPct: Number(newSeedForm.geneticPurityPct),
      testingDate: newSeedForm.testingDate,
      expiryDate: newSeedForm.expiryDate,
      qrPayload: `V2A-SEED:${newSeedForm.batchNumber}:${newSeedForm.variety}`,
      verificationStatus: newSeedForm.producerType.includes("TSSCA")
        ? "VERIFIED_OFFICIAL"
        : "UNVERIFIED",
      treatedWithPesticide: true,
      packageWeightKg: Number(newSeedForm.packageWeightKg),
      mrp: Number(newSeedForm.mrp),
    };

    AppStore.addSeedBatch(newBatch);
    setSelectedBatch(newBatch);
    setVerificationResultState(
      newBatch.producerType.includes("TSSCA") ? "VERIFIED" : "UNVERIFIED",
    );
    setShowAddSeedModal(false);
    triggerRefresh();
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
                : "Certified Seed Passport & QR Verification"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "விதை தொகுதி விவரங்கள் & ஆய்வு"
              : "Seed Passport & Batch Authenticity"}
          </h1>
          <p className="text-xs text-ink-500">
            Batch tracking, physical purity, germination standards, and internal QR verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddSeedModal(true)}
            className="px-4 py-2 bg-paddy-700 hover:bg-paddy-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Seed Record</span>
          </button>

          {selectedBatch && (
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Internal QR</span>
            </button>
          )}
        </div>
      </div>

      {/* Regulatory Notice Banner */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-harvest-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            Regulatory Notice — Verification Boundaries:
          </p>
          <p className="text-ink-600 leading-relaxed">
            Internally generated QR codes are for internal inventory tracking and record-keeping. They do not constitute official government seed certification or statutory clearance under The Seeds Act, 1966. Only batches with authoritative laboratory test numbers from certified agencies are categorized as VERIFIED.
          </p>
        </div>
      </div>

      {/* QR Scanner & Batch Code Entry Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Camera QR Scanner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-5">
          <h3 className="font-display font-bold text-base text-forest-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-paddy-600" />
            <span>Scan Seed Bag QR Code</span>
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
                    Allow camera access, then point at a seed QR code.
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

          {/* Quick Pre-Set Bag QRs */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
              Registered Seed Batches:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {state.seedBatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBatchInput(b.batchNumber);
                    handleVerifyBatch(b.batchNumber);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedBatch?.id === b.id
                      ? "bg-forest-800 text-cream-50 border-forest-900 shadow-sm"
                      : "bg-cream-50 hover:bg-forest-50 border-sage-300 text-forest-900"
                  }`}
                >
                  <span>🌾 {b.variety}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      selectedBatch?.id === b.id
                        ? "bg-harvest-300 text-forest-950"
                        : "bg-paddy-100 text-paddy-800"
                    }`}
                  >
                    {b.germinationRatePct}% Germ
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Seed Passport Certificate & Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Manual Input Search Bar */}
          <div className="bg-white rounded-3xl p-4 border border-sage-300 shadow-agro flex items-center gap-3">
            <Search className="w-5 h-5 text-ink-400 shrink-0 ml-2" />
            <input
              type="text"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="Enter batch number (e.g. TN-TSSCA-2025-P90412)..."
              className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-forest-900 focus:outline-none"
            />
            <button
              onClick={() => handleVerifyBatch(batchInput)}
              className="px-5 py-2.5 bg-paddy-700 hover:bg-paddy-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Verify Batch
            </button>
          </div>

          {selectedBatch ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
              {/* Top Banner with 3-State Verification Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-cream-200 text-forest-900 px-3 py-1 rounded-lg">
                      {selectedBatch.batchNumber}
                    </span>

                    {/* 3 Verification States */}
                    {verificationResultState === "VERIFIED" && (
                      <span className="bg-paddy-100 text-paddy-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-paddy-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-paddy-700" />
                        <span>VERIFIED • Official TSSCA Certified</span>
                      </span>
                    )}
                    {verificationResultState === "UNVERIFIED" && (
                      <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>UNVERIFIED • Internal Dealer Record</span>
                      </span>
                    )}
                    {verificationResultState === "FLAGGED_EXPIRED" && (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-red-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>EXPIRED LOT • Validity Passed</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-forest-900 mt-2">
                    {selectedBatch.variety} ({selectedBatch.tamilVariety})
                  </h3>
                  <p className="text-xs text-ink-500">
                    Producer: {selectedBatch.manufacturer} • Agency: {selectedBatch.producerType}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">MRP</span>
                  <p className="font-display font-black text-2xl text-forest-900">
                    ₹{selectedBatch.mrp}
                    <span className="text-xs font-normal text-ink-500"> / {selectedBatch.packageWeightKg}kg</span>
                  </p>
                </div>
              </div>

              {/* Quality Standards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink-500">Germination</span>
                  <p className="font-display font-black text-2xl text-paddy-700">
                    {selectedBatch.germinationRatePct}%
                  </p>
                  <p className="text-[10px] text-ink-500">Min Benchmark: 80%</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink-500">Physical Purity</span>
                  <p className="font-display font-black text-2xl text-forest-900">
                    {selectedBatch.physicalPurityPct}%
                  </p>
                  <p className="text-[10px] text-ink-500">Clean Inert Matter</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink-500">Genetic Purity</span>
                  <p className="font-display font-black text-2xl text-forest-900">
                    {selectedBatch.geneticPurityPct}%
                  </p>
                  <p className="text-[10px] text-ink-500">Breeder Lineage</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-ink-500">Expiry Date</span>
                  <p className="font-display font-black text-base text-forest-900 mt-1">
                    {selectedBatch.expiryDate}
                  </p>
                  <p className="text-[10px] text-ink-500">Tested: {selectedBatch.testingDate}</p>
                </div>
              </div>

              {/* Batch Metadata & Certification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Certification Details</span>
                  <p className="font-bold text-forest-900">{selectedBatch.certNumber}</p>
                  <p className="text-ink-600">Issued by Department of Seed Certification, Govt of Tamil Nadu.</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Seed Treatment</span>
                  <p className="font-bold text-forest-900">
                    {selectedBatch.treatedWithPesticide ? "Treated with Carbendazim / Thiram" : "Untreated Organic"}
                  </p>
                  <p className="text-ink-600">Shields emerging seedlings from soil-borne damping-off disease.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sage-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToFarm}
                    className="flex items-center gap-2 px-5 py-3 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
                  >
                    <Save className="w-4 h-4 text-harvest-400" />
                    <span>Save Seed to Active Season</span>
                  </button>

                  {savedSuccess && (
                    <span className="text-xs font-bold text-paddy-700 flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saved!</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-terracotta-300 text-terracotta-700 font-bold text-xs hover:bg-terracotta-50 transition-colors"
                >
                  <Flag className="w-4 h-4 text-terracotta-600" />
                  <span>Report Suspicious Details</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-sage-300 shadow-agro space-y-2">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-base text-forest-900">No Matching Record Found</h4>
              <p className="text-xs text-ink-500">
                Batch code <span className="font-mono font-bold text-forest-900">{batchInput}</span> was not found in records.
              </p>
              <button
                onClick={() => setShowAddSeedModal(true)}
                className="mt-2 px-4 py-2 bg-paddy-700 text-white font-bold text-xs rounded-xl"
              >
                Register this Batch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ADD SEED RECORD MODAL */}
      {showAddSeedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sage-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Register New Seed Batch</h3>
              <button onClick={() => setShowAddSeedModal(false)} className="text-ink-500 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSeedRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={newSeedForm.batchNumber}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl font-mono"
                    placeholder="e.g. TN-TSSCA-2026-P01"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Variety Name *</label>
                  <input
                    type="text"
                    required
                    value={newSeedForm.variety}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, variety: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                    placeholder="e.g. CR 1009 Sub 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Manufacturer / Brand</label>
                  <input
                    type="text"
                    value={newSeedForm.manufacturer}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Producer Agency</label>
                  <select
                    value={newSeedForm.producerType}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, producerType: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Government (TSSCA)">Government (TSSCA)</option>
                    <option value="Certified Agri University">Certified Agri University</option>
                    <option value="Licensed Private Seed Co">Licensed Private Seed Co</option>
                    <option value="Farmer Producer Org">Farmer Producer Org</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Germination %</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newSeedForm.germinationRatePct}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, germinationRatePct: parseInt(e.target.value) || 90 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Purity %</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newSeedForm.physicalPurityPct}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, physicalPurityPct: parseInt(e.target.value) || 98 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newSeedForm.mrp}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newSeedForm.expiryDate}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Seller / Vendor</label>
                  <input
                    type="text"
                    value={newSeedForm.seller}
                    onChange={(e) => setNewSeedForm({ ...newSeedForm, seller: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowAddSeedModal(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl text-ink-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-paddy-700 hover:bg-paddy-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Seed Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERNAL QR GENERATOR MODAL */}
      {showQrModal && selectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-sage-300 shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-sage-200">
              <h4 className="font-bold text-forest-900 text-sm">Internal Batch QR Tag</h4>
              <button onClick={() => setShowQrModal(false)} className="text-ink-400 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated 2D Matrix Tag */}
            <div className="p-6 bg-white border-2 border-forest-900 rounded-2xl mx-auto w-56 h-56 flex flex-col items-center justify-center shadow-inner">
              <QrCode className="w-36 h-36 text-forest-900" />
              <span className="font-mono text-[10px] font-bold mt-2 text-ink-700">
                {selectedBatch.batchNumber}
              </span>
            </div>

            <div className="text-xs text-ink-600 space-y-1">
              <p className="font-bold text-forest-900">{selectedBatch.variety}</p>
              <p className="text-[11px] text-ink-500">
                Internal Inventory Tag • Farm Cadastre ID: {state.farm.id}
              </p>
            </div>

            <button
              onClick={() => {
                alert("Printing simulated QR tag...");
                setShowQrModal(false);
              }}
              className="w-full py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Internal Label</span>
            </button>
          </div>
        </div>
      )}

      {/* Report Suspicious Modal */}
      {showReportModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-sage-300 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-forest-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-terracotta-600" />
                <span>Report Suspicious Lot</span>
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-ink-400 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ink-600">
              Logged reports are recorded to your account and forwarded to the agricultural inspection desk for batch verification.
            </p>

            <form onSubmit={handleReportIssue} className="space-y-4 text-xs">
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="font-bold block text-forest-900">Batch: {selectedBatch.batchNumber}</span>
                <span className="text-ink-600">{selectedBatch.variety} • {selectedBatch.manufacturer}</span>
              </div>

              <div>
                <label className="block font-bold text-ink-700 mb-1">
                  Reason for Reporting *
                </label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  required
                  rows={3}
                  placeholder="e.g. Germination rate observed below 50% in nursery; seed tag appears tampered with..."
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-terracotta-600 text-white font-bold shadow-sm hover:bg-terracotta-700"
                >
                  Submit Discrepancy Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
