import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const tours = db.getAllTourPlans();
    return NextResponse.json({
      success: true,
      tours: tours || []
    });
  } catch (error) {
    console.error('Error fetching operator tour packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve tour packages' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      tour_name,
      destinations = ['Goa'],
      duration_days = 4,
      accommodation_tier = 'premium',
      pace = 'moderate',
      budget_total = 50000,
      group_size = 2,
      operator_name = 'Custom Tour Operator',
      image_url
    } = body;

    if (!tour_name) {
      return NextResponse.json(
        { success: false, error: 'Tour name is required' },
        { status: 400 }
      );
    }

    const tourId = `tour-custom-${Date.now()}`;
    const primaryDest = destinations[0] || 'Goa';

    // 1. Create Tour Plan
    const newTour = db.createTourPlan({
      id: tourId,
      tour_name,
      destinations,
      duration_days: parseInt(duration_days) || 4,
      accommodation_tier,
      pace,
      budget_total: parseInt(budget_total) || 50000,
      total_cost: Math.round((parseInt(budget_total) || 50000) * 0.75),
      group_size: parseInt(group_size) || 2,
      status: 'active',
      operator_name,
      image_url: image_url || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
      lead_traveler: 'Open Booking Group',
      lead_phone: '+91 98000 11223',
      lead_email: 'ops@tourplan.in',
      start_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      end_date: new Date(Date.now() + (7 + (parseInt(duration_days) || 4)) * 86400000).toISOString().split('T')[0]
    });

    // 2. Generate Days & Itinerary Items from Destination Catalog
    const days = [];
    const items = [];
    const numDays = parseInt(duration_days) || 4;

    for (let d = 1; d <= numDays; d++) {
      const dayId = `day-${tourId}-${d}`;
      days.push({
        id: dayId,
        tour_plan_id: tourId,
        day_number: d,
        title: d === 1 ? `Arrival & Welcome in ${primaryDest}` : d === numDays ? `Departure & Souvenirs` : `${primaryDest} Discovery & Excursions`,
        date: new Date(Date.now() + (7 + d) * 86400000).toISOString().split('T')[0]
      });

      // Stay item on Day 1
      if (d === 1) {
        items.push({
          id: `item-${dayId}-stay`,
          tour_plan_id: tourId,
          itinerary_day_id: dayId,
          day_number: d,
          type: 'stay',
          name: `${primaryDest} Heritage & Resort Stay`,
          category: 'Resort & Hospitality',
          location: `${primaryDest} Central`,
          start_time: '14:00',
          end_time: '11:00',
          cost: Math.round(((parseInt(budget_total) || 50000) * 0.35) / numDays),
          status: 'confirmed',
          depends_on: []
        });

        items.push({
          id: `item-${dayId}-transfer`,
          tour_plan_id: tourId,
          itinerary_day_id: dayId,
          day_number: d,
          type: 'transport',
          name: `Private Chauffeur Airport Pickup`,
          category: 'Private Cab',
          location: `${primaryDest} Airport to Resort`,
          start_time: '11:30',
          end_time: '13:00',
          cost: 1500,
          status: 'confirmed',
          depends_on: []
        });
      }

      // Activity item
      items.push({
        id: `item-${dayId}-act`,
        tour_plan_id: tourId,
        itinerary_day_id: dayId,
        day_number: d,
        type: 'activity',
        name: d === 1 ? `${primaryDest} Sunset Walk & Dinner` : `${primaryDest} Guided Highlights & Culture Tour`,
        category: 'Guided Experience',
        location: `${primaryDest} Region`,
        start_time: '15:30',
        end_time: '18:30',
        cost: 2200,
        status: 'confirmed',
        depends_on: []
      });
    }

    db.saveItinerary(tourId, days, items);

    return NextResponse.json({
      success: true,
      message: 'Tour package published successfully',
      tour: newTour
    });
  } catch (error) {
    console.error('Error creating operator tour package:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create tour package' },
      { status: 500 }
    );
  }
}
