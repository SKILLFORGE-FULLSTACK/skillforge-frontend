"use client"

import { useState } from "react"
import { Send, Mic, Image as ImageIcon, MoreVertical } from "lucide-react"

interface Message {
  id: string
  role: "ai" | "user"
  content: string
  timestamp?: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content: "Excellent choice of algorithm. BFS using a queue is the most intuitive and robust way to handle level-order traversals."
  },
  {
    id: "2", 
    role: "ai",
    content: "\"How would you optimize the space complexity if you were given a very deep, narrow tree?\""
  }
]

export function AiCoachPanel() {
  const [messages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-background/20" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Stitch AI Coach</h3>
            <p className="text-xs text-muted-foreground">ENGINEERING HUB</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
          </div>
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === "ai" 
                ? "bg-secondary/50 text-foreground" 
                : "bg-primary/20 text-foreground ml-8"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        ))}

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            Recursive approach
          </button>
          <button className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            Space analysis
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Explain your logic..."
            className="w-full px-4 py-3 pr-24 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Mic className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
