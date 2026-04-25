import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getUsageStats, getSubscriptionLimits } from "../services/api";
import { useAuth } from "./AuthContext";

interface UsageStats {
  subscription_tier: "free" | "premium";
  personal_projects: {
    used: number;
    limit: number | "unlimited";
  };
  teams: {
    used: number;
    limit: number | "unlimited";
  };
  team_projects: {
    used: number;
    limit: number | "unlimited";
  };
}

interface SubscriptionLimits {
  tier: "free" | "premium";
  personal_projects: number | "unlimited";
  teams: number | "unlimited";
  team_projects: number | "unlimited";
}

interface SubscriptionContextType {
  usageStats: UsageStats | null;
  limits: SubscriptionLimits | null;
  isLoading: boolean;
  refreshUsage: () => Promise<void>;
  isAtLimit: (type: 'personal_projects' | 'teams' | 'team_projects') => boolean;
  getRemainingCount: (type: 'personal_projects' | 'teams' | 'team_projects') => number | "unlimited";
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start as false
  const { isAuthenticated } = useAuth(); // Get auth status

  const refreshUsage = async () => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) {
      setUsageStats(null);
      setLimits(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [usageData, limitsData] = await Promise.all([
        getUsageStats(),
        getSubscriptionLimits()
      ]);
      
      setUsageStats(usageData);
      setLimits(limitsData);
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
      // Don't throw error, just log it
      setUsageStats(null);
      setLimits(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUsage();
  }, [isAuthenticated]); // Re-run when auth status changes

  const isAtLimit = (type: 'personal_projects' | 'teams' | 'team_projects'): boolean => {
    if (!usageStats || !limits) return false;
    
    const used = usageStats[type].used;
    const limit = limits[type];
    
    if (limit === "unlimited") return false;
    return used >= limit;
  };

  const getRemainingCount = (type: 'personal_projects' | 'teams' | 'team_projects'): number | "unlimited" => {
    if (!usageStats || !limits) return "unlimited";
    
    const used = usageStats[type].used;
    const limit = limits[type];
    
    if (limit === "unlimited") return "unlimited";
    return Math.max(0, limit - used);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        usageStats,
        limits,
        isLoading,
        refreshUsage,
        isAtLimit,
        getRemainingCount
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
