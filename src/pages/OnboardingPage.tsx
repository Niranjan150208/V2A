import React, { useEffect, useState } from "react";
import {
  Sprout,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Layers,
  Droplets,
  ShieldCheck,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import type {
  FarmerCategory,
  CommunicationPreference,
  Language,
  LandParcel,
  SeasonName,
} from "../types";

const FARMER_CATEGORIES: FarmerCategory[] = [
  "Small farmer",
  "Medium farmer",
  "Large farmer",
  "Tenant farmer",
  "Agricultural land manager",
  "Other",
];

const SOIL_TYPES: string[] = [
  "Clay Loam",
  "Alluvial",
  "Red Sandy Loam",
  "Black Cotton",
  "Sandy",
  "Loamy",
];

const WATER_SOURCES: string[] = [
  "Canal",
  "Borewell",
  "Drip Irrigation",
  "Open Well",
  "Rainfed",
  "Pond",
  "Sprinkler",
];

const FARMING_METHODS = [
  "Conventional",
  "Organic",
  "Natural / ZBNF",
  "Mixed",
] as const;

export const OnboardingPage: React.FC = () => {
  const { navigate, language, setLanguage, triggerRefresh } = useNavigation();
  const draftKey = `v2a_onboarding_draft_${AppStore.getState().currentUser.id}`;
  const [savedDraft] = useState<{ step: number; formData: Record<string, any> } | null>(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [step, setStep] = useState(savedDraft?.step ?? 1);

  // Form State
  const [formData, setFormData] = useState<{
    // Step 1: Personal
    fullName: string;
    tamilFullName: string;
    phone: string;
    email: string;
    preferredLanguage: Language;
    farmerCategory: FarmerCategory;
    preferredCommunication: CommunicationPreference;
    // Step 2: Location
    state: string;
    district: string;
    taluk: string;
    village: string;
    pincode: string;
    // Step 3: Farm Details
    farmName: string;
    totalLand: number;
    areaUnit: "Acres" | "Hectares";
    ownershipType: "Owned" | "Leased" | "Shared" | "Tenant";
    farmingMethod: "Conventional" | "Organic" | "Natural / ZBNF" | "Mixed";
    surveyNumber: string;
    pattaNumber: string;
    // Step 4: Soil & Irrigation
    soilType: string;
    irrigationSource: string;
    waterAvailability: "Perennial" | "Seasonal" | "Deficit";
    electricityAvailability: "24 hrs" | "3-phase scheduled" | "Solar" | "None";
    // Step 5: Crop Info
    primaryCropId: string;
    plannedVariety: string;
    seasonName: SeasonName;
    sowingDate: string;
    allocatedArea: number;
  }>(() => {
    const state = AppStore.getState();
    const parcel = state.farm.parcels[0];
    const season = state.seasons.find((item) => item.id === state.activeSeasonId);

    return {
      fullName: state.farmer.fullName || state.currentUser.name || "",
      tamilFullName: state.farmer.tamilFullName || state.currentUser.tamilName || "",
      phone: state.currentUser.phone || "9842100000",
      email: state.currentUser.email || "",
      preferredLanguage: (state.language as Language) || "en",
      farmerCategory: state.farmer.farmerCategory || "Small farmer",
      preferredCommunication: state.farmer.preferredCommunicationMethod || "SMS",
      state: state.farmer.state || "Tamil Nadu",
      district: state.farmer.district || "Thanjavur",
      taluk: state.farmer.taluk || "Budalur",
      village: state.farmer.village || "Thiruvaiyaru",
      pincode: state.farmer.pincode || "613204",
      farmName: state.farm.farmName || "Delta Green Farm",
      totalLand: state.farmer.totalLandAcres || 3.5,
      areaUnit: state.farm.areaUnit || "Acres",
      ownershipType: (state.farm.ownershipType as any) || "Owned",
      farmingMethod: (state.farm.farmingMethod as any) || "Conventional",
      surveyNumber: parcel?.surveyNumber || "142/3B",
      pattaNumber: parcel?.pattaNumber || "PATTA-904",
      soilType: parcel?.soilType || "Clay Loam",
      irrigationSource: parcel?.irrigationType || "Canal",
      waterAvailability: state.farm.waterAvailability || "Perennial",
      electricityAvailability: state.farm.electricityAvailability || "Solar",
      primaryCropId: state.crops[0]?.id || "CROP-PADDY-SAMBA",
      plannedVariety: season?.variety || "CR 1009 Sub 1",
      seasonName: season?.seasonName || "Samba (Main-Rabi)",
      sowingDate: season?.sowingDate || new Date().toISOString().split("T")[0],
      allocatedArea: season?.areaAcres || 3.5,
      ...(savedDraft?.formData || {}),
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ step, formData }));
    } catch {
      console.warn("Could not automatically save onboarding progress.");
    }
  }, [draftKey, step, formData]);

  const handleRestart = () => {
    if (!window.confirm(language === "ta" ? "புதியதாக தொடங்க மேலோட்ட விவரங்களை அழிக்கவா?" : "Clear this saved onboarding progress and restart?")) return;
    localStorage.removeItem(draftKey);
    window.location.reload();
  };

  // Validation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full name is required";
      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        errs.phone = "Valid 10-digit mobile number is required";
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = "Please enter a valid email address";
      }
    } else if (currentStep === 2) {
      if (!formData.district.trim()) errs.district = "District is required";
      if (!formData.village.trim()) errs.village = "Village is required";
      if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
        errs.pincode = "Valid 6-digit PIN code is required";
      }
    } else if (currentStep === 3) {
      if (!formData.farmName.trim()) errs.farmName = "Farm name is required";
      if (formData.totalLand <= 0) errs.totalLand = "Total land must be greater than 0";
    } else if (currentStep === 4) {
      if (!formData.soilType) errs.soilType = "Select soil classification";
      if (!formData.irrigationSource) errs.irrigationSource = "Select primary irrigation source";
    } else if (currentStep === 5) {
      if (!formData.primaryCropId) errs.primaryCropId = "Select a crop";
      if (formData.allocatedArea <= 0) errs.allocatedArea = "Allocated area must be greater than 0";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 6) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveProgress = () => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ step, formData }));
      setSaveToast(true);
    } catch {
      alert("Could not save progress in this browser. Check available storage and try again.");
    }
    setTimeout(() => setSaveToast(false), 2000);
  };

  const calculateCompletionScore = (): number => {
    let score = 0;
    if (formData.fullName && formData.phone) score += 20;
    if (formData.village && formData.district && formData.pincode) score += 20;
    if (formData.farmName && formData.totalLand > 0) score += 20;
    if (formData.soilType && formData.irrigationSource) score += 20;
    if (formData.primaryCropId && formData.allocatedArea > 0) score += 20;
    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5)) {
      setStep(1);
      return;
    }

    const state = AppStore.getState();
    const crop = state.crops.find((c) => c.id === formData.primaryCropId) || state.crops[0];
    const totalAcres =
      formData.areaUnit === "Hectares"
        ? AppStore.hectaresToAcres(formData.totalLand)
        : formData.totalLand;

    const parcelId = `PARCEL-${Date.now()}`;
    const parcel: LandParcel = {
      id: parcelId,
      surveyNumber: formData.surveyNumber || "1/1",
      subDivision: "1",
      pattaNumber: formData.pattaNumber || "PATTA-1",
      acres: totalAcres,
      soilType: formData.soilType as any,
      irrigationType: formData.irrigationSource as any,
      locationName: `${formData.village} Field`,
    };

    const farmId = `FARM-${Date.now()}`;
    const updatedFarm = {
      id: farmId,
      farmerId: state.farmer.id,
      farmName: formData.farmName,
      state: formData.state,
      district: formData.district,
      taluk: formData.taluk,
      village: formData.village,
      pincode: formData.pincode,
      totalAreaAcres: totalAcres,
      areaUnit: formData.areaUnit,
      ownershipType: formData.ownershipType,
      soilType: formData.soilType,
      irrigationSource: formData.irrigationSource,
      waterAvailability: formData.waterAvailability,
      electricityAvailability: formData.electricityAvailability,
      farmingMethod: formData.farmingMethod,
      parcels: [parcel],
      activeSeasonsCount: 1,
    };

    // Update state
    AppStore.updateFarmerAndFarm(
      {
        fullName: formData.fullName,
        tamilFullName: formData.tamilFullName || formData.fullName,
        email: formData.email,
        farmerCategory: formData.farmerCategory,
        preferredLanguage: formData.preferredLanguage,
        preferredCommunicationMethod: formData.preferredCommunication,
        state: formData.state,
        district: formData.district,
        taluk: formData.taluk,
        village: formData.village,
        pincode: formData.pincode,
        totalLandAcres: totalAcres,
        primaryCrops: [crop.name],
        soilTypes: [formData.soilType],
        waterSources: [formData.irrigationSource],
      },
      updatedFarm,
    );

    AppStore.setCurrentUser({
      ...state.currentUser,
      name: formData.fullName,
      tamilName: formData.tamilFullName || formData.fullName,
      phone: formData.phone,
      email: formData.email,
      role: "farmer",
    });

    if (formData.preferredLanguage !== state.language) {
      setLanguage(formData.preferredLanguage);
    }

    // Create season
    AppStore.createSeason({
      farmerId: state.farmer.id,
      cropId: crop.id,
      cropName: crop.name,
      tamilCropName: crop.tamilName,
      variety: formData.plannedVariety,
      seasonName: formData.seasonName,
      parcelId,
      parcelName: `${formData.village} Field (${totalAcres} Acres)`,
      areaAcres: totalAcres,
      startDate: new Date().toISOString().split("T")[0],
      sowingDate: formData.sowingDate,
      plannedHarvestDate: new Date(Date.now() + crop.durationDays * 86400000)
        .toISOString()
        .split("T")[0],
      stage: "Planning",
      targetYieldBags: Math.round(totalAcres * crop.avgYieldBagsPerAcre),
      allocatedBudget: Math.round(totalAcres * crop.avgCostPerAcre),
      notes: "Onboarding cultivation season initialized.",
    });

    localStorage.removeItem(draftKey);
    triggerRefresh();
    navigate("/dashboard");
  };

  const completionPct = calculateCompletionScore();

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Header & Progress Indicator */}
      <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-paddy-600" />
              <span>Farmer Onboarding & Farm Setup</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
              {step === 1 && "Step 1: Personal Details"}
              {step === 2 && "Step 2: Farm Location"}
              {step === 3 && "Step 3: Farm Holdings & Land Area"}
              {step === 4 && "Step 4: Soil & Irrigation Infrastructure"}
              {step === 5 && "Step 5: Current Crop Cultivation Plan"}
              {step === 6 && "Step 6: Review & Final Registration"}
            </h1>
            <p className="text-xs text-ink-500">
              Step {step} of 6 • Multi-step verification for personalized agronomy recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedDraft && (
              <button
                type="button"
                onClick={handleRestart}
                className="px-3 py-2 rounded-xl border border-sage-300 text-xs font-bold text-ink-600 hover:bg-cream-100"
              >
                {language === "ta" ? "மீண்டும் தொடங்கு" : "Restart"}
              </button>
            )}
            <div className="text-right">
              <span className="text-[10px] font-bold text-ink-500 uppercase block">Completion</span>
              <span className="font-display font-extrabold text-lg text-paddy-700">{completionPct}%</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-forest-800 text-harvest-300 font-bold flex items-center justify-center text-sm shadow-sm">
              {step}/6
            </div>
          </div>
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-6 gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? "bg-paddy-600" : "bg-sage-200"
              }`}
            />
          ))}
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-paddy-100 border border-paddy-400 text-paddy-900 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-paddy-700" />
          <span>Progress saved locally. You can continue whenever you are ready.</span>
        </div>
      )}

      {/* Main Multi-Step Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro">
        <form onSubmit={step === 6 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-forest-900 border-b border-sage-200 pb-2">
                Personal Information & Contact Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Full Name (ஆங்கிலப் பெயர்) *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium focus:outline-none focus:border-paddy-600"
                    placeholder="e.g. Vijayakumar"
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Tamil Name (தமிழில் பெயர்)
                  </label>
                  <input
                    type="text"
                    value={formData.tamilFullName}
                    onChange={(e) => setFormData({ ...formData, tamilFullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium focus:outline-none focus:border-paddy-600"
                    placeholder="எ.கா. விஜயகுமார்"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Mobile Number (கைபேசி எண்) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium focus:outline-none focus:border-paddy-600"
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Email Address (மின்னஞ்சல் - விருப்பத்தேர்வு)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium focus:outline-none focus:border-paddy-600"
                    placeholder="farmer@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Preferred Language (மொழி) *
                  </label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as Language })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium focus:outline-none focus:border-paddy-600"
                  >
                    <option value="en">English</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Farmer Category (விவசாயி வகை) *
                  </label>
                  <select
                    value={formData.farmerCategory}
                    onChange={(e) => setFormData({ ...formData, farmerCategory: e.target.value as FarmerCategory })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium focus:outline-none focus:border-paddy-600"
                  >
                    {FARMER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Preferred Communication (தொடர்பு முறை)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["SMS", "WhatsApp", "Phone Call", "In-App"] as CommunicationPreference[]).map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredCommunication: pref })}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.preferredCommunication === pref
                            ? "bg-forest-800 text-harvest-300 border-forest-900 shadow-sm"
                            : "bg-cream-50 text-ink-700 border-sage-300 hover:bg-cream-100"
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-forest-900 border-b border-sage-200 pb-2">
                Geographic Location & Revenue Firka
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">State (மாநிலம்) *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="Tamil Nadu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">District (மாவட்டம்) *</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="Thanjavur"
                  />
                  {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Taluk / Block (வட்டம்)</label>
                  <input
                    type="text"
                    value={formData.taluk}
                    onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="Budalur / Thiruvaiyaru"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Village / Revenue Town (கிராமம்) *</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="Thiruvaiyaru"
                  />
                  {errors.village && <p className="text-xs text-red-600 mt-1">{errors.village}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Postal PIN Code (அஞ்சல் குறியீடு) *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="613204"
                  />
                  {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Farm Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-forest-900 border-b border-sage-200 pb-2">
                Farm Characteristics & Land Title
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-700 mb-1">Farm Name (பண்ணையின் பெயர்) *</label>
                  <input
                    type="text"
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="e.g. Cauvery Riverbed Fertile Vayal"
                  />
                  {errors.farmName && <p className="text-xs text-red-600 mt-1">{errors.farmName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Total Land Area (மொத்த பரப்பு) *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.totalLand}
                      onChange={(e) => setFormData({ ...formData, totalLand: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                      placeholder="e.g. 3.5"
                    />
                    <select
                      value={formData.areaUnit}
                      onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as "Acres" | "Hectares" })}
                      className="px-3 py-2.5 bg-cream-100 border border-sage-300 rounded-xl text-xs font-bold"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Hectares">Hectares</option>
                    </select>
                  </div>
                  {errors.totalLand && <p className="text-xs text-red-600 mt-1">{errors.totalLand}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Land Ownership Type (உரிமை வகை)</label>
                  <select
                    value={formData.ownershipType}
                    onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    <option value="Owned">Owned (சொந்த நிலம்)</option>
                    <option value="Leased">Leased (குத்தகை நிலம்)</option>
                    <option value="Shared">Shared Cultivation (பங்கு சாகுபடி)</option>
                    <option value="Tenant">Tenant Cultivator (உழவு சாகுபடி)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Farming Method (விவசாய முறை)</label>
                  <select
                    value={formData.farmingMethod}
                    onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    {FARMING_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Survey Number (புல எண் / உட்பிரிவு)</label>
                  <input
                    type="text"
                    value={formData.surveyNumber}
                    onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="e.g. 142/3B"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Soil & Irrigation */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-forest-900 border-b border-sage-200 pb-2">
                Soil Classification & Irrigation Source
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Soil Classification (மண் வகை) *</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    {SOIL_TYPES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {errors.soilType && <p className="text-xs text-red-600 mt-1">{errors.soilType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Primary Irrigation Source (பாசன ஆதாரம்) *</label>
                  <select
                    value={formData.irrigationSource}
                    onChange={(e) => setFormData({ ...formData, irrigationSource: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    {WATER_SOURCES.map((ws) => (
                      <option key={ws} value={ws}>
                        {ws}
                      </option>
                    ))}
                  </select>
                  {errors.irrigationSource && <p className="text-xs text-red-600 mt-1">{errors.irrigationSource}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Water Availability (நீர் கிடைக்கும் தன்மை)</label>
                  <select
                    value={formData.waterAvailability}
                    onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    <option value="Perennial">Perennial (வருடம் முழுவதும் போதுமானது)</option>
                    <option value="Seasonal">Seasonal (பருவகால பாசனம் மட்டும்)</option>
                    <option value="Deficit">Deficit (நீர் பற்றாக்குறை மண்டலம்)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Electricity Availability (மின்சார வசதி)</label>
                  <select
                    value={formData.electricityAvailability}
                    onChange={(e) => setFormData({ ...formData, electricityAvailability: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    <option value="Solar">Solar Pump (சூரிய சக்தி பம்ப் செட்)</option>
                    <option value="3-phase scheduled">3-Phase Scheduled (அரசு கட்டணமில்லா மும்முனை)</option>
                    <option value="24 hrs">24 Hours Continuous</option>
                    <option value="None">None / Diesel Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Current Crop Cultivation Plan */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-forest-900 border-b border-sage-200 pb-2">
                Crop Selection & Sowing Schedule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink-700 mb-1">Primary Crop (பயிர் தேர்வு) *</label>
                  <select
                    value={formData.primaryCropId}
                    onChange={(e) => setFormData({ ...formData, primaryCropId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    {AppStore.getState().crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.tamilName}) • Avg Yield: {c.avgYieldBagsPerAcre} bags/acre
                      </option>
                    ))}
                  </select>
                  {errors.primaryCropId && <p className="text-xs text-red-600 mt-1">{errors.primaryCropId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Variety (பயிர் ரகம்)</label>
                  <input
                    type="text"
                    value={formData.plannedVariety}
                    onChange={(e) => setFormData({ ...formData, plannedVariety: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                    placeholder="e.g. CR 1009 Sub 1 / Ponni"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Cultivation Season (சாகுபடி பருவம்)</label>
                  <select
                    value={formData.seasonName}
                    onChange={(e) => setFormData({ ...formData, seasonName: e.target.value as SeasonName })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  >
                    <option value="Samba (Main-Rabi)">Samba (Main-Rabi)</option>
                    <option value="Kuruvai (Summer-Kharif)">Kuruvai (Summer-Kharif)</option>
                    <option value="Thaladi (Late-Rabi)">Thaladi (Late-Rabi)</option>
                    <option value="Navarai (Summer)">Navarai (Summer)</option>
                    <option value="General Season">General Season</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Planned Sowing Date (விதைப்பு தேதி)</label>
                  <input
                    type="date"
                    value={formData.sowingDate}
                    onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Land Allocated (ஒதுக்கப்பட்ட பரப்பு - ஏக்கர்)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.allocatedArea}
                    onChange={(e) => setFormData({ ...formData, allocatedArea: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-medium"
                  />
                  {errors.allocatedArea && <p className="text-xs text-red-600 mt-1">{errors.allocatedArea}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-forest-900 border-b border-sage-200 pb-2">
                Step 6: Review Information & Submit
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Farmer Identity</span>
                  <p className="font-bold text-sm text-forest-900">{formData.fullName} ({formData.tamilFullName || "—"})</p>
                  <p className="text-ink-600">Mobile: {formData.phone}</p>
                  <p className="text-ink-600">Category: {formData.farmerCategory}</p>
                  <p className="text-ink-600">Language: {formData.preferredLanguage.toUpperCase()}</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Location</span>
                  <p className="font-bold text-sm text-forest-900">{formData.village}, {formData.taluk}</p>
                  <p className="text-ink-600">District: {formData.district}</p>
                  <p className="text-ink-600">State: {formData.state} - {formData.pincode}</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Farm Holdings</span>
                  <p className="font-bold text-sm text-forest-900">{formData.farmName}</p>
                  <p className="text-ink-600">Total Area: {formData.totalLand} {formData.areaUnit}</p>
                  <p className="text-ink-600">Ownership: {formData.ownershipType} • Method: {formData.farmingMethod}</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <span className="text-[10px] font-bold text-ink-500 uppercase block">Soil & Irrigation</span>
                  <p className="font-bold text-sm text-forest-900">Soil: {formData.soilType}</p>
                  <p className="text-ink-600">Irrigation: {formData.irrigationSource} ({formData.waterAvailability})</p>
                  <p className="text-ink-600">Electricity: {formData.electricityAvailability}</p>
                </div>

                <div className="sm:col-span-2 p-4 bg-harvest-50 rounded-2xl border border-harvest-200 space-y-1">
                  <span className="text-[10px] font-bold text-forest-800 uppercase block">Cultivation Season Plan</span>
                  <p className="font-bold text-sm text-forest-900">
                    {AppStore.getState().crops.find((c) => c.id === formData.primaryCropId)?.name || "Paddy"} ({formData.plannedVariety})
                  </p>
                  <p className="text-xs text-ink-700">
                    Season: {formData.seasonName} • Allocated Area: {formData.allocatedArea} Acres • Sowing Date: {formData.sowingDate}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-paddy-50 rounded-2xl border border-paddy-300 text-xs text-paddy-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-paddy-700" />
                  Data Ownership & Privacy Guarantee
                </p>
                <p className="leading-relaxed">
                  Your farm data is stored under your authenticated account session. No sensitive personal identifiers or unauthorized data will be shared with third parties.
                </p>
              </div>
            </div>
          )}

          {/* Navigation & Action Buttons */}
          <div className="mt-8 pt-4 border-t border-sage-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-sage-300 text-ink-700 font-bold text-xs hover:bg-cream-100 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="px-4 py-2.5 rounded-xl border border-sage-300 text-ink-600 font-medium text-xs hover:bg-cream-100"
                >
                  Save Progress
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-paddy-700 hover:bg-paddy-800 text-white font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Registration & Launch Farm</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
