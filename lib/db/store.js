import { initialDestinations, initialHotels, initialActivities, initialTransport } from '../seedData';

const seedDemoTour = {
  id: "tour-goa-signature",
  tour_name: "Goa 4-Day Coastal Signature Experience",
  destinations: ["Goa"],
  status: "active",
  duration_days: 4,
  start_date: "2026-10-05",
  end_date: "2026-10-09",
  budget_total: 60000,
  total_cost: 41200,
  group_size: 2,
  accommodation_tier: "premium",
  pace: "relaxed",
  coordinator_id: "coord-1",
  operator_name: "Coastal Haven DMC",
  image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
  lead_traveler: "Aditi Sharma",
  lead_phone: "+91 98765 43210",
  lead_email: "aditi.sharma@example.com",
  created_at: new Date(Date.now() - 86400000).toISOString(),
  updated_at: new Date().toISOString()
};

const seedDemoTourManali = {
  id: "tour-manali-adventure",
  tour_name: "Manali 5-Day Alpine Peaks & Solang Valley Trek",
  destinations: ["Manali"],
  status: "active",
  duration_days: 5,
  start_date: "2026-10-15",
  end_date: "2026-10-20",
  budget_total: 48000,
  total_cost: 36500,
  group_size: 4,
  accommodation_tier: "standard",
  pace: "moderate",
  coordinator_id: "coord-2",
  operator_name: "Himalayan Trails & Safaris",
  image_url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
  lead_traveler: "Rohan Varma",
  lead_phone: "+91 98123 45678",
  lead_email: "rohan.v@example.com",
  created_at: new Date(Date.now() - 172800000).toISOString(),
  updated_at: new Date().toISOString()
};

const seedDemoTourRajasthan = {
  id: "tour-rajasthan-heritage",
  tour_name: "Rajasthan 6-Day Royal Forts & Maharaja Palaces",
  destinations: ["Jaipur"],
  status: "active",
  duration_days: 6,
  start_date: "2026-11-01",
  end_date: "2026-11-07",
  budget_total: 85000,
  total_cost: 64000,
  group_size: 2,
  accommodation_tier: "luxury",
  pace: "relaxed",
  coordinator_id: "coord-3",
  operator_name: "Royal Rajputana Expeditions",
  image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
  lead_traveler: "Priya Sengupta",
  lead_phone: "+91 99876 54321",
  lead_email: "priya.s@example.com",
  created_at: new Date(Date.now() - 259200000).toISOString(),
  updated_at: new Date().toISOString()
};

const seedDemoTourKerala = {
  id: "tour-kerala-backwaters",
  tour_name: "Kerala 4-Day Tea Hills & Backwaters Serenity",
  destinations: ["Munnar"],
  status: "active",
  duration_days: 4,
  start_date: "2026-11-12",
  end_date: "2026-11-16",
  budget_total: 52000,
  total_cost: 39000,
  group_size: 2,
  accommodation_tier: "premium",
  pace: "relaxed",
  coordinator_id: "coord-1",
  operator_name: "Malabar Heritage DMC",
  image_url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
  lead_traveler: "Kavita Pillai",
  lead_phone: "+91 94471 23456",
  lead_email: "kavita.p@example.com",
  created_at: new Date(Date.now() - 345600000).toISOString(),
  updated_at: new Date().toISOString()
};

const seedDemoDays = [
  { id: "day-goa-1", tour_plan_id: "tour-goa-signature", day_number: 1, date: "2026-10-05", title: "Arrival & Coastal Heritage Unwind" },
  { id: "day-goa-2", tour_plan_id: "tour-goa-signature", day_number: 2, date: "2026-10-06", title: "Islands, Coral Reefs & Scuba" },
  { id: "day-goa-3", tour_plan_id: "tour-goa-signature", day_number: 3, date: "2026-10-07", title: "Spice Sanctuaries & Latin Fontainhas" },
  { id: "day-goa-4", tour_plan_id: "tour-goa-signature", day_number: 4, date: "2026-10-08", title: "Mandovi Sunset Cruise & Departure" }
];

