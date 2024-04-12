import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "./Button";
import "../css/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMaximize,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import cat from "../assets/image.png";
import cat2 from "../assets/imagev2.png";
import BarChart from "../components/BarChart"

/**
 * Renders an image or chart component based on the provided title and description.
 * 
 * @param {string} title - The title of the component.
 * @param {string} description - The description of the component.
 * @returns {JSX.Element|null} - Returns the JSX representation of the image or chart component if the conditions are met, otherwise returns null.
 */
const renderImage = (title, description) => {
  if (title === "Location" && description === "Woodlands Drive 16.") {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <img src={cat} alt="cat" className="w-full h-full object-cover" />
      </div>
    );
  } else if (
    title === "Town Council" &&
    description === "Sembawang Town Council."
    
  ) {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <img src={cat2} alt="cat" className="w-full h-full object-cover" />
      </div>
    );
  } else if (
    title === "Historical HDB Price"
  ) {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <BarChart/>
      </div>
    );
  }else if (
    title === "Historical BTO Price"
  ) {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <BarChart/>
      </div>
    );
  }
    else {
    return null; // No image for other titles and descriptions
  }
};

/**
 * Represents a container component with sortable functionality.
 * 
 * @param {object} props - The properties passed to the Container component.
 * @param {string} props.id - The unique identifier of the container.
 * @param {ReactNode} props.children - The child components of the container.
 * @param {string} props.title - The title of the container.
 * @param {string} props.description - The description of the container.
 * @param {string} props.long_description - The long description of the container.
 * @param {Function} props.onExpand - The function to expand the container.
 * @returns {JSX.Element} - Returns the JSX representation of the Container component.
 */
const Container = ({ id, children, title, description, long_description, onExpand }) => {
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
          "relative flex-none w-full md:w-64 p-4 bg-white rounded-lg shadow-md border",
          isDragging && "opacity-50"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="">
            <h1 className="text-green-800 text-lg font-semibold">{title}</h1>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={onExpand}
              className="w-8 h-8 border-transparent shadow-md border rounded-md hover:bg-gray-200 transition duration-300 text-gray-500"
            >
              <FontAwesomeIcon icon={faMaximize} />
            </button>
            <button
              className="ml-2 w-8 h-8 border-transparent shadow-md border text-gray-500 rounded-md hover:bg-gray-200 transition duration-300"
              {...listeners}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>

        {children}
        <div className="mb-4 rounded-lg overflow-hidden relative">
          {renderImage(title, description)}
        </div>
      </div>
    </div>
  );
};

export default Container;
