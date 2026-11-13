import type { ReactNode } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Slot } from 'radix-ui';

type DragDropProps = {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  id: string | number;
};

type SortableProps = DragDropProps & { index: number; group?: string | number };

function Draggable({ asChild, disabled, id, ...props }: DragDropProps) {
  const { ref, isDragSource } = useDraggable({ id, disabled });

  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp {...props} ref={ref} data-dragging={isDragSource || undefined} />
  );
}

function Droppable({ asChild, disabled, id, ...props }: DragDropProps) {
  const { ref, isDropTarget } = useDroppable({ id, disabled });

  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp {...props} ref={ref} data-drop-target={isDropTarget || undefined} />
  );
}

function Sortable({
  asChild,
  disabled,
  group,
  id,
  index,
  ...props
}: SortableProps) {
  const { ref } = useSortable({ disabled, group, id, index });

  const Comp = asChild ? Slot.Root : 'div';

  return <Comp {...props} ref={ref} />;
}

export { Draggable, Droppable, Sortable };
