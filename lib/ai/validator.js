export function validateItinerary(itinerary, preferences, inventory) {
  const issues = [];
  let calculatedCost = 0;
  let isValid = true;

  if (!itinerary || !Array.isArray(itinerary.days)) {
    return {
      isValid: false,
      issues: ["Itinerary structure missing days array."],
      calculatedCost: 0
    };
  }

  const budgetCeiling = preferences?.budget_total || 50000;

  itinerary.days.forEach((day, dayIdx) => {
    const dayNumber = day.day_number || dayIdx + 1;
    let lastEndTime = null;

    if (!Array.isArray(day.items)) {
      issues.push(`Day ${dayNumber} has no items.`);
      return;
    }

    day.items.forEach((item, itemIdx) => {
      // 1. Cost check
      const itemCost = Number(item.cost) || 0;
      calculatedCost += itemCost;

      // 2. Time overlap check
      if (item.start_time && item.end_time) {
        if (item.start_time >= item.end_time) {
          issues.push(`Day ${dayNumber}, Item "${item.name}": start time (${item.start_time}) is after or equal to end time (${item.end_time}).`);
        }

        if (lastEndTime && item.start_time < lastEndTime) {
          issues.push(`Day ${dayNumber}, Item "${item.name}": overlaps with preceding activity (starts at ${item.start_time} before previous ended at ${lastEndTime}).`);
        }

        lastEndTime = item.end_time;
      }

      // 3. Opening hours check for activities
      if (item.item_type === 'activity' && item.entity_id) {
        const activityRecord = inventory.activities?.find(a => a.id === item.entity_id);
        if (activityRecord && activityRecord.opening_time && activityRecord.closing_time) {
          if (item.start_time && item.start_time < activityRecord.opening_time) {
            issues.push(`Day ${dayNumber}, Activity "${item.name}": scheduled at ${item.start_time} before venue opens at ${activityRecord.opening_time}.`);
          }
          if (item.end_time && item.end_time > activityRecord.closing_time) {
            issues.push(`Day ${dayNumber}, Activity "${item.name}": scheduled until ${item.end_time} after venue closes at ${activityRecord.closing_time}.`);
          }
        }
      }
    });
  });

  // 4. Budget check
  if (calculatedCost > budgetCeiling * 1.15) { // allow 15% margin or flag
    issues.push(`Total cost (₹${calculatedCost.toLocaleString('en-IN')}) exceeds budget ceiling (₹${budgetCeiling.toLocaleString('en-IN')}) by ₹${(calculatedCost - budgetCeiling).toLocaleString('en-IN')}.`);
    isValid = false;
  }

  if (issues.length > 0 && !isValid) {
    isValid = false;
  } else if (issues.length > 0) {
    // minor warnings
    isValid = true;
  }

  return {
    isValid,
    issues,
    calculatedCost,
    budgetUtilizationPct: Math.round((calculatedCost / budgetCeiling) * 100)
  };
}
