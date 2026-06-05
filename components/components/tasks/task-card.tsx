import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button, Badge } from "@/components/ui/button";
import { CheckCircle2, Circle, Users } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  weightage: number;
  status: "todo" | "in-progress" | "completed";
  assignee?: string;
  onUpdateStatus: (taskId: string, status: "todo" | "in-progress" | "completed") => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, weightage, status, assignee, onUpdateStatus }) => {
  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant="outline" className="ml-2 bg-zinc-700">
            {weightage} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        {assignee && (
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{assignee}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-end">
        {status === "todo" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onUpdateStatus(id, "in-progress")}
          >
            Start
          </Button>
        )}
        {status === "in-progress" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onUpdateStatus(id, "completed")}
          >
            Complete
          </Button>
        )}
        {status === "completed" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onUpdateStatus(id, "todo")}
          >
            Reopen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;