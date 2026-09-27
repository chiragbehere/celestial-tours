'use client';

export default function BudgetBar({
  budgetTotal = 30000,
  stayCost = 0,
  transportCost = 0,
  activityCost = 0,
  className = ''
}) {
  const totalUsed = stayCost + transportCost + activityCost;
  const remaining = Math.max(0, budgetTotal - totalUsed);
  const isOverBudget = totalUsed > budgetTotal;

  const stayPct = Math.min(100, Math.round((stayCost / budgetTotal) * 100));
  const transportPct = Math.min(100 - stayPct, Math.round((transportCost / budgetTotal) * 100));
  const activityPct = Math.min(100 - stayPct - transportPct, Math.round((activityCost / budgetTotal) * 100));

  return (
    <div className={`budget-bar-container ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Live Budget Tracker</span>
          {isOverBudget ? (
            <span className="badge badge-error">
              +₹{(totalUsed - budgetTotal).toLocaleString('en-IN')} Over Budget
            </span>
          ) : (
            <span className="badge badge-success">
              ₹{remaining.toLocaleString('en-IN')} Remaining
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-accent">
            ₹{totalUsed.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-secondary"> / ₹{budgetTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="budget-bar-track">
        <div
          className="budget-bar-segment budget-bar-stay"
          style={{ width: `${stayPct}%` }}
          title={`Stay: ₹${stayCost.toLocaleString('en-IN')}`}
        />
        <div
          className="budget-bar-segment budget-bar-transport"
          style={{ width: `${transportPct}%` }}
          title={`Transport: ₹${transportCost.toLocaleString('en-IN')}`}
        />
        <div
          className="budget-bar-segment budget-bar-activity"
          style={{ width: `${activityPct}%` }}
          title={`Activities: ₹${activityCost.toLocaleString('en-IN')}`}
        />
      </div>

      {/* Legend & Category breakdown */}
      <div className="budget-bar-legend">
        <div className="budget-legend-item">
          <span className="budget-legend-dot" style={{ background: 'var(--color-accent-primary)' }} />
          <span>Stay: <strong>₹{stayCost.toLocaleString('en-IN')}</strong> ({stayPct}%)</span>
        </div>
        <div className="budget-legend-item">
          <span className="budget-legend-dot" style={{ background: 'var(--color-accent-secondary)' }} />
          <span>Transport: <strong>₹{transportCost.toLocaleString('en-IN')}</strong> ({transportPct}%)</span>
        </div>
        <div className="budget-legend-item">
          <span className="budget-legend-dot" style={{ background: 'var(--color-accent-tertiary)' }} />
          <span>Activities: <strong>₹{activityCost.toLocaleString('en-IN')}</strong> ({activityPct}%)</span>
        </div>
      </div>
    </div>
  );
}
