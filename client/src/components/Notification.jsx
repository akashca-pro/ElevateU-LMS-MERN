import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import socket, { registerSocket } from "@/services/socketClient";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { useUserLoadNotificationsQuery,  useUserReadNotificationsMutation} from '@/services/userApi/userProfileApi.js';
import { useTutorLoadNotificationsQuery, useTutorReadNotificationsMutation} from '@/services/TutorApi/tutorProfileApi';
import { useAdminLoadNotificationsQuery, useAdminReadNotificationsMutation } from '@/services/adminApi/adminProfileApi';
import { Link } from "react-router-dom";

const Notification = ({ userId, role }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

let queryResult;
let readNotificationQuery;

(() => {
  switch (role) {
    case 'user': { 
      queryResult = useUserLoadNotificationsQuery();
      [readNotificationQuery,] = useUserReadNotificationsMutation();
      break;  
    }

    case 'tutor': {
      queryResult = useTutorLoadNotificationsQuery();
      [readNotificationQuery] = useTutorReadNotificationsMutation();
      break;
    }

    case 'admin': {
      queryResult = useAdminLoadNotificationsQuery();
      [readNotificationQuery] = useAdminReadNotificationsMutation();
      break;
    }

    default: {
      queryResult = { data: null };
      readNotificationQuery = null;
    }
  }
})();

  useEffect(() => {

    const apiNotifications = queryResult.data?.data || [];
    const transformed = apiNotifications.map(notification => ({
      ...notification,
      isRead: notification.isRead || false, 
    }));
    queryResult.refetch();
    setNotifications(transformed);
    setUnreadCount(transformed.filter(n => !n.isRead).length);
  }, [queryResult.data]);

  
  useEffect(() => {
    registerSocket(userId, role);

    socket.on("newNotification", (notification) => {
      setNotifications(prev => [{
        ...notification,
      }, ...prev]);
      setUnreadCount(count => count + 1);
    });

    return () => socket.off("newNotification");
  }, [userId, role]);

  const handleMarkAllAsRead = async() => {
    
    try {
      const updatedNotifications = notifications.map((n) => ({...n , isRead : true}))
      setNotifications(updatedNotifications)
      await readNotificationQuery({ notification_id : notifications }).unwrap()
      setUnreadCount(0)
    } catch (error) {
      console.log(error)
    }
  };

  const handleMarkAsRead = async(index) => {
    try {
      const updatedNotifications = [...notifications];
      updatedNotifications[index].isRead = true;
      setNotifications(updatedNotifications) 
      console.log(notifications)
      await readNotificationQuery({ notification_id : notifications[index] }).unwrap()
      setUnreadCount((prev)=>prev - 1)
    } catch (error) {
      console.log(error);
    }
  };

  // Get notification type color
  const getNotificationTypeColor = (type) => {
    const colors = {
      publish_request: "bg-blue-500",
      verify_profile: "bg-purple-500",
      new_enrollment: "bg-green-500",
      payment_update: "bg-green-500",
      publish_course: "bg-blue-500",
      suspend_course:"bg-yellow-500",
      suspension_removed : "bg-green-500",
      withdraw_request : "bg-yellow-500",
      withdraw_rejected : 'bg-red-500',
      withdraw_approved : 'bg-green-500',
      default: "bg-gray-500",
    };
    return colors[type] || colors.default;
  };

  // Get notification type badge
  const getNotificationTypeBadge = (type) => {
    const badges = {
      publish_request: { label: "Course Request", variant: "blue" },
      verify_profile: { label: "Profile", variant: "purple" },
      new_enrollment: { label: "Enrollment", variant: "green" },
      payment_update: { label: "Payment", variant: "green" },
      publish_course: { label: "Course approved", variant: "blue" },
      suspend_course : { label : "Course suspended", variant : "yellow" },
      suspension_removed : { label : "Suspention removed", variant : "green" },
      withdraw_request : { label : "withdraw_request", variant : "yellow" },
      withdraw_rejected : { label : "withdraw_rejected", variant : "red" },
      withdraw_approved : { label : "withdraw_approved", variant : "green" },
      default: { label: "Notification", variant: "default" },
    };

    const badgeInfo = badges[type] || badges.default;

    return (
      <Badge
        variant="outline"
        className={`text-xs font-normal bg-${badgeInfo.variant}-100 text-${badgeInfo.variant}-800 border-${badgeInfo.variant}-200`}
      >
        {badgeInfo.label}
      </Badge>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
  <Link to={`#`} className="hidden text-gray-600 hover:text-purple-600 md:block relative">
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Bell className="h-6 w-6" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px] h-5"
          >
            {unreadCount}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </Link>
</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-lg font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-8 text-blue-600 hover:text-blue-800"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                <Bell className="h-6 w-6 text-gray-600 hover:text-purple-600 md:block" />
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 hover:bg-gray-50 ${notification.isRead ? "" : "bg-blue-50/50"}`}
                    onClick={() => handleMarkAsRead(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getNotificationTypeColor(notification.type)}`}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm ${notification.isRead ? "text-gray-700" : "text-gray-900 font-medium"}`}>
                            {notification.message}
                          </p>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-blue-600 -mr-2 -mt-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(index);
                              }}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          {getNotificationTypeBadge(notification.type)}
                          <span className="text-xs text-gray-400">
                            {notification.createdAt
                              ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        <div className="p-3 border-t text-center">
          <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;