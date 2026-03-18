import { useSubscription } from "../../context/SubscriptionContext";
import { cn } from "../../lib/utils";

interface UsageIndicatorProps {
  type: 'personal_projects' | 'teams' | 'team_projects';
  className?: string;
  compact?: boolean;
}

export function UsageIndicator({ type, className, compact = false }: UsageIndicatorProps) {
  const { usageStats, limits, isLoading } = useSubscription();

  if (isLoading || !usageStats || !limits) {
    return null;
  }

  const used = usageStats[type].used;
  const limit = limits[type];
  const isUnlimited = limit === "unlimited";
  const percentage = isUnlimited ? 0 : (used / limit) * 100;
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && used >= limit;

  const getLabel = () => {
    switch (type) {
      case 'personal_projects':
        return 'Personal';
      case 'teams':
        return 'Teams';
      case 'team_projects':
        return 'Team Projects';
    }
  };

  if (compact) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        isAtLimit ? "bg-red-500/20 text-red-400" : 
        isNearLimit ? "bg-yellow-500/20 text-yellow-400" : 
        "bg-blue-500/20 text-blue-400",
        className
      )}>
        <span>{getLabel()}</span>
        <span className="opacity-70">{used}{isUnlimited ? '' : `/${limit}`}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-gray-500">{getLabel()}:</span>
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isAtLimit ? "text-red-400" : 
        isNearLimit ? "text-yellow-400" : 
        "text-blue-400"
      )}>
        <span>{used}</span>
        {!isUnlimited && <span className="opacity-50">/{limit}</span>}
      </div>
    </div>
  );
}
