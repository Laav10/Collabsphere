import React, { useState } from 'react';
import CreateSprint from './CreateSprint';
import CreateTask from './CreateTask';
import ProjectSprints from '../shared/ProjectSprints';
import TeamMemberDropdown from '../shared/TeamMemberDropdown';
import { Sprint, Task, SprintFromAPI } from '../../types'; // Adjust the import based on your types location

export default function SprintManagement({ project_id, projectTitle }: { project_id: string; projectTitle: string }) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [currentApiSprint, setCurrentApiSprint] = useState<SprintFromAPI | null>(null);
  
  const handleLatestSprintSelect = (sprint: SprintFromAPI) => {
    const existingSprint = sprints.find(s => s.id === sprint.sprint_id.toString());
    
    if (existingSprint) {
      setSelectedSprintId(existingSprint.id);
    } else {
      const newSprint: Sprint = {
        id: sprint.sprint_id.toString(),
        name: sprint.name,
        startDate: sprint.start_date ? new Date(sprint.start_date) : new Date(),
        endDate: sprint.end_date ? new Date(sprint.end_date) : new Date(new Date().setDate(new Date().getDate() + 14)),
        tasks: [],
      };
      
      setSprints(prev => [...prev, newSprint]);
      setSelectedSprintId(newSprint.id);
      fetchSprintTasks(sprint.sprint_id);
    }
  };

  const fetchSprintTasks = async (sprintId: number) => {
    // Fetch tasks for the selected sprint
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-500">
        {projectTitle ? `Sprint Management: ${projectTitle}` : 'Sprint Management'}
      </h1>

      <CreateSprint project_id={project_id} setSprints={setSprints} />
      <CreateTask selectedSprintId={selectedSprintId} setSprints={setSprints} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-4">
          <ProjectSprints project_id={project_id} onLatestSprintSelect={handleLatestSprintSelect} />
        </div>

        <div className="md:col-span-3">
          {selectedSprintId && (
            <div>
              <h2 className="text-xl font-semibold">Tasks for Sprint ID: {selectedSprintId}</h2>
              {/* Render tasks here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}