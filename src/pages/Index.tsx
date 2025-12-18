import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskStats } from '@/components/TaskStats';
import { EmptyState } from '@/components/EmptyState';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTaskReminders } from '@/hooks/useTaskReminders';

const Index = () => {
  const { tasks, isLoaded, addTask, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  
  // Show reminders for overdue/due soon tasks on load
  useTaskReminders(tasks, isLoaded);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const hasFilters = Boolean(search) || statusFilter !== 'all' || priorityFilter !== 'all';

  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({ title: 'Task updated', description: 'Your changes have been saved.' });
    } else {
      addTask(taskData);
      toast({ title: 'Task created', description: 'Your new task is ready.' });
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast({ title: 'Task deleted', description: 'The task has been removed.' });
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
    if (status === 'done') {
      toast({ title: 'Well done!', description: 'Task marked as complete.' });
    }
  };

  const handleOpenForm = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Task Manager
                </h1>
                <p className="text-sm text-muted-foreground">
                  Stay organized, get things done
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/dashboard">
                <Button variant="outline" size="icon" className="shadow-sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <Button onClick={handleOpenForm} className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <TaskStats tasks={tasks} />
        </header>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
          />
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <EmptyState onAddTask={handleOpenForm} hasFilters={hasFilters} />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Task Form Dialog */}
        <TaskForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmit}
          editingTask={editingTask}
        />
      </div>
    </div>
  );
};

export default Index;
