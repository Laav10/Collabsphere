"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const burndownData = [
  { day: "Day 1", ideal: 100, actual: 98 },
  { day: "Day 2", ideal: 90, actual: 92 },
  { day: "Day 3", ideal: 80, actual: 85 },
  { day: "Day 4", ideal: 70, actual: 78 },
  { day: "Day 5", ideal: 60, actual: 68 },
  { day: "Day 6", ideal: 50, actual: 58 },
  { day: "Day 7", ideal: 40, actual: 45 },
  { day: "Day 8", ideal: 30, actual: 38 },
  { day: "Day 9", ideal: 20, actual: 25 },
  { day: "Day 10", ideal: 10, actual: 15 },
]

const velocityData = [
  { sprint: "Sprint 1", points: 32 },
  { sprint: "Sprint 2", points: 38 },
  { sprint: "Sprint 3", points: 45 },
  { sprint: "Sprint 4", points: 40 },
  { sprint: "Sprint 5", points: 42 },
  { sprint: "Sprint 6", points: 48 },
]

const teamData = [
  { name: "Jadhav", tasksCompleted: 47 },
  { name: "Sarah", tasksCompleted: 35 },
  { name: "Aditya", tasksCompleted: 42 },
  { name: "Sanjay", tasksCompleted: 40 },
  { name: "Lavanya", tasksCompleted: 38 },
]

interface ProjectAnalyticsProps {
  projectId: number
}

export default function ProjectAnalytics({ projectId }: ProjectAnalyticsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-pink-500">Project Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-pink-500">78%</span>
              <span className="text-sm font-medium text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12% from last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sprint Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-pink-500">42</span>
              <span className="text-sm font-medium text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +3 points increased
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-pink-500">91%</span>
              <span className="text-sm font-medium text-red-500 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                -4% from last sprint
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time to Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-pink-500">18d</span>
              <span className="text-sm font-medium text-green-500 flex items-center">On track</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Burndown Chart</CardTitle>
            <CardDescription>Remaining work vs ideal progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={burndownData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "1px solid #444",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ideal"
                    stroke="#36BFFA"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Ideal Burndown"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#F471B5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Actual Progress"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Velocity Trend</CardTitle>
            <CardDescription>Story points completed per sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={velocityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="sprint" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      border: "1px solid #444",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="points" name="Story Points Completed" fill="#F471B5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Tasks completed by team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamData.map((member) => (
              <div key={member.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>{member.name}</span>
                  <span className="text-sm text-muted-foreground">{member.tasksCompleted} Tasks Completed</span>
                </div>
                <Progress value={(member.tasksCompleted / 50) * 100} className="h-2 bg-zinc-800">
                  <div className="h-full bg-pink-500 rounded-full" />
                </Progress>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

