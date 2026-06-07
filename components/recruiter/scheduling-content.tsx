"use client"

import { useState } from "react"
import { Calendar, Clock, Video, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const scheduledInterviews = [
  {
    id: 1,
    candidate: "Sophie Martin",
    initials: "SM",
    position: "Senior React Developer",
    date: "15 Jan 2024",
    time: "14:00 - 15:00",
    type: "Technique",
    location: "Google Meet",
    status: "confirmed"
  },
  {
    id: 2,
    candidate: "Thomas Bernard",
    initials: "TB",
    position: "Full Stack Developer",
    date: "16 Jan 2024",
    time: "10:00 - 11:00",
    type: "RH",
    location: "Sur site",
    status: "pending"
  },
  {
    id: 3,
    candidate: "Julie Dubois",
    initials: "JD",
    position: "Backend Developer",
    date: "17 Jan 2024",
    time: "16:00 - 17:00",
    type: "Technique",
    location: "Zoom",
    status: "confirmed"
  }
]

const calendarDays = [
  { day: 13, events: 0 },
  { day: 14, events: 1 },
  { day: 15, events: 2, isToday: true },
  { day: 16, events: 1 },
  { day: 17, events: 1 },
  { day: 18, events: 0 },
  { day: 19, events: 0 }
]

export function SchedulingContent() {
  const [selectedDate, setSelectedDate] = useState(15)

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planification d&apos;entretiens</h1>
          <p className="text-muted-foreground">Gerez vos entretiens et disponibilites</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel entretien
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Janvier 2024</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item) => (
                <button
                  key={item.day}
                  onClick={() => setSelectedDate(item.day)}
                  className={`
                    relative p-2 text-sm rounded-lg transition-colors
                    ${item.isToday ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                    ${selectedDate === item.day && !item.isToday ? "bg-muted" : ""}
                  `}
                >
                  {item.day}
                  {item.events > 0 && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium text-foreground">Legende</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500" />
                Confirme
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500" />
                En attente
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interviews List */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Entretiens programmes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {interview.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-foreground">{interview.candidate}</h4>
                    <p className="text-sm text-muted-foreground">{interview.position}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {interview.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {interview.time}
                      </span>
                      <span className="flex items-center gap-1">
                        {interview.location === "Google Meet" || interview.location === "Zoom" ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        {interview.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {interview.type}
                  </Badge>
                  <Badge
                    className={
                      interview.status === "confirmed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {interview.status === "confirmed" ? "Confirme" : "En attente"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
