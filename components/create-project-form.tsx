"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CreateProjectFormProps {
  onSuccess?: () => void
}

export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<string[]>([])
  const [memberEmail, setMemberEmail] = useState("")
  const [milestones, setMilestones] = useState<string[]>([])
  const [milestone, setMilestone] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])
  const [tech, setTech] = useState("")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)))
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    membersRequired: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMember = () => {
    if (memberEmail && !teamMembers.includes(memberEmail)) {
      setTeamMembers([...teamMembers, memberEmail])
      setMemberEmail("")
    }
  }

  const handleRemoveMember = (email: string) => {
    setTeamMembers(teamMembers.filter((member) => member !== email))
  }

  const handleAddMilestone = () => {
    if (milestone && !milestones.includes(milestone)) {
      setMilestones([...milestones, milestone])
      setMilestone("")
    }
  }

  const handleRemoveMilestone = (item: string) => {
    setMilestones(milestones.filter((m) => m !== item))
  }

  const handleAddTech = () => {
    if (tech && !techStack.includes(tech)) {
      setTechStack([...techStack, tech])
      setTech("")
    }
  }

  const handleRemoveTech = (item: string) => {
    setTechStack(techStack.filter((t) => t !== item))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally send the data to your API
    console.log({
      ...formData,
      teamMembers,
      milestones,
      techStack,
      startDate,
      endDate,
    })

    // Simulate success and redirect
    if (onSuccess) {
      onSuccess()
    }

    // Redirect to the projects page
    router.push("/my-projects")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-blue-400 mb-4 pb-2 border-b border-zinc-800">Project Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Project Name</label>
            <Input
              name="name"
              placeholder="Enter project name"
              className="bg-zinc-800 border-zinc-700"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Project Description</label>
            <Textarea
              name="description"
              placeholder="Describe your project"
              className="bg-zinc-800 border-zinc-700 min-h-[100px]"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Project Type</label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Application</SelectItem>
                <SelectItem value="mobile">Mobile Application</SelectItem>
                <SelectItem value="desktop">Desktop Application</SelectItem>
                <SelectItem value="api">API Development</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Tech Stack</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add technology"
                className="bg-zinc-800 border-zinc-700"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddTech} className="border-zinc-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {techStack.map((item, index) => (
                  <Badge key={index} variant="secondary" className="bg-zinc-800 text-white">
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(item)}
                      className="ml-1 text-zinc-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-blue-400 mb-4 pb-2 border-b border-zinc-800">Team & Timeline</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Add Team Members</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter team member's email"
                className="bg-zinc-800 border-zinc-700"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddMember} className="border-zinc-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {teamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {teamMembers.map((email, index) => (
                  <Badge key={index} variant="secondary" className="bg-zinc-800 text-white">
                    <span className="mr-1">👤</span> {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(email)}
                      className="ml-1 text-zinc-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm mb-1">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Add Milestone</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter milestone"
                className="bg-zinc-800 border-zinc-700"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddMilestone}
                className="border-zinc-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {milestones.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {milestones.map((item, index) => (
                  <Badge key={index} variant="secondary" className="bg-zinc-800 text-white">
                    <span className="mr-1">🚩</span> {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(item)}
                      className="ml-1 text-zinc-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Members Required</label>
            <Select
              value={formData.membersRequired}
              onValueChange={(value) => handleSelectChange("membersRequired", value)}
              required
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select number of members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2">1-2 members</SelectItem>
                <SelectItem value="3-5">3-5 members</SelectItem>
                <SelectItem value="6-10">6-10 members</SelectItem>
                <SelectItem value="10+">10+ members</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
        >
          CREATE PROJECT
        </Button>
      </div>
    </form>
  )
}

