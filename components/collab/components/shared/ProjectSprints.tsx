import React from 'react';

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  weightage: number;
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
}

interface ProjectSprintsProps {
  sprints: Sprint[];
  onSprintSelect: (sprint: Sprint) => void;
}

const ProjectSprints: React.FC<ProjectSprintsProps> = ({ sprints, onSprintSelect }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Project Sprints</h2>
      <ul className="space-y-2">
        {sprints.map((sprint) => (
          <li key={sprint.id} className="p-2 border rounded cursor-pointer hover:bg-gray-200" onClick={() => onSprintSelect(sprint)}>
            <h3 className="font-medium">{sprint.name}</h3>
            <p className="text-sm text-gray-500">
              {sprint.startDate.toLocaleDateString()} - {sprint.endDate.toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectSprints;