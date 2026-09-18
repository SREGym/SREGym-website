export interface ResearchHighlightData {
  study: string;
  baseline: { label: string; passed: number; total: number };
  comparison: { label: string; passed: number; total: number };
  sample: string;
  caveat: string;
}

export function ResearchHighlight({
  data,
  compact = false,
}: {
  data: ResearchHighlightData;
  compact?: boolean;
}) {
  const baselineRate = (data.baseline.passed / data.baseline.total) * 100;
  const comparisonRate = (data.comparison.passed / data.comparison.total) * 100;
  const difference = comparisonRate - baselineRate;

  return (
    <aside
      className={`research-highlight ${compact ? "research-highlight-compact" : ""}`}
      aria-label={`${data.study} results summary`}
    >
      <div className="research-highlight-heading">
        <span className="blog-eyebrow">{data.study}</span>
        <span className="blog-muted font-mono text-xs">Pass rate</span>
      </div>
      <div className="research-metrics">
        {[data.baseline, data.comparison].map((condition, index) => {
          const rate = (condition.passed / condition.total) * 100;
          return (
            <div
              key={condition.label}
              className={
                index === 1
                  ? "research-metric research-metric-accent"
                  : "research-metric"
              }
            >
              <div className="blog-muted text-sm">{condition.label}</div>
              <div className="research-number">
                {rate.toFixed(0)}
                <span>%</span>
              </div>
              <div className="research-bar" aria-hidden="true">
                <span style={{ width: `${rate}%` }} />
              </div>
              <div className="blog-muted mt-2 font-mono text-xs">
                {condition.passed}/{condition.total} attempts
              </div>
            </div>
          );
        })}
      </div>
      <div className="research-highlight-footer">
        <span className="font-medium">
          {difference > 0 ? "+" : ""}
          {Number(difference.toFixed(1))} percentage points
        </span>
        <span className="blog-muted text-xs">{data.sample}</span>
      </div>
      <p className="blog-muted research-caveat">{data.caveat}</p>
    </aside>
  );
}
