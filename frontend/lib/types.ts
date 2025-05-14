export interface Project {
    id: string
    name: string
    description: string
    type: string
    techStack: string[]
    startDate: string
    endDate: string
    progress: number
    teamMembers: string[]
    milestones: string[]
    membersRequired: string
    githublink:string
    status: "active" | "completed" | "applied"
  }
  
  export interface TeamMember {
    id: string
    name: string
    role: string
    avatar?: string
    rating: number
    skills: string[]
    projects: number
    email: string
  }
  
  export interface Sprint {
    id: string
    projectId: string
    name: string
    startDate: Date
    endDate: Date
    tasks: Task[]
  }
  
  export interface Task {
    id: string
    title: string
    description: string
    weightage: number
    status: "todo" | "in-progress" | "completed"
    assignee?: string
  }
  
  