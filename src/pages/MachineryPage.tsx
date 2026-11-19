import React, { useState } from 'react';
import { Tractor, Calendar, Phone, CheckCircle2, Star, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { AppStore } from '../services/store';

export const MachineryPage: React.FC = () => {
  const { language, navigate, activeSeasonId, triggerRefresh } = useNavigation();
  const state = AppStore.getState();

  const [bookingModal, setBookingModal] = useState<any>(null);
  const [hours, setHours] = useState(4);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModal || isSubmitting || hours < 1) return;
    setIsSubmitting(true);

    const totalRent = bookingModal.hourlyRate * hours;

    AppStore.addMachineryBooking({
      seasonId: activeSeasonId,
      machineryId: bookingModal.id,
      machineryTitle: bookingModal.title,
      chcCenterName: bookingModal.chcCenterName,
      operatorName: bookingModal.contactPerson,
      phone: bookingModal.phone,
      hours,
      hourlyRate: bookingModal.hourlyRate,
      totalCost: totalRent,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
    });

    setBookingSuccess(true);
    setIsSubmitting(false);
    triggerRefresh();
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModal(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-paddy-700 uppercase tracking-wider mb-1">
            <Tractor className="w-4 h-4 text-paddy-600" />
            <span>{language === 'ta' ? 'வாடகை சேவை மையம் (CHC)' : 'Custom Hiring Center (CHC) Mechanization'}</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-900">
            {language === 'ta' ? 'வேளாண் வாடகை இயந்திரங்கள்' : 'Farm Machinery & Equipment Rental'}
          </h1>
          <p className="text-xs text-ink-500">
            {language === 'ta'
              ? 'டிராக்டர்கள், இயந்திர நடவு கருவிகள், அறுவடை இயந்திரங்கள் மற்றும் ட்ரோன் தெளிப்பான்'
              : 'Direct hire from Primary Agricultural Cooperative Societies (PACS) and authorized operators'}
          </p>
        </div>

        <button
          onClick={() => navigate('/farm-calendar')}
          className="px-4 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro"
        >
          {language === 'ta' ? 'பண்ணை நாட்காட்டி' : 'Field Operations Calendar'}
        </button>
      </div>

      {/* Machinery Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.machineryListings.map((mach) => (
          <div
            key={mach.id}
            className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro flex flex-col justify-between hover:border-paddy-500 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-paddy-700 bg-paddy-50 px-2.5 py-0.5 rounded-full">
                  {mach.equipmentType}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-forest-900 bg-harvest-200 px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-harvest-600 text-harvest-600" />
                  {mach.rating}
                </span>
              </div>

              <h3 className="font-display font-extrabold text-lg text-forest-900 leading-snug">
                {language === 'ta' ? mach.tamilTitle : mach.title}
              </h3>
              <p className="text-xs text-ink-500 mt-1">{mach.chcCenterName}</p>

              <div className="my-4 p-3 bg-cream-50 rounded-2xl border border-sage-200 space-y-1.5 text-xs text-ink-700">
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Operator:</span>
                  <span className="font-bold text-forest-900">{mach.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Location:</span>
                  <span className="font-semibold text-forest-900">{mach.village}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Includes Fuel & Driver:</span>
                  <span className="font-bold text-paddy-700">Yes (உட்பட) ✓</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-sage-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-ink-500 uppercase font-bold block">Hourly Rate</span>
                  <span className="font-display font-black text-2xl text-forest-900">
                    ₹{mach.hourlyRate}
                  </span>
                  <span className="text-xs text-ink-500"> / hour</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-ink-500 uppercase font-bold block">Daily Rate</span>
                  <span className="font-bold text-sm text-paddy-700">₹{mach.dailyRate} / day</span>
                </div>
              </div>

              <button
                onClick={() => setBookingModal(mach)}
                className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-harvest-300 font-bold text-xs rounded-xl shadow-agro transition-all"
              >
                {language === 'ta' ? 'இப்போதே வாடகைக்கு முன்பதிவு செய்' : 'Book Machinery Rental'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Persisted booking history */}
      <section className="bg-white rounded-3xl p-6 border border-sage-300 shadow-agro space-y-3">
        <h3 className="font-display font-extrabold text-lg text-forest-900">Machinery Booking History</h3>
        {state.machineryBookings.filter((booking) => booking.seasonId === activeSeasonId).length === 0 ? (
          <p className="text-xs text-ink-500">No machinery bookings for this crop season yet.</p>
        ) : state.machineryBookings.filter((booking) => booking.seasonId === activeSeasonId).map((booking) => (
          <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-sage-200 p-3">
            <div><p className="font-bold text-sm text-forest-900">{booking.machineryTitle}</p><p className="text-xs text-ink-500">{booking.chcCenterName} • {booking.bookingDate} • {booking.hours} hours</p></div>
            <div className="text-sm font-bold text-paddy-700">₹{booking.totalCost.toLocaleString()} · {booking.status}</div>
          </div>
        ))}
      </section>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sage-300 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-forest-900">
              {language === 'ta' ? 'இயந்திர வாடகை முன்பதிவு' : 'Confirm Machinery Booking'}
            </h3>
            <p className="text-xs text-ink-600">
              {bookingModal.title} • {bookingModal.chcCenterName}
            </p>

            {bookingSuccess ? (
              <div className="p-4 bg-paddy-100 text-paddy-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 text-paddy-700 shrink-0" />
                <span>
                  {language === 'ta'
                    ? 'முன்பதிவு உறுதி செய்யப்பட்டது! செலவு தானாக பயிர் வரவு-செலவில் சேர்க்கப்பட்டது.'
                    : 'Booking confirmed! Operator dispatched and rental cost added to season expenses.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleBookEquipment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-700 mb-1">
                    {language === 'ta' ? 'தேவையான நேரம் (Hours)' : 'Operating Duration (Hours)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-cream-50 border border-sage-300 rounded-xl text-sm font-bold text-forest-900"
                  />
                </div>

                <div className="p-3 bg-cream-100 rounded-xl border border-sage-300 text-xs flex items-center justify-between font-bold">
                  <span>Total Rental Quote:</span>
                  <span className="text-base text-forest-900">₹{(bookingModal.hourlyRate * hours).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-sage-200">
                  <button
                    type="button"
                    onClick={() => setBookingModal(null)}
                    className="px-4 py-2 rounded-xl border border-sage-300 text-xs font-semibold text-ink-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-forest-800 text-harvest-300 font-bold text-xs rounded-xl shadow-agro disabled:opacity-60"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm & Record Expense'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
