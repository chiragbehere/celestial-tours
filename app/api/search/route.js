import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const tag = searchParams.get('tag')?.toLowerCase() || '';
    const priceBand = searchParams.get('price_band') || '';

    let destinations = db.getDestinations();
    let activities = db.getAllActivities();

    if (query) {
      const terms = query.split(/\s+/).filter(Boolean);
      destinations = destinations.filter(d => {
        const text = `${d.name} ${d.tagline} ${d.description} ${d.tags.join(' ')} ${d.best_season}`.toLowerCase();
        return terms.some(term => text.includes(term));
      });

      activities = activities.filter(a => {
        const text = `${a.name} ${a.category} ${a.tags.join(' ')}`.toLowerCase();
        return terms.some(term => text.includes(term));
      });
    }

    if (tag) {
      destinations = destinations.filter(d => d.tags.map(t => t.toLowerCase()).includes(tag));
    }

    if (priceBand) {
      destinations = destinations.filter(d => d.price_band === priceBand);
    }

    return NextResponse.json({
      success: true,
      destinations,
      activities
    });
  } catch (err) {
    console.error('Error in search API:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