const seedDemoItems = [
  {
    id: "item-goa-stay",
    tour_plan_id: "tour-goa-signature",
    itinerary_day_id: "day-goa-1",
    day_number: 1,
    type: "stay",
    hotel_id: "hotel-goa-taj",
    name: "Taj Exotica Resort & Spa",
    category: "Luxury Mediterranean Villa Resort",
    location: "Benaulim Beach, South Goa",
    start_time: "14:00",
    end_time: "11:00",
    cost: 22000,
    status: "confirmed",
    depends_on: []
  },
  {
    id: "item-goa-trans-1",
    tour_plan_id: "tour-goa-signature",
    itinerary_day_id: "day-goa-1",
    day_number: 1,
    type: "transport",
    transport_id: "trans-goa-cab",
    name: "Private Innova Chauffeur Airport Transfer",
    category: "Private Luxury Cab",
    location: "Dabolim Airport to Taj Exotica",
    start_time: "12:00",
    end_time: "13:30",
    cost: 1800,
    status: "confirmed",
    depends_on: []
  },
  {
    id: "item-goa-act-scuba",
    tour_plan_id: "tour-goa-signature",
    itinerary_day_id: "day-goa-2",
    day_number: 2,
    type: "activity",
    activity_id: "act-goa-scuba",
    name: "Grande Island Scuba Diving & Dolphin Safari",
    category: "Water Sports & Adventure",
    location: "Grande Island Pier",
    start_time: "07:30",
    end_time: "13:30",
    cost: 4500,
    status: "confirmed",
    depends_on: ["item-goa-stay"]
  },
  {
    id: "item-goa-act-spice",
    tour_plan_id: "tour-goa-signature",
    itinerary_day_id: "day-goa-3",
    day_number: 3,
    type: "activity",
    activity_id: "act-goa-spice",
    name: "Sahakari Organic Spice Plantation & Traditional Feast",
    category: "Culture & Culinary",
    location: "Ponda, Central Goa",
    start_time: "10:00",
    end_time: "14:30",
    cost: 2400,
    status: "confirmed",
    depends_on: ["item-goa-stay"]
  },
  {
    id: "item-goa-act-fontainhas",
    tour_plan_id: "tour-goa-signature",
    itinerary_day_id: "day-goa-3",
    day_number: 3,
    type: "activity",
    activity_id: "act-goa-fontainhas",
    name: "Fontainhas Latin Quarter Heritage Architecture Walk",
    category: "Heritage & Photography",
    location: "Panaji Latin Quarter",
    start_time: "16:00",
    end_time: "18:30",
    cost: 1500,
    status: "confirmed",
    depends_on: ["item-goa-act-spice"]
  },
  {
    id: "item-goa-act-cruise",
    tour_plan_id: "tour-goa-signature",
    itinerary_day_id: "day-goa-4",
    day_number: 4,
    type: "activity",
    activity_id: "act-goa-cruise",
    name: "Mandovi River Luxury Catamaran Sunset Cruise",
    category: "Leisure & Nightlife",
    location: "Panjim Jetty",
    start_time: "17:00",
    end_time: "19:00",
    cost: 3000,
    status: "confirmed",
    depends_on: []
  },
  {
    id: "item-goa-trans-drop",
    tour_plan_id: "tour-goa-signature",
    itinerary_day_id: "day-goa-4",
    day_number: 4,
    type: "transport",
    transport_id: "trans-goa-cab-drop",
    name: "Private Chauffeur Return Transfer to Airport",
    category: "Private Luxury Cab",
    location: "Panaji Jetty to Dabolim Airport",
    start_time: "19:30",
    end_time: "20:45",
    cost: 1800,
    status: "confirmed",
    depends_on: ["item-goa-act-cruise"]
  }
];

