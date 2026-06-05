import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog';
import { format } from 'date-fns';

const CreateSprint = ({ project_id, onSprintCreated }) => {
  const [newSprint, setNewSprint] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
  });
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);

  const handleAddSprint = async () => {
    if (!newSprint.name) {
      alert('Please enter a sprint name');
      return;
    }
    setIsCreatingSprint(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/project/create_sprint', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project_id,
          name: newSprint.name,
          start_date: format(newSprint.startDate, 'yyyy-MM-dd'),
          end_date: format(newSprint.endDate, 'yyyy-MM-dd'),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Sprint created:', data);
      onSprintCreated(data.sprint_id, newSprint.name, newSprint.startDate, newSprint.endDate);

      // Reset form
      setNewSprint({
        name: '',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      });
    } catch (error) {
      console.error('Error creating sprint:', error);
      alert('Failed to create sprint. Please try again.');
    } finally {
      setIsCreatingSprint(false);
    }
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
          <DialogDescription>
            Add a new sprint to break down your project into manageable timeframes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm">Sprint Name</label>
            <Input
              placeholder="e.g. Sprint 1 - Project Setup"
              value={newSprint.name}
              onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Start Date</label>
              <Input
                type="date"
                value={format(newSprint.startDate, 'yyyy-MM-dd')}
                onChange={(e) => setNewSprint({ ...newSprint, startDate: new Date(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">End Date</label>
              <Input
                type="date"
                value={format(newSprint.endDate, 'yyyy-MM-dd')}
                onChange={(e) => setNewSprint({ ...newSprint, endDate: new Date(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAddSprint} disabled={isCreatingSprint}>
            {isCreatingSprint ? 'Creating...' : 'Create Sprint'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSprint;