import { X, Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Task completed',
    message: 'Deploy the fe with renamed landing page has been marked as done',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New task assigned',
    message: 'You have been assigned to work on the user authentication system',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Deadline approaching',
    message: 'Project "Mobile App Redesign" is due in 2 days',
    time: '3 hours ago',
    read: true,
  },
];

const iconMap = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  warning: <AlertCircle className="w-4 h-4 text-amber-400" />,
  info: <Clock className="w-4 h-4 text-teal-400" />,
};

const dotMap = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  info: 'bg-teal-400',
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]"
          onClick={onClose}
        />
      )}

      {/* Panel — fixed right side, never shifts layout */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-[320px] bg-[#111111] border-l border-zinc-800/50 z-[1001] flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-800/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-100">Notifications</h2>
            <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              2
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={cn(
                'p-4 rounded-xl border transition-colors',
                n.read
                  ? 'bg-zinc-900/20 border-zinc-800/30'
                  : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{iconMap[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-100">{n.title}</span>
                    {!n.read && (
                      <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotMap[n.type])} />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-zinc-600 mt-2 block">{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-800/50 flex-shrink-0">
          <button className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
