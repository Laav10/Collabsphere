"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { LayoutDashboard, Users, BarChart3, Settings, FolderKanban } from "lucide-react"
import Link from "next/link"

// Sample data for project progress chart
const projectProgressData = [
  { name: "Week 1", value: 30, task: "Sign In/Sign Up" },
  { name: "Week 2", value: 45, task: "Landing Page" },
  { name: "Week 3", value: 35, task: "User Profile" },
  { name: "Week 4", value: 50, task: "Project Creation" },
  { name: "Week 5", value: 40, task: "Task Management" },
  { name: "Week 6", value: 60, task: "API Integration" },
]

// Sample data for task distribution chart
const taskDistributionData = [
  { name: "Development", value: 35, color: "#4361ee" },
  { name: "Design", value: 25, color: "#3bde7c" },
  { name: "Testing", value: 20, color: "#ffd166" },
  { name: "Planning", value: 15, color: "#ff6b6b" },
  { name: "Review", value: 5, color: "#f72585" },
]

const recentActivities = [
  {
    title: "New user authentication system",
    time: "2 hours ago",
    status: "completed",
    score: 1.0, // fully completed and correct
  },
  {
    title: "Updated UI/UX design for homepage",
    time: "4 hours ago",
    status: "completed",
    score: 0.8, // completed but not fully correct
  },
  {
    title: "Completed Project documentation",
    time: "1 day ago",
    status: "completed",
    score: 1.0, // fully completed and correct
  },
]

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard")

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-pink-500">CollabSphere</h1>
        </div>

        <nav className="space-y-2">
          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "dashboard" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("dashboard")}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
    <Link href='/projects'>
          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "projects" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("projects")}
          >
            <FolderKanban className="h-5 w-5" />
            <span>Projects</span>
          </button>
    </Link>
    <Link href='team'>
          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "team" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("team")}
          >
            <Users className="h-5 w-5" />
            <span>Team</span>
          </button>
          </Link>
<Link href='my-projects'>
            <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "analytics" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("analytics")}
          >
            <BarChart3 className="h-5 w-5" />
            <span>my-projects</span>
          </button>
          </Link>
          <Link href='settings' className="">
          <button
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${activeNav === "settings" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setActiveNav("settings")}
          >
         
            <Settings className="h-5 w-5" />
            <span>Settings</span>
         
          </button>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome back!</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-l-4 border-pink-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-l-4 border-pink-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-l-4 border-pink-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">8</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-l-4 border-pink-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-normal">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">95%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-pink-500">Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectProgressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    formatter={(value, name, props) => {
                      return [`Value: ${value}`, `Task: ${props.payload.task}`]
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Project Progress"
                    stroke="#f72585"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-pink-500">Task Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {taskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    formatter={(value) => [`${value} weeks`]}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-pink-500">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full mr-3 ${
                      activity.score === 1.0
                        ? "bg-green-500"
                        : activity.score >= 0.8
                          ? "bg-yellow-500"
                          : activity.score >= 0.5
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }`}
                  />
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

