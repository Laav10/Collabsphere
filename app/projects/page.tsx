"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  FolderKanban,
  Search,
  PlusCircle,
  Calendar,
  MapPin,
  User,
  Clock,
} from "lucide-react"

// Sample projects data
const projectsData = [
  {
    id: 1,
    title: "AI-Powered Learning Platform",
    description:
      "Develop an adaptive learning platform that uses AI to personalize educational content based on student performance and learning style.",
    techStack: ["React", "Node.js", "TensorFlow", "MongoDB"],
    peopleRequired: 5,
    peopleRegistered: 3,
    deadline: "April 30, 2025",
  },
  {
    id: 2,
    title: "Blockchain-based Supply Chain Tracker",
    description:
      "Create a transparent supply chain tracking system using blockchain technology to verify product authenticity and track items from production to delivery.",
    techStack: ["Solidity", "React", "Node.js", "Ethereum"],
    peopleRequired: 4,
    peopleRegistered: 2,
    deadline: "May 15, 2025",
  },
  {
    id: 3,
    title: "AR Navigation App",
    description:
      "Build an augmented reality navigation app that overlays directions and points of interest on the real world through a smartphone camera.",
    techStack: ["Swift", "ARKit", "Firebase", "Google Maps API"],
    peopleRequired: 3,
    peopleRegistered: 1,
    deadline: "June 5, 2025",
  },
  {
    id: 4,
    title: "Healthcare Data Analytics Dashboard",
    description:
      "Develop a comprehensive dashboard for healthcare providers to visualize patient data, track outcomes, and identify trends for improved care.",
    techStack: ["Python", "Django", "React", "D3.js", "PostgreSQL"],
    peopleRequired: 6,
    peopleRegistered: 4,
    deadline: "May 20, 2025",
  },
]

// Sample hackathons data
const hackathonsData = [
  {
    id: 1,
    name: "Global Climate Hack 2025",
    description: "Develop innovative solutions to address climate change challenges using technology.",
    mode: "Hybrid",
    location: "San Francisco, CA (or Remote)",
    date: "May 10-12, 2025",
    membersRequired: "3-5",
    techStack: ["Any", "Sustainability Focus"],
    prizes: "$10,000 in prizes",
    registrationDeadline: "April 25, 2025",
  },
  {
    id: 2,
    name: "HealthTech Innovation Challenge",
    description:
      "Create solutions that improve healthcare accessibility, affordability, or quality using emerging technologies.",
    mode: "Online",
    date: "June 15-17, 2025",
    membersRequired: "2-4",
    techStack: ["AI/ML", "Mobile", "Web", "IoT"],
    prizes: "$5,000 + Incubation Opportunity",
    registrationDeadline: "June 1, 2025",
  },
  {
    id: 3,
    name: "Fintech Disruption Hackathon",
    description:
      "Reimagine financial services with innovative solutions that enhance security, accessibility, or user experience.",
    mode: "In-person",
    location: "New York, NY",
    date: "July 8-10, 2025",
    membersRequired: "4",
    techStack: ["Blockchain", "AI", "Cloud", "Security"],
    prizes: "$15,000 + Mentorship",
    registrationDeadline: "June 20, 2025",
  },
]

// Sample mentors data
const mentorsData = [
  {
    id: 1,
    name: "Dr. A Balu",
    title: "Professor & Research mentor",
    expertise: ["Project guide", "Number Theory", "Cryptography"],
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "Senior Software Engineer",
    expertise: ["Software Engineering", "Cloud Architecture", "DevOps"],
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    title: "UX/UI Design Lead",
    expertise: ["UI/UX Design", "User Research", "Prototyping"],
    available: false,
    image: "/placeholder.svg?height=80&width=80",
  },
]

// Sample upcoming sessions
const upcomingSessions = [
  {
    id: 1,
    title: "Research Methodology Workshop",
    description: "One-on-one session with Dr A Balu covering research methodologies and academic writing techniques",
    mentor: "Dr A Balu",
    date: "April 5, 2025",
    time: "2:00 PM - 4:00 PM",
  },
  {
    id: 2,
    title: "Cloud Architecture Fundamentals",
    description: "Group session on AWS and Azure architecture patterns and best practices",
    mentor: "Sarah Chen",
    date: "April 8, 2025",
    time: "10:00 AM - 12:00 PM",
  },
]

// Sample past sessions
const pastSessions = [
  {
    id: 1,
    title: "UI/UX Best practices",
    description: "Review session with Sarah on implementing effective user interface",
    mentor: "Sarah Chen",
    date: "March 15, 2025",
  },
  {
    id: 2,
    title: "Blockchain Development Workshop",
    description: "Hands-on session on building smart contracts and decentralized applications",
    mentor: "Michael Rodriguez",
    date: "March 10, 2025",
  },
]

