import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tourPlanId = searchParams.get('tour_plan_id');
    const status = searchParams.get('status');

    let bookings = tourPlanId ? db.getBookingsByTourPlan(tourPlanId) : db.getAllBookings();

    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }

    return NextResponse.json({
      success: true,
      bookings,
      totalCount: bookings.length
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    const updated = db.updateBooking(id, { status, ...(notes ? { notes } : {}) });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
