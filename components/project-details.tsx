import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Briefcase, Code, Flag, Github, ArrowLeft} from "lucide-react"
import type { Project } from "@/lib/types"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { type } from "os"


interface ProjectDetails {
  type:string
  title: string;              
  description: string;        
  start_date: string;         
  end_date: string;           
  project_type: string;       
  project_size: number;       
  github_link: string | null; 
  team_members: any[];        
  tech_stack: string[];       
}
// isme admin  
const fetchProjectDetails = async(project_id: string ) => {
  try {
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
    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function ProjectDetails({ project_id }: { project_id: string }) {

  
    const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(false);  
    useEffect(() => {
      const getProjectDetails = async () => {
        const details = await fetchProjectDetails(project_id);
        if (details) {
          setProjectDetails(details);
        }
      };
      
      getProjectDetails();
    }, [project_id]);
    const displayProject = projectDetails ;
  
    if (!displayProject) {
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
      )
    }
  
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
                    <p className="text-sm text-muted-foreground">Project Type</p>
                    <p className="font-medium">{projectDetails.type}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{projectDetails.team_members}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(projectDetails.  start_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(projectDetails.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Github className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Github</p>
                    <p className="font-medium">{projectDetails.github_link}</p>
                  </div>
                </div>  
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {projectDetails.tech_stack.map((tech, index) => (
                  <Badge key={index} className="bg-pink-500/10 text-pink-500 border-pink-500/20">
                    <Code className="h-3 w-3 mr-1" /> {tech}
                  </Badge>
                ))}
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
                {projectDetails.team_members.map((member, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                      <AvatarFallback>{member.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{member}</span>
                  </div>
                ))}

                {projectDetails.team_members.length === 0 && (
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

