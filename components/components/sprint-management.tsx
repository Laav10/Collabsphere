// filepath: /home/sanjay-sahu/programming/collab/components/sprint-management.tsx
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import TaskForm from "@/components/tasks/task-form"
import TaskList from "@/components/tasks/task-list"
import { useUserContext } from "@/lib/usercontext"

interface SprintManagementProps {
  project_id: number;
  projectTitle?: string;
}

export default function SprintManagement({ project_id, projectTitle }: SprintManagementProps) {
  const { user } = useUserContext()
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprintId, setSelectedSprintId] = useState<string>("")

  const fetchSprints = async () => {
    // Fetch sprints from API
    const response = await fetch(`http://127.0.0.1:5000/project/sprints?project_id=${project_id}`)
    const data = await response.json()
    setSprints(data.sprints)
  }

  useEffect(() => {
    fetchSprints()
  }, [project_id])

  const handleSprintSelect = (sprintId: string) => {
    setSelectedSprintId(sprintId)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-500">
        {projectTitle ? `Sprint Management: ${projectTitle}` : 'Sprint Management'}
      </h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
            Create Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm project_id={project_id} onTaskAdded={fetchSprints} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Project Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          {sprints.map(sprint => (
            <div key={sprint.id} onClick={() => handleSprintSelect(sprint.id)}>
              {sprint.name}
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedSprintId && (
        <TaskList sprintId={selectedSprintId} />
      )}
    </div>
  )
}