import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TeamMemberDropdown } from '@/components/team-members-dropdown';

const TaskForm = ({ projectId, onTaskAdded }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskWeightage, setTaskWeightage] = useState(5);
  const [assignee, setAssignee] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/project/edit_tasks/add_task', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          points: taskWeightage,
          assigned_to: assignee,
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      onTaskAdded(data.task); // Call the parent function to update the task list
      resetForm();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskWeightage(5);
    setAssignee('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm">Task Title</label>
        <Input
          placeholder="e.g. Implement user authentication"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Description</label>
        <Input
          placeholder="Describe what needs to be done in this task"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">Weightage (Story Points)</label>
        <Input
          type="number"
          min="1"
          max="13"
          value={taskWeightage}
          onChange={(e) => setTaskWeightage(Number(e.target.value))}
        />
      </div>
      <TeamMemberDropdown
        projectId={projectId}
        onSelect={(member) => setAssignee(member.name)}
        label="Assign To"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </Button>
    </form>
  );
};

const TaskList = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="border p-4 rounded">
          <h3 className="font-bold">{task.title}</h3>
          <p>{task.description}</p>
          <p>Weightage: {task.weightage} pts</p>
          <p>Assigned to: {task.assignee}</p>
        </div>
      ))}
    </div>
  );
};

const TeamMembers = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Tasks</h2>
      <TaskForm projectId={projectId} onTaskAdded={handleTaskAdded} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default TeamMembers;