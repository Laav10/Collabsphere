import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface TeamMember {
  id: string
  name: string
}

interface TeamMemberModalProps {
  teamMembers: TeamMember[]
  selectedMembers: string[]
  onAddMembers: (members: string[]) => void
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ teamMembers, selectedMembers, onAddMembers }) => {
  const [selected, setSelected] = useState<string[]>(selectedMembers)

  const toggleMember = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    onAddMembers(selected)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Add Team Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Team Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(member.id)}
                onCheckedChange={() => toggleMember(member.id)}
              />
              <span>{member.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TeamMemberModal