import React, { useState } from "react";
import {
  Layers,
  MapPin,
  Droplets,
  Activity,
  Plus,
  ShieldCheck,
  ChevronRight,
  FileText,
  Trash2,
  Edit,
  Sparkles,
  Zap,
  Globe,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import type { Farm, LandParcel } from "../types";

export const MyFarmPage: React.FC = () => {
  const { language, navigate, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  // Unit toggle state: "Acres" or "Hectares"
  const [unitMode, setUnitMode] = useState<"Acres" | "Hectares">("Acres");

  // Selected farm
  const currentFarms = state.farms.length > 0 ? state.farms : [state.farm];
  const [selectedFarmId, setSelectedFarmId] = useState<string>(
    state.farm.id || currentFarms[0]?.id || "",
  );

  const activeFarm =
    currentFarms.find((f) => f.id === selectedFarmId) || currentFarms[0] || state.farm;

  // Selected parcel
  const parcels = activeFarm.parcels || [];
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    parcels[0]?.id || "",
  );
  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Modals
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showEditFarmModal, setShowEditFarmModal] = useState(false);
  const [showAddParcelModal, setShowAddParcelModal] = useState(false);
  const [showEditParcelModal, setShowEditParcelModal] = useState(false);

  // Farm Form State
  const [farmForm, setFarmForm] = useState({
    farmName: "",
    state: "Tamil Nadu",
    district: "Thanjavur",
    taluk: "Budalur",
    village: "",
    pincode: "",
    totalAreaAcres: 3.5,
    ownershipType: "Owned",
    soilType: "Clay Loam",
    irrigationSource: "Canal",
    waterAvailability: "Perennial",
    electricityAvailability: "Solar",
    farmingMethod: "Conventional",
  });

  // Parcel Form State
  const [parcelForm, setParcelForm] = useState({
    surveyNumber: "",
    subDivision: "1",
    pattaNumber: "",
    acres: 1.5,
    soilType: "Clay Loam",
    irrigationType: "Canal",
    locationName: "",
    lat: 10.787,
    lng: 79.137,
  });

  const displayArea = (acres: number) => {
    if (unitMode === "Hectares") {
      return `${AppStore.acresToHectares(acres)} ha`;
    }
    return `${acres.toFixed(2)} acres`;
  };

  // Farm Handlers
  const handleOpenAddFarm = () => {
    setFarmForm({
      farmName: `Farm #${currentFarms.length + 1}`,
      state: state.farmer.state || "Tamil Nadu",
      district: state.farmer.district || "Thanjavur",
      taluk: state.farmer.taluk || "Budalur",
      village: state.farmer.village || "Thiruvaiyaru",
      pincode: state.farmer.pincode || "613204",
      totalAreaAcres: 2.0,
      ownershipType: "Owned",
      soilType: "Clay Loam",
      irrigationSource: "Canal",
      waterAvailability: "Perennial",
      electricityAvailability: "Solar",
      farmingMethod: "Conventional",
    });
    setShowAddFarmModal(true);
  };

  const handleSaveAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmForm.farmName.trim()) return;

    const newFarm = AppStore.addFarm({
      farmerId: state.farmer?.id || "FARMER-1",
      farmName: farmForm.farmName,
      state: farmForm.state,
      district: farmForm.district,
      taluk: farmForm.taluk,
      village: farmForm.village,
      pincode: farmForm.pincode,
      totalAreaAcres: farmForm.totalAreaAcres,
      ownershipType: farmForm.ownershipType as any,
      soilType: farmForm.soilType,
      irrigationSource: farmForm.irrigationSource,
      waterAvailability: farmForm.waterAvailability as any,
      electricityAvailability: farmForm.electricityAvailability as any,
      farmingMethod: farmForm.farmingMethod as any,
      parcels: [],
      activeSeasonsCount: 0,
    });

    setSelectedFarmId(newFarm.id);
    setShowAddFarmModal(false);
    triggerRefresh();
  };

  const handleOpenEditFarm = () => {
    setFarmForm({
      farmName: activeFarm.farmName,
      state: activeFarm.state || "Tamil Nadu",
      district: activeFarm.district,
      taluk: activeFarm.taluk || "",
      village: activeFarm.village,
      pincode: activeFarm.pincode || "",
      totalAreaAcres: activeFarm.totalAreaAcres,
      ownershipType: activeFarm.ownershipType || "Owned",
      soilType: activeFarm.soilType || "Clay Loam",
      irrigationSource: activeFarm.irrigationSource || "Canal",
      waterAvailability: activeFarm.waterAvailability || "Perennial",
      electricityAvailability: activeFarm.electricityAvailability || "Solar",
      farmingMethod: activeFarm.farmingMethod || "Conventional",
    });
    setShowEditFarmModal(true);
  };

  const handleSaveEditFarm = (e: React.FormEvent) => {
    e.preventDefault();
    AppStore.updateFarm(activeFarm.id, {
      farmName: farmForm.farmName,
      state: farmForm.state,
      district: farmForm.district,
      taluk: farmForm.taluk,
      village: farmForm.village,
      pincode: farmForm.pincode,
      ownershipType: farmForm.ownershipType as any,
      soilType: farmForm.soilType,
      irrigationSource: farmForm.irrigationSource,
      waterAvailability: farmForm.waterAvailability as any,
      electricityAvailability: farmForm.electricityAvailability as any,
      farmingMethod: farmForm.farmingMethod as any,
    });
    setShowEditFarmModal(false);
    triggerRefresh();
  };

  const handleDeleteFarm = () => {
    if (currentFarms.length <= 1) {
      alert("You must keep at least one registered farm.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${activeFarm.farmName}? All attached parcels will be removed.`,
    );
    if (!confirmed) return;

    AppStore.deleteFarm(activeFarm.id);
    const remaining = AppStore.getState().farms;
    setSelectedFarmId(remaining[0]?.id || "");
    triggerRefresh();
  };

  // Parcel Handlers
  const handleOpenAddParcel = () => {
    setParcelForm({
      surveyNumber: `${Math.floor(Math.random() * 200 + 10)}/1`,
      subDivision: "1",
      pattaNumber: activeFarm.parcels[0]?.pattaNumber || "PATTA-101",
      acres: 1.0,
      soilType: activeFarm.soilType || "Clay Loam",
      irrigationType: activeFarm.irrigationSource || "Canal",
      locationName: `${activeFarm.village || "North"} Field`,
      lat: 10.787,
      lng: 79.137,
    });
    setShowAddParcelModal(true);
  };

  const handleSaveAddParcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelForm.surveyNumber.trim()) return;

    const newParcel = AppStore.addParcel(activeFarm.id, {
      surveyNumber: parcelForm.surveyNumber,
      subDivision: parcelForm.subDivision,
      pattaNumber: parcelForm.pattaNumber,
      acres: parcelForm.acres,
      soilType: parcelForm.soilType as any,
      irrigationType: parcelForm.irrigationType as any,
      locationName: parcelForm.locationName || `Plot ${parcelForm.surveyNumber}`,
      geoCoordinates: { lat: parcelForm.lat, lng: parcelForm.lng },
    });

    setSelectedParcelId(newParcel.id);
    setShowAddParcelModal(false);
    triggerRefresh();
  };

  const handleOpenEditParcel = (p: LandParcel) => {
    setParcelForm({
      surveyNumber: p.surveyNumber,
      subDivision: p.subDivision,
      pattaNumber: p.pattaNumber,
      acres: p.acres,
      soilType: p.soilType,
      irrigationType: p.irrigationType,
      locationName: p.locationName,
      lat: p.geoCoordinates?.lat || 10.787,
      lng: p.geoCoordinates?.lng || 79.137,
    });
    setShowEditParcelModal(true);
  };

  const handleSaveEditParcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel) return;

    AppStore.updateParcel(activeFarm.id, selectedParcel.id, {
      surveyNumber: parcelForm.surveyNumber,
      subDivision: parcelForm.subDivision,
      pattaNumber: parcelForm.pattaNumber,
      acres: parcelForm.acres,
      soilType: parcelForm.soilType as any,
      irrigationType: parcelForm.irrigationType as any,
      locationName: parcelForm.locationName,
      geoCoordinates: { lat: parcelForm.lat, lng: parcelForm.lng },
    });

    setShowEditParcelModal(false);
    triggerRefresh();
  };

  const handleDeleteParcel = (pId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this land plot?");
    if (!confirmed) return;

    AppStore.deleteParcel(activeFarm.id, pId);
    const updated = AppStore.getState().farms.find((f) => f.id === activeFarm.id);
    setSelectedParcelId(updated?.parcels[0]?.id || "");
    triggerRefresh();
  };

  // Calculations
  const totalLandAcrossFarmsAcres = currentFarms.reduce(
    (sum, f) => sum + (f.totalAreaAcres || 0),
    0,
  );
  const totalPlotsAcrossFarms = currentFarms.reduce(
    (sum, f) => sum + (f.parcels?.length || 0),
    0,
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-paddy-600" />
            <span>Multi-Farm Holdings & Digital Cadastre</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {activeFarm.farmName}
          </h1>
          <p className="text-xs text-ink-500">
            {activeFarm.village}, {activeFarm.taluk ? `${activeFarm.taluk} Taluk, ` : ""}
            {activeFarm.district} District • Ownership: {activeFarm.ownershipType || "Owned"}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Unit Toggle */}
          <div className="bg-cream-100 p-1 rounded-xl border border-sage-300 flex items-center text-xs font-bold">
            <button
              onClick={() => setUnitMode("Acres")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                unitMode === "Acres"
                  ? "bg-forest-800 text-harvest-300 shadow-sm"
                  : "text-ink-600 hover:text-forest-900"
              }`}
            >
              Acres
            </button>
            <button
              onClick={() => setUnitMode("Hectares")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                unitMode === "Hectares"
                  ? "bg-forest-800 text-harvest-300 shadow-sm"
                  : "text-ink-600 hover:text-forest-900"
              }`}
            >
              Hectares
            </button>
          </div>

          <button
            onClick={handleOpenAddFarm}
            className="px-4 py-2 bg-paddy-700 hover:bg-paddy-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Farm</span>
          </button>

          <button
            onClick={() => navigate("/soil-health")}
            className="px-4 py-2 bg-white border border-sage-300 hover:bg-cream-100 text-forest-900 font-bold text-xs rounded-xl shadow-sm"
          >
            Soil Health
          </button>
        </div>
      </div>

      {/* Farm Switcher Tabs (if multiple farms) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {currentFarms.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setSelectedFarmId(f.id);
              AppStore.setActiveFarm(f.id);
              setSelectedParcelId(f.parcels[0]?.id || "");
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all flex items-center gap-2 ${
              f.id === activeFarm.id
                ? "bg-forest-800 text-harvest-300 border-forest-900 shadow-agro"
                : "bg-white text-ink-700 border-sage-300 hover:bg-cream-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{f.farmName}</span>
            <span className="text-[10px] opacity-75">({displayArea(f.totalAreaAcres)})</span>
          </button>
        ))}
      </div>

      {/* Farm Overview Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Farm Area
          </span>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900 mt-1">
            {displayArea(activeFarm.totalAreaAcres)}
          </p>
          <p className="text-xs text-paddy-700 font-semibold mt-1">
            ✓ Method: {activeFarm.farmingMethod || "Conventional"}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Total Managed Land
          </span>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900 mt-1">
            {displayArea(totalLandAcrossFarmsAcres)}
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Across {currentFarms.length} registered farm{currentFarms.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Plots in this Farm
          </span>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900 mt-1">
            {parcels.length}{" "}
            <span className="text-sm font-medium text-ink-500">Parcels</span>
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Total {totalPlotsAcrossFarms} plots managed
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
              Farm Management
            </span>
            <p className="text-xs font-bold text-forest-900 mt-1 truncate">
              {activeFarm.irrigationSource || "Canal"} • {activeFarm.soilType || "Clay Loam"}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleOpenEditFarm}
              className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-forest-900 text-xs font-bold rounded-xl border border-sage-300 flex items-center gap-1"
            >
              <Edit className="w-3 h-3 text-paddy-700" />
              <span>Edit Farm</span>
            </button>
            {currentFarms.length > 1 && (
              <button
                onClick={handleDeleteFarm}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Parcel Selection and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Parcel List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-forest-900">
              Registered Plots ({parcels.length})
            </h3>
            <button
              onClick={handleOpenAddParcel}
              className="px-3 py-1.5 bg-paddy-100 hover:bg-paddy-200 text-paddy-800 text-xs font-bold rounded-xl border border-paddy-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Plot</span>
            </button>
          </div>

          {parcels.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-dashed border-sage-300 text-center space-y-2">
              <Layers className="w-6 h-6 text-sage-400 mx-auto" />
              <p className="text-xs font-bold text-ink-600">No plots added to this farm yet</p>
              <button
                onClick={handleOpenAddParcel}
                className="px-3 py-1.5 bg-paddy-700 text-white text-xs font-bold rounded-xl"
              >
                Add First Plot
              </button>
            </div>
          ) : (
            parcels.map((parcel) => (
              <div
                key={parcel.id}
                onClick={() => setSelectedParcelId(parcel.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedParcel?.id === parcel.id
                    ? "bg-forest-800 text-cream-50 border-forest-900 shadow-agro"
                    : "bg-white text-ink-900 border-sage-300 hover:border-paddy-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      selectedParcel?.id === parcel.id ? "text-harvest-400" : "text-paddy-700"
                    }`}
                  >
                    Survey: {parcel.surveyNumber}
                  </span>
                  <span
                    className={`text-xs font-black ${
                      selectedParcel?.id === parcel.id ? "text-cream-100" : "text-forest-900"
                    }`}
                  >
                    {displayArea(parcel.acres)}
                  </span>
                </div>
                <h4 className="font-bold text-sm">{parcel.locationName}</h4>
                <div className="flex items-center gap-2 mt-2 text-xs opacity-90">
                  <span>{parcel.soilType}</span>
                  <span>•</span>
                  <span>{parcel.irrigationType}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Detailed Parcel Card */}
        <div className="lg:col-span-2">
          {selectedParcel ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
                <div>
                  <span className="text-xs font-bold text-paddy-700 uppercase tracking-wider">
                    {selectedParcel.pattaNumber} • Survey {selectedParcel.surveyNumber}
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-forest-900">
                    {selectedParcel.locationName}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-paddy-100 text-paddy-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-paddy-600" />
                    <span>Patta Aadhaar Linked</span>
                  </span>
                  <button
                    onClick={() => handleOpenEditParcel(selectedParcel)}
                    className="p-1.5 text-ink-600 hover:text-forest-900 border border-sage-300 rounded-lg hover:bg-cream-100"
                    title="Edit Plot"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteParcel(selectedParcel.id)}
                    className="p-1.5 text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50"
                    title="Delete Plot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <p className="text-xs font-bold text-ink-500 uppercase">Soil Classification</p>
                  <p className="font-bold text-base text-forest-900">{selectedParcel.soilType}</p>
                  <p className="text-xs text-ink-600">Rich agricultural soil with verified nutrient retention capacity.</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <p className="text-xs font-bold text-ink-500 uppercase">Water Sourcing & Method</p>
                  <p className="font-bold text-base text-forest-900">{selectedParcel.irrigationType}</p>
                  <p className="text-xs text-ink-600">Availability: {activeFarm.waterAvailability || "Perennial"}. Power: {activeFarm.electricityAvailability || "Solar"}.</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <p className="text-xs font-bold text-ink-500 uppercase">Geo-Coordinates & Firka</p>
                  <p className="font-mono font-bold text-sm text-forest-900">
                    {selectedParcel.geoCoordinates
                      ? `${selectedParcel.geoCoordinates.lat.toFixed(4)}° N, ${selectedParcel.geoCoordinates.lng.toFixed(4)}° E`
                      : "10.7870° N, 79.1378° E"}
                  </p>
                  <p className="text-xs text-ink-600">{activeFarm.village} Revenue Firka, {activeFarm.district} Basin.</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 space-y-1">
                  <p className="text-xs font-bold text-ink-500 uppercase">Cultivated Area</p>
                  <p className="font-bold text-base text-forest-900">{displayArea(selectedParcel.acres)}</p>
                  <p className="text-xs text-paddy-700 font-semibold">TNAU Agro-climatic Zone Recommendation</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/crop-planner")}
                  className="px-5 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl hover:bg-forest-900 transition-colors"
                >
                  Plan Crop on This Parcel
                </button>
                <button
                  onClick={() => navigate("/irrigation")}
                  className="px-5 py-2.5 bg-white border border-sage-300 text-forest-900 font-bold text-xs rounded-xl hover:bg-sage-100 transition-colors"
                >
                  Irrigation Scheduler
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-sage-300 shadow-agro text-center space-y-3">
              <Layers className="w-10 h-10 text-sage-400 mx-auto" />
              <h4 className="font-bold text-base text-forest-900">No Plot Selected</h4>
              <p className="text-xs text-ink-500">Add a plot or select an existing plot from the list to view cadastre details.</p>
              <button
                onClick={handleOpenAddParcel}
                className="px-4 py-2 bg-paddy-700 text-white font-bold text-xs rounded-xl"
              >
                Add New Plot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ADD FARM MODAL */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sage-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Add New Farm Holding</h3>
              <button onClick={() => setShowAddFarmModal(false)} className="text-ink-500 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-700 mb-1">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={farmForm.farmName}
                  onChange={(e) => setFarmForm({ ...farmForm, farmName: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  placeholder="e.g. Cauvery Riverbank Farm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={farmForm.district}
                    onChange={(e) => setFarmForm({ ...farmForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    value={farmForm.village}
                    onChange={(e) => setFarmForm({ ...farmForm, village: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Total Land Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={farmForm.totalAreaAcres}
                    onChange={(e) => setFarmForm({ ...farmForm, totalAreaAcres: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Ownership Type</label>
                  <select
                    value={farmForm.ownershipType}
                    onChange={(e) => setFarmForm({ ...farmForm, ownershipType: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Owned">Owned</option>
                    <option value="Leased">Leased</option>
                    <option value="Shared">Shared</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Soil Classification</label>
                  <select
                    value={farmForm.soilType}
                    onChange={(e) => setFarmForm({ ...farmForm, soilType: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Black Cotton">Black Cotton</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Primary Irrigation</label>
                  <select
                    value={farmForm.irrigationSource}
                    onChange={(e) => setFarmForm({ ...farmForm, irrigationSource: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Canal">Canal</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Open Well">Open Well</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl text-ink-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-paddy-700 hover:bg-paddy-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FARM MODAL */}
      {showEditFarmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sage-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Edit Farm Details</h3>
              <button onClick={() => setShowEditFarmModal(false)} className="text-ink-500 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-700 mb-1">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={farmForm.farmName}
                  onChange={(e) => setFarmForm({ ...farmForm, farmName: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={farmForm.village}
                    onChange={(e) => setFarmForm({ ...farmForm, village: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">District</label>
                  <input
                    type="text"
                    value={farmForm.district}
                    onChange={(e) => setFarmForm({ ...farmForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Soil Classification</label>
                  <select
                    value={farmForm.soilType}
                    onChange={(e) => setFarmForm({ ...farmForm, soilType: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Black Cotton">Black Cotton</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Primary Irrigation</label>
                  <select
                    value={farmForm.irrigationSource}
                    onChange={(e) => setFarmForm({ ...farmForm, irrigationSource: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Canal">Canal</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Open Well">Open Well</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowEditFarmModal(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl text-ink-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold rounded-xl shadow-sm"
                >
                  Update Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PARCEL MODAL */}
      {showAddParcelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sage-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Add Plot to {activeFarm.farmName}</h3>
              <button onClick={() => setShowAddParcelModal(false)} className="text-ink-500 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddParcel} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Survey Number *</label>
                  <input
                    type="text"
                    required
                    value={parcelForm.surveyNumber}
                    onChange={(e) => setParcelForm({ ...parcelForm, surveyNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                    placeholder="e.g. 142/3B"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Patta Number</label>
                  <input
                    type="text"
                    value={parcelForm.pattaNumber}
                    onChange={(e) => setParcelForm({ ...parcelForm, pattaNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                    placeholder="PATTA-904"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={parcelForm.acres}
                    onChange={(e) => setParcelForm({ ...parcelForm, acres: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Location / Field Name</label>
                  <input
                    type="text"
                    value={parcelForm.locationName}
                    onChange={(e) => setParcelForm({ ...parcelForm, locationName: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                    placeholder="e.g. East Wetland"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Soil Type</label>
                  <select
                    value={parcelForm.soilType}
                    onChange={(e) => setParcelForm({ ...parcelForm, soilType: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Black Cotton">Black Cotton</option>
                    <option value="Sandy">Sandy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Irrigation Method</label>
                  <select
                    value={parcelForm.irrigationType}
                    onChange={(e) => setParcelForm({ ...parcelForm, irrigationType: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  >
                    <option value="Canal">Canal</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Open Well">Open Well</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowAddParcelModal(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl text-ink-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-paddy-700 hover:bg-paddy-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PARCEL MODAL */}
      {showEditParcelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sage-300 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Edit Plot Information</h3>
              <button onClick={() => setShowEditParcelModal(false)} className="text-ink-500 hover:text-forest-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditParcel} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Survey Number *</label>
                  <input
                    type="text"
                    required
                    value={parcelForm.surveyNumber}
                    onChange={(e) => setParcelForm({ ...parcelForm, surveyNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Patta Number</label>
                  <input
                    type="text"
                    value={parcelForm.pattaNumber}
                    onChange={(e) => setParcelForm({ ...parcelForm, pattaNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={parcelForm.acres}
                    onChange={(e) => setParcelForm({ ...parcelForm, acres: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink-700 mb-1">Location Name</label>
                  <input
                    type="text"
                    value={parcelForm.locationName}
                    onChange={(e) => setParcelForm({ ...parcelForm, locationName: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-50 border border-sage-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowEditParcelModal(false)}
                  className="px-4 py-2 border border-sage-300 rounded-xl text-ink-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold rounded-xl shadow-sm"
                >
                  Update Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
