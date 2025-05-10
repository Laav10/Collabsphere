"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CreateProjectForm from "@/components/create-project-form"

interface CreateProjectButtonProps {
  variant?: "default" | "outline"
}

export default function CreateProjectButton({ variant = "default" }: CreateProjectButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            variant === "default"
              ? "bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              : "border-zinc-700"
          }
          variant={variant}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-pink-500">Create New Project</DialogTitle>
          <DialogDescription>Fill in the details below to create a new project.</DialogDescription>
        </DialogHeader>
        <CreateProjectForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

