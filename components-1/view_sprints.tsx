import React from 'react';
import { SprintFromAPI } from './sprint-management'; // Adjust the import based on your actual file structure

interface ViewSprintsProps {
  sprints: SprintFromAPI[];
  onSprintSelect: (sprint: SprintFromAPI) => void;
}

const ViewSprints: React.FC<ViewSprintsProps> = ({ sprints, onSprintSelect }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Sprints</h2>
      <ul className="space-y-2">
        {sprints.map((sprint) => (
          <li key={sprint.sprint_id} className="p-4 bg-zinc-800 border border-zinc-700 rounded-md cursor-pointer" onClick={() => onSprintSelect(sprint)}>
            <h3 className="font-medium text-pink-500">{sprint.name}</h3>
            <p className="text-sm text-gray-400">
              {sprint.start_date ? `Start: ${new Date(sprint.start_date).toLocaleDateString()}` : 'Start: Not set'} - 
              {sprint.end_date ? ` End: ${new Date(sprint.end_date).toLocaleDateString()}` : ' End: Not set'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewSprints;