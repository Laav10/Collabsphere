"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Tag, User } from "lucide-react"
import { format } from "date-fns"

interface Project {
  admin_id: string | number
  description: string
  project_id: number
  end_date: string
  members_required: number
  start_date: string
  status: string | number
  tags: string
  title: string
  statusLabel?: string // Optional human-readable status
}

interface ProjectCardProps {
  project: Project
}

// Helper function to get a status badge color based on status
const getStatusBadgeColor = (status: string | number) => {
  // First try to use the statusLabel if available
  const statusString = typeof status === 'string' 
    ? status.toLowerCase() 
    : status === 0 || status === 0.0 
      ? 'active' 
      : status === 1 || status === 1.0 
        ? 'completed' 
        : 'applied';

  switch (statusString) {
    case 'active':
    case '0':
    case '0.0':
    case 'in progress':
      return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
    case 'completed':
    case '1':
    case '1.0':
      return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
    case 'applied':
    case '2':
    case '2.0':
    case 'pending':
      return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30";
  }
};

// Helper to get human-readable status
const getStatusLabel = (status: string | number): string => {
  if (status === 0 || status === 0.0 || status === "0" || status === "0.0") {
    return "Active";
  } else if (status === 1 || status === 1.0 || status === "1" || status === "1.0") {
    return "Completed";
  } else if (status === 2 || status === 2.0 || status === "2" || status === "2.0") {
    return "Applied";
  } else if (typeof status === "string") {
    return status; // Return as-is if already a string status
  } else {
    return "Unknown";
  }
};

export default function ProjectCard({ project }: ProjectCardProps) {
  // Format dates and extract project data
  const startDate = new Date(project.start_date);
  const endDate = new Date(project.end_date);
  const isValidDate = (date: Date) => !isNaN(date.getTime());
  
  // Use the statusLabel if available, otherwise convert it
  const statusLabel = project.statusLabel || getStatusLabel(project.status);
  const statusBadgeColor = getStatusBadgeColor(project.status);
  
  // Parse tags into an array
  const tagsList = project.tags ? project.tags.split(',').filter(Boolean) : [];

  return (
    <Link href={`/project/${project.project_id}`}>
      <Card className="bg-zinc-900 border-zinc-800 hover:border-pink-500/50 transition-all hover:shadow-md hover:shadow-pink-500/10">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <Badge className={statusBadgeColor} variant="outline">
              {statusLabel}
            </Badge>
          </div>
          <CardTitle className="mt-2 text-xl">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          {isValidDate(startDate) && isValidDate(endDate) && (
            <div className="flex items-center text-zinc-400 text-sm mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-zinc-400 text-sm mb-4">
            <Users className="h-4 w-4 mr-2" />
            <span>{project.members_required} team members required</span>
          </div>
          
          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tagsList.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-zinc-800 text-zinc-400">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-zinc-400 text-sm">
            <User className="h-4 w-4 mr-2" />
            <span>Admin: {project.admin_id}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}