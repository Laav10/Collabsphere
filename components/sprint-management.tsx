"use client"
import { useState, useEffect } from "react"
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
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Clock, Users, CheckCircle2, Circle, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import TeamMemberDropdown from "@/components/team-members"
import ProjectSprints from "@/components/view_sprints"
import { useUserContext } from "@/lib/usercontext"


interface SprintManagementProps {
  project_id: number;
  projectTitle?: string;
}

interface SprintFromAPI {
  name: string;
  sprint_id: number;
  start_date?: string;
  end_date?: string;
}

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

export default function SprintManagement({ project_id, projectTitle }: SprintManagementProps) {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprintId, setSelectedSprintId] = useState<string>("")
  const [currentApiSprint, setCurrentApiSprint] = useState<SprintFromAPI | null>(null)
  
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
    assignee: "",
  })

  const [isCreatingSprint, setIsCreatingSprint] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)

  // Handle the latest sprint selected from ProjectSprints component
  const handleLatestSprintSelect = (sprint: SprintFromAPI) => {
    console.log("Latest sprint from API:", sprint);
    setCurrentApiSprint(sprint);
    
    // Check if this sprint already exists in our local state
    const existingSprint = sprints.find(s => s.id === sprint.sprint_id.toString());
    
    if (existingSprint) {
      setSelectedSprintId(existingSprint.id);
    } else {
      // Create a new sprint object from the API data
      const newSprint: Sprint = {
        id: sprint.sprint_id.toString(),
        name: sprint.name,
        startDate: sprint.start_date ? new Date(sprint.start_date) : new Date(),
        endDate: sprint.end_date ? new Date(sprint.end_date) : new Date(new Date().setDate(new Date().getDate() + 14)),
        tasks: [],
      };
      
      setSprints(prev => [...prev, newSprint]);
      setSelectedSprintId(newSprint.id);
      
      // Fetch tasks for this sprint
      fetchSprintTasks(sprint.sprint_id);
    }
  };

  const handleAddSprint = async () => {
    if (!newSprint.name) {
      alert("Please enter a sprint name");
      return;
    }
    
    setIsCreatingSprint(true);
    
    try {
      // Create sprint in the API
      const response = await fetch("http://127.0.0.1:5000/project/create_sprint", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: project_id,
          name: newSprint.name,
          start_date: newSprint.startDate ,
          end_date: newSprint.endDate ,
          user_id:id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Sprint created:", data);

      // Add to local state
      const sprint: Sprint = {
        id: data.sprint_id.toString(),
        name: newSprint.name,
        startDate: newSprint.startDate,
        endDate: newSprint.endDate,
        tasks: [],
      };

      setSprints(prev => [...prev, sprint]);
      setSelectedSprintId(sprint.id);
      setCurrentApiSprint({
        sprint_id: data.sprint_id,
        name: newSprint.name,
        start_date: format(newSprint.startDate, "yyyy-MM-dd"),
        end_date: format(newSprint.endDate, "yyyy-MM-dd"),
      });
      
      // Reset form
      setNewSprint({
        name: "",
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      });
      
    } catch (error) {
      console.error("Error creating sprint:", error);
      alert("Failed to create sprint. Please try again.");
    } finally {
      setIsCreatingSprint(false);
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title || !selectedSprintId) {
      alert("Please enter a task title and select a sprint");
      return;
    }
    
    setIsCreatingTask(true);
    console.log(
       selectedSprintId,
       newTask.title,
       newTask.description,
       newTask.weightage,
       newTask.assignee || null,
       project_id,
    )
    const {user } = useUserContext()
    const id = user?.id ? user?.id:'sanjay23bcy51';
    try {
      // Create task in the API
      const response = await fetch("http://127.0.0.1:5000/project/edit_tasks/add_task", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sprint_number: selectedSprintId,
          title: newTask.title,
          description: newTask.description,
          points: newTask.weightage,
          assigned_to: newTask.assignee ,
          project_id: project_id,
          user_id: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Task created:", data);

      // Add to local state
      const task: Task = {
        id: data.task_id?.toString() || `task-${Math.random().toString(36).substr(2, 9)}`,
        title: newTask.title,
        description: newTask.description,
        weightage: newTask.weightage,
        status: "todo",
        assignee: newTask.assignee,
      };

      setSprints(
        sprints.map((sprint) => {
          if (sprint.id === selectedSprintId) {
            return {
              ...sprint,
              tasks: [...sprint.tasks, task],
            };
          }
          return sprint;
        }),
      );

      // Reset form
      setNewTask({
        title: "",
        description: "",
        weightage: 5,
        sprintId: "",
        assignee: "",
      });
      
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setIsCreatingTask(false);
    }
  }

  const updateTaskStatus = async (sprintId: string, taskId: string, status: "todo" | "in-progress" | "completed") => {
    try {
      // Update task in the API
      const response = await fetch("http://127.0.0.1:5000/sprint/update_task_status", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: taskId,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update local state
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
                  };
                }
                return task;
              }),
            };
          }
          return sprint;
        }),
      );
      
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  }
  
  // Function to fetch tasks for a sprint
  const fetchSprintTasks = async (sprintId: number) => {
    setIsLoadingTasks(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/sprint/view_tasks?sprint_id=${sprintId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Sprint tasks:", data);

      if (data.tasks && Array.isArray(data.tasks)) {
        // Map API tasks to our Task type
        const tasks: Task[] = data.tasks.map((apiTask: any) => ({
          id: apiTask.task_id.toString(),
          title: apiTask.title,
          description: apiTask.description || "",
          weightage: apiTask.weightage || 1,
          status: apiTask.status.toLowerCase() || "todo",
          assignee: apiTask.assignee || undefined,
        }));

        // Update the sprint with these tasks
        setSprints(prev => 
          prev.map(sprint => 
            sprint.id === sprintId.toString() 
              ? { ...sprint, tasks } 
              : sprint
          )
        );
      }
    } catch (error) {
      console.error("Error fetching sprint tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const selectedSprint = sprints.find((sprint) => sprint.id === selectedSprintId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-500">
          {projectTitle ? `Sprint Management: ${projectTitle}` : 'Sprint Management'}
        </h1>

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
                disabled={isCreatingSprint}
              >
                {isCreatingSprint ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  'Create Sprint'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-4">
          {/* Project Sprints Display (readonly) */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Project Sprints</CardTitle>
              <CardDescription>Current active sprint is highlighted</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectSprints 
                project_id={project_id}
                onLatestSprintSelect={handleLatestSprintSelect}
              />
            </CardContent>
          </Card>

          {currentApiSprint && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Active Sprint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-zinc-800 p-3 rounded-md">
                  <h3 className="font-medium text-pink-500">{currentApiSprint.name}</h3>
                  
                  {currentApiSprint.start_date && currentApiSprint.end_date && (
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {format(new Date(currentApiSprint.start_date), "MMM d")} - {format(new Date(currentApiSprint.end_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  
                  {selectedSprint && (
                    <div className="flex items-center mt-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>
                        {selectedSprint.tasks.filter(t => t.status === "completed").length} of {selectedSprint.tasks.length} tasks completed
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <TeamMemberDropdown
                projectId={project_id}
                onSelect={(member) => console.log("Selected member:", member)}
                label="Project Team Members"
              />
            </CardContent>
          </Card>
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
                   
                      <TeamMemberDropdown
                        projectId={project_id}
                        onSelect={(member) => setNewTask({ ...newTask, assignee: member.name })}
                        label="Assign To"
                      />

                      <div className="space-y-2 mt-2">
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

                      {/* Hidden this selection since we're always adding to the current sprint */}
                      <input type="hidden" value={selectedSprintId} />
                    </div>

                    <DialogFooter>
                      <Button
                        onClick={handleAddTask}
                        className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                        disabled={isCreatingTask}
                      >
                        {isCreatingTask ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                          </>
                        ) : (
                          'Add Task'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoadingTasks ? (
                <div className="flex items-center justify-center h-64 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-pink-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">Loading sprint tasks...</p>
                  </div>
                </div>
              ) : (
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
                          
                        {selectedSprint.tasks.filter((task) => task.status === "todo").length === 0 && (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            No tasks to do
                          </div>
                        )}
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
                          
                        {selectedSprint.tasks.filter((task) => task.status === "in-progress").length === 0 && (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            No tasks in progress
                          </div>
                        )}
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
                          
                        {selectedSprint.tasks.filter((task) => task.status === "completed").length === 0 && (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            No completed tasks
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-muted-foreground">No sprints available. Create a sprint to start managing tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}