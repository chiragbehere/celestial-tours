export function Skeleton({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function ItinerarySkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <Skeleton style={{ height: '32px', width: '280px', borderRadius: '8px' }} />
        <Skeleton style={{ height: '24px', width: '120px', borderRadius: '9999px' }} />
      </div>
      <div className="itinerary-timeline">
        {[1, 2, 3].map((d) => (
          <div key={d} className="itinerary-day">
            <div className="itinerary-day-header">
              <Skeleton style={{ height: '24px', width: '100px' }} />
              <Skeleton style={{ height: '16px', width: '60px' }} />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton style={{ height: '110px', borderRadius: '12px' }} />
              <Skeleton style={{ height: '90px', borderRadius: '12px' }} />
              <Skeleton style={{ height: '110px', borderRadius: '12px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
