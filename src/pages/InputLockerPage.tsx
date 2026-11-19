import React from "react";
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { AppStore } from "../services/store";

export const InputLockerPage: React.FC = () => {
  const { language, navigate, activeSeasonId } = useNavigation();
  const state = AppStore.getState();
  const purchases = state.inputPurchases.filter(
    (purchase) => purchase.seasonId === activeSeasonId,
  );

  const totalOrdered = purchases.reduce(
    (sum, purchase) => sum + purchase.totalCost,
    0,
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-paddy-600" />
            <span>
              {language === "ta"
                ? "டெமோ ஆர்டர் வரலாறு"
                : "Demo Orders & Purchase History"}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === "ta"
              ? "இடுபொருள் ஆர்டர்கள்"
              : "Input Orders & Purchase History"}
          </h1>
          <p className="text-xs text-ink-500">
            {language === "ta"
              ? "பயன்படுத்தப்பட்ட மற்றும் இருப்பில் உள்ள உரங்கள், விதைகள் மற்றும் இடுபொருட்களின் சான்றிதழ்"
              : "Review demo orders placed from the input shop. Orders are local records; no supplier or payment service is connected."}
          </p>
        </div>

        <button
          onClick={() => navigate("/input-marketplace")}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4 text-harvest-400" />
          <span>
            {language === "ta" ? "புதிய இடுபொருட்கள் வாங்க" : "Buy More Inputs"}
          </span>
        </button>
      </div>

      {/* Locker Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === "ta"
              ? "இந்த பருவத்தின் ஆர்டர்கள்"
              : "Orders This Season"}
          </span>
          <p className="font-display font-black text-3xl text-forest-900 mt-1">
            {purchases.length}
          </p>
          <p className="text-xs text-paddy-700 font-semibold mt-1">
            Local demo purchase history
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === "ta" ? "ஆர்டர் மொத்தம்" : "Total Order Value"}
          </span>
          <p className="font-display font-black text-3xl text-forest-900 mt-1">
            ₹{totalOrdered.toLocaleString()}
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Orders shown for selected season
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-300 shadow-agro">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            {language === "ta"
              ? "பணம் செலுத்தும் நிலை"
              : "Order & Payment Status"}
          </span>
          <p className="font-display font-black text-xl text-paddy-700 mt-1">
            Demo only · Unpaid
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Payment and delivery are not processed by this prototype.
          </p>
        </div>
      </div>

      {/* Vault Items List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === "ta" ? "ஆர்டர் பட்டியல்" : "Order History"}
        </h3>

        <div className="divide-y divide-sage-200">
          {purchases.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-600">
              No orders for this season yet.{" "}
              <button
                onClick={() => navigate("/input-marketplace")}
                className="font-bold text-paddy-700 underline"
              >
                Browse the demo shop
              </button>
            </div>
          ) : (
            purchases.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 border border-sage-300 flex items-center justify-center text-paddy-700 shrink-0 mt-0.5">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-forest-900">
                        {item.productName}
                      </h4>
                      <span className="text-[10px] font-mono font-bold bg-cream-200 text-ink-600 px-2 py-0.5 rounded">
                        {item.batchNumber}
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 mt-0.5">
                      Purchased on {item.purchaseDate} from {item.supplier}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-forest-800 font-medium mt-1">
                        📝 {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 text-right">
                  <div>
                    <span className="text-xs font-bold text-ink-500 block uppercase">
                      Quantity & Rate
                    </span>
                    <p className="font-bold text-xs text-forest-900">
                      {item.quantity} {item.unit} @ ₹{item.unitPrice}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-ink-500 block uppercase">
                      Total Invested
                    </span>
                    <p className="font-display font-black text-base text-forest-900">
                      ₹{item.totalCost.toLocaleString()}
                    </p>
                  </div>

                  <span className="bg-harvest-100 text-forest-900 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-paddy-600" />
                    {item.orderStatus ||
                      (item.isUsedInField
                        ? "Demo record · Used"
                        : "Demo record · Placed")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
