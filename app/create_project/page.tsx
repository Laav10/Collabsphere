import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateProjectForm from "@/components/create-project-form"
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <Tabs defaultValue="create" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="create">Create Project</TabsTrigger>
         
        </TabsList>
        <TabsContent value="create">
        <CreateProjectForm />
        </TabsContent>
      </Tabs>
    </main>
  )
}

