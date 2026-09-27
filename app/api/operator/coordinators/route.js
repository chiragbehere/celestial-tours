import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const coordinators = db.getCoordinators();
    const tourPlans = db.getAllTourPlans();

    // Attach active tour details to each coordinator
    const enriched = coordinators.map(c => {
      const assignedTours = tourPlans.filter(p => p.coordinator_id === c.id);
      return {
        ...c,
        active_tours: assignedTours.length,
        assigned_tours: assignedTours.map(t => ({ id: t.id, name: t.tour_name, status: t.status }))
      };
    });

    return NextResponse.json({ success: true, coordinators: enriched });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { tourPlanId, coordinatorId } = body;

    if (!tourPlanId || !coordinatorId) {
      return NextResponse.json({ success: false, error: 'tourPlanId and coordinatorId are required' }, { status: 400 });
    }

    const updatedTour = db.assignCoordinator(tourPlanId, coordinatorId);
    if (!updatedTour) {
      return NextResponse.json({ success: false, error: 'Tour plan not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Coordinator assigned successfully',
      tourPlan: updatedTour
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
