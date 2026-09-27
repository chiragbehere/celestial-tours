import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req) {
  try {
    const vendors = db.getVendors();
    const stats = {
      totalVendors: vendors.length,
      activeContracts: vendors.filter(v => v.contract_status === 'active').length,
      totalPendingSettlements: vendors.reduce((acc, v) => acc + (v.pending_payout || 0), 0),
      totalSettledPayouts: vendors.reduce((acc, v) => acc + (v.settled_payout || 0), 0),
      avgSlaScore: Math.round(vendors.reduce((acc, v) => acc + (v.sla_score || 0), 0) / (vendors.length || 1))
    };
    return NextResponse.json({ success: true, vendors, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, vendorData, vendorId, message } = body;

    if (action === 'create') {
      if (!vendorData || !vendorData.name) {
        return NextResponse.json({ success: false, error: 'Vendor name is required' }, { status: 400 });
      }
      const newVendor = db.addVendor(vendorData);
      return NextResponse.json({ success: true, vendor: newVendor });
    }

    const dispatch = db.dispatchVendorNotification(vendorId, message || 'Itinerary update dispatch from Celestial Operations');
    return NextResponse.json({ success: true, dispatch });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