const seedDemoBookings = [
  { id: "bk-goa-stay", tour_plan_id: "tour-goa-signature", itinerary_item_id: "item-goa-stay", vendor_type: "hotel", vendor_name: "Taj Exotica Resort & Spa", amount: 22000, status: "confirmed", payment_status: "paid", traveler_name: "Aditi Sharma", created_at: new Date().toISOString() },
  { id: "bk-goa-trans1", tour_plan_id: "tour-goa-signature", itinerary_item_id: "item-goa-trans-1", vendor_type: "transport", vendor_name: "Goa Chauffeur Services", amount: 1800, status: "confirmed", payment_status: "paid", traveler_name: "Aditi Sharma", created_at: new Date().toISOString() },
  { id: "bk-goa-scuba", tour_plan_id: "tour-goa-signature", itinerary_item_id: "item-goa-act-scuba", vendor_type: "activity", vendor_name: "DiveGoa Marine Center", amount: 4500, status: "confirmed", payment_status: "paid", traveler_name: "Aditi Sharma", created_at: new Date().toISOString() },
  { id: "bk-goa-spice", tour_plan_id: "tour-goa-signature", itinerary_item_id: "item-goa-act-spice", vendor_type: "activity", vendor_name: "Sahakari Plantation Estate", amount: 2400, status: "confirmed", payment_status: "paid", traveler_name: "Aditi Sharma", created_at: new Date().toISOString() },
  { id: "bk-goa-cruise", tour_plan_id: "tour-goa-signature", itinerary_item_id: "item-goa-act-cruise", vendor_type: "activity", vendor_name: "Mandovi Luxury Cruises", amount: 3000, status: "confirmed", payment_status: "paid", traveler_name: "Aditi Sharma", created_at: new Date().toISOString() }
];

const seedDemoDisruption = {
  id: "disrupt-demo-monsoon",
  tour_plan_id: "tour-goa-signature",
  tour_name: "Goa 4-Day Coastal Signature Experience",
  source: "weather",
  reason: "Indian Meteorological Dept High Surge Warning: Grande Island marine transit suspended by Port Captain.",
  affected_item_id: "item-goa-act-scuba",
  affected_item_name: "Grande Island Scuba Diving & Dolphin Safari",
  affected_item_type: "activity",
  cascade_item_ids: ["item-goa-stay"],
  cascade_details: [
    {
      id: "item-goa-stay",
      name: "Taj Exotica Resort & Spa",
      type: "stay",
      impactReason: "Traveler stranded at resort during morning scuba slot if alternative indoor experience not scheduled."
    }
  ],
  status: "detected",
  created_at: new Date(Date.now() - 3600000).toISOString()
};

// Global singleton in memory so Next.js serverless/API routes share state in local runtime
const globalStore = globalThis.__TOUR_STORE__ || {
  destinations: [...initialDestinations],
  hotels: [...initialHotels],
  activities: [...initialActivities],
  transport: [...initialTransport],
  tourPlans: [seedDemoTour, seedDemoTourManali, seedDemoTourRajasthan, seedDemoTourKerala],
  itineraryDays: [...seedDemoDays],
  itineraryItems: [...seedDemoItems],
  bookings: [...seedDemoBookings],
  disruptions: [seedDemoDisruption],
  reviews: [],
  coordinators: [
    { id: "coord-1", name: "Meera Nair", phone: "+91 98765 43210", email: "meera@celestialtours.com", active_tours: 1, base: "Goa & South Hub" },
    { id: "coord-2", name: "Vikram Chauhan", phone: "+91 98111 22334", email: "vikram@celestialtours.com", active_tours: 2, base: "Himachal & Uttarakhand Hub" },
    { id: "coord-3", name: "Ananya Deshmukh", phone: "+91 99201 55678", email: "ananya@celestialtours.com", active_tours: 0, base: "Rajasthan & Central Hub" }
  ]
};

globalThis.__TOUR_STORE__ = globalStore;