export default function ProjectsPage() {
  const [activeNav, setActiveNav] = useState("projects")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])

  const toggleExpertise = (expertise: string) => {
    if (selectedExpertise.includes(expertise)) {
      setSelectedExpertise(selectedExpertise.filter((e) => e !== expertise))
    } else {
      setSelectedExpertise([...selectedExpertise, expertise])
    }
  }

  const filteredMentors = mentorsData.filter((mentor) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by selected expertise
    const matchesExpertise =
      selectedExpertise.length === 0 || mentor.expertise.some((e) => selectedExpertise.includes(e))

    return matchesSearch && matchesExpertise
  })

  const allExpertiseTags = Array.from(new Set(mentorsData.flatMap((mentor) => mentor.expertise)))

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-pink-500">CollabSphere</h1>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="w-full flex items-center space-x-2 p-3 rounded-md text-gray-300 hover:bg-gray-800"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "projects" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("projects")}
          >
            <FolderKanban className="h-5 w-5" />
            <span>Projects</span>
          </button>

          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "team" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("team")}
          >
            <Users className="h-5 w-5" />
            <span>Team</span>
          </button>

          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "analytics" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("analytics")}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Analytics</span>
          </button>

          <Link
            href="/settings"
            className="w-full flex items-center space-x-2 p-3 rounded-md text-gray-300 hover:bg-gray-800"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Explore Opportunities</h1>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-6">
            <TabsTrigger value="projects" className="data-[state=active]:bg-pink-500">
              Projects
            </TabsTrigger>
            <TabsTrigger value="hackathons" className="data-[state=active]:bg-pink-500">
              Hackathons
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="data-[state=active]:bg-pink-500">
              Mentorship
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Search projects..." className="pl-10 bg-gray-800 border-gray-700" />
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData.map((project) => (
                <Card key={project.id} className="bg-gray-800 border-none overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm line-clamp-3">{project.description}</p>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Tech Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-700">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-pink-500" />
                        <span>
                          {project.peopleRegistered}/{project.peopleRequired} members
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-pink-500" />
                        <span>Due {project.deadline}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-700 pt-4">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">Apply Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hackathons Tab */}
          <TabsContent value="hackathons" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Search hackathons..." className="pl-10 bg-gray-800 border-gray-700" />
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Hackathon Request
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hackathonsData.map((hackathon) => (
                <Card key={hackathon.id} className="bg-gray-800 border-none overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{hackathon.name}</CardTitle>
                      <Badge
                        className={`${hackathon.mode === "Online" ? "bg-blue-600" : hackathon.mode === "In-person" ? "bg-green-600" : "bg-purple-600"}`}
                      >
                        {hackathon.mode}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{hackathon.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                          <span>{hackathon.date}</span>
                        </div>
                        {hackathon.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                            <span>{hackathon.location}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-pink-500" />
                          <span>{hackathon.membersRequired} members</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 mb-1">Tech Stack:</p>
                        <div className="flex flex-wrap gap-2">
                          {hackathon.techStack.map((tech, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-700">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-sm">
                      <div className="text-yellow-400 font-medium">{hackathon.prizes}</div>
                      <div className="text-gray-400">Register by {hackathon.registrationDeadline}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-700 pt-4">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">Register Team</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mentorship Tab */}
          <TabsContent value="mentorship" className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-pink-500 mb-6">Mentorship Hub</h2>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search mentors by name or expertise..."
                  className="pl-10 bg-gray-800 border-gray-700 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {allExpertiseTags.map((tag, index) => (
                  <Button
                    key={index}
                    variant={selectedExpertise.includes(tag) ? "default" : "outline"}
                    className={
                      selectedExpertise.includes(tag)
                        ? "bg-pink-500 hover:bg-pink-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }
                    onClick={() => toggleExpertise(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <Card key={mentor.id} className="bg-gray-800 border-none">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-pink-500">
                          <Image
                            src={mentor.image || "/placeholder.svg"}
                            alt={mentor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold">{mentor.name}</h3>
                          <p className="text-sm text-gray-400">{mentor.title}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className={`w-2 h-2 rounded-full ${mentor.available ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span className="text-sm">
                          {mentor.available ? "Available for Sessions" : "Currently Unavailable"}
                        </span>
                      </div>

                      <Button className="w-full bg-pink-500 hover:bg-pink-600" disabled={!mentor.available}>
                        Book a Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-pink-500 mb-4">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <Card key={session.id} className="bg-gray-800 border-none">
                      <CardContent className="p-4">
                        <h3 className="font-bold">{session.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">{session.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{session.mentor}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{session.time}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-pink-500 mb-4">Past Sessions</h2>
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <Card key={session.id} className="bg-gray-800 border-none">
                      <CardContent className="p-4">
                        <h3 className="font-bold">{session.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">{session.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{session.mentor}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{session.date}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

