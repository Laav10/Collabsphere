import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { id, name, description, type, techStack, startDate, endDate, progress, teamMembers, status } = project

  // Calculate days remaining or days since completion
  const today = new Date()
  const end = new Date(endDate)
  const timeRemaining = formatDistanceToNow(end, { addSuffix: true })

  return (
    <Link href={`/projects/${id}`}>
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold text-white">{name}</CardTitle>
            <Badge
              variant="outline"
              className={
                status === "active"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : status === "completed"
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              }
            >
              {status === "active" ? "Active" : status === "completed" ? "Completed" : "Applied"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{description}</p>
        </CardHeader>

        <CardContent className="py-2 flex-grow">
          <div className="flex flex-wrap gap-1 mb-4">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="secondary" className="bg-zinc-800">
                {tech}
              </Badge>
            ))}
          </div>

          {status !== "applied" && (
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-zinc-800">
                <div className={`h-full rounded-full ${status === "completed" ? "bg-blue-500" : "bg-pink-500"}`} />
              </Progress>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 border-t border-zinc-800 flex flex-col space-y-2">
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timeRemaining}</span>
            </div>
          </div>

          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{teamMembers.length} members</span>
            </div>
            <div>
              <Badge variant="outline" className="text-xs bg-zinc-800 font-normal">
                {type}
              </Badge>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

