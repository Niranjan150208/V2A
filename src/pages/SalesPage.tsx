import React, { useState } from "react";
import {
  Receipt,
  Scale,
  ShieldCheck,
  Download,
  ArrowRight,
  CheckCircle2,
  FileText,
  Plus,
  Edit3,
  Trash2,
  MessageSquare,
  Phone,
  Store,
  Tag,
  X,
  AlertCircle,
  Eye,
  Check,
  Ban,
  Clock,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";
import { ProduceListing, MarketplaceEnquiry } from "../types";

export const SalesPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();

  const [activeTab, setActiveTab] = useState<"listings" | "invoices">("listings");

  const sale = state.sales.find((item) => item.seasonId === activeSeasonId) || state.sales[0];
  const harvest = state.harvestRecords.find(
    (item) => item.seasonId === activeSeasonId,
  ) || state.harvestRecords[0];

  // Listing modal states
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [editingListing, setEditingListing] = useState<ProduceListing | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState<ProduceListing | null>(null);

  // Listing form states
  const [cropName, setCropName] = useState(state.crops[0]?.name || "Paddy (Samba)");
  const [variety, setVariety] = useState("CR 1009 Sub 1");
  const [quantityBags, setQuantityBags] = useState("100");
  const [bagWeightKg, setBagWeightKg] = useState("75");
  const [unit, setUnit] = useState("Bags");
  const [askingPrice, setAskingPrice] = useState("2350");
  const [qualityGrade, setQualityGrade] = useState("Grade A Super");
  const [moisturePct, setMoisturePct] = useState("13.5");
  const [pickupLocation, setPickupLocation] = useState(
    state.farms[0]?.village ? `${state.farms[0].village} Farm Gate, ${state.farms[0].district}` : "Farm Gate, Thanjavur",
  );
  const [contactPref, setContactPref] = useState<"Phone" | "WhatsApp" | "In-App Enquiry">("Phone");

  // Enquiry response form
  const [enquiryBuyerName, setEnquiryBuyerName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryQty, setEnquiryQty] = useState("");
  const [enquiryPrice, setEnquiryPrice] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");

  const handleOpenCreateListing = () => {
    setEditingListing(null);
    setCropName(state.crops[0]?.name || "Paddy (Samba)");
    setVariety("CR 1009 Sub 1");
    setQuantityBags("100");
    setBagWeightKg("75");
    setUnit("Bags");
    setAskingPrice("2350");
    setQualityGrade("Grade A Super");
    setMoisturePct("13.5");
    setPickupLocation(
      state.farms[0]?.village
        ? `${state.farms[0].village} Farm Gate, ${state.farms[0].district}`
        : "Farm Gate, Thanjavur",
    );
    setContactPref("Phone");
    setShowCreateListingModal(true);
  };

  const handleOpenEditListing = (item: ProduceListing) => {
    setEditingListing(item);
    setCropName(item.cropName);
    setVariety(item.variety);
    setQuantityBags(item.quantityBags.toString());
    setBagWeightKg(item.bagWeightKg.toString());
    setUnit(item.unit || "Bags");
    setAskingPrice(item.askingPricePerBag.toString());
    setQualityGrade(item.qualityGrade);
    setMoisturePct(item.moisturePct.toString());
    setPickupLocation(item.pickupLocation);
    setContactPref(item.contactPreference || "Phone");
    setShowCreateListingModal(true);
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantityBags) || 0;
    const price = parseFloat(askingPrice) || 0;
    if (qty <= 0 || price <= 0) return;

    if (editingListing) {
      AppStore.updateProduceListing(editingListing.id, {
        cropName,
        variety,
        quantityBags: qty,
        bagWeightKg: parseFloat(bagWeightKg) || 75,
        unit,
        askingPricePerBag: price,
        qualityGrade,
        moisturePct: parseFloat(moisturePct) || 14,
        pickupLocation,
        contactPreference: contactPref,
      });
    } else {
      AppStore.addProduceListing({
        seasonId: activeSeasonId,
        farmerId: state.farmer?.id || "FARMER-1",
        farmerName: state.farmer?.fullName || "Vijay (Demo)",
        cropName,
        variety,
        quantityBags: qty,
        bagWeightKg: parseFloat(bagWeightKg) || 75,
        unit,
        askingPricePerBag: price,
        qualityGrade,
        moisturePct: parseFloat(moisturePct) || 14,
        pickupLocation,
        district: state.farms[0]?.district || "Thanjavur",
        listingDate: new Date().toISOString().split("T")[0],
        contactPreference: contactPref,
        status: "Active",
      });
    }

    setShowCreateListingModal(false);
    triggerRefresh();
  };

  const handleToggleSold = (listingId: string, currentStatus: string) => {
    AppStore.updateProduceListing(listingId, {
      status: currentStatus === "Sold" ? "Active" : "Sold",
    });
    triggerRefresh();
  };

  const handleDeleteListing = (listingId: string) => {
    if (confirm("Are you sure you want to remove this produce listing?")) {
      AppStore.deleteProduceListing(listingId);
      triggerRefresh();
    }
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEnquiryModal) return;

    AppStore.addMarketplaceEnquiry({
      listingId: showEnquiryModal.id,
      cropName: showEnquiryModal.cropName,
      buyerName: enquiryBuyerName || "Shri Krishna Modern Rice Mill",
      buyerPhone: enquiryPhone || "+91 98421 55660",
      buyerOrg: "Delta Grain Traders Syndicate",
      requestedQuantityBags: parseInt(enquiryQty) || 50,
      offeredPricePerBag: parseFloat(enquiryPrice) || showEnquiryModal.askingPricePerBag,
      message: enquiryMessage || "Interested in farm-gate delivery this weekend. Immediate bank settlement.",
    });

    setShowEnquiryModal(null);
    setEnquiryBuyerName("");
    setEnquiryPhone("");
    setEnquiryQty("");
    setEnquiryPrice("");
    setEnquiryMessage("");
    triggerRefresh();
  };

  const handleUpdateEnquiryStatus = (
    enquiryId: string,
    newStatus: "Accepted" | "Declined" | "Replied",
  ) => {
    AppStore.updateEnquiryStatus(enquiryId, newStatus);
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "நேரடி விளைபொருள் விற்பனை"
                : "Direct Farmer-to-Buyer Marketplace"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "விளைபொருள் விற்பனை & விலைப்பட்டியல்"
              : "Produce Sales & Procurement Ledger"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "விவசாயிகள் இடைத்தரகர் இன்றி ஆலைகளுக்கு நேரடியாக விற்கலாம்"
              : "List harvest lots, manage direct buyer enquiries, and audit weighment sale invoices"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCreateListing}
            className="px-4 py-2.5 bg-paddy-600 hover:bg-paddy-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === "ta" ? "விற்பனை பதிவு" : "Create Produce Listing"}
            </span>
          </button>
          <button
            onClick={() => navigate("/offers")}
            className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro hover:bg-forest-900 transition-colors"
          >
            {language === "ta" ? "கொள்முதல் ஏலங்கள்" : "Buyer Bids (Offers)"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage-300">
        <button
          onClick={() => setActiveTab("listings")}
          className={`py-3 px-5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "listings"
              ? "border-paddy-600 text-paddy-700 bg-paddy-50/50 rounded-t-xl"
              : "border-transparent text-ink-600 hover:text-forest-900"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Active Produce Listings & Enquiries ({state.produceListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("invoices")}
          className={`py-3 px-5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "invoices"
              ? "border-paddy-600 text-paddy-700 bg-paddy-50/50 rounded-t-xl"
              : "border-transparent text-ink-600 hover:text-forest-900"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Weighment Slips & Sale Invoices</span>
        </button>
      </div>

      {/* TAB 1: Produce Listings & Buyer Enquiries */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          {/* Produce Listings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <div>
                <h3 className="font-display font-bold text-lg text-forest-900">
                  {language === "ta"
                    ? "என் விளைபொருள் விற்பனை பதிவுகள்"
                    : "Your Active Produce Lots for Sale"}
                </h3>
                <p className="text-xs text-ink-500">
                  Visible to verified mills, wholesalers, and FPO procurement partners
                </p>
              </div>
              <button
                onClick={handleOpenCreateListing}
                className="px-3 py-1.5 bg-paddy-50 border border-paddy-200 text-paddy-800 text-xs font-bold rounded-xl hover:bg-paddy-100 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Listing</span>
              </button>
            </div>

            {state.produceListings.length === 0 ? (
              <div className="p-8 text-center bg-cream-50 rounded-2xl border border-dashed border-sage-300 space-y-2">
                <Store className="w-8 h-8 text-harvest-500 mx-auto" />
                <p className="text-sm font-bold text-forest-900">
                  No produce lots currently listed for sale.
                </p>
                <p className="text-xs text-ink-500">
                  Create a listing to broadcast your harvested bags to registered buyers.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.produceListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-sage-300 bg-cream-50/60 space-y-3 relative hover:border-paddy-500 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              item.status === "Active"
                                ? "bg-paddy-100 text-paddy-800"
                                : item.status === "Sold"
                                ? "bg-harvest-200 text-forest-900"
                                : "bg-ink-100 text-ink-700"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-[10px] font-semibold text-ink-500">
                            Listed on {item.listingDate}
                          </span>
                        </div>
                        <h4 className="font-display font-extrabold text-lg text-forest-900 mt-1">
                          {item.cropName} ({item.variety})
                        </h4>
                        <p className="text-xs text-ink-600">
                          Location: <span className="font-semibold text-ink-800">{item.pickupLocation}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-ink-500 uppercase block">
                          Asking Price
                        </span>
                        <p className="font-display font-black text-xl text-forest-900">
                          ₹{item.askingPricePerBag.toLocaleString()}
                        </p>
                        <span className="text-[10px] text-ink-500 block">/ {item.unit || "Bag"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-sage-200">
                      <div className="p-2 bg-white rounded-xl border border-sage-200">
                        <span className="text-[10px] text-ink-500 uppercase block">Quantity</span>
                        <span className="font-bold text-forest-900">{item.quantityBags} Bags</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-sage-200">
                        <span className="text-[10px] text-ink-500 uppercase block">Grade</span>
                        <span className="font-bold text-paddy-800 truncate block">{item.qualityGrade}</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-sage-200">
                        <span className="text-[10px] text-ink-500 uppercase block">Moisture</span>
                        <span className="font-bold text-ink-700">{item.moisturePct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-sage-200 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleSold(item.id, item.status)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                            item.status === "Sold"
                              ? "bg-sage-200 text-ink-700 hover:bg-sage-300"
                              : "bg-paddy-700 text-white hover:bg-paddy-800"
                          }`}
                        >
                          {item.status === "Sold" ? "Mark Active" : "Mark as Sold"}
                        </button>
                        <button
                          onClick={() => setShowEnquiryModal(item)}
                          className="px-2.5 py-1 bg-white border border-sage-300 rounded-lg font-semibold text-forest-900 hover:bg-sage-50"
                        >
                          + Buyer Enquiry
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditListing(item)}
                          className="p-1.5 text-ink-500 hover:text-forest-900 hover:bg-sage-100 rounded-lg"
                          title="Edit listing"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="p-1.5 text-ink-500 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buyer Enquiries Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200">
              <div>
                <h3 className="font-display font-bold text-lg text-forest-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-paddy-600" />
                  <span>Buyer Inquiries & Price Negotiations ({state.enquiries?.length || 0})</span>
                </h3>
                <p className="text-xs text-ink-500">
                  Direct trade enquiries received from verified grain buyers
                </p>
              </div>
            </div>

            {(!state.enquiries || state.enquiries.length === 0) ? (
              <div className="p-6 text-center bg-cream-50 rounded-2xl border border-dashed border-sage-300">
                <p className="text-xs font-semibold text-ink-600">
                  No buyer enquiries received yet. Click &quot;+ Buyer Enquiry&quot; on any active listing to test the enquiry workflow.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-sage-200">
                {state.enquiries.map((enq) => (
                  <div key={enq.id} className="py-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-forest-900 text-sm">
                            {enq.buyerName} {enq.buyerOrg ? `(${enq.buyerOrg})` : ""}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              enq.status === "Accepted"
                                ? "bg-paddy-100 text-paddy-800"
                                : enq.status === "Declined"
                                ? "bg-terracotta-100 text-terracotta-800"
                                : "bg-harvest-100 text-forest-900"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-xs text-ink-600 mt-0.5">
                          Target Lot: <span className="font-semibold text-forest-900">{enq.cropName}</span>
                          {" "}• Requested: <span className="font-semibold">{enq.requestedQuantityBags} Bags</span>
                          {" "}• Offered: <span className="font-semibold text-paddy-700">₹{enq.offeredPricePerBag}/bag</span>
                          {" "}• Date: {enq.date}
                        </p>
                      </div>

                      {/* Status / Contact Actions */}
                      <div className="flex items-center gap-2">
                        {enq.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleUpdateEnquiryStatus(enq.id, "Accepted")}
                              className="px-3 py-1 bg-paddy-600 hover:bg-paddy-700 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleUpdateEnquiryStatus(enq.id, "Declined")}
                              className="px-3 py-1 bg-white border border-sage-300 text-terracotta-700 hover:bg-terracotta-50 font-bold text-xs rounded-lg"
                            >
                              Decline
                            </button>
                          </>
                        ) : enq.status === "Accepted" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-paddy-700 font-bold">Contact Unlocked:</span>
                            <a
                              href={`tel:${enq.buyerPhone}`}
                              className="px-3 py-1 bg-forest-800 text-harvest-300 rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{enq.buyerPhone}</span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-ink-400 font-semibold italic">
                            Enquiry closed
                          </span>
                        )}
                      </div>
                    </div>

                    {enq.message && (
                      <p className="text-xs text-ink-700 bg-cream-50 p-2.5 rounded-xl border border-sage-200 italic">
                        &quot;{enq.message}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Weighment Slips & Sale Invoices */}
      {activeTab === "invoices" && (
        <div className="space-y-6">
          {!sale ? (
            <div className="rounded-3xl border border-sage-300 bg-white p-8 text-center shadow-agro space-y-3">
              <Receipt className="mx-auto h-8 w-8 text-paddy-700" />
              <h3 className="font-display text-lg font-bold text-forest-900">
                No finalized sale invoices yet
              </h3>
              <p className="text-xs text-ink-600 max-w-md mx-auto">
                Once a buyer offer or enquiry is accepted and the harvest lot is settled, your weighment slip and invoice statement will appear here.
              </p>
              <button
                onClick={() => navigate("/offers")}
                className="px-4 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
              >
                Review Buyer Bids
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-paddy-600/40 shadow-agro space-y-6">
              {/* Invoice Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-cream-200 text-forest-900 px-3 py-1 rounded-lg">
                      {sale.saleInvoiceNumber}
                    </span>
                    <span className="bg-harvest-200 text-forest-900 text-xs font-bold px-3 py-1 rounded-full">
                      {sale.status}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-forest-900 mt-2">
                    {sale.buyerName}
                  </h3>
                  <p className="text-xs text-ink-500">
                    Procurement Unit: {sale.buyerOrg} • Sale Date: {sale.saleDate}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-ink-500 uppercase block">
                    Net Invoiced Value
                  </span>
                  <p className="font-display font-black text-3xl text-forest-900">
                    ₹{sale.netSaleProceeds.toLocaleString()}
                  </p>
                  <p className="text-xs text-paddy-700 font-semibold">
                    Gross: ₹{sale.grossAmount.toLocaleString()} ({sale.bagsSold} Bags)
                  </p>
                </div>
              </div>

              {/* Digital Weighment Slip Section */}
              <div className="p-5 bg-cream-100 rounded-3xl border border-sage-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-paddy-700" />
                    <h4 className="font-display font-bold text-base text-forest-900">
                      {language === "ta"
                        ? "அங்கீகரிக்கப்பட்ட எடை விவரம்"
                        : "Certified Digital Weighment Slip"}
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-ink-600">
                    Slip Reference: {sale.weighmentSlipNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-sage-200">
                    <span className="text-ink-500 block text-[10px] uppercase font-bold">
                      Bag Count
                    </span>
                    <p className="font-bold text-sm text-forest-900 mt-0.5">
                      {sale.bagsSold} bags
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-sage-200">
                    <span className="text-ink-500 block text-[10px] uppercase font-bold">
                      Bag Weight
                    </span>
                    <p className="font-bold text-sm text-forest-900 mt-0.5">
                      {harvest?.bagWeightKg ?? 75} kg
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-sage-200">
                    <span className="text-ink-500 block text-[10px] uppercase font-bold">
                      Calculated Produce Weight
                    </span>
                    <p className="font-display font-black text-sm text-paddy-700 mt-0.5">
                      {(
                        sale.bagsSold * (harvest?.bagWeightKg ?? 75)
                      ).toLocaleString()}{" "}
                      kg
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-sage-200">
                    <span className="text-ink-500 block text-[10px] uppercase font-bold">
                      Recorded Moisture
                    </span>
                    <p className="font-bold text-sm text-forest-900 mt-0.5">
                      {harvest ? `${harvest.moistureContentPct}%` : "13.5%"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200 text-xs space-y-2">
                <span className="font-bold text-ink-700 block">Deductions Audit:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-ink-600">
                  <div>Market Cess: ₹{sale.deductions?.mandiCessOrMarketFee || 0}</div>
                  <div>Bagging: ₹{sale.deductions?.baggingCost || 0}</div>
                  <div>Moisture Penalty: ₹{sale.deductions?.moistureDeduction || 0}</div>
                  <div>Logistics: ₹{sale.deductions?.logisticsPaidByFarmer || 0}</div>
                </div>
              </div>

              {/* Action Link to Payments & Print */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-sage-200">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-cream-100 hover:bg-cream-200 text-forest-900 font-bold text-xs rounded-xl border border-sage-300 transition-colors"
                >
                  <Download className="w-4 h-4 text-paddy-600" />
                  <span>
                    {language === "ta"
                      ? "அச்சிடு / PDF சேமி"
                      : "Print / Save Invoice PDF"}
                  </span>
                </button>

                <button
                  onClick={() => navigate("/payments")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-colors"
                >
                  <span>
                    {language === "ta"
                      ? "பணவரவு மற்றும் நிலுவை பார்க்க"
                      : "Inspect Bank Payments & Dues"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Produce Listing Modal */}
      {showCreateListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-sage-200">
              <h3 className="font-display font-extrabold text-lg text-forest-900">
                {editingListing ? "Edit Produce Listing" : "Create Produce Listing"}
              </h3>
              <button
                onClick={() => setShowCreateListingModal(false)}
                className="text-ink-400 hover:text-ink-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Variety
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
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
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Bags">Bags (75kg)</option>
                    <option value="Quintals">Quintals (100kg)</option>
                    <option value="Kgs">Kgs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Asking Price (₹)
                  </label>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    required
                    min="1"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Grade A Super">Grade A Super</option>
                    <option value="Standard Common">Standard Common</option>
                    <option value="Fair Average Quality">Fair Average Quality (FAQ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePct}
                    onChange={(e) => setMoisturePct(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Farm Gate / Pickup Location
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  required
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Preferred Contact Method
                </label>
                <select
                  value={contactPref}
                  onChange={(e) => setContactPref(e.target.value as any)}
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Phone">Phone Call (Verified buyers only)</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="In-App Enquiry">In-App Enquiry Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowCreateListingModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600 hover:bg-sage-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro hover:bg-forest-900 transition-colors"
                >
                  {editingListing ? "Update Listing" : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buyer Enquiry Simulation Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sage-200">
              <h3 className="font-display font-extrabold text-base text-forest-900">
                Submit Buyer Trade Enquiry
              </h3>
              <button
                onClick={() => setShowEnquiryModal(null)}
                className="text-ink-400 hover:text-ink-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ink-600">
              For: <span className="font-bold text-forest-900">{showEnquiryModal.cropName}</span> ({showEnquiryModal.quantityBags} bags available @ ₹{showEnquiryModal.askingPricePerBag})
            </p>

            <form onSubmit={handleSendEnquiry} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Buyer / Mill Name
                </label>
                <input
                  type="text"
                  value={enquiryBuyerName}
                  onChange={(e) => setEnquiryBuyerName(e.target.value)}
                  placeholder="e.g. Sri Venkateswara Modern Rice Mill"
                  required
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  placeholder="e.g. +91 98421 55660"
                  required
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Requested Bags
                  </label>
                  <input
                    type="number"
                    value={enquiryQty}
                    onChange={(e) => setEnquiryQty(e.target.value)}
                    placeholder="e.g. 50"
                    required
                    min="1"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    Offered Price (₹/bag)
                  </label>
                  <input
                    type="number"
                    value={enquiryPrice}
                    onChange={(e) => setEnquiryPrice(e.target.value)}
                    placeholder={`e.g. ${showEnquiryModal.askingPricePerBag}`}
                    required
                    min="1"
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Trade Message / Payment Terms
                </label>
                <textarea
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  rows={2}
                  placeholder="e.g. Immediate bank NEFT transfer upon weighbridge clearance."
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(null)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
                >
                  Send Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
