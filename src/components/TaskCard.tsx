import { Task, TaskStatus } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical, 
  Pencil, 
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-priority-low/10 text-priority-low border-priority-low/20' },
  medium: { label: 'Medium', className: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20' },
  high: { label: 'High', className: 'bg-priority-high/10 text-priority-high border-priority-high/20' },
};

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, className: 'text-muted-foreground' },
  'in-progress': { label: 'In Progress', icon: Clock, className: 'text-accent' },
  done: { label: 'Done', icon: CheckCircle2, className: 'text-success' },
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const StatusIcon = statusConfig[task.status].icon;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const cycleStatus = () => {
    const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(task.id, nextStatus);
  };

  return (
    <Card className={cn(
      "p-4 glass-card task-card-hover slide-up",
      task.status === 'done' && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <button
          onClick={cycleStatus}
          className={cn(
            "mt-0.5 transition-colors hover:scale-110",
            statusConfig[task.status].className
          )}
        >
          <StatusIcon className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-foreground leading-tight",
              task.status === 'done' && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
                  <Circle className="h-4 w-4 mr-2" /> To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>
                  <Clock className="h-4 w-4 mr-2" /> In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Done
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge 
              variant="outline" 
              className={cn("text-xs", priorityConfig[task.priority].className)}
            >
              {priorityConfig[task.priority].label}
            </Badge>

            {task.dueDate && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs gap-1",
                  isOverdue && "bg-destructive/10 text-destructive border-destructive/20",
                  isDueToday && !isOverdue && "bg-warning/10 text-warning border-warning/20"
                )}
              >
                {isOverdue && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                {format(new Date(task.dueDate), 'MMM d')}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
