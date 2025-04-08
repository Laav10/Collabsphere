"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import TaskForm from "@/components/taskform"
import SprintDetails from "@/components/sprint-details"
import { useUserContext } from "@/lib/usercontext"
import ProjectTasks from "@/components/view_tasks" // Import the updated component

interface SprintManagementProps {
  project_id: number;
  projectTitle?: string;
}

interface Sprint{
  End: string,
  Start: string,
  Status: string,
  name: string,
  sprint_id: string  
}

export default function SprintManagement({ project_id, projectTitle }: SprintManagementProps) {
  const { user } = useUserContext()
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprintId, setSelectedSprintId] = useState<string>("")
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)

  const fetchSprints = async () => {
    // Fetch sprints from API
    const response = await fetch(`http://127.0.0.1:5000/project/view_sprints?project_id=${project_id}`)
    const data = await response.json()
    setSprints(data.sprints)
    console.log(data)
    // If sprints exist and no sprint is selected, select the last sprint by default
    if (data.sprints && data.sprints.length > 0 && !selectedSprintId) {
      const lastSprint = data.sprints[data.sprints.length - 1]
      setSelectedSprintId(lastSprint.id)
      setSelectedSprint(lastSprint)
    }
  }

  useEffect(() => {
    fetchSprints()
  }, [project_id])

  const handleSprintSelect = (sprint: Sprint) => {
    setSelectedSprintId(sprint.sprint_id)
    setSelectedSprint(sprint)
  }

  // Find the selected sprint object
  useEffect(() => {
    if (selectedSprintId && sprints.length > 0) {
      const sprint = sprints.find(s => s.sprint_id === selectedSprintId) || null
      setSelectedSprint(sprint)
    }
  }, [selectedSprintId, sprints])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-500">
        {projectTitle ? `Sprint Management: ${projectTitle}` : 'Sprint Management'}
      </h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:text-black hover:to-blue-600">
            Create Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm projectId={project_id} onTaskAdded={fetchSprints} sprintId={selectedSprintId} />
        </DialogContent>
      </Dialog>

      {/* Updated grid layout - decreased sprint card width, increased details width */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Decreased width from col-span-1 to a narrower column */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Project Sprints</CardTitle>
              <CardDescription>Select a sprint to view details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sprints.length > 0 ? (
                sprints.map(sprint => (
                  <div 
                    key={sprint.sprint_id} 
                    onClick={() => handleSprintSelect(sprint)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedSprintId === sprint.sprint_id 
                        ? 'bg-pink-100 border-l-4 border-pink-500 text-black' 
                        : 'hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center justify-between text-inherit">
                      <h3 className={`font-medium ${selectedSprintId === sprint.sprint_id ? 'text-black' : ''}`}>{sprint.name}</h3>
                      <Badge variant={sprint.Status === "active" ? "default" : "outline"} 
                             className={`text-xs ${selectedSprintId === sprint.sprint_id ? 'text-black' : ''}`}>
                        {sprint.Status}
                      </Badge>
                    </div>
                    {sprint.Start && sprint.End && (
                      <p className={`text-xs ${selectedSprintId === sprint.sprint_id ? 'text-black' : 'text-muted-foreground'} mt-1 group-hover:text-black`}>
                        {new Date(sprint.Start).toLocaleDateString()} - {new Date(sprint.End).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No sprints available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Increased width from col-span-2 to col-span-3 */}
        <div className="md:col-span-3 space-y-6">
          {selectedSprint && (
            <>
              <SprintDetails sprint={selectedSprint} />
              
              <ProjectTasks 
                projectId={project_id} 
                sprintId={selectedSprintId} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}