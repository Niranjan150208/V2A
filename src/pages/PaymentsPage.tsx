import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Banknote,
  RefreshCw,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const PaymentsPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();
  const financials = AppStore.calculateSeasonFinancials(activeSeasonId);
  const seasonPayments = state.payments.filter(
    (payment) => payment.seasonId === activeSeasonId,
  );
  const seasonSales = state.sales.filter(
    (sale) => sale.seasonId === activeSeasonId,
  );
  const totalBagsSold = seasonSales.reduce(
    (total, sale) => total + sale.bagsSold,
    0,
  );
  const totalGrossSales = seasonSales.reduce(
    (total, sale) => total + sale.grossAmount,
    0,
  );
  const pendingPayment = seasonPayments.find(
    (payment) => payment.status === "PENDING",
  );

  const [settlingId, setSettlingId] = useState<string | null>(null);

  const handleSettle = (paymentId: string) => {
    setSettlingId(paymentId);
    setTimeout(() => {
      AppStore.recordPaymentSettlement(
        paymentId,
        `NEFT-IOB-${Date.now().toString().slice(-6)}`,
      );
      setSettlingId(null);
      triggerRefresh();
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "வங்கி வரவு & தீர்வு கண்காணிப்பாளர்"
                : "Bank Settlements & Dues Ledger"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "பணவரவு & நிலுவைத் தொகை"
              : "Payment Status & Pending Balances"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "பெறப்பட்ட வங்கி வரவு மற்றும் வரவேண்டிய நிலுவை தொகை பிரித்துக் காட்டப்படுகிறது"
              : "Demo ledger separates recorded receipts from pending receivables. No real bank transfer is initiated."}
          </p>
        </div>

        <button
          onClick={() => navigate("/finance")}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === "ta" ? "முழு பண்ணை லாப-நஷ்டம்" : "Farm Financial P&L"}
        </button>
      </div>

      {/* Critical Segregation Notice (Prompt Rule) */}
      <div className="p-4 bg-cream-100 rounded-2xl border-l-4 border-harvest-500 text-xs text-forest-900 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-harvest-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">
            {language === "ta"
              ? "கணக்கியல் விதிமுறை (Accounting Integrity):"
              : "Strict Cashflow Recognition Principle:"}
          </p>
          <p className="text-ink-600 leading-relaxed">
            {language === "ta"
              ? "வரவேண்டிய நிலுவைத் தொகைகள் வங்கியில் பெறப்படும் வரை பெறப்பட்ட வருமானமாக கணக்கிடப்படாது. உண்மையான வங்கிப் பணப்புழக்கம் மட்டுமே லாபமாக அங்கீகரிக்கப்படும்."
              : "In this demo, pending amounts stay separate until you mark them received. This only updates the local ledger; it does not verify a bank deposit."}
          </p>
        </div>
      </div>

      {/* Balance Summary Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Received In Bank */}
        <div className="bg-white rounded-3xl p-6 border-2 border-paddy-600 shadow-agro space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
              Recorded as Received (Demo)
            </span>
            <span className="bg-paddy-100 text-paddy-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Recorded
            </span>
          </div>
          <p className="font-display font-black text-3xl text-paddy-700">
            ₹{financials.receivedPayments.toLocaleString()}
          </p>
          <p className="text-xs text-ink-600 font-medium">
            Local demo record only — no bank transfer occurs
          </p>
        </div>

        {/* Pending Due (Separated) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-harvest-400 shadow-agro space-y-1 bg-harvest-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
              Pending Buyer Dues
            </span>
            <span className="bg-harvest-200 text-forest-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Receivable
            </span>
          </div>
          <p className="font-display font-black text-3xl text-terracotta-600">
            ₹{financials.pendingPayments.toLocaleString()}
          </p>
          <p className="text-xs text-ink-600 font-medium">
            {pendingPayment
              ? `Due ${pendingPayment.dueDate} from ${pendingPayment.buyerName}`
              : "No pending buyer dues"}
          </p>
        </div>

        {/* Total Invoiced Contract */}
        <div className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider block">
            Contracted Net Value
          </span>
          <p className="font-display font-black text-3xl text-forest-900">
            ₹{financials.netProceedsInvoiced.toLocaleString()}
          </p>
          <p className="text-xs text-paddy-700 font-semibold">
            {totalBagsSold} Bags sold
            {totalBagsSold > 0
              ? ` • Avg ₹${Math.round(totalGrossSales / totalBagsSold).toLocaleString()}/bag`
              : ""}
          </p>
        </div>
      </div>

      {/* Payment Records Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === "ta"
            ? "பணப்பரிவர்த்தனை பட்டியல்"
            : "Payment Transaction Ledger"}
        </h3>

        <div className="divide-y divide-sage-200">
          {seasonPayments.map((p) => {
            const isPending = p.status === "PENDING";

            return (
              <div
                key={p.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPending
                        ? "bg-harvest-100 text-forest-900"
                        : "bg-paddy-100 text-paddy-700"
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-forest-900">
                        {p.buyerName}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-cream-200 text-ink-700 px-2 py-0.5 rounded">
                        {p.paymentType}
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 mt-0.5">
                      Method: {p.method} • Due: {p.dueDate}{" "}
                      {p.referenceNo ? `• Ref: ${p.referenceNo}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 text-right">
                  <div>
                    <span className="text-[10px] font-bold text-ink-500 uppercase block">
                      Amount
                    </span>
                    <p
                      className={`font-display font-black text-xl ${isPending ? "text-terracotta-600" : "text-paddy-700"}`}
                    >
                      ₹{p.amount.toLocaleString()}
                    </p>
                  </div>

                  {isPending ? (
                    <button
                      onClick={() => handleSettle(p.id)}
                      disabled={settlingId === p.id}
                      className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      {settlingId === p.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Settling...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-harvest-400" />
                          <span>
                            {language === "ta"
                              ? "வங்கி வரவு பதிவு செய்"
                              : "Simulate Bank Credit"}
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="bg-paddy-100 text-paddy-800 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-paddy-600" />
                      Received (demo)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
