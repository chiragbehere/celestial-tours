import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tourPlanId = searchParams.get('tour_plan_id');
    const reviews = tourPlanId ? db.getReviewsByTourPlan(tourPlanId) : [];
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { tourPlanId, travelerName, rating, comment, highlights } = body;

    let aiSummary = '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && comment) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

        const prompt = `Summarize this traveler review into a concise 1-sentence executive sentiment highlight with key positive tags:
Rating: ${rating}/5
Review: "${comment}"
Return only the 1-sentence summary without quotes.`;

        const res = await model.generateContent(prompt);
        aiSummary = res.response.text().trim();
      } catch (e) {
        console.warn('Review AI summary error:', e.message);
      }
    }

    if (!aiSummary) {
      aiSummary = rating >= 4
        ? 'Exceptional guest satisfaction with smooth logistics and verified vendor experiences.'
        : 'Constructive traveler feedback noted for tour operations continuous enhancement.';
    }

    const review = db.createReview({
      tour_plan_id: tourPlanId,
      traveler_name: travelerName || 'Verified Traveler',
      rating: rating || 5,
      comment: comment || 'Wonderful experience organized by CelestialTours.',
      highlights: highlights || ['Prompt Chauffeur', 'Flawless Resort Check-in'],
      ai_summary: aiSummary
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
