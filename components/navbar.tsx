import Link from "next/link"
import { LayoutDashboard, FolderKanban, Users, Settings } from "lucide-react"


interface NavbarProps {
  activeNav: string
  setActiveNav: (nav: string) => void
}

export default function Navbar({ activeNav, setActiveNav }: NavbarProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-pink-500">CollabSphere</h1>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${
              activeNav === "dashboard" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
            onClick={() => setActiveNav("dashboard")}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/my-projects"
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${
              activeNav === "my-projects" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
            onClick={() => setActiveNav("my-projects")}
          >
            <FolderKanban className="h-5 w-5" />
            <span>Projects</span>
          </Link>

          <Link
            href="/users"
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${
              activeNav === "users" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
            onClick={() => setActiveNav("users")}
          >
            <Users className="h-5 w-5" />
            <span>Users</span>
          </Link>

          <Link
            href="/profile/sanjay"
            className={`w-full flex items-center space-x-2 p-3 rounded-md ${
              activeNav === "profile" ? "bg-pink-500 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
            onClick={() => setActiveNav("profile")}
          >
            <Settings className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </nav>
            
      </div>

   
    
  
  )
}