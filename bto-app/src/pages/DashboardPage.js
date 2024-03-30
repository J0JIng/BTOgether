import React, { useState } from 'react';
import Navbar from "../components/NavBar";

import { DndContext } from '@dnd-kit/core';
import { Droppable } from '../components/Droppable';
import { Draggable } from '../components/Draggable';

const DashboardPage = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const containers = ['A', 'B', 'C']; // Define your containers

  function arrayMove(array, oldIndex, newIndex) {
    if (newIndex >= array.length) {
      let k = newIndex - array.length + 1;
      while (k--) {
        array.push(undefined);
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  }
  
  function handleDragEnd(event) {
  const { active, over } = event;

  // Check if over is null before accessing its id property
  if (over && active.id !== over.id) {
    setItems((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });
  }
}

function handleDragEnd(event) {
    const { active, over } = event;
  
    // Check if over is null before accessing its id property
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  

  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

  return (
    <div>
    <Navbar/>
      <DndContext onDragEnd={handleDragEnd}>
        {containers.map((id) => (
          <Droppable key={id} id={id}>
            {draggableMarkup}
          </Droppable>
        ))}
      </DndContext>
    </div>
  );
};

export default DashboardPage;
