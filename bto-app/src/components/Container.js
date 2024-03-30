import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Button } from './Button';
import "tailwindcss/tailwind.css";

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
}) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{ transition, transform: CSS.Translate.toString(transform) }}
      className={clsx( 'w-full h-full p-4 bg-black-50 rounded-xl flex flex-col gap-y-4',
        isDragging && 'opacity-100'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </button>
      </div>
      {children}
      <Button variant="ghost" onClick={onAddItem}>
        Add Item
      </Button>
    </div>
  );
};

export default Container;