import React from "react";
import {
  Receipt,
  Scale,
  ShieldCheck,
  Download,
  ArrowRight,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const SalesPage: React.FC = () => {
  const { language, navigate, activeSeasonId } = useNavigation();
  const state = AppStore.getState();
  const sale = state.sales.find((item) => item.seasonId === activeSeasonId);
  const harvest = state.harvestRecords.find(
    (item) => item.seasonId === activeSeasonId,
  );

  if (!sale) {
    return (
      <div className="space-y-6 pb-12">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-forest-900">
            No sale recorded for this season
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Review buyer offers and accept one to create a demo sale invoice.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/offers")}
            className="rounded-xl bg-forest-800 px-5 py-3 text-xs font-bold text-harvest-300"
          >
            Review buyer offers
          </button>
          <button
            onClick={() => navigate("/harvest")}
            className="rounded-xl border border-sage-300 bg-white px-5 py-3 text-xs font-bold text-forest-900"
          >
            Go to harvest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta" ? "டெமோ விற்பனை ரசீது" : "Demo Sale Record"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "விற்பனை விவரம் & எடை சுருக்கம்"
              : "Sale Details & Weighment Summary"}
          </h1>
          <p className="text-xs text-ink-500">
            Demo record only — not a certified weighbridge slip, tax invoice, or
            official purchase deed.
          </p>
        </div>

        <button
          onClick={() => navigate("/payments")}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === "ta"
            ? "வங்கி வரவு நிலை காண்க"
            : "Payment Status & Bank Dues"}
        </button>
      </div>

      {/* Demo Sale Record Card */}
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

        {/* Digital Weighment Slip Section (Requirement H) */}
        <div className="p-5 bg-cream-100 rounded-3xl border border-sage-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-paddy-700" />
              <h4 className="font-display font-bold text-base text-forest-900">
                {language === "ta"
                  ? "டெமோ எடை விவரம்"
                  : "Demo Weighment Summary"}
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-ink-600">
              Demo reference: {sale.weighmentSlipNumber}
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
                {harvest ? `${harvest.moistureContentPct}%` : "Not recorded"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Link to Payments */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-sage-200">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-cream-100 hover:bg-cream-200 text-forest-900 font-bold text-xs rounded-xl border border-sage-300"
          >
            <Download className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "அச்சிடு / PDF ஆக சேமி"
                : "Print / Save as PDF"}
            </span>
          </button>

          <button
            onClick={() => navigate("/payments")}
            className="flex items-center gap-2 px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
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
    </div>
  );
};
