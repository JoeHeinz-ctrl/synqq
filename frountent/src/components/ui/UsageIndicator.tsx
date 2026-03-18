import { useSubscription } from "../../context/SubscriptionContext";
import { cn } from "../../lib/utils";

interface UsageIndicatorProps {
  type: 'personal_projects' | 'groups' | 'group_projects';
  className?: string;
}

export function UsageIndicator({ type, className }: UsageIndicatorProps) {
  const { usageStats, limits, isLoading } = useSubscription();

  if (isLoading || !usageStats || !limits) {
    return (
      <div className={cn("text-sm text-gray-500", className)}>
        Loading...
      </div>
    );
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
        return 'Personal Projects';
      case 'groups':
        return 'Groups';
      case 'group_projects':
        return 'Group Projects';
    }
  };

  const getRemainingText = () => {
    if (isUnlimited) return 'Unlimited';
    const remaining = Math.max(0, limit - used);
    return `${remaining} left`;
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{getLabel()}</span>
        <span className={cn(
          "text-xs",
          isAtLimit ? "text-red-500" : 
          isNearLimit ? "text-yellow-500" : 
          "text-gray-500"
        )}>
          {getRemainingText()}
        </span>
      </div>
      
      {!isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              isAtLimit ? "bg-red-500" : 
              isNearLimit ? "bg-yellow-500" : 
              "bg-blue-500"
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        {used} / {isUnlimited ? "∞" : limit}
      </div>
    </div>
  );
}
