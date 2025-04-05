"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectCard from "@/components/project-card"
import CreateProjectButton from "@/components/create-project-button"
import Navbar from "@/components/navbar"
import { useUserContext } from "@/lib/usercontext"

interface Project {
  admin_id: string | number
  description: string
  project_id: number
  end_date: string
  members_required: number
  start_date: string
  status: string | number
  tags: string
  title: string
}

// Map numeric status codes to readable strings
const getStatusLabel = (status: string | number): string => {
  if (status === 0 || status === 0.0 || status === "0" || status === "0.0") {
    return "Active";
  } else if (status === 1 || status === 1.0 || status === "1" || status === "1.0") {
    return "Completed";
  } else if (status === 2 || status === 2.0 || status === "2" || status === "2.0") {
    return "Applied";
  } else if (typeof status === "string") {
    return status; // Return as-is if already a string status
  } else {
    return "Unknown";
  }
};

export default function MyProjects() {
  const [activeTab, setActiveTab] = useState("current")
  const [projectsData, setProjectsData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useUserContext()
  const id = user?.id ? user?.id : 'sanjay23bcy51';
  
  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        
        const response = await fetch("http://127.0.0.1:5000/list/myprojects", {
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
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response:", data)
        
        if (data.project && Array.isArray(data.project)) {
          // Normalize the projects with readable status labels
          const normalizedProjects = data.project.map((project: Project) => ({
            ...project,
            statusLabel: getStatusLabel(project.status) // Add a human-readable status label
          }));
          
          setProjectsData(normalizedProjects)
          
          // Debug: Log original status values from the API
          const statuses = [...new Set(data.project.map((p: any) => p.status))]
          console.log("Original project statuses:", statuses)
          
          // Debug: Log mapped status labels
          const statusLabels = [...new Set(normalizedProjects.map((p: any) => p.statusLabel))]
          console.log("Mapped status labels:", statusLabels)
        } else {
          setProjectsData([])
          console.warn("Unexpected data structure:", data)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        setError("Failed to load projects. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [id])

  // Filter projects based on the status labels we've added
  const currentProjects = projectsData.filter(project => 
    project.status === "Active" || 
    project.status === "In Progress" ||
    (project.admin_id === id && project.status !== "Completed" && project.status !== "Applied")
  )
  
  const completedProjects = projectsData.filter(project => 
    project.status === "Completed"
  )
  
  const appliedProjects = projectsData.filter(project => 
    project.status === "Applied" || 
    project.status === "Pending"
  )

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar activeNav="projects" setActiveNav={() => {}} />

      <main className="min-h-screen bg-black w-full text-white p-4 md:p-8 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-pink-500 mb-4 md:mb-0">My Projects</h1>
            <CreateProjectButton />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="current">Current ({currentProjects.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
                <TabsTrigger value="applied">Applied ({appliedProjects.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                {currentProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProjects.map((project) => (
                      <ProjectCard key={project.project_id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-muted-foreground mb-4">You don't have any current projects</p>
                    <CreateProjectButton variant="outline" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedProjects.map((project) => (
                      <ProjectCard key={project.project_id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-muted-foreground">You don't have any completed projects</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="applied">
                {appliedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appliedProjects.map((project) => (
                      <ProjectCard key={project.project_id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-muted-foreground">You haven't applied to any projects</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {projectsData.length === 0 && !loading && !error && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No projects found. Create a new project to get started!</p>
              <CreateProjectButton variant="default" />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}