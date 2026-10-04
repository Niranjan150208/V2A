import React, { useState } from "react";
import {
  PieChart,
  TrendingUp,
  CircleDollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const FinancePage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } =
    useNavigation();
  const state = AppStore.getState();
  const financials = AppStore.calculateSeasonFinancials(activeSeasonId);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<any>("Labour");

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    AppStore.addExpense({
      seasonId: activeSeasonId,
      category: cat,
      description: desc,
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0],
      paymentMode: "Cash",
      paidTo: "Field Vendor",
    });

    setDesc("");
    setAmount("");
    setShowExpenseModal(false);
    triggerRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <PieChart className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "பண்ணை நிதி நிலை & கணக்கியல்"
                : "Comprehensive Farm Financial Ledger & P&L"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "பண்ணை வரவு-செலவு & லாப-நஷ்ட அறிக்கை"
              : "Farm Balance Sheet & Cashflow Audit"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "விதை முதல் விற்பனை வரை வெளிப்படையான செலவு மற்றும் நிகர லாப பகுப்பாய்வு"
              : "Category-wise expenditures, realized bank cashflow, and segregated buyer receivables"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-4 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === "ta" ? "செலவு சேர்க்க" : "Record Expense"}
            </span>
          </button>
          <button
            onClick={() => navigate("/crop-journey")}
            className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
          >
            {language === "ta" ? "பயிர் பயணம் (Passport)" : "Crop Passport"}
          </button>
        </div>
      </div>

      {/* Main 4 Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Gross Sales Invoiced
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-forest-900">
            ₹{financials.grossSales.toLocaleString()}
          </p>
          <p className="text-xs text-paddy-700 font-medium">
            110 Bags contracted
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Total Field Expenses
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-terracotta-600">
            ₹{financials.totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-ink-500">
            {financials.expenseCount} Itemized records
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro space-y-1">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Realized Net Cashflow
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-paddy-700">
            ₹{financials.realizedCashflow.toLocaleString()}
          </p>
          <p className="text-xs text-forest-800 font-semibold">
            Net Proceeds - Expenses
          </p>
        </div>

        {/* Pending Receivables (Separated!) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-harvest-400 shadow-agro space-y-1 bg-harvest-50/40">
          <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
            Pending Buyer Dues
          </span>
          <p className="font-display font-black text-2xl sm:text-3xl text-terracotta-700">
            ₹{financials.pendingPayments.toLocaleString()}
          </p>
          <p className="text-[10px] text-ink-600 font-bold">
            ⚠ Separated from received income
          </p>
        </div>
      </div>

      {/* Category-wise Expense Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === "ta"
            ? "செலவு வகை வாரியான பகுப்பாய்வு"
            : "Category-Wise Expense Distribution"}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(financials.expenseByCategory).map(
            ([category, amt]) => {
              const pct = Math.round((amt / financials.totalExpenses) * 100);

              return (
                <div
                  key={category}
                  className="p-3.5 bg-cream-50 rounded-2xl border border-sage-200 text-center space-y-1"
                >
                  <span className="text-[10px] font-bold uppercase text-ink-500 block truncate">
                    {category}
                  </span>
                  <p className="font-display font-black text-base text-forest-900">
                    ₹{amt.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-paddy-700 font-bold">
                    {pct}% of budget
                  </p>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Itemized Expense History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === "ta"
            ? "பதிவான அனைத்து செலவுகள்"
            : "Itemized Cultivation Expenses"}
        </h3>

        <div className="divide-y divide-sage-200 text-xs">
          {state.expenses.map((exp) => (
            <div
              key={exp.id}
              className="py-3 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-forest-900 text-sm">
                  {language === "ta"
                    ? exp.tamilDescription || exp.description
                    : exp.description}
                </span>
                <p className="text-ink-500 mt-0.5">
                  Category:{" "}
                  <span className="font-semibold text-paddy-700">
                    {exp.category}
                  </span>{" "}
                  • Date: {exp.date} • Paid via {exp.paymentMode} to{" "}
                  {exp.paidTo}
                </p>
              </div>

              <div className="text-right">
                <span className="font-display font-black text-base text-terracotta-600">
                  ₹{exp.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-forest-900">
              {language === "ta"
                ? "புதிய செலவு பதிவு"
                : "Log Cultivation Expense"}
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Expense Category
                </label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value as any)}
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Labour">Labour (கூலி)</option>
                  <option value="Machinery">Machinery (இயந்திர வாடகை)</option>
                  <option value="Fertilizers">Fertilizers (உரம்)</option>
                  <option value="Bio-Inputs">Bio-Inputs (உயிரி உரங்கள்)</option>
                  <option value="Seeds">Seeds (விதை)</option>
                  <option value="Transport">Transport (போக்குவரத்து)</option>
                  <option value="Storage">Storage (கிடங்கு)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  placeholder="e.g. 5 bags Neem cake"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="e.g. 3500"
                  className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
                >
                  Save to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
