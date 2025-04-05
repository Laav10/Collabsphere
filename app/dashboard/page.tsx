    "use client"

    import { useState, useEffect } from "react"
    import Link from "next/link"
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Badge } from "@/components/ui/badge"
    import {
      Search,
      User,
      Clock,
    } from "lucide-react"
    import Navbar from "@/components/navbar"
    import { useUserContext } from "@/lib/usercontext"
    import Notification from "@/components/notification"

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

    export default function ProjectsPage() {
      const [activeNav, setActiveNav] = useState("dashboard")
      const [searchQuery, setSearchQuery] = useState("")
      const [projects, setProjects] = useState<Project[]>([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)

 const {user } = useUserContext()  
 const userlocal = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
 const parsedUser = userlocal ? JSON.parse(userlocal) : null;
   const userId = user?.id ? user?.id:parsedUser?.id;
   console.log("userId",userId)
   // const id = user?.id ? user?.id:userlocal?.id;
 
 const id = 'sanjay23bcy51' // Replace with actual user ID;
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
              body: JSON.stringify({
                user_id: id, 
              }),
            })

            if (!response.ok) {
            console.error("Error:", response.status);
              throw new Error(`HTTP error! Status: ${response.status}`) 
            }

            const data = await response.json()
            console.log("API Response:", data)
            
            // Check if data has a project property (based on the response structure)
            const projectData = data.project || []
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
              user_id: user?.id, 
              role: "member",
              remarks: ""
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
          
          // Show success message
          alert("Successfully applied to project!")
        } catch (error) {
          console.error("Error applying to project:", error)
          alert("Failed to apply to project. Please try again.")
        }
      }

      // Process tags for each project
      const processedProjects = projects.map(project => {
        // Handle different tag formats: "{tag1,tag2}" or "tag1, tag2" or empty
        let tagArray: string[] = []
        
        if (project.tags) {
          // Remove curly braces if present
          const cleanTags = project.tags.replace(/^\{|\}$/g, '')
          
          if (cleanTags.trim()) {
            // Split by comma and trim each tag
            tagArray = cleanTags.split(/,\s*/).map(tag => tag.trim())
          }
        }
        
        return {
          ...project,
          tagArray
        }
      })

      // Filter projects based on search query
      const filteredProjects = processedProjects.filter(project => 
        searchQuery === "" || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagArray.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )

      return (
        <div className="flex min-h-screen bg-black text-white">
          {/* Sidebar */}
          <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
          <div className="fixed top-4 right-6 z-50">
  <Notification />
</div>
          {/* Main content */}
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Explore Projects</h1>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between items-center mb-6">
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

            {/* Projects List */}
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
                {filteredProjects.map((project) => (
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
                      ) : project.status === "Pending" ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                          Applied
                        </Button>
                      ) : project.status === "Part" ? (
                        <Button className="w-full bg-blue-500 hover:bg-blue-600" disabled>
                          Participating
                        </Button>
                      ) : project.status === "Closed" ? (
                        <Button className="w-full bg-gray-500 hover:bg-gray-600" disabled>
                          Closed
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
          </div>
        </div>
      )
    }