import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button} from "@/components/ui/button";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  weightage: number;
  status: "To Do" | "In Progress" | "Completed";
  assignee?: string;
  onUpdateStatus: (taskId: string, status: "To Do" | "In Progress" | "Completed") => void;
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
        {status === "To Do" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onUpdateStatus(id, "In Progress")}
          >
            Start
          </Button>
        )}
        {status === "In Progress" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onUpdateStatus(id, "Completed")}
          >
            Complete
          </Button>
        )}
        {status === "Completed" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onUpdateStatus(id, "To Do")}
          >
            Reopen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;