"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectDetails from "@/components/project-details"
import SprintManagement from "@/components/sprint-management"
import ProjectAnalytics from "@/components/project-analytics"
import ProjectChat from "@/components/project-chat"
import { projectsData } from "@/lib/sample-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState(projectsData.find((p) => p.id === projectId) || null)

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/my-projects" className="text-muted-foreground hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-pink-500">Project Not Found</h1>
          </div>
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center">
            <p className="text-muted-foreground">
              The project you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/my-projects" className="text-muted-foreground hover:text-white mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-pink-500">{project.name}</h1>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="sprints">Sprints</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ProjectDetails project={project} />
          </TabsContent>

          <TabsContent value="sprints">
            <SprintManagement  />
          </TabsContent>

          <TabsContent value="analytics">
            <ProjectAnalytics projectId={project.id} />
          </TabsContent>

          <TabsContent value="chat">
            <ProjectChat projectId={project.id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

