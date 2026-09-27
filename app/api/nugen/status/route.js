import { NextResponse } from 'next/server';
import { verifyNugenConnection } from '@/lib/ai/nugen';

export async function GET() {
  const result = await verifyNugenConnection();
  const rawKey = process.env.NUGEN_API_KEY || '';
  const maskedKey = rawKey ? `${rawKey.slice(0, 8)}...${rawKey.slice(-4)}` : 'Not set';

  return NextResponse.json({
    success: true,
    nugen: {
      ...result,
      keyMasked: maskedKey,
      domainDocument: 'celestial_tours_domain_knowledge.md',
      alignmentTarget: 'Autonomous Tourism Operations & Personalized Travel Synthesis'
    }
  });
}
