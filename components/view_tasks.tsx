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

const ProjectTasks = () => {
  const [tasksData, setTasksData] = useState<ApiResponse | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/project/view_tasks?project_id=3",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTasksData(data);
        console.log("Server Response:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
}
export default ProjectTasks;