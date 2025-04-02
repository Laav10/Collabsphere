import React, { useState } from "react"

interface TeamMember {
  id: string
  name: string
}

interface TeamMemberDropdownProps {
  teamMembers: TeamMember[]
  onSelect: (member: TeamMember) => void
  label?: string
}

const TeamMemberDropdown: React.FC<TeamMemberDropdownProps> = ({ teamMembers, onSelect, label }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const handleSelect = (member: TeamMember) => {
    setSelectedMember(member)
    onSelect(member)
  }

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <select
        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2"
        value={selectedMember?.id || ""}
        onChange={(e) => {
          const member = teamMembers.find((m) => m.id === e.target.value)
          if (member) handleSelect(member)
        }}
      >
        <option value="" disabled>
          Select a team member
        </option>
        {teamMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TeamMemberDropdown