import React, { useState } from "react";
import {
  Tag,
  CheckCircle2,
  ArrowRight,
  CircleDollarSign,
  Store,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const OffersPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();
  const listing = state.produceListings.find(
    (item) => item.seasonId === activeSeasonId,
  );
  const offers = listing
    ? state.buyerOffers.filter((offer) => offer.listingId === listing.id)
    : [];
  const [actionNotice, setActionNotice] = useState("");

  const handleAccept = (offerId: string) => {
    const accepted = AppStore.acceptOffer(offerId);
    if (!accepted) {
      setActionNotice(
        "This offer is no longer available. Refresh the page and review the current listing.",
      );
      triggerRefresh();
      return;
    }
    triggerRefresh();
    setTimeout(() => {
      navigate("/sales");
    }, 1200);
  };

  const handleReject = (offerId: string) => {
    const rejected = AppStore.rejectOffer(offerId);
    if (!rejected) {
      setActionNotice("This offer is no longer pending.");
    } else {
      setActionNotice("Offer declined.");
    }
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "நேரடி கொள்முதல் ஏலங்கள்"
                : "Direct Buyer Tender Bids & Negotiations"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "கொள்முதல் சலுகைகள் & ஏலங்கள்"
              : `Buyer offers${listing ? ` on ${listing.quantityBags}-bag lot` : ""}`}
          </h1>
          <p className="text-xs text-ink-500">
            {listing
              ? `${listing.cropName} • ${listing.qualityGrade} (${listing.moisturePct}% moisture)`
              : "Review offers after broadcasting an available harvest lot."}
          </p>
        </div>

        <button
          onClick={() => navigate("/net-proceeds")}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === "ta"
            ? "நிகர லாப கணக்கீட்டாளர்"
            : "Calculate Net Proceeds"}
        </button>
      </div>

      {actionNotice && (
        <div
          role="status"
          className="rounded-xl border border-sage-300 bg-sage-50 px-4 py-3 text-sm text-forest-900"
        >
          {actionNotice}
        </div>
      )}

      {/* Lot Status Card */}
      {listing && (
        <div className="bg-gradient-to-r from-cream-100 via-harvest-50 to-sage-100 rounded-3xl p-6 border border-harvest-400 shadow-agro flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-800 bg-paddy-100 px-2.5 py-0.5 rounded-full">
              {listing.status} Harvest Lot
            </span>
            <h3 className="font-display font-black text-xl text-forest-900">
              {listing.quantityBags} Bags (
              {(listing.quantityBags * listing.bagWeightKg).toLocaleString()}{" "}
              kg) • {listing.pickupLocation}
            </h3>
            <p className="text-xs text-ink-600">
              Asking Price: ₹{listing.askingPricePerBag.toLocaleString()}/bag •
              Quality: {listing.qualityGrade} • Moisture: {listing.moisturePct}%
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/harvest")}
              className="px-4 py-2 bg-white border border-sage-300 rounded-xl text-xs font-bold text-forest-900 hover:bg-sage-50"
            >
              {language === "ta" ? "அறுவடை சான்றிதழ்" : "Quality Certificate"}
            </button>
          </div>
        </div>
      )}

      {/* Offers Comparison Cards (Requirement H) */}
      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="rounded-3xl border border-sage-300 bg-white p-8 text-center shadow-agro">
            <Store className="mx-auto mb-3 h-8 w-8 text-paddy-700" />
            <h3 className="font-display text-lg font-bold text-forest-900">
              No offers for this season yet
            </h3>
            <p className="mt-2 text-sm text-ink-600">
              Broadcast an unsold harvest lot to generate buyer offers for this
              demo.
            </p>
            <button
              onClick={() => navigate("/harvest")}
              className="mt-4 rounded-xl bg-forest-800 px-5 py-2.5 text-xs font-bold text-harvest-300 hover:bg-forest-900"
            >
              Go to Harvest
            </button>
          </div>
        ) : (
          offers.map((offer) => {
            const grossAmount =
              offer.offeredPricePerBag * offer.quantityBagsRequested;
            const isAccepted = offer.status === "Accepted";

            return (
              <div
                key={offer.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border-2 shadow-agro space-y-4 transition-all ${
                  isAccepted
                    ? "border-paddy-600 bg-paddy-50/20"
                    : "border-sage-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                        {offer.buyerOrg}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isAccepted
                            ? "bg-paddy-600 text-white"
                            : offer.status === "Rejected"
                              ? "bg-terracotta-100 text-terracotta-700"
                              : "bg-harvest-200 text-forest-900"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-xl text-forest-900 mt-1">
                      {offer.buyerName}
                    </h3>
                    <p className="text-xs text-ink-500 mt-0.5">
                      Offer received on {offer.offerDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-ink-500 block uppercase">
                      Offered Bid Price
                    </span>
                    <p className="font-display font-black text-3xl text-forest-900">
                      ₹{offer.offeredPricePerBag}{" "}
                      <span className="text-xs font-normal text-ink-500">
                        / 75kg bag
                      </span>
                    </p>
                    <p className="text-xs font-bold text-paddy-700">
                      Gross: ₹{grossAmount.toLocaleString()} (
                      {offer.quantityBagsRequested} Bags)
                    </p>
                  </div>
                </div>

                {/* Terms Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
                    <span className="text-ink-500 font-bold block uppercase text-[10px]">
                      Pickup Terms
                    </span>
                    <span className="font-bold text-forest-900 mt-0.5 block">
                      {offer.pickupTerms}
                    </span>
                    <p className="text-[10px] text-paddy-700 font-semibold mt-0.5">
                      {offer.pickupTerms === "Buyer Farm-gate Pickup"
                        ? "Buyer arranges transport"
                        : "Farmer delivery required"}
                    </p>
                  </div>

                  <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
                    <span className="text-ink-500 font-bold block uppercase text-[10px]">
                      Payment Settlement
                    </span>
                    <span className="font-bold text-forest-900 mt-0.5 block">
                      {offer.paymentTerms}
                    </span>
                    <p className="text-[10px] text-ink-500 mt-0.5">
                      Settlement follows the terms above
                    </p>
                  </div>

                  <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200">
                    <span className="text-ink-500 font-bold block uppercase text-[10px]">
                      Quality Acceptance
                    </span>
                    <span className="font-bold text-forest-900 mt-0.5 block">
                      {offer.gradeAccepted}
                    </span>
                    <p className="text-[10px] text-paddy-700 font-semibold mt-0.5">
                      Grade requirement: {offer.gradeAccepted}
                    </p>
                  </div>
                </div>

                {offer.notes && (
                  <p className="text-xs text-ink-700 italic bg-cream-100 p-3 rounded-xl border border-sage-200">
                    📝 Buyer Remarks: "{offer.notes}"
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-sage-200">
                  <button
                    onClick={() => navigate("/net-proceeds")}
                    className="text-xs font-bold text-paddy-700 hover:text-paddy-900 flex items-center gap-1"
                  >
                    <CircleDollarSign className="w-4 h-4" />
                    <span>
                      {language === "ta"
                        ? "நிகர லாப கணக்கீடு பார்க்க"
                        : "Simulate Net Proceeds after Deductions"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3">
                    {!isAccepted && offer.status !== "Rejected" && (
                      <>
                        <button
                          onClick={() => handleReject(offer.id)}
                          className="px-4 py-2.5 rounded-xl border border-terracotta-300 text-terracotta-700 font-bold text-xs hover:bg-terracotta-50 transition-colors"
                        >
                          {language === "ta" ? "மறுக்கவும்" : "Decline Offer"}
                        </button>

                        <button
                          onClick={() => handleAccept(offer.id)}
                          className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-harvest-400" />
                          <span>
                            {language === "ta"
                              ? "விலை சலுகையை ஏற்கிறேன்"
                              : "Accept Offer & Generate Bill"}
                          </span>
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => navigate("/sales")}
                        className="px-5 py-2.5 bg-paddy-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
                      >
                        <span>
                          {language === "ta"
                            ? "விற்பனை ரசீது பார்க்க"
                            : "View Sale Deed & Weighment"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
