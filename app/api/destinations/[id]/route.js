import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

// Destination visual galleries & curated local highlights
const destinationGalleries = {
  'dest-goa': [
    { title: 'Palolem Crescent Beach & Shacks', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80', caption: 'Golden sands & turquoise tides' },
    { title: 'Fontainhas Portuguese Latin Quarter', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80', caption: '18th-century yellow & azure heritage homes' },
    { title: 'Grand Island Underwater Reef', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80', caption: 'PADI dive sanctuary & coral heads' },
    { title: 'Mandovi River Luxury Catamaran', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', caption: 'Sunset champagne cruise with Goan brass band' }
  ],
  'dest-manali': [
    { title: 'Solang Valley Alpine Glades', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80', caption: 'Paragliding over deodar evergreen pine valleys' },
    { title: 'Rohtang Pass High Glacier', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', caption: 'Year-round snow panorama at 13,058 ft' },
    { title: 'Old Manali Apple Orchards & Cafes', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80', caption: 'Wooden havelis, trout cafes & artisanal bakeries' },
    { title: 'Jogini Waterfall Pine Trail', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', caption: 'Cascading alpine spring with sacred Himalayan shrine' }
  ],
  'dest-jaipur': [
    { title: 'Amber Fort Royal Ramparts', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80', caption: 'Sheesh Mahal mirror mosaics & hilltop bastions' },
    { title: 'Hawa Mahal Honeycomb Facade', image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=800&auto=format&fit=crop&q=80', caption: '953 carved pink sandstone jharokhas' },
    { title: 'City Palace Peacock Courtyard', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80', caption: 'Maharaja state apartments & heirloom armory' },
    { title: 'Nahargarh Sunset Fort Terrace', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&auto=format&fit=crop&q=80', caption: 'Panoramic Pink City glow with royal chai' }
  ],
  'dest-munnar': [
    { title: 'Kolukkumalai Sunrise Tea Highlands', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80', caption: 'Worlds highest organic orthodox tea plantation' },
    { title: 'Eravikulam Nilgiri Tahr Sanctuary', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80', caption: 'Rolling shola grasslands & rare mountain goats' },
    { title: 'Kundala Dam Pedal Boating', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', caption: 'Mirror lake enveloped by aromatic eucalyptus forests' },
    { title: 'Attukad Waterfall Mist Canopy', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', caption: 'Rushing stream through cardamom plantations' }
  ]
};

// Fallback photos for any other destination
const fallbackGallery = [
  { title: 'Heritage Sanctuary & Historic Quarter', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80', caption: 'Centuries of preserved architecture & lore' },
  { title: 'Signature Regional Dining & Flavors', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80', caption: 'Handmade local spices & slow-cooked delicacy' },
  { title: 'Scenic Landscape & Sunset Vista', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', caption: 'Untouched panoramic viewpoints' },
  { title: 'Artisan Craft & Night Markets', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80', caption: 'Vibrant local weavers, sculptors & musicians' }
];

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    let destination = db.getDestinationById(id);

    // If id passed is destination name like "Goa" instead of "dest-goa"
    if (!destination) {
      destination = db.getDestinations().find(d => d.name.toLowerCase() === id.toLowerCase());
    }

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const hotels = db.getHotelsByDestination(destination.id);
    const activities = db.getActivitiesByDestination(destination.id);
    const transport = db.getTransportByDestination(destination.id);

    // Matching tour plan if any
    const tourPlans = db.getAllTourPlans().filter(p => 
      p.destinations && p.destinations.some(d => d.toLowerCase() === destination.name.toLowerCase())
    );

    const gallery = destinationGalleries[destination.id] || [
      { title: `${destination.name} Panorama`, image: destination.image_url, caption: destination.tagline },
      ...fallbackGallery.slice(1)
    ];

    return NextResponse.json({
      success: true,
      destination,
      hotels,
      activities,
      transport,
      matchingTours: tourPlans,
      gallery,
      weather: {
        temp: destination.tags.includes('hill-station') || destination.tags.includes('snow') ? '16°C' : '28°C',
        condition: destination.tags.includes('hill-station') ? 'Misty & Fresh Alpine Breeze' : 'Sunny & Gentle Sea Breeze',
        airQuality: 'Good (AQI 42)',
        bestMonths: destination.best_season
      }
    });
  } catch (err) {
    console.error('Error fetching destination details:', err);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
