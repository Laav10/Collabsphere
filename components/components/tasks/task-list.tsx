import { useEffect, useState } from "react";
import { Task } from "@/components/sprint-management"; // Adjust the import based on your actual Task type location
import TaskCard from "@/components/tasks/task-card";

interface TaskListProps {
  sprintId: string;
}

const TaskList: React.FC<TaskListProps> = ({ sprintId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
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
      if (data.tasks && Array.isArray(data.tasks)) {
        const fetchedTasks: Task[] = data.tasks.map((apiTask: any) => ({
          id: apiTask.task_id.toString(),
          title: apiTask.title,
          description: apiTask.description || "",
          weightage: apiTask.weightage || 1,
          status: apiTask.status.toLowerCase() || "todo",
          assignee: apiTask.assignee || undefined,
        }));
        setTasks(fetchedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sprintId) {
      fetchTasks();
    }
  }, [sprintId]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-6 text-muted-foreground text-sm">Loading tasks...</div>
      ) : (
        tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">No tasks available for this sprint.</div>
        )
      )}
    </div>
  );
};

export default TaskList;