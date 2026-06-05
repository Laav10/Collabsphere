"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"


 interface Sprint{
  End: string ,
  Start:string ,
  Status:string ,
  name: string
  sprint_id:number
 }
interface SprintDetailsProps {
  sprint: Sprint | null
}

export default function SprintDetails({ sprint }: SprintDetailsProps) {
  if (!sprint) {
    return <div>No sprint selected</div>
  }

  // Format dates if they exist
  const startDate = sprint.Start ? new Date(sprint.Start) : null
  const endDate = sprint.End ? new Date(sprint.End) : null

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{sprint.name}</CardTitle>
          <Badge variant={sprint.Status === "active" ? "default" : "outline"}>
            {sprint.Status}
          </Badge>
        </div>
        <CardDescription>
          {startDate && endDate ? (
            <span>
              {format(startDate, "PPP")} - {format(endDate, "PPP")}
            </span>
          ) : (
            <span>Dates not specified</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
      </CardContent>
    </Card>
  )
}
