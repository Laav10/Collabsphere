import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Briefcase, Code, Flag, Github, ArrowLeft} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useUserContext } from "@/lib/usercontext"

// Update interface to match the actual API response
interface ProjectDetails {
  description: string
  end_date: string
  github_link: string
  project_size: number
  project_type: string
  start_date: string
  team_members: string[]
  tech_stack: string
  title: string// This is a string, not an array
}
interface ProjectDetailsProps {
  project_id: number;
  onTitleChange?: (title: string) => void;
}
const fetchProjectDetails = async(project_id: number) => {
  try {
    // Use the actual project_id parameter instead of hardcoded value
    const response = await fetch(`http://127.0.0.1:5000/project/view_details?project_id=${project_id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Error:", response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function ProjectDetails({ project_id, onTitleChange }: ProjectDetailsProps) {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>();
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const getProjectDetails = async () => {
      setLoading(true);
      const details = await fetchProjectDetails(project_id );
      if (details) {
        setProjectDetails(details);
          if (onTitleChange && details.title) {
          onTitleChange(details.title);
        }
      }
      setLoading(false);
    };
    
    getProjectDetails();
  }, [project_id]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/my-projects" className="text-muted-foreground hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-pink-500">Loading Project...</h1>
          </div>
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center">
            <p className="text-muted-foreground">
              Fetching project details, please wait...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Project not found or error
  if (!projectDetails) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/my-projects" className="text-muted-foreground hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-pink-500">Project Not Found</h1>
          </div>
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center">
            <p className="text-muted-foreground">
              The project you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Convert tech_stack string to array for rendering
  const techStackArray = projectDetails.tech_stack 
    ? projectDetails.tech_stack.split(',').map(tech => tech.trim())
    : [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{projectDetails.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Project Status</p>
                    <p className="font-medium">{projectDetails.project_type}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{projectDetails.project_size}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(projectDetails.start_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(projectDetails.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                {projectDetails.github_link && (
                  <div className="flex items-start">
                    <Github className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Github</p>
                      <a 
                        href={projectDetails.github_link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="font-medium text-blue-400 hover:underline"
                      >
                        {projectDetails.github_link.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {techStackArray.length > 0 ? (
                  techStackArray.map((tech, index) => (
                    <Badge key={index} className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                      <Code className="h-3 w-3 mr-1" /> {tech}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No technologies specified for this project.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectDetails.team_members && projectDetails.team_members.length > 0 ? (
                  projectDetails.team_members.map((member, index) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>
                          {member.split(' ').map(word => word[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No team members have been added to this project.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}