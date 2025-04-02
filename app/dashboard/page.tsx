"use client"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  User,
  Clock,
} from "lucide-react"
import Navbar from "@/components/navbar"

// Define the Project interface
interface Project {
  admin_id: number
  description: string
  project_id: number
  end_date: string
  members_required: number
  start_date: string
  status: string
  title: string
  tags: string
}
const mentorsData: any[] = []

export default function ProjectsPage() {
  const [activeNav, setActiveNav] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://127.0.0.1:5000/list/projects", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response:", data)
        
        // Check if data has a projects property, otherwise use data itself
        const projectData = data.projects || data
        setProjects(projectData)
        setError(null)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setError("Failed to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Handle applying to a project
  const handleApplyToProject = async (projectId: number) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/apply/project", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          user_id: 1, 
          role: "member",
          remarks:""
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Apply Response:", data)
      
      // Update the project status in the UI
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === projectId ? { ...project, status: "Applied" } : project
        )
      )
      
      // Show success message (you can implement this with a toast notification)
      alert("Successfully applied to project!")
    } catch (error) {
      console.error("Error applying to project:", error)
      alert("Failed to apply to project. Please try again.")
    }
  }

  // Process tags for each project
  const processedProjects = projects.map(project => {
    return {
      ...project,
      tagArray: project.tags ? project.tags.split(',').map(tag => tag.trim()) : []
    }
  })

  // Filter mentors based on search query and selected expertise
  const filteredMentors = mentorsData.filter((mentor) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((e: string) => e.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by selected expertise
    const matchesExpertise =
      selectedExpertise.length === 0 || mentor.expertise.some((e: string) => selectedExpertise.includes(e))

    return matchesSearch && matchesExpertise
  })

  const toggleExpertise = (expertise: string) => {
    if (selectedExpertise.includes(expertise)) {
      setSelectedExpertise(selectedExpertise.filter((e) => e !== expertise))
    } else {
      setSelectedExpertise([...selectedExpertise, expertise])
    }
  }

  const allExpertiseTags = Array.from(new Set(mentorsData.flatMap((mentor) => mentor.expertise)))

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Explore Opportunities</h1>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-1/2 self-center grid-cols-2 bg-gray-800 mb-6">
            <TabsTrigger value="projects" className="data-[state=active]:bg-pink-500">
              Projects
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
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p>Loading projects...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-gray-800 hover:bg-gray-700"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedProjects.map((project) => (
                  <Card key={project.project_id} className="bg-gray-800 border-none overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm line-clamp-3">{project.description}</p>

                      <div>
                        <p className="text-sm text-gray-400 mb-1">Tech Stack:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tagArray.map((tech, index) => (
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
                            {/* You can add applied members count here if available in API */}
                            {project.members_required} members required
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-pink-500" />
                          <span>Due {new Date(project.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-700 pt-4">
                      {project.status === "Apply Now" ? (
                        <Button 
                          className="w-full bg-pink-500 hover:bg-pink-600"
                          onClick={() => handleApplyToProject(project.project_id)}
                        >
                          Apply Now
                        </Button>
                      ) : project.status === "Applied" ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                          Applied
                        </Button>
                      ) : (
                        <Link href={`/project/${project.project_id}`} className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            View Details
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Mentorship Tab */}
          <TabsContent value="mentorship" className="space-y-6">
            {/* Keep your existing mentorship tab content */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}