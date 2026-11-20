export interface SkeletonProps {
  variant?: "text" | "card";
  /** Text variant only. Default 3. */
  lines?: number;
}

export function Skeleton({ variant = "text", lines = 3 }: SkeletonProps) {
  if (variant === "card") {
    return (
      <div className="cr-skel-card" aria-hidden="true">
        <span className="cr-skel" style={{ width: "30%" }} />
        <span className="cr-skel cr-skel--lg" style={{ width: "70%" }} />
        <span className="cr-skel cr-skel--lg" style={{ width: "55%" }} />
        <span className="cr-skel" style={{ width: "45%" }} />
      </div>
    );
  }
  return (
    <div className="cr-skel-text" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="cr-skel" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}
