"use client"

import { useState } from "react"
import { 
  Star, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin,
  Download,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreCircle, SkillBadge, ContributionHeatmap } from "@/components/skillforge"

const candidateData = {
  name: "Sophie Martin",
  initials: "SM",
  title: "Senior Full Stack Developer",
  location: "Paris, France",
  experience: "5 ans d'experience",
  email: "sophie.martin@email.com",
  phone: "+33 6 12 34 56 78",
  website: "sophiemartin.dev",
  github: "github.com/sophiemartin",
  linkedin: "linkedin.com/in/sophiemartin",
  globalScore: 92,
  availability: "Disponible immediatement",
  salaryExpectation: "55-65k EUR",
  isVerified: true
}

const certifications = [
  { name: "React Advanced", score: 95, date: "Dec 2023", badge: "Expert" },
  { name: "Node.js Backend", score: 88, date: "Nov 2023", badge: "Avance" },
  { name: "System Design", score: 82, date: "Oct 2023", badge: "Avance" },
  { name: "TypeScript", score: 91, date: "Sep 2023", badge: "Expert" }
]

const skills = [
  { name: "React", level: 95 },
  { name: "TypeScript", level: 91 },
  { name: "Node.js", level: 88 },
  { name: "PostgreSQL", level: 85 },
  { name: "AWS", level: 78 },
  { name: "Docker", level: 82 }
]

const experiences = [
  {
    company: "TechCorp",
    role: "Senior Full Stack Developer",
    period: "2021 - Present",
    description: "Lead developer sur une plateforme SaaS B2B avec 50k+ utilisateurs actifs."
  },
  {
    company: "StartupXYZ",
    role: "Full Stack Developer",
    period: "2019 - 2021",
    description: "Developpement de l'architecture microservices et migration cloud."
  }
]

export function CandidateProfileContent() {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl text-white">
                    {candidateData.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {candidateData.name}
                    </h1>
                    {candidateData.isVerified && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    <button onClick={() => setIsFavorite(!isFavorite)}>
                      <Star
                        className={`w-5 h-5 ${isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {candidateData.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {candidateData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {candidateData.experience}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {candidateData.availability}
                    </Badge>
                    <Badge variant="outline">
                      {candidateData.salaryExpectation}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 md:ml-auto">
                <ScoreCircle
                  score={candidateData.globalScore}
                  maxScore={100}
                  size="lg"
                  label="Score Global"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
              <Button className="bg-primary hover:bg-primary/90">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contacter
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Planifier entretien
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Telecharger CV
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href={`mailto:${candidateData.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                  <Mail className="w-4 h-4" />
                  {candidateData.email}
                </a>
                <a
                  href={`tel:${candidateData.phone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                  <Phone className="w-4 h-4" />
                  {candidateData.phone}
                </a>
                <a
                  href={`https://${candidateData.website}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                  {candidateData.website}
                </a>
                <a
                  href={`https://${candidateData.github}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                  <Github className="w-4 h-4" />
                  {candidateData.github}
                </a>
                <a
                  href={`https://${candidateData.linkedin}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                  <Linkedin className="w-4 h-4" />
                  {candidateData.linkedin}
                </a>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Competences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{skill.name}</span>
                      <span className="text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="certifications" className="w-full">
              <TabsList className="bg-muted">
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="activity">Activite</TabsTrigger>
              </TabsList>

              <TabsContent value="certifications" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certifications.map((cert) => (
                        <div
                          key={cert.name}
                          className="p-4 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {cert.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {cert.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-primary" />
                              <span className="text-lg font-bold text-foreground">
                                {cert.score}
                              </span>
                            </div>
                          </div>
                          <SkillBadge
                            label={cert.badge}
                            variant={
                              cert.badge === "Expert" ? "primary" : "success"
                            }
                            className="mt-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6 space-y-6">
                    {experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="relative pl-6 border-l-2 border-primary/30">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                        <h4 className="font-medium text-foreground">
                          {exp.role}
                        </h4>
                        <p className="text-sm text-primary">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {exp.period}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Activite de preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContributionHeatmap data={[]} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
