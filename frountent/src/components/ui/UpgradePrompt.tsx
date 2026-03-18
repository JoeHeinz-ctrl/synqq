import { AlertCircle, Crown } from "lucide-react";
import { cn } from "../../lib/utils";

interface UpgradePromptProps {
  message?: string;
  className?: string;
  onUpgrade?: () => void;
}

export function UpgradePrompt({ 
  message = "You've reached the free tier limit. Upgrade to Premium for unlimited access!",
  className,
  onUpgrade 
}: UpgradePromptProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default behavior - navigate to pricing page
      window.location.href = '/pricing';
    }
  };

  return (
    <div className={cn(
      "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Crown className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Upgrade to Premium
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              PRO
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {message}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              ✓ Unlimited personal projects<br />
              ✓ Unlimited groups<br />
              ✓ Unlimited group projects
            </div>
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LimitAlertProps {
  type: 'personal_projects' | 'groups' | 'group_projects';
  className?: string;
}

export function LimitAlert({ type, className }: LimitAlertProps) {
  const getLimitMessage = () => {
    switch (type) {
      case 'personal_projects':
        return "You've reached the limit of 3 personal projects. Upgrade to create unlimited projects!";
      case 'groups':
        return "You've reached the limit of 1 group. Upgrade to create unlimited groups!";
      case 'group_projects':
        return "You've reached the limit of 1 group project. Upgrade to create unlimited group projects!";
    }
  };

  return (
    <div className={cn(
      "bg-red-50 border border-red-200 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Limit Reached
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {getLimitMessage()}
          </p>
          <div className="mt-3">
            <UpgradePrompt 
              message="Unlock unlimited features with Premium"
              className="bg-white border-red-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
