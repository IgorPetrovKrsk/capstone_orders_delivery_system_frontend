import React, { type ReactNode } from 'react';
import {useDroppable} from '@dnd-kit/core';

interface DroppableProps {
  children: ReactNode;
}

function Droppable({ children }:DroppableProps) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}