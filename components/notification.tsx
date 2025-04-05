import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  XCircle,
  Users,
  ClipboardList
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the notification type
interface Notification {
  id: number;
  type: 'project_request' |  'task_assigned';
  title: string;
  message: string;
  time: string;
  read: boolean;
  projectId?: string;
  userId?: string;
  taskId?: string;
}

// Props for NotificationItem
interface NotificationItemProps {
  notification: Notification;
  onRead: (id: number) => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

const NotificationSystem: React.FC = () => {
  // Mock data for notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'project_request',
      title: 'Project Join Request',
      message: 'Alex Wang wants to join your project "E-commerce Redesign"',
      time: '10 minutes ago',
      read: false,
      projectId: 'p1',
      userId: 'u1',
    },
    {
      id: 2,
      type: 'project_request',
      title: 'Project Join Request',
      message: 'Sarah Miller wants to join your project "Dashboard Analytics"',
      time: '1 hour ago',
      read: false,
      projectId: 'p2',
      userId: 'u2',
    },
   
    {
      id: 6,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'You have been assigned "Fix navigation bugs" in Dashboard Analytics',
      time: '3 days ago',
      read: true,
      projectId: 'p2',
      taskId: 't2',
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const handleAcceptRequest = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    alert('Request accepted!');
  };

  const handleRejectRequest = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    alert('Request rejected.');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative p-2">
            <Bell size={20} />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-red-500">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-0 h-auto"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
              <TabsTrigger value="requests">Join Requests</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-64">
              <TabsContent value="all">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={handleNotificationRead}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </TabsContent>

             

              <TabsContent value="requests">
                {notifications.filter((n) => n.type === 'project_request').length > 0 ? (
                  notifications
                    .filter((n) => n.type === 'project_request')
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={handleNotificationRead}
                        onAccept={handleAcceptRequest}
                        onReject={handleRejectRequest}
                      />
                    ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No pending requests
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onAccept,
  onReject,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    setExpanded(!expanded);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'project_request':
        return <Users className="text-blue-500" size={16} />;
      case 'task_assigned':
        return <ClipboardList className="text-purple-500" size={16} />;
      default:
        return <Bell className="text-gray-500" size={16} />;
    }
  };

  return (
    <div
      className={`border-b last:border-0 ${
        notification.read ? 'bg-white' : 'bg-blue-50'
      }`}
      onClick={toggleExpand}
    >
      <div className="p-3 cursor-pointer flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium">{notification.title}</h4>
            <span className="text-xs text-gray-500">{notification.time}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>

          {expanded && notification.type === 'project_request' && (
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(notification.id);
                }}
              >
                <CheckCircle size={14} className="mr-1" /> Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(notification.id);
                }}
              >
                <XCircle size={14} className="mr-1" /> Reject
              </Button>
            </div>
          )}

          {expanded && notification.type === 'task_assigned' && (
            <div className="mt-2">
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Viewing task details...');
                }}
              >
                View Task
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;