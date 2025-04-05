"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { useUserContext } from "@/lib/usercontext"

interface Notification {
  application_id: number
  applied: "user" | "admin"
  applied_at: string
  project_id: number
  remarks: string
  role: string
  status: "Pending" | "Accepted" | "Rejected"
  title: string
  user_id: number
  username?: string // Username of the requesting user
  admin_name?: string // Name of admin who sent the invitation
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const { user } = useUserContext()
  
  const userlocal = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const parsedUser = userlocal ? JSON.parse(userlocal) : null;
  const userId = user?.id ? user?.id : parsedUser?.id;
  console.log("userId", userId)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch("http://127.0.0.1:5000/notification", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Notifications:", data)
      
      if (data.notification && Array.isArray(data.notification)) {
        setNotifications(data.notification)
      } else {
        console.warn("Unexpected data structure:", data)
        setNotifications([])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError(error instanceof Error ? error.message : "Failed to load notifications")
      
      // For development: Use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        setNotifications([
          {
            application_id: 13,
            applied: "user",
            applied_at: "2025-04-02T18:17:00.583870",
            project_id: 1,
            remarks: "Interested in frontend development",
            role: "member",
            status: "Pending",
            title: "Web App Development",
            user_id: 2,
            username: "John Doe"
          },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Set up polling for notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000)
    
    return () => clearInterval(intervalId)
  }, [userId]) 

  const handleAcceptRequest = async (applicationId: number, accept: boolean) => {
    try {
      setLoading(true)
      
      // Updated API endpoint and payload structure
      const response = await fetch("http://127.0.0.1:5000/update/project/status", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id: applicationId,
          status: accept ? "Accepted" : "Rejected",
          user_id: userId,
          project_id: notifications.find(n => n.application_id === applicationId)?.project_id
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      
      // Optimistically update the UI
      setNotifications(prev => 
        prev.map(notification => 
          notification.application_id === applicationId
            ? { ...notification, status: accept ? "Accepted" : "Rejected" }
            : notification
        )
      )
      
      // Show success message
      alert(accept ? "Request accepted successfully!" : "Request rejected.")
      
    } catch (error) {
      console.error("Error processing request:", error)
      alert("Failed to process the request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const pendingNotifications = notifications.filter(n => n.status === "Pending")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingNotifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center bg-pink-500 text-white">
              {pendingNotifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-zinc-950 border-zinc-800">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h4 className="font-medium text-white">Notifications</h4>
          {pendingNotifications.length > 0 && (
            <Badge className="bg-pink-500">
              {pendingNotifications.length} new
            </Badge>
          )}
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-zinc-400">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={fetchNotifications}
            >
              Retry
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-zinc-400">
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="divide-y divide-zinc-800">
              {notifications.map((notification) => (
                <div 
                  key={notification.application_id} 
                  className={`p-4 hover:bg-zinc-900 transition-colors ${
                    notification.status === "Pending" ? "bg-zinc-900/50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">
                      {notification.title}
                    </span>
                    <Badge 
                      variant={
                        notification.status === "Accepted" ? "outline" : 
                        notification.status === "Rejected" ? "destructive" : 
                        "secondary"
                      }
                      className={
                        notification.status === "Pending" ? "bg-pink-500/20 text-pink-500 border-pink-500/20" : ""
                      }
                    >
                      {notification.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-zinc-400 mb-2">
                    {notification.applied === "admin" ? (
                      <>
                        <span className="text-pink-500">{notification.admin_name || "An admin"}</span> invited you to join <span className="text-pink-500">{notification.title}</span> as {notification.role}
                      </>
                    ) : (
                      <>
                        <span className="text-pink-500">{notification.username || "A user"}</span> requested to join <span className="text-pink-500">{notification.title}</span> as {notification.role}
                      </>
                    )}
                  </p>
                  
                  {notification.remarks && (
                    <p className="text-xs text-zinc-500 mb-2 italic">
                      "{notification.remarks}"
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {formatDistanceToNow(new Date(notification.applied_at), { addSuffix: true })}
                    </span>
                    
                    {notification.status === "Pending" && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => handleAcceptRequest(notification.application_id, false)}
                          disabled={loading}
                        >
                          <X className="h-3 w-3 mr-1" /> Reject
                        </Button>
                        <Button 
                          size="sm"
                          className="h-7 px-2 py-1 text-xs bg-pink-600 hover:bg-pink-700"
                          onClick={() => handleAcceptRequest(notification.application_id, true)}
                          disabled={loading}
                        >
                          <Check className="h-3 w-3 mr-1" /> Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}