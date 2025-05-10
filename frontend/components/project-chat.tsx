"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send, PaperclipIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isCurrentUser: boolean
}

interface ProjectChatProps {
  projectId: string
}

export default function ProjectChat({ projectId }: ProjectChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "John Doe",
      content: "Hey team, I've started working on the authentication module.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isCurrentUser: false,
    },
    {
      id: "2",
      sender: "Jane Smith",
      content: "Great! I'll handle the UI components for the dashboard.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isCurrentUser: false,
    },
    {
      id: "3",
      sender: "You",
      content:
        "I'll take care of the API integration. Let me know if you need any help with the authentication module, John.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isCurrentUser: true,
    },
    {
      id: "4",
      sender: "John Doe",
      content: "Thanks! I might need some help with the password reset functionality.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isCurrentUser: false,
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <Card className="flex-grow bg-zinc-900 border-zinc-800 overflow-hidden flex flex-col">
        <CardContent className="p-4 flex-grow overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.isCurrentUser ? "justify-end" : "justify-start")}>
                <div className={cn("flex max-w-[80%]", message.isCurrentUser ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className={cn("h-8 w-8", message.isCurrentUser ? "ml-2" : "mr-2")}>
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback>{message.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div>
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        message.isCurrentUser ? "bg-pink-500 text-white" : "bg-zinc-800 text-white",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div
                      className={cn(
                        "flex mt-1 text-xs text-muted-foreground",
                        message.isCurrentUser ? "justify-end" : "justify-start",
                      )}
                    >
                      <span>
                        {message.sender} • {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-zinc-800 border-zinc-700">
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              className="bg-zinc-800 border-zinc-700"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button className="bg-pink-500 hover:bg-pink-600" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

