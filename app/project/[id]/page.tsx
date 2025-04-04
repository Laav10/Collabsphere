"use client"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectDetails from "@/components/project-details"
import SprintManagement from "@/components/sprint-management"
import ProjectAnalytics from "@/components/project-analytics"
import { projectsData } from "@/lib/sample-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react";
 //in this call the api  give project_id  , user_id (from usercontext )   
export default function ProjectPage() {
  const params = useParams();
 const project_id = params?.id as number;
  
  if(!project_id) {
      return (
        <div> getting some error in opening project</div>
      )
   
           }
  

  // Use either project from static data or projectDetails from API

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/my-projects" className="text-muted-foreground hover:text-white mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-pink-500">{ "A Web-development Project"}</h1>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-8">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="sprints">Sprints</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ProjectDetails project_id={project_id} />
          </TabsContent>

          <TabsContent value="sprints">
            <SprintManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <ProjectAnalytics projectId={project_id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

