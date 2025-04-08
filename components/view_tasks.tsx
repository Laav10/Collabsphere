import { useState, useEffect } from "react";

// Define the interface for the response data
interface Task {
  assigned_to: string;
  assignee_name: string;
  description: string;
  id: number;
  points: number;
}

interface Sprint {
  completed_tasks: number;
  completion_percentage: number;
  sprint_name: string;
  sprint_number: number;
  tasks: {
    completed: Task[];
    in_progress: Task[];
    todo: Task[];
    total_tasks: number;
  };
}

interface ApiResponse {
  sprints: Sprint[];
}

interface ProjectTasksProps {
  projectId: number;
  sprintId?: string;
}

// Task Card Component with status change buttons
export const TaskCard = ({ task, status, onStatusChange }: { 
  task: Task; 
  status: string; 
  onStatusChange: (taskId: number, newStatus: string) => void 
}) => {
  // Get status color for text
  const getStatusColor = () => {
    switch (status) {
      case "todo":
        return "text-blue-400";
      case "in_progress":
        return "text-yellow-400";
      case "completed":
        return "text-green-400";
      default:
        return "text-white";
    }
  };

  // Get status label
  const getStatusLabel = () => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  // Get available next statuses based on current status
  const getNextStatuses = () => {
    switch (status) {
      case "todo":
        return [{ value: "in_progress", label: "Move to In Progress" }];
      case "in_progress":
        return [
          { value: "todo", label: "Move to To Do" },
          { value: "completed", label: "Mark as Completed" }
        ];
      case "completed":
        return [{ value: "in_progress", label: "Reopen" }];
      default:
        return [];
    }
  };

  return (
    <div className="bg-black rounded-lg p-5 mb-4 shadow-md min-h-[160px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-medium text-lg">Task #{task.id}</h3>
          <span className={`px-3 py-1.5 rounded text-sm font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
        <p className="text-gray-300 mb-4 text-base leading-relaxed">{task.description}</p>
      </div>
      <div>
        {/* Status change buttons */}
        <div className="flex gap-2 mb-3">
          {getNextStatuses().map((nextStatus) => (
            <button
              key={nextStatus.value}
              onClick={() => onStatusChange(task.id, nextStatus.value)}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                nextStatus.value === "todo" 
                  ? "bg-blue-900 hover:bg-blue-800 text-blue-300"
                  : nextStatus.value === "in_progress"
                  ? "bg-yellow-900 hover:bg-yellow-800 text-yellow-300"
                  : "bg-green-900 hover:bg-green-800 text-green-300"
              }`}
            >
              {nextStatus.label}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-gray-800">
          <span className="text-gray-400">Assignee: <span className="text-white">{task.assignee_name}</span></span>
          <span className="text-gray-400">Points: <span className="text-white">{task.points}</span></span>
        </div>
      </div>
    </div>
  );
};

const ProjectTasks = ({ projectId, sprintId }: ProjectTasksProps) => {
  const [tasksData, setTasksData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Add sprint_id to the URL if provided
      let url = `http://127.0.0.1:5000/project/view_tasks?project_id=${projectId}`;
      if (sprintId) {
        url += `&sprint_id=${sprintId}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        setError(`Error: ${response.status}`);
        console.log("Error:", response.status);
      }
      
      const data = await response.json();
      setTasksData(data);
      console.log("Tasks Data:", data);
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, sprintId]);

  // Handle task status change
  const handleStatusChange = async (taskId: number, newStatus: string) => {
    setStatusUpdating(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/project/update_task_status", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: taskId,
          new_status: newStatus,
          project_id: projectId,
          sprint_id: sprintId
        }),
      });

      if (!response.ok) {
        console.error("Failed to update task status:", response.status);
        return;
      }

      // Refresh tasks after status update
      await fetchTasks();
      
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  if (statusUpdating) {
    return <div className="text-center py-4">Updating task status...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (!tasksData || !tasksData.sprints || tasksData.sprints.length === 0) {
    return <div className="text-center py-4 text-gray-500">No tasks available for this sprint</div>;
  }

  // Get the first sprint (we're filtering by sprint_id in the API call)
  const sprint = tasksData.sprints[0];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Sprint Tasks</h2>
      
      {/* Updated to make columns more spacious */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Todo Column */}
        <div className="bg-gray-900 p-5 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-5 text-blue-500 border-b border-blue-500 pb-3">
            To Do ({sprint.tasks.todo.length})
          </h3>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {sprint.tasks.todo.length > 0 ? (
              sprint.tasks.todo.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  status="todo" 
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center py-6">No tasks in this category</p>
            )}
          </div>
        </div>
        
        {/* In Progress Column */}
        <div className="bg-gray-900 p-5 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-5 text-yellow-500 border-b border-yellow-500 pb-3">
            In Progress ({sprint.tasks.in_progress.length})
          </h3>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {sprint.tasks.in_progress.length > 0 ? (
              sprint.tasks.in_progress.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  status="in_progress" 
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center py-6">No tasks in this category</p>
            )}
          </div>
        </div>
        
        {/* Completed Column */}
        <div className="bg-gray-900 p-5 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-5 text-green-500 border-b border-green-500 pb-3">
            Completed ({sprint.tasks.completed.length})
          </h3>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {sprint.tasks.completed.length > 0 ? (
              sprint.tasks.completed.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  status="completed" 
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center py-6">No tasks in this category</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTasks;