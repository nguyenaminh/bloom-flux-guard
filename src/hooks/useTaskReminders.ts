import { useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { isToday, isBefore, startOfDay, addDays } from 'date-fns';

export function useTaskReminders(tasks: Task[], isLoaded: boolean) {
  const { toast } = useToast();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || hasShownRef.current) return;

    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);

    const overdueTasks = tasks.filter(task => {
      if (task.status === 'done' || !task.dueDate) return false;
      return isBefore(new Date(task.dueDate), today);
    });

    const dueTodayTasks = tasks.filter(task => {
      if (task.status === 'done' || !task.dueDate) return false;
      return isToday(new Date(task.dueDate));
    });

    const dueTomorrowTasks = tasks.filter(task => {
      if (task.status === 'done' || !task.dueDate) return false;
      const dueDate = startOfDay(new Date(task.dueDate));
      return dueDate.getTime() === tomorrow.getTime();
    });

    // Show notifications with slight delays for better UX
    const timeouts: NodeJS.Timeout[] = [];

    if (overdueTasks.length > 0) {
      timeouts.push(setTimeout(() => {
        toast({
          title: `⚠️ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
          description: overdueTasks.slice(0, 2).map(t => t.title).join(', ') + 
            (overdueTasks.length > 2 ? ` and ${overdueTasks.length - 2} more` : ''),
          variant: "destructive",
        });
      }, 500));
    }

    if (dueTodayTasks.length > 0) {
      timeouts.push(setTimeout(() => {
        toast({
          title: `📅 ${dueTodayTasks.length} task${dueTodayTasks.length > 1 ? 's' : ''} due today`,
          description: dueTodayTasks.slice(0, 2).map(t => t.title).join(', ') +
            (dueTodayTasks.length > 2 ? ` and ${dueTodayTasks.length - 2} more` : ''),
        });
      }, 1500));
    }

    if (dueTomorrowTasks.length > 0) {
      timeouts.push(setTimeout(() => {
        toast({
          title: `🔔 ${dueTomorrowTasks.length} task${dueTomorrowTasks.length > 1 ? 's' : ''} due tomorrow`,
          description: dueTomorrowTasks.slice(0, 2).map(t => t.title).join(', ') +
            (dueTomorrowTasks.length > 2 ? ` and ${dueTomorrowTasks.length - 2} more` : ''),
        });
      }, 2500));
    }

    hasShownRef.current = true;

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [tasks, isLoaded, toast]);
}
