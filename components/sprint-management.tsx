"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Clock, Users, CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  title: string
  description: string
  weightage: number
  status: "todo" | "in-progress" | "completed"
  assignee?: string
}

type Sprint = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  tasks: Task[]
}

export default function SprintManagement() {
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: "sprint-1",
      name: "Sprint 1 - Project Setup",
      startDate: new Date(2024, 2, 1),
      endDate: new Date(2024, 2, 14),
      tasks: [
        {
          id: "task-1",
          title: "Setup project repository",
          description: "Create GitHub repository and setup initial project structure",
          weightage: 3,
          status: "completed",
          assignee: "john.doe@example.com",
        },
        {
          id: "task-2",
          title: "Design database schema",
          description: "Create ERD and define database tables and relationships",
          weightage: 5,
          status: "in-progress",
          assignee: "jane.smith@example.com",
        },
        {
          id: "task-3",
          title: "Setup CI/CD pipeline",
          description: "Configure GitHub Actions for continuous integration and deployment",
          weightage: 8,
          status: "todo",
        },
      ],
    },
  ])

  const [newSprint, setNewSprint] = useState({
    name: "",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
  })

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    weightage: 5,
    sprintId: "",
  })

  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints[0]?.id || "")

  const handleAddSprint = () => {
    const sprint: Sprint = {
      id: `sprint-${sprints.length + 1}`,
      name: newSprint.name,
      startDate: newSprint.startDate,
      endDate: newSprint.endDate,
      tasks: [],
    }

    setSprints([...sprints, sprint])
    setNewSprint({
      name: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    })
  }

  const handleAddTask = () => {
    if (!newTask.sprintId) return

    const task: Task = {
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      title: newTask.title,
      description: newTask.description,
      weightage: newTask.weightage,
      status: "todo",
    }

    setSprints(
      sprints.map((sprint) => {
        if (sprint.id === newTask.sprintId) {
          return {
            ...sprint,
            tasks: [...sprint.tasks, task],
          }
        }
        return sprint
      }),
    )

    setNewTask({
      title: "",
      description: "",
      weightage: 5,
      sprintId: "",
    })
  }

  const updateTaskStatus = (sprintId: string, taskId: string, status: "todo" | "in-progress" | "completed") => {
    setSprints(
      sprints.map((sprint) => {
        if (sprint.id === sprintId) {
          return {
            ...sprint,
            tasks: sprint.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  status,
                }
              }
              return task
            }),
          }
        }
        return sprint
      }),
    )
  }

  const selectedSprint = sprints.find((sprint) => sprint.id === selectedSprintId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-500">Sprint Management</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
              <Plus className="mr-2 h-4 w-4" /> Create Sprint
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Create New Sprint</DialogTitle>
              <DialogDescription>
                Add a new sprint to break down your project into manageable timeframes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm">Sprint Name</label>
                <Input
                  placeholder="e.g. Sprint 1 - Project Setup"
                  className="bg-zinc-800 border-zinc-700"
                  value={newSprint.name}
                  onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newSprint.startDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSprint.startDate}
                        onSelect={(date) => date && setNewSprint({ ...newSprint, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newSprint.endDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSprint.endDate}
                        onSelect={(date) => date && setNewSprint({ ...newSprint, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleAddSprint}
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              >
                Create Sprint
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Sprints</CardTitle>
              <CardDescription>Select a sprint to manage tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sprints.map((sprint) => (
                  <Button
                    key={sprint.id}
                    variant={selectedSprintId === sprint.id ? "default" : "outline"}
                    className={cn(
                      "w-full justify-start",
                      selectedSprintId === sprint.id
                        ? "bg-gradient-to-r from-pink-500 to-blue-500"
                        : "bg-zinc-800 border-zinc-700",
                    )}
                    onClick={() => setSelectedSprintId(sprint.id)}
                  >
                    {sprint.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedSprint && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Sprint Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(selectedSprint.startDate), "MMM d")} -{" "}
                    {format(new Date(selectedSprint.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedSprint.tasks.filter((t) => t.status === "completed").length} of{" "}
                    {selectedSprint.tasks.length} tasks completed
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-3">
          {selectedSprint ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedSprint.name} Tasks</h2>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-zinc-800 border-zinc-700">
                      <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>
                        Create a new task for this sprint with description and weightage.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm">Task Title</label>
                        <Input
                          placeholder="e.g. Implement user authentication"
                          className="bg-zinc-800 border-zinc-700"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm">Description</label>
                        <Textarea
                          placeholder="Describe what needs to be done in this task"
                          className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm">Task Weightage (Story Points)</label>
                          <span className="text-sm font-medium">{newTask.weightage}</span>
                        </div>
                        <Slider
                          defaultValue={[5]}
                          max={13}
                          min={1}
                          step={1}
                          value={[newTask.weightage]}
                          onValueChange={(value) => setNewTask({ ...newTask, weightage: value[0] })}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 (Easy)</span>
                          <span>13 (Complex)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm">Assign to Sprint</label>
                        <Select
                          value={newTask.sprintId || selectedSprintId}
                          onValueChange={(value) => setNewTask({ ...newTask, sprintId: value })}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Select sprint" />
                          </SelectTrigger>
                          <SelectContent>
                            {sprints.map((sprint) => (
                              <SelectItem key={sprint.id} value={sprint.id}>
                                {sprint.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        onClick={handleAddTask}
                        className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                      >
                        Add Task
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">To Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedSprint.tasks
                        .filter((task) => task.status === "todo")
                        .map((task) => (
                          <Card key={task.id} className="bg-zinc-800 border-zinc-700">
                            <CardHeader className="p-3 pb-0">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                <Badge variant="outline" className="ml-2 bg-zinc-700">
                                  {task.weightage} pts
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-2">
                              <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                              {task.assignee && (
                                <div className="flex items-center">
                                  <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="p-2 pt-0 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => updateTaskStatus(selectedSprint.id, task.id, "in-progress")}
                              >
                                <ArrowRight className="h-3 w-3 mr-1" /> Start
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedSprint.tasks
                        .filter((task) => task.status === "in-progress")
                        .map((task) => (
                          <Card key={task.id} className="bg-zinc-800 border-zinc-700">
                            <CardHeader className="p-3 pb-0">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                <Badge variant="outline" className="ml-2 bg-zinc-700">
                                  {task.weightage} pts
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-2">
                              <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                              {task.assignee && (
                                <div className="flex items-center">
                                  <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="p-2 pt-0 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => updateTaskStatus(selectedSprint.id, task.id, "completed")}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedSprint.tasks
                        .filter((task) => task.status === "completed")
                        .map((task) => (
                          <Card key={task.id} className="bg-zinc-800 border-zinc-700">
                            <CardHeader className="p-3 pb-0">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                <Badge variant="outline" className="ml-2 bg-zinc-700">
                                  {task.weightage} pts
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-2">
                              <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                              {task.assignee && (
                                <div className="flex items-center">
                                  <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="p-2 pt-0 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => updateTaskStatus(selectedSprint.id, task.id, "todo")}
                              >
                                <Circle className="h-3 w-3 mr-1" /> Reopen
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-muted-foreground">Select a sprint to view and manage tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

