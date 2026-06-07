"use client"

import { useState } from "react"
import { 
  Search, 
  Edit, 
  Inbox, 
  Star, 
  Archive, 
  FileText, 
  Users,
  Video,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  ArrowRight,
  HelpCircle,
  LogOut
} from "lucide-react"
import { Logo, SkillBadge, ScoreCircle } from "@/components/skillforge"
import Link from "next/link"

const conversations = [
  {
    id: 1,
    name: "Alex Rivera",
    preview: "C'est parfait, je vous envoie ça...",
    time: "14:20",
    level: 7,
    online: true,
    unread: true
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    preview: "Merci pour l'opportunité !",
    time: "Hier",
    level: 5,
    online: false,
    unread: false
  },
  {
    id: 3,
    name: "Jordan Chen",
    preview: "Le dépôt GitHub est à jour.",
    time: "24 Oct.",
    level: 8,
    online: false,
    unread: false
  }
]

const messages = [
  {
    id: 1,
    sender: "them",
    content: "Bonjour ! J'ai bien reçu votre invitation pour l'entretien technique. Serait-il possible de le décaler à 15h00 ?",
    time: "11:05"
  },
  {
    id: 2,
    sender: "me",
    content: "Bonjour Alex, aucun problème pour 15h00. J'ai mis à jour l'invitation calendrier.",
    time: "11:12",
    status: "sent"
  },
  {
    id: 3,
    sender: "them",
    content: "C'est parfait, je vous envoie ça dès que possible pour les documents complémentaires. À tout à l'heure !",
    time: "14:20"
  }
]

const sidebarItems = [
  { icon: Inbox, label: "Inbox", active: true },
  { icon: Star, label: "Starred" },
  { icon: Archive, label: "Archived" },
  { icon: FileText, label: "Drafts" },
  { icon: Users, label: "Team Chat" },
]

export function MessagingContent() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [message, setMessage] = useState("")

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Navigation */}
      <div className="w-56 border-r border-border bg-sidebar flex flex-col">
        <div className="p-4 border-b border-border">
          <Logo href="/recruiter" showSubtitle subtitle="COMMUNICATIONS" />
        </div>
        
        <div className="p-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            <Edit className="w-4 h-4" />
            New Message
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <HelpCircle className="w-5 h-5" />
            Help Center
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="w-5 h-5" />
            Log Out
          </Link>
        </div>
      </div>

      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Messages</h2>
            <button className="p-1 hover:bg-secondary rounded">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un candidat"
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-4 flex items-start gap-3 text-left hover:bg-secondary/50 transition-colors ${
                selectedConversation.id === conv.id ? "bg-secondary/50" : ""
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-foreground font-semibold">
                  {conv.name.charAt(0)}
                </div>
                {conv.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{conv.name}</span>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.preview}</p>
              </div>
              <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                L{conv.level}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-foreground font-semibold">
              {selectedConversation.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
              <p className="text-xs text-muted-foreground">Fullstack Engineer — <span className="text-success">En ligne</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-secondary rounded-lg">
              <Video className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <div className="text-center">
            <span className="px-3 py-1 text-xs bg-secondary rounded-full text-muted-foreground">
              {"AUJOURD'HUI"}
            </span>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-md ${msg.sender === "me" ? "order-2" : ""}`}>
                {msg.sender !== "me" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mb-1" />
                )}
                <div className={`px-4 py-3 rounded-lg ${
                  msg.sender === "me" 
                    ? "bg-primary/20 text-foreground" 
                    : "bg-card border border-border text-foreground"
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className={`text-xs text-muted-foreground mt-1 ${msg.sender === "me" ? "text-right" : ""}`}>
                  {msg.time} {msg.status && "• Envoyé ✓"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button className="p-2 hover:bg-secondary rounded-lg">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 bg-primary rounded-lg hover:bg-primary/90">
              <Send className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sidebar */}
      <div className="w-72 border-l border-border p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 mb-3 flex items-center justify-center text-3xl font-bold text-foreground">
            {selectedConversation.name.charAt(0)}
          </div>
          <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
          <p className="text-sm text-muted-foreground">Membre depuis Jan 2023</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs bg-secondary rounded-full text-foreground">
            Shortlisted
          </span>
        </div>

        <div className="mb-6">
          <div className="text-xs text-muted-foreground mb-2">SCORE GLOBAL</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-primary">850</span>
            <span className="text-muted-foreground">/ 1000</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs text-muted-foreground mb-2">COMPÉTENCES CERTIFIÉES</div>
          <div className="flex flex-wrap gap-2">
            <SkillBadge label="React" variant="primary" />
            <SkillBadge label="TypeScript" variant="primary" />
            <SkillBadge label="AWS" variant="warning" />
          </div>
        </div>

        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Étape</span>
            <span className="text-foreground">Entretien Tech</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Localisation</span>
            <span className="text-foreground">Paris, FR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Prétentions</span>
            <span className="text-foreground">65k - 75k €</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
          View Full Profile
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