export const db = {
  // Destinations
  getDestinations: () => globalStore.destinations,
  getDestinationById: (id) => globalStore.destinations.find(d => d.id === id),
  
  // Hotels
  getHotelsByDestination: (destId) => globalStore.hotels.filter(h => h.destination_id === destId && h.available),
  getAllHotels: () => globalStore.hotels,
  getHotelById: (id) => globalStore.hotels.find(h => h.id === id),
  addHotel: (hotelData) => {
    const newHotel = {
      id: hotelData.id || `hotel-${Date.now()}`,
      available: true,
      rating: 4.8,
      ...hotelData
    };
    globalStore.hotels.unshift(newHotel);
    return newHotel;
  },
  updateHotel: (id, updates) => {
    const idx = globalStore.hotels.findIndex(h => h.id === id);
    if (idx !== -1) {
      globalStore.hotels[idx] = { ...globalStore.hotels[idx], ...updates };
      return globalStore.hotels[idx];
    }
    return null;
  },

  // Activities
  getActivitiesByDestination: (destId) => globalStore.activities.filter(a => a.destination_id === destId && a.available),
  getAllActivities: () => globalStore.activities,
  getActivityById: (id) => globalStore.activities.find(a => a.id === id),
  addActivity: (activityData) => {
    const newAct = {
      id: activityData.id || `act-${Date.now()}`,
      available: true,
      rating: 4.8,
      ...activityData
    };
    globalStore.activities.unshift(newAct);
    return newAct;
  },
  updateActivity: (id, updates) => {
    const idx = globalStore.activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      globalStore.activities[idx] = { ...globalStore.activities[idx], ...updates };
      return globalStore.activities[idx];
    }
    return null;
  },

  // Transport
  getTransportByDestination: (destId) => globalStore.transport.filter(t => t.from_destination_id === destId && t.available),
  getAllTransport: () => globalStore.transport,
  getTransportById: (id) => globalStore.transport.find(t => t.id === id),
  addTransport: (transportData) => {
    const newTrans = {
      id: transportData.id || `trans-${Date.now()}`,
      available: true,
      ...transportData
    };
    globalStore.transport.unshift(newTrans);
    return newTrans;
  },
  updateTransport: (id, updates) => {
    const idx = globalStore.transport.findIndex(t => t.id === id);
    if (idx !== -1) {
      globalStore.transport[idx] = { ...globalStore.transport[idx], ...updates };
      return globalStore.transport[idx];
    }
    return null;
  },

  // Tour Plans
  createTourPlan: (planData) => {
    const id = planData.id || `tour-${Date.now()}`;
    const newPlan = {
      id,
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...planData
    };
    globalStore.tourPlans.unshift(newPlan);
    return newPlan;
  },
  getTourPlan: (id) => globalStore.tourPlans.find(p => p.id === id),
  getAllTourPlans: () => globalStore.tourPlans,
  updateTourPlan: (id, updates) => {
    const idx = globalStore.tourPlans.findIndex(p => p.id === id);
    if (idx !== -1) {
      globalStore.tourPlans[idx] = {
        ...globalStore.tourPlans[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      return globalStore.tourPlans[idx];
    }
    return null;
  },

  // Itinerary Days & Items
  saveItinerary: (tourPlanId, days, items) => {
    globalStore.itineraryDays = globalStore.itineraryDays.filter(d => d.tour_plan_id !== tourPlanId);
    globalStore.itineraryItems = globalStore.itineraryItems.filter(i => i.tour_plan_id !== tourPlanId);
    
    globalStore.itineraryDays.push(...days);
    globalStore.itineraryItems.push(...items);
    return { days, items };
  },

  getItinerary: (tourPlanId) => {
    const days = globalStore.itineraryDays
      .filter(d => d.tour_plan_id === tourPlanId)
      .sort((a, b) => a.day_number - b.day_number);

    const items = globalStore.itineraryItems
      .filter(i => i.tour_plan_id === tourPlanId)
      .sort((a, b) => (a.slot_order || 0) - (b.slot_order || 0));

    return { days, items };
  },

  updateItineraryItem: (itemId, updates) => {
    const idx = globalStore.itineraryItems.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      globalStore.itineraryItems[idx] = { ...globalStore.itineraryItems[idx], ...updates };
      return globalStore.itineraryItems[idx];
    }
    return null;
  },

  replaceItineraryItem: (itemId, replacementItem) => {
    const idx = globalStore.itineraryItems.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      const oldItem = globalStore.itineraryItems[idx];
      oldItem.status = 'replaced';
      oldItem.replaced_by = replacementItem.id;
      globalStore.itineraryItems.push(replacementItem);
      return { oldItem, replacementItem };
    }
    return null;
  },

  // Bookings
  createBooking: (bookingData) => {
    const newBooking = {
      id: `bk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
      status: 'confirmed',
      payment_status: 'paid',
      ...bookingData
    };
    globalStore.bookings.unshift(newBooking);
    return newBooking;
  },
  getBookingsByTourPlan: (tourPlanId) => globalStore.bookings.filter(b => b.tour_plan_id === tourPlanId),
  getAllBookings: () => globalStore.bookings,
  updateBooking: (id, updates) => {
    const idx = globalStore.bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      globalStore.bookings[idx] = { ...globalStore.bookings[idx], ...updates };
      return globalStore.bookings[idx];
    }
    return null;
  },

  // Disruptions (Phase 3)
  createDisruption: (disruptionData) => {
    const newDisruption = {
      id: disruptionData.id || `disrupt-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'detected',
      ...disruptionData
    };
    // Don't add duplicate if same id exists
    const existing = globalStore.disruptions.findIndex(d => d.id === newDisruption.id);
    if (existing !== -1) {
      globalStore.disruptions[existing] = { ...globalStore.disruptions[existing], ...newDisruption };
      return globalStore.disruptions[existing];
    }
    globalStore.disruptions.unshift(newDisruption);
    return newDisruption;
  },
  getDisruptionsByTourPlan: (tourPlanId) => globalStore.disruptions.filter(d => d.tour_plan_id === tourPlanId),
  getAllDisruptions: () => globalStore.disruptions,
  getDisruptionById: (id) => globalStore.disruptions.find(d => d.id === id),
  updateDisruption: (id, updates) => {
    const idx = globalStore.disruptions.findIndex(d => d.id === id);
    if (idx !== -1) {
      globalStore.disruptions[idx] = { ...globalStore.disruptions[idx], ...updates };
      return globalStore.disruptions[idx];
    }
    return null;
  },

  // Apply chosen AI alternative & cascade update throughout tour plan and bookings
  resolveDisruptionWithAlternative: (disruptionId, alternative) => {
    const disruption = globalStore.disruptions.find(d => d.id === disruptionId);
    if (!disruption) return null;

    const tourPlan = globalStore.tourPlans.find(p => p.id === disruption.tour_plan_id);
    const affectedItem = globalStore.itineraryItems.find(i => i.id === disruption.affected_item_id);

    if (affectedItem && alternative.replacement) {
      const rep = alternative.replacement;
      const newItem = {
        id: `item-rep-${Date.now()}`,
        tour_plan_id: disruption.tour_plan_id,
        itinerary_day_id: affectedItem.itinerary_day_id,
        day_number: affectedItem.day_number,
        type: affectedItem.type,
        name: rep.name,
        category: rep.category || affectedItem.category,
        location: rep.location || affectedItem.location,
        start_time: rep.start_time || affectedItem.start_time,
        end_time: rep.end_time || affectedItem.end_time,
        cost: rep.cost !== undefined ? rep.cost : affectedItem.cost,
        status: 'confirmed',
        notes: `AI Replan Replacement: ${alternative.title}`,
        depends_on: affectedItem.depends_on || []
      };

      // Mark old item replaced
      affectedItem.status = 'replaced';
      affectedItem.replaced_by = newItem.id;
      globalStore.itineraryItems.push(newItem);

      // Update bookings: cancel old booking, add replacement booking
      const oldBk = globalStore.bookings.find(b => b.itinerary_item_id === affectedItem.id);
      if (oldBk) {
        oldBk.status = 'cancelled';
        oldBk.notes = `Disruption Replaced: ${disruption.reason}`;
      }

      globalStore.bookings.unshift({
        id: `bk-rep-${Date.now()}`,
        tour_plan_id: disruption.tour_plan_id,
        itinerary_item_id: newItem.id,
        vendor_type: newItem.type,
        vendor_name: newItem.name,
        amount: newItem.cost,
        status: 'confirmed',
        payment_status: 'paid',
        traveler_name: tourPlan?.lead_traveler || 'Traveler',
        created_at: new Date().toISOString()
      });

      // Recalculate total tour cost
      if (tourPlan) {
        const activeItems = globalStore.itineraryItems.filter(
          i => i.tour_plan_id === tourPlan.id && i.status !== 'replaced' && i.status !== 'cancelled'
        );
        tourPlan.total_cost = activeItems.reduce((sum, i) => sum + (i.cost || 0), 0);
        tourPlan.updated_at = new Date().toISOString();
      }
    }

    // Mark disruption resolved
    disruption.status = 'resolved';
    disruption.resolved_at = new Date().toISOString();
    disruption.chosen_alternative = alternative.title;

    return { success: true, disruption, tourPlan };
  },

  // Coordinators
  getCoordinators: () => globalStore.coordinators,
  assignCoordinator: (tourPlanId, coordinatorId) => {
    const plan = globalStore.tourPlans.find(p => p.id === tourPlanId);
    if (plan) {
      plan.coordinator_id = coordinatorId;
      plan.updated_at = new Date().toISOString();
      return plan;
    }
    return null;
  },

  // Aggregate stats for Operator Dashboard
  getOperatorStats: () => {
    const activeTours = globalStore.tourPlans.filter(p => p.status === 'active' || p.status === 'booked' || p.status === 'planned').length;
    const pendingBookings = globalStore.bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = globalStore.bookings.filter(b => b.status === 'confirmed').length;
    const unresolvedAlerts = globalStore.disruptions.filter(d => d.status === 'detected' || d.status === 'alternatives_generated').length;
    const totalVendors = globalStore.hotels.length + globalStore.activities.length + globalStore.transport.length;

    return {
      activeTours,
      pendingBookings,
      confirmedBookings,
      unresolvedAlerts,
      totalVendors,
      totalTours: globalStore.tourPlans.length
    };
  },

  // Reviews (FR9)
  createReview: (reviewData) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...reviewData
    };
    globalStore.reviews.unshift(newReview);
    return newReview;
  },
  getReviewsByTourPlan: (tourPlanId) => globalStore.reviews.filter(r => r.tour_plan_id === tourPlanId),

  // Vendors & Settlements Management
  getVendors: () => {
    const hotelVendors = (globalStore.hotels || []).map(h => ({
      id: h.id,
      name: h.name || 'Hotel Partner',
      category: 'Hospitality / Resort',
      destination: h.destination || 'Goa',
      rating: h.rating || 4.8,
      contact_person: `${(h.name || 'Hotel').split(' ')[0]} Front Desk`,
      phone: '+91 98230 ' + Math.floor(10000 + Math.random() * 90000),
      email: `reservations@${h.id || 'hotel'}.in`,
      contract_status: 'active',
      sla_score: 98,
      pending_payout: Math.floor((h.price_per_night || 5000) * 1.8),
      settled_payout: Math.floor((h.price_per_night || 5000) * 8.5)
    }));

    const activityVendors = (globalStore.activities || []).map(a => ({
      id: a.id,
      name: a.name || 'Activity Partner',
      category: 'Experience & Excursions',
      destination: a.destination || 'Goa',
      rating: a.rating || 4.7,
      contact_person: `Ops Lead (${(a.name || 'Experience').split(' ')[0]})`,
      phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
      email: `ops@${a.id || 'activity'}.in`,
      contract_status: 'active',
      sla_score: 96,
      pending_payout: Math.floor((a.cost || 2000) * 3),
      settled_payout: Math.floor((a.cost || 2000) * 12)
    }));

    const transportVendors = (globalStore.transport || []).map(t => ({
      id: t.id,
      name: t.name || 'Transport Partner',
      category: 'Fleet & Chauffeur Services',
      destination: t.destination || 'Goa',
      rating: 4.8,
      contact_person: `Dispatch Manager (${(t.name || 'Fleet').split(' ')[0]})`,
      phone: '+91 99100 ' + Math.floor(10000 + Math.random() * 90000),
      email: `fleet@${t.id || 'transport'}.in`,
      contract_status: 'active',
      sla_score: 99,
      pending_payout: Math.floor((t.cost || 3000) * 2.2),
      settled_payout: Math.floor((t.cost || 3000) * 9.4)
    }));

    const custom = globalStore.customVendors || [];
    return [...custom, ...hotelVendors, ...activityVendors, ...transportVendors];
  },

  addVendor: (vendorData) => {
    if (!globalStore.customVendors) globalStore.customVendors = [];
    const id = `vnd-${Date.now()}`;
    const newVendor = {
      id,
      name: vendorData.name,
      category: vendorData.category || 'Hospitality / Resort',
      destination: vendorData.destination || 'Goa',
      rating: Number(vendorData.rating) || 4.9,
      contact_person: vendorData.contact_person || 'Operations Lead',
      phone: vendorData.phone || '+91 98200 12345',
      email: vendorData.email || `contact@${vendorData.name?.toLowerCase().replace(/\s+/g, '') || 'partner'}.com`,
      contract_status: 'active',
      sla_score: Number(vendorData.sla_score) || 98,
      pending_payout: 0,
      settled_payout: 0,
      service_rate: Number(vendorData.service_rate) || 3500
    };

    globalStore.customVendors.unshift(newVendor);

    // Sync to inventory so travelers can book it!
    const dest = (globalStore.destinations || []).find(d => d.name?.toLowerCase() === newVendor.destination?.toLowerCase()) || { id: 'dest-goa' };

    if (newVendor.category.includes('Hospitality') || newVendor.category.includes('Resort')) {
      globalStore.hotels.unshift({
        id: `hotel-${id}`,
        destination_id: dest.id,
        destination: newVendor.destination,
        name: newVendor.name,
        tier: 'premium',
        price_per_night: newVendor.service_rate,
        rating: newVendor.rating,
        available: true,
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
      });
    } else if (newVendor.category.includes('Experience') || newVendor.category.includes('Excursion')) {
      globalStore.activities.unshift({
        id: `act-${id}`,
        destination_id: dest.id,
        destination: newVendor.destination,
        name: newVendor.name,
        category: 'excursion',
        price: newVendor.service_rate,
        cost: newVendor.service_rate,
        duration_minutes: 180,
        rating: newVendor.rating,
        available: true,
        image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
      });
    } else {
      globalStore.transport.unshift({
        id: `tr-${id}`,
        from_destination_id: dest.id,
        to_destination_id: dest.id,
        destination: newVendor.destination,
        mode: 'cab',
        provider: newVendor.name,
        price: newVendor.service_rate,
        cost: newVendor.service_rate,
        available: true
      });
    }

    return newVendor;
  },

  dispatchVendorNotification: (vendorId, message) => {
    return {
      success: true,
      vendor_id: vendorId,
      dispatched_at: new Date().toISOString(),
      channel: 'WhatsApp / Webhook & SMS',
      message: message
    };
  }
};

