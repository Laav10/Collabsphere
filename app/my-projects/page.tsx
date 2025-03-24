"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectCard from "@/components/project-card"
import CreateProjectButton from "@/components/create-project-button"
import { projectsData } from "@/lib/sample-data"

export default function MyProjects() {
  const [activeTab, setActiveTab] = useState("current")

  const currentProjects = projectsData.filter((project) => project.status === "active")
  const completedProjects = projectsData.filter((project) => project.status === "completed")
  const appliedProjects = projectsData.filter((project) => project.status === "applied")

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-500 mb-4 md:mb-0">My Projects</h1>
          <CreateProjectButton />
        </div>

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
                  <ProjectCard key={project.id} project={project} />
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
                  <ProjectCard key={project.id} project={project} />
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
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="text-muted-foreground">You haven't applied to any projects</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

