import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import "../css/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMaximize } from "@fortawesome/free-solid-svg-icons";

import BarChart from "../components/BarChart";
import Counter from "../components/Counter";
import Timer from "../components/Timer";
import { ImageDisplay } from "../components/ImageRender";

const Container = ({
  id,
  children,
  title,
  description,
  long_description,
  timeToTravel,
  numberOfAmenities,
  imageUrl,
  onExpand,
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
          <div>
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
          {renderDisplayHandler(
            title,
            description,
            timeToTravel,
            numberOfAmenities
          )}
        </div>
      </div>
    </div>
  );
};

export default Container;

const renderDisplayHandler = (
  title,
  description,
  timeToTravel,
  numberOfAmenities
) => {
  if (title === "Amenities") {
    return (
      <div className="p-4 rounded-lg flex justify-center items-center ">
        {/* // Get Amenities Widget */}
        <Counter value={numberOfAmenities} />
      </div>
    );
  } else if (title === "Transportation") {
    return (
      <div className="p-4 rounded-lg flex justify-center items-center ">
        {/* // Get distance timing Widget*/}
        <Timer value={timeToTravel} />
      </div>
    );
  } else if (title === "Historical HDB Price") {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <BarChart />
      </div>
    );
  } else if (title === "Historical BTO Price") {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <BarChart />
      </div>
    );
  }
  if (title === "Location") {
    return (
      <div class="p-4  rounded-b-lg flex justify-end  object-cover h-48 w-96 ">
        {/* add image from pexel here  */}
        <ImageDisplay query={"singapore"} />
      </div>
    );
  } else if (title === "Town Council") {
    return (
      <div class="p-4 rounded-b-lg flex justify-end object-cover h-48 w-96 overflow-hidden">
        {/* add image from pexel here  */}
        <ImageDisplay query={"architecture"}  />
      </div>
    );
  } else if (title === "Number of Rooms") {
    return (
      <div class="p-4 rounded-b-lg flex justify-end  object-cover h-48 w-96 overflow-hidden">
        {/* add image from pexel here  */}
        <ImageDisplay query={"common corridor of hdb flat"} />
      </div>
    );
  }else {
    return null; // No image for other titles and descriptions
  }
};

/*const renderImage = (title, description) => {
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
  } else if (title === "Historical HDB Price") {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <BarChart />
      </div>
    );
  } else if (title === "Historical BTO Price") {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <BarChart />
      </div>
    );
  } else if (title === "Amenities") {
    return (
      <div className="p-4 rounded-lg flex justify-center items-center ">
        
        <Counter value={1} />
      </div>
    );
  } 
  else if (title === "Transportation") {
    return (
      <div className="p-4 rounded-lg flex justify-center items-center ">
        
        <Counter value={1} />
      </div>
    );
  } else {
    return null; // No image for other titles and descriptions
  }
}; */
