import { Task } from '@/types/task';
import { CheckCircle2, Circle, Clock, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;

  const stats = [
    { label: 'Total', value: total, icon: ListTodo, color: 'text-foreground' },
    { label: 'To Do', value: todo, icon: Circle, color: 'text-muted-foreground' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-accent' },
    { label: 'Completed', value: done, icon: CheckCircle2, color: 'text-success' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-lg p-4 flex items-center gap-3"
        >
          <stat.icon className={`h-5 w-5 ${stat.color}`} />
          <div>
            <p className="text-2xl font-display font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
