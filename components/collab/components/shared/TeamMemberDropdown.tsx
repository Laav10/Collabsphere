import React from 'react';

interface TeamMember {
  id: string;
  name: string;
}

interface TeamMemberDropdownProps {
  teamMembers: TeamMember[];
  onSelect: (member: TeamMember) => void;
  label: string;
}

const TeamMemberDropdown: React.FC<TeamMemberDropdownProps> = ({ teamMembers, onSelect, label }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm">{label}</label>
      <select
        className="bg-zinc-800 border-zinc-700 text-white p-2 rounded"
        onChange={(e) => {
          const selectedMember = teamMembers.find(member => member.id === e.target.value);
          if (selectedMember) {
            onSelect(selectedMember);
          }
        }}
      >
        <option value="">Select a team member</option>
        {teamMembers.map(member => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamMemberDropdown;