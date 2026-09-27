import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { saveBookingToFirestore, saveTourPlanToFirestore } from '@/lib/firebase-db';

export async function POST(req) {
  try {
    const { tourPlanId, travelerName, travelerEmail, paymentMethod, paymentPreferences = {} } = await req.json();

    let tourPlan = db.getTourPlan(tourPlanId);
    if (!tourPlan) {
      const allPlans = db.getAllTourPlans ? db.getAllTourPlans() : [];
      const match = allPlans.find(p => (p.destinations || []).some(d => tourPlanId.toLowerCase().includes(d.toLowerCase()))) || allPlans[0];
      if (match) {
        tourPlan = db.createTourPlan({
          ...match,
          id: tourPlanId,
          status: 'planned'
        });
      }
    }

    if (!tourPlan) {
      return NextResponse.json({ error: 'Tour plan not found' }, { status: 404 });
    }

    let { items } = db.getItinerary(tourPlanId);
    if (!items || items.length === 0) {
      const refPlanId = tourPlan.destinations?.[0]?.toLowerCase().includes('manali') 
        ? 'tour-manali-adventure' 
        : tourPlan.destinations?.[0]?.toLowerCase().includes('jaipur') 
          ? 'tour-rajasthan-heritage' 
          : 'tour-goa-signature';
      const refItinerary = db.getItinerary(refPlanId);
      const days = (refItinerary?.days || []).map((d, idx) => ({ ...d, id: `day-${tourPlanId}-${idx+1}`, tour_plan_id: tourPlanId }));
      items = (refItinerary?.items || []).map((i, idx) => ({
        ...i,
        id: `item-${tourPlanId}-${idx+1}`,
        tour_plan_id: tourPlanId,
        type: i.type || i.item_type || 'activity',
        item_type: i.item_type || i.type || 'activity',
        cost: Number(i.cost || i.price || i.price_per_night || 0)
      }));
      db.saveItinerary(tourPlanId, days, items);
    }

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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const tourPlanId = searchParams.get('tour_plan_id');

    let bookings = db.getAllBookings();
    if (tourPlanId) {
      bookings = bookings.filter(b => b.tour_plan_id === tourPlanId);
    }
    if (email) {
      bookings = bookings.filter(b => 
        b.traveler_email?.toLowerCase() === email.toLowerCase() ||
        b.traveler_name?.toLowerCase().includes(email.split('@')[0].toLowerCase())
      );
    }

    const tourPlans = db.getTourPlans();

    return NextResponse.json({
      success: true,
      bookings,
      tourPlans
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

