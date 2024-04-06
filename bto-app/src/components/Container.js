import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "./Button";
import "../css/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Container = ({ id, children, title, description, onDelete }) => {
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
      type: "container",
    },
  });

  return (
    <div className="flex justify-between mb-4">
      <div
        ref={setNodeRef}
        {...attributes}
        style={{ transition, transform: CSS.Translate.toString(transform) }}
        className={clsx(
          "flex-none w-full md:w-96 p-4 bg-white rounded-lg shadow-md border border-gray-200",
          isDragging && "opacity-75"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-800 text-lg font-semibold">{title}</h1>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          <button
            className="flex items-center justify-center w-8 h-8 border-transparent shadow-md border text-gray-500 rounded-md hover:bg-gray-200 transition duration-300"
            {...listeners}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        {children}
        <button onClick={() => onDelete(id)}>Remove</button>
      </div>
    </div>
  );
};

export default Container;
