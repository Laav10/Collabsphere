import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/lib/usercontext";

interface TaskFormProps {
  sprintId: string;
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ sprintId, onTaskAdded }) => {
  const { user } = useUserContext();
  const [task, setTask] = useState({
    title: "",
    description: "",
    weightage: 5,
    assignee: "",
  });
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleAddTask = async () => {
    if (!task.title || !sprintId) {
      alert("Please enter a task title and select a sprint");
      return;
    }

    setIsCreatingTask(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/project/edit_tasks/add_task", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sprint_number: sprintId,
          title: task.title,
          description: task.description,
          points: task.weightage,
          assigned_to: task.assignee,
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Task created:", data);
      onTaskAdded(); // Call the function to reload the task list

      // Reset form
      setTask({
        title: "",
        description: "",
        weightage: 5,
        assignee: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Task Title</label>
        <Input
          placeholder="e.g. Implement user authentication"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Description</label>
        <Textarea
          placeholder="Describe what needs to be done in this task"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Assign To</label>
        <Input
          placeholder="e.g. John Doe"
          value={task.assignee}
          onChange={(e) => setTask({ ...task, assignee: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Task Weightage (Story Points)</label>
        <Input
          type="number"
          min={1}
          max={13}
          value={task.weightage}
          onChange={(e) => setTask({ ...task, weightage: Number(e.target.value) })}
        />
      </div>

      <Button onClick={handleAddTask} disabled={isCreatingTask}>
        {isCreatingTask ? "Creating..." : "Add Task"}
      </Button>
    </div>
  );
};

export default TaskForm;