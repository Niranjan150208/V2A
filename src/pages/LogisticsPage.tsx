import React, { useState } from 'react';
import { Truck, MapPin, Calculator, Phone, CheckCircle2, ArrowRight, CircleDollarSign } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const LogisticsPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  const [destination, setDestination] = useState<'mill' | 'godown' | 'mandi'>('mill');
  const [selectedVehicle, setSelectedVehicle] = useState(state.transportListings[1]); // Eicher 4T
  const [bagCount, setBagCount] = useState(110);
  const [bookingDone, setBookingDone] = useState(false);

  const destinationOptions = {
    mill: {
      name: 'Thanjavur Modern Rice Mill Pvt Ltd',
      tamilName: 'தஞ்சாவூர் நவீன அரிசி ஆலை',
      distanceKm: 14,
      quotedOfferPrice: 2280,
    },
    godown: {
      name: 'Thanjavur Central WDRA Godown',
      tamilName: 'மத்திய ஒழுங்குமுறை சேமிப்புக் கிடங்கு',
      distanceKm: 9.5,
      quotedOfferPrice: 2250,
    },
    mandi: {
      name: 'Kumbakonam Regulated Market Committee (Mandi)',
      tamilName: 'கும்பகோணம் ஒழுங்குமுறை விற்பனைக் கூடம்',
      distanceKm: 28,
      quotedOfferPrice: 2260,
    },
  };

  const currentDest = destinationOptions[destination];

  // Freight calculation: Base Charge + (Distance * RatePerKm)
  const tripsNeeded = Math.ceil(bagCount / selectedVehicle.maxPayloadBags);
  const totalFreight = (selectedVehicle.baseCharge + currentDest.distanceKm * selectedVehicle.ratePerKm) * tripsNeeded;

  // Estimated Net Proceeds
  const grossValue = bagCount * currentDest.quotedOfferPrice;
  const baggingCost = bagCount * 30;
  const cess = Math.round(grossValue * 0.01);
  const netProceeds = grossValue - totalFreight - baggingCost - cess;

  const handleBookVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    AppStore.addExpense({
      seasonId: activeSeasonId,
      category: 'Transport',
      description: `${selectedVehicle.vehicleType} transport to ${currentDest.name}`,
      amount: totalFreight,
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'UPI',
      paidTo: selectedVehicle.driverName,
    });
    setBookingDone(true);
    triggerRefresh();
    setTimeout(() => {
      setBookingDone(false);
      navigate('/net-proceeds');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'பண்ணை முதல் சந்தை வரை போக்குவரத்து' : 'Farm-to-Mandi Transport Logistics'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'சரக்கு கட்டண கால்குலேட்டர் & லாரி முன்பதிவு' : 'Freight Rate Calculator & Vehicle Booking'}
          </h1>
          <p className="text-xs text-ink-500">
            Thiruvaiyaru Farm Gate • Transparent distance & vehicle payload matrix
          </p>
        </div>

        <button
          onClick={() => navigate('/net-proceeds')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'நிகர வரவு கால்குலேட்டர்' : 'Net Proceeds Breakdown'}
        </button>
      </div>

      {/* Destination & Net Proceeds Comparison Matrix (Requirement G) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-4">
        <h3 className="font-display font-bold text-xl text-forest-900">
          {language === 'ta' ? 'இடத்தேர்வு & நிகர வருமான ஒப்பீடு' : 'Route & Destination Net Realization Comparison'}
        </h3>
        <p className="text-xs text-ink-600">
          Compare total freight deductions and net earnings across destinations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['mill', 'godown', 'mandi'] as const).map((destKey) => {
            const dest = destinationOptions[destKey];
            const freight = (selectedVehicle.baseCharge + dest.distanceKm * selectedVehicle.ratePerKm) * tripsNeeded;
            const gross = bagCount * dest.quotedOfferPrice;
            const net = gross - freight - (bagCount * 30) - Math.round(gross * 0.01);
            const isSelected = destination === destKey;

            return (
              <div
                key={destKey}
                onClick={() => setDestination(destKey)}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-paddy-600 bg-cream-50 shadow-agro'
                    : 'border-sage-300 bg-white hover:border-paddy-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-100 px-2 py-0.5 rounded-full">
                    {dest.distanceKm} km distance
                  </span>
                  {isSelected && (
                    <span className="text-xs font-bold text-paddy-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Selected
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-base text-forest-900">{dest.name}</h4>
                <p className="text-xs text-ink-500 mt-0.5">Offer: ₹{dest.quotedOfferPrice}/bag</p>

                <div className="mt-4 pt-3 border-t border-sage-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-ink-500">Freight:</span>
                    <span className="font-bold text-terracotta-700">-₹{freight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-forest-900 pt-1">
                    <span>Est. Net Proceeds:</span>
                    <span className="text-paddy-700">₹{net.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vehicle Selection & Freight Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Vehicle Selector */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base text-forest-900">
            {language === 'ta' ? 'சரக்கு வாகனம் தேர்வு' : 'Select Transport Vehicle'}
          </h3>

          {state.transportListings.map((veh) => (
            <div
              key={veh.id}
              onClick={() => setSelectedVehicle(veh)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedVehicle.id === veh.id
                  ? 'bg-forest-800 text-cream-50 border-forest-900 shadow-agro'
                  : 'bg-white text-ink-900 border-sage-300 hover:border-paddy-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${selectedVehicle.id === veh.id ? 'text-harvest-400' : 'text-paddy-700'}`}>
                  Max Payload: {veh.maxPayloadBags} Bags
                </span>
                <span className="text-xs font-bold">Base ₹{veh.baseCharge} + ₹{veh.ratePerKm}/km</span>
              </div>
              <h4 className="font-bold text-sm">{veh.vehicleType}</h4>
              <p className={`text-xs mt-1 ${selectedVehicle.id === veh.id ? 'text-sage-200' : 'text-ink-500'}`}>
                Driver: {veh.driverName} ({veh.phone})
              </p>
            </div>
          ))}
        </div>

        {/* Right 2 Cols: Freight Summary & Booking Confirmation */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-agro space-y-6">
          <h3 className="font-display font-extrabold text-xl text-forest-900">
            {language === 'ta' ? 'போக்குவரத்து முன்பதிவு விவரம்' : 'Freight Quote & Booking Dispatch'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200">
              <span className="text-xs font-bold text-ink-500 uppercase block">Distance</span>
              <p className="font-display font-black text-2xl text-forest-900 mt-1">{currentDest.distanceKm} km</p>
              <p className="text-xs text-ink-500">Farm Gate to Destination</p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200">
              <span className="text-xs font-bold text-ink-500 uppercase block">Vehicle Trips</span>
              <p className="font-display font-black text-2xl text-forest-900 mt-1">{tripsNeeded} Trip(s)</p>
              <p className="text-xs text-ink-500">{bagCount} total bags loaded</p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-sage-200">
              <span className="text-xs font-bold text-ink-500 uppercase block">Total Freight Quote</span>
              <p className="font-display font-black text-2xl text-terracotta-600 mt-1">₹{totalFreight.toLocaleString()}</p>
              <p className="text-xs text-ink-500">Includes driver & toll</p>
            </div>
          </div>

          {bookingDone ? (
            <div className="p-4 bg-paddy-100 text-paddy-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-paddy-700 shrink-0" />
              <span>
                {language === 'ta'
                  ? 'வாகனம் முன்பதிவு செய்யப்பட்டது! சரக்கு கட்டணம் பயிர் செலவில் சேர்க்கப்பட்டு நிகர லாபம் கணக்கிடப்பட்டது.'
                  : 'Vehicle dispatch confirmed! Freight cost recorded in active season expenses.'}
              </span>
            </div>
          ) : (
            <button
              onClick={handleBookVehicle}
              className="w-full py-3.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
            >
              {language === 'ta' ? 'லாரி முன்பதிவை உறுதி செய்க' : 'Confirm Truck Booking & Log Transport Expense'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
