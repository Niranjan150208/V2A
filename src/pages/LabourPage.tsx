import React, { useState } from 'react';
import { Users, Phone, Calendar, CheckCircle2, Plus, Clock, CircleDollarSign, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const LabourPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  const [bookingModal, setBookingModal] = useState(false);
  const [workType, setWorkType] = useState('Hand Weeding');
  const [workersCount, setWorkersCount] = useState(8);
  const [dailyWage, setDailyWage] = useState(500);
  const [leadName, setLeadName] = useState('Meenakshi Weeding Team');
  const [phone, setPhone] = useState('+91 94861 88319');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookLabour = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || workersCount < 1 || dailyWage <= 0 || !leadName.trim() || !requiredDate) return;
    setIsSubmitting(true);
    const totalWage = workersCount * dailyWage;

    AppStore.addLabourBooking({
      seasonId: activeSeasonId,
      workType: workType as any,
      requiredDate,
      workersCount,
      dailyWagePerPerson: dailyWage,
      totalCostEstimate: totalWage,
      leadWorkerName: leadName,
      phone,
      status: 'Confirmed',
    });

    setBookingModal(false);
    setIsSubmitting(false);
    triggerRefresh();
    alert(language === 'ta' ? 'வேளாண் கூலி ஆட்கள் முன்பதிவு செய்யப்பட்டு செலவு பதிவானது!' : 'Labour team booked & wage expense logged into active crop season!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'வேளாண் கூலி ஆட்கள் குழுக்கள்' : 'Farm Labour Groups & Wage Scheduling'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'கூலி ஆட்கள் முன்பதிவு & கூலிப்பட்டியல்' : 'Labour Teams & Field Task Crews'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta'
              ? 'நாற்று பறித்தல், நடுவு, களை எடுத்தல் மற்றும் மூட்டை பிடிக்கும் குழுக்கள்'
              : 'Direct connection with agricultural self-help groups (SHGs) and harvesting crews'}
          </p>
        </div>

        <button
          onClick={() => setBookingModal(true)}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-harvest-400" />
          <span>{language === 'ta' ? 'ஆட்கள் முன்பதிவு செய்ய' : 'Book Labour Team'}</span>
        </button>
      </div>

      {/* Available Labour Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.labourBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2 py-0.5 rounded-full">
                  {b.workType}
                </span>
                <h3 className="font-display font-extrabold text-lg text-forest-900 mt-1">
                  {b.leadWorkerName}
                </h3>
              </div>
              <span className="text-xs font-bold text-paddy-800 bg-paddy-100 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {b.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 bg-cream-50 rounded-2xl border border-sage-200">
              <div>
                <span className="text-[10px] font-bold text-ink-500 uppercase block">Workers</span>
                <p className="font-extrabold text-sm text-forest-900">{b.workersCount} Persons</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-ink-500 uppercase block">Daily Wage</span>
                <p className="font-extrabold text-sm text-forest-900">₹{b.dailyWagePerPerson}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-ink-500 uppercase block">Total Cost</span>
                <p className="font-extrabold text-sm text-paddy-700">₹{b.totalCostEstimate.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-600 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-forest-800">
                <Phone className="w-3.5 h-3.5 text-paddy-600" />
                {b.phone}
              </span>
              <span>Required: {b.requiredDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Book Labour Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-forest-900">
              {language === 'ta' ? 'புதிய கூலி ஆட்கள் குழு முன்பதிவு' : 'Schedule Farm Labour Crew'}
            </h3>

            <form onSubmit={handleBookLabour} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Work Type</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Hand Weeding">Hand Weeding (களை எடுத்தல்)</option>
                  <option value="Paddy Nursery Pulling">Paddy Nursery Pulling (நாற்று பறித்தல்)</option>
                  <option value="Transplanting">Transplanting (நடுவு பணி)</option>
                  <option value="Harvesting & Bagging">Harvesting & Bagging (அறுவடை & மூட்டை பிடித்தல்)</option>
                  <option value="Bio-Pesticide Spraying">Bio-Pesticide Spraying (மருந்து தெளித்தல்)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Worker Count</label>
                  <input
                    type="number"
                    value={workersCount}
                    onChange={(e) => setWorkersCount(parseInt(e.target.value) || 1)}
                    className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">Wage / Person (₹)</label>
                  <input
                    type="number"
                    value={dailyWage}
                    onChange={(e) => setDailyWage(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-bold text-forest-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Required Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-700 mb-1">Crew Lead / Contact</label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-sage-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="p-3 bg-cream-100 rounded-xl border border-sage-300 text-xs flex items-center justify-between font-bold">
                <span>Total Estimated Wage:</span>
                <span className="text-base text-forest-900">₹{(workersCount * dailyWage).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                <button
                  type="button"
                  onClick={() => setBookingModal(false)}
                  className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro disabled:opacity-60"
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
