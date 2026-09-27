import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { saveBookingToFirestore, saveTourPlanToFirestore } from '@/lib/firebase-db';

export async function POST(req) {
  try {
    const { tourPlanId, travelerName, travelerEmail, paymentMethod, paymentPreferences = {} } = await req.json();

    const tourPlan = db.getTourPlan(tourPlanId);
    if (!tourPlan) {
      return NextResponse.json({ error: 'Tour plan not found' }, { status: 404 });
    }

    const { items } = db.getItinerary(tourPlanId);

    let amountPaidNow = 0;
    let amountPayOnLocation = 0;

    // Auto-create operator-side booking records with customized payment mode
    const createdBookings = [];

    items.forEach((item) => {
      // By default: Stays are essential (prepaid), activities/transport can be customized
      const pref = paymentPreferences[item.id] || (item.item_type === 'stay' ? 'pay_now' : 'pay_now');

      if (pref === 'skip') {
        return; // Traveler opted out of this optional activity
      }

      const isPayNow = pref === 'pay_now';
      const cost = item.cost || 0;

      if (isPayNow) {
        amountPaidNow += cost;
      } else {
        amountPayOnLocation += cost;
      }

      const booking = db.createBooking({
        tour_plan_id: tourPlanId,
        itinerary_item_id: item.id,
        vendor_type: item.item_type,
        vendor_entity_id: item.entity_id,
        vendor_name: item.name,
        amount: cost,
        traveler_name: travelerName || 'Aditi Sharma',
        traveler_email: travelerEmail || 'aditi@example.com',
        payment_method: isPayNow ? (paymentMethod || 'UPI / Card') : 'Pay on Location (Direct to Vendor)',
        status: 'confirmed',
        payment_status: isPayNow ? 'paid' : 'pay_on_location',
        payment_preference: pref
      });

      // Async write to Cloud Firestore
      saveBookingToFirestore(booking);

      createdBookings.push(booking);
    });

    // Update tour plan status to booked
    const updatedPlan = db.updateTourPlan(tourPlanId, {
      status: 'booked',
      traveler_name: travelerName || 'Aditi Sharma',
      traveler_email: travelerEmail || 'aditi@example.com',
      amount_paid_now: amountPaidNow,
      amount_pay_on_location: amountPayOnLocation
    });

    if (updatedPlan) {
      saveTourPlanToFirestore(updatedPlan);
    }

    return NextResponse.json({
      success: true,
      tour_plan: updatedPlan,
      bookings: createdBookings,
      amountPaidNow,
      amountPayOnLocation,
      confirmation_code: `CT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 });
  }
}
