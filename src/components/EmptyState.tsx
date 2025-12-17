import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddTask: () => void;
  hasFilters?: boolean;
}

export const EmptyState = ({ onAddTask, hasFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center fade-in">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      
      {hasFilters ? (
        <>
          <h3 className="font-display text-lg font-semibold mb-1">No matching tasks</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="font-display text-lg font-semibold mb-1">No tasks yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-4">
            Get started by creating your first task. Stay organized and boost your productivity!
          </p>
          <Button onClick={onAddTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Create your first task
          </Button>
        </>
      )}
    </div>
  );
};
