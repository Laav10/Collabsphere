"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  FolderKanban,
  PlusCircle,
  LogOut,
  Lock,
  Trophy,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react"

// Sample user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  bio: "Full-stack developer with 5 years of experience in React, Node.js, and Python. Passionate about building collaborative tools and open-source projects.",
  github: "github.com/alexjohnson",
  linkedin: "linkedin.com/in/alexjohnson",
  avatar: "/placeholder.svg?height=200&width=200",
  skills: ["React", "Node.js", "Python", "TypeScript", "MongoDB", "AWS", "Docker"],
}

// Sample projects data
const projectsData = {
  current: [
    { id: 1, name: "CollabSphere", role: "Lead Developer", progress: 65, members: 5 },
    { id: 2, name: "TaskFlow", role: "Frontend Developer", progress: 40, members: 3 },
  ],
  past: [
    { id: 3, name: "DataViz Platform", role: "Full-stack Developer", progress: 100, members: 4 },
    { id: 4, name: "E-Learning Portal", role: "Backend Developer", progress: 100, members: 6 },
  ],
  applied: [
    { id: 5, name: "AI Research Tool", role: "Frontend Developer", status: "Under Review" },
    { id: 6, name: "Healthcare Dashboard", role: "Full-stack Developer", status: "Shortlisted" },
  ],
}

// Sample hackathons data
const hackathonsData = [
  { id: 1, name: "Global Hack 2024", date: "March 15-17, 2024", position: "2nd Place", project: "EcoTrack" },
  { id: 2, name: "CodeFest 2023", date: "November 5-7, 2023", position: "Finalist", project: "MediConnect" },
  { id: 3, name: "DevJam 2023", date: "July 22-24, 2023", position: "1st Place", project: "SmartCity" },
]

export default function SettingsPage() {
  const [activeNav, setActiveNav] = useState("settings")

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

          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "settings" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("settings")}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile & Settings</h1>
          <Link href='/create_project'>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Project
          </Button>
          </Link>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-pink-500">
              Profile
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-pink-500">
              Projects
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-pink-500">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800 border-none">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-pink-500">
                      <Image
                        src={userData.avatar || "/placeholder.svg"}
                        alt={userData.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold">{userData.name}</h2>
                    <p className="text-gray-400">Full-stack Developer</p>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-pink-500" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-pink-500" />
                        <span>{userData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-pink-500" />
                        <span>{userData.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Github className="h-5 w-5 text-pink-500" />
                        <span>{userData.github}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-pink-500" />
                        <span>{userData.linkedin}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Bio</h3>
                      <p className="text-gray-300">{userData.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-none">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center">
                  <Trophy className="mr-2 h-5 w-5" /> Hackathons Participated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hackathonsData.map((hackathon) => (
                    <div key={hackathon.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{hackathon.name}</h3>
                          <p className="text-sm text-gray-400">{hackathon.date}</p>
                          <p className="text-sm mt-1">Project: {hackathon.project}</p>
                        </div>
                        <div className="px-3 py-1 bg-pink-500 rounded-full text-sm">{hackathon.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="bg-gray-800 border-none">
              <CardHeader>
                <CardTitle className="text-pink-500">Current Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectsData.current.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-400">Role: {project.role}</p>
                          <p className="text-sm mt-1">Team: {project.members} members</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-600 rounded-full mr-2">
                            <div
                              className="h-full bg-pink-500 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-none">
              <CardHeader>
                <CardTitle className="text-pink-500">Past Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectsData.past.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-400">Role: {project.role}</p>
                          <p className="text-sm mt-1">Team: {project.members} members</p>
                        </div>
                        <div className="px-3 py-1 bg-green-500 rounded-full text-sm">Completed</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-none">
              <CardHeader>
                <CardTitle className="text-pink-500">Projects Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectsData.applied.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-400">Role: {project.role}</p>
                        </div>
                        <div className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm">{project.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800 border-none">
              <CardHeader>
                <CardTitle className="text-pink-500">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={userData.name} className="bg-gray-700 border-gray-600" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={userData.email} className="bg-gray-700 border-gray-600" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={userData.phone} className="bg-gray-700 border-gray-600" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={userData.location} className="bg-gray-700 border-gray-600" />
                </div>

                <Button className="bg-pink-500 hover:bg-pink-600 w-full">Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-none">
              <CardHeader>
                <CardTitle className="text-pink-500">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="bg-gray-700 border-gray-600" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="bg-gray-700 border-gray-600" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="bg-gray-700 border-gray-600" />
                </div>

                <Button className="bg-pink-500 hover:bg-pink-600 w-full">
                  <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>

                <div className="pt-4 border-t border-gray-700">
                  <Button variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

