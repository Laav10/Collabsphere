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

// Task Card Component
export const TaskCard = ({ task, status }: { task: Task; status: string }) => {
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

  return (
    <div className="bg-black rounded-lg p-4 mb-3 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium">Task #{task.id}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>
      <p className="text-gray-300 mb-3">{task.description}</p>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Assignee: <span className="text-white">{task.assignee_name}</span></span>
        <span className="text-gray-400">Points: <span className="text-white">{task.points}</span></span>
      </div>
    </div>
  );
};

const ProjectTasks = ({ projectId, sprintId }: ProjectTasksProps) => {
  const [tasksData, setTasksData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
    
    fetchData();
  }, [projectId, sprintId]);

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
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
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2 text-blue-500">To Do</h3>
          {sprint.tasks.todo.length > 0 ? (
            sprint.tasks.todo.map((task) => (
              <TaskCard key={task.id} task={task} status="todo" />
            ))
          ) : (
            <p className="text-gray-400">No tasks in this category</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 text-yellow-500">In Progress</h3>
          {sprint.tasks.in_progress.length > 0 ? (
            sprint.tasks.in_progress.map((task) => (
              <TaskCard key={task.id} task={task} status="in_progress" />
            ))
          ) : (
            <p className="text-gray-400">No tasks in this category</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 text-green-500">Completed</h3>
          {sprint.tasks.completed.length > 0 ? (
            sprint.tasks.completed.map((task) => (
              <TaskCard key={task.id} task={task} status="completed" />
            ))
          ) : (
            <p className="text-gray-400">No tasks in this category</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTasks;