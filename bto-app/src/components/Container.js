import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Button } from './Button';

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
    React.createElement('div', Object.assign({}, attributes, {
      ref: setNodeRef,
      style: {
        transition,
        transform: CSS.Translate.toString(transform),
      },
      className: clsx(
        'w-full h-full p-4 bg-black-50 rounded-xl flex flex-col gap-y-4',
        isDragging && 'opacity-100',
      ),
    }), [
      React.createElement('div', { className: 'flex items-center justify-between' }, [
        React.createElement('div', { className: 'flex flex-col gap-y-1' }, [
          React.createElement('h1', { className: 'text-gray-800 text-xl' }, title),
          React.createElement('p', { className: 'text-gray-400 text-sm' }, description),
        ]),
        React.createElement('button', Object.assign({
          className: 'border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl',
        }, listeners), 'Drag Handle'),
      ]),
      children,
      React.createElement(Button, { variant: 'ghost', onClick: onAddItem }, 'Add Item'),
    ])
  );
};

export default Container;

