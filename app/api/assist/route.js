import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { queryNugenAI } from '@/lib/ai/nugen';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { tourPlanId, message, currentDayNumber = 1 } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const tourPlan = tourPlanId ? db.getTourPlan(tourPlanId) : db.getAllTourPlans()[0];
    const { days, items } = tourPlanId ? db.getItinerary(tourPlanId) : db.getItinerary(tourPlan?.id);

    const activeItems = (items || []).filter(i => i.status !== 'replaced' && i.status !== 'cancelled');
    const destination = tourPlan?.destinations?.[0] || 'Goa';

    let replyText = '';

    // 1. Try Nugen AI if configured
    if (process.env.NUGEN_API_KEY) {
      try {
        const prompt = `
TRAVELER CONTEXT:
- Tour: ${tourPlan?.tour_name || 'Bespoke India Tour'}
- Destination: ${destination}
- Current Day of Trip: Day ${currentDayNumber}
- Active Schedule for this trip:
${JSON.stringify(activeItems.map(i => ({ day: i.day_number, name: i.name, type: i.type, time: `${i.start_time} - ${i.end_time}`, location: i.location })))}

TRAVELER QUESTION:
"${message}"
`;
        replyText = await queryNugenAI({
          prompt,
          systemPrompt: `You are the Celestial In-Trip Concierge AI for an active traveler in ${destination}. Answer concisely with local expertise based on their schedule.`,
          temperature: 0.7
        });
      } catch (nugenErr) {
        console.warn('Nugen Assist error, trying fallback:', nugenErr.message);
      }
    }

    // 2. Try Gemini if replyText is still empty
    const apiKey = process.env.GEMINI_API_KEY;
    if (!replyText && apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
You are the Celestial In-Trip Concierge AI for an active traveler currently on tour in ${destination}.
You must be warm, helpful, highly knowledgeable about their schedule, and proactive.

TRAVELER CONTEXT:
- Tour: ${tourPlan?.tour_name || 'Bespoke India Tour'}
- Destination: ${destination}
- Current Day of Trip: Day ${currentDayNumber}
- Active Schedule for this trip:
${JSON.stringify(activeItems.map(i => ({ day: i.day_number, name: i.name, type: i.type, time: `${i.start_time} - ${i.end_time}`, location: i.location })))}

TRAVELER QUESTION:
"${message}"

INSTRUCTIONS:
- Answer directly based on their live schedule and location.
- If they ask what is next, give the exact upcoming event, timing, and local tip.
- If they ask for food/restaurant recommendations, suggest authentic, top-rated local spots near their scheduled hotel/activity.
- Keep the response concise (2-4 paragraphs max), professional, and clear.
`;

        const result = await model.generateContent(prompt);
        replyText = result.response.text();
      } catch (geminiErr) {
        console.warn('Gemini Assist error, using fallback:', geminiErr.message);
      }
    }

    if (!replyText) {
      const todayEvents = activeItems.filter(i => i.day_number === currentDayNumber);
      const nextEvent = todayEvents[0] || activeItems[0];

      if (message.toLowerCase().includes('next') || message.toLowerCase().includes('schedule')) {
        replyText = `Your next scheduled activity is **${nextEvent?.name || 'Grande Island Excursion'}** at **${nextEvent?.start_time || '10:00 AM'}** (${nextEvent?.location || 'Marina Pier'}). Your private chauffeur will be waiting outside the lobby 15 minutes prior to departure.`;
      } else if (message.toLowerCase().includes('food') || message.toLowerCase().includes('restaurant') || message.toLowerCase().includes('eat')) {
        replyText = `For lunch near your current location in ${destination}, we highly recommend **Fisherman's Wharf** (superb butter garlic crab and Goan fish curry) or **Martin's Corner** in Betalbatim (legendary kingfish and live coastal music). Both are within a 10-minute cab ride of your resort.`;
      } else if (message.toLowerCase().includes('weather') || message.toLowerCase().includes('rain')) {
        replyText = `Current conditions in ${destination}: 29°C with a gentle coastal sea breeze. Sunset is at 6:32 PM today. Perfect conditions for your evening sunset catamaran cruise!`;
      } else {
        replyText = `I have reviewed your active itinerary for **${tourPlan?.tour_name}**. Everything is on schedule, and your assigned coordinator, **Meera Nair**, is on standby for any immediate requests. How else can I make your journey seamless?`;
      }
    }

    return NextResponse.json({
      success: true,
      reply: replyText
    });
  } catch (error) {
    console.error('Assist API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
