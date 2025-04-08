import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { TeamMemberDropdown } from '../shared/TeamMemberDropdown';

interface CreateTaskProps {
  projectId: string;
  onTaskCreated: (task: any) => void; // Adjust the type as per your Task type
}

const CreateTask: React.FC<CreateTaskProps> = ({ projectId, onTaskCreated }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    weightage: 5,
    assignee: '',
  });

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleAddTask = async () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }

    setIsCreatingTask(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/project/edit_tasks/add_task', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          points: newTask.weightage,
          assigned_to: newTask.assignee,
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Task created:', data);
      onTaskCreated(data); // Notify parent component of the new task

      // Reset form
      setNewTask({
        title: '',
        description: '',
        weightage: 5,
        assignee: '',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
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
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Description</label>
        <Textarea
          placeholder="Describe what needs to be done in this task"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
      </div>

      <TeamMemberDropdown
        projectId={projectId}
        onSelect={(member) => setNewTask({ ...newTask, assignee: member.name })}
        label="Assign To"
      />

      <div className="space-y-2 mt-2">
        <div className="flex justify-between">
          <label className="text-sm">Task Weightage (Story Points)</label>
          <span className="text-sm font-medium">{newTask.weightage}</span>
        </div>
        <input
          type="range"
          min="1"
          max="13"
          value={newTask.weightage}
          onChange={(e) => setNewTask({ ...newTask, weightage: Number(e.target.value) })}
        />
      </div>

      <Button onClick={handleAddTask} disabled={isCreatingTask}>
        {isCreatingTask ? 'Creating...' : 'Add Task'}
      </Button>
    </div>
  );
};

export default CreateTask;