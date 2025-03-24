import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Mail, UserPlus } from "lucide-react"
import type { TeamMember } from "@/lib/types"

interface TeamMemberCardProps {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { name, role, avatar, rating, skills, projects, email } = member

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="h-12 bg-gradient-to-r from-pink-500 to-blue-500" />
      <CardHeader className="pt-0 flex flex-col items-center">
        <Avatar className="h-20 w-20 mt-[-40px] border-4 border-zinc-900">
          <AvatarImage src={avatar || `/placeholder.svg?height=80&width=80`} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-center mt-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"}`} />
          ))}
          <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-zinc-800">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Projects</p>
            <p className="text-sm">{projects} completed projects</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-zinc-800 pt-4">
        <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700">
          <Mail className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Request to Join
        </Button>
      </CardFooter>
    </Card>
  )
}

