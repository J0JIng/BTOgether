import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import "../css/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMaximize } from "@fortawesome/free-solid-svg-icons";
import RenderDisplayHandler from "./RenderDisplayHandler";

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
  latitude,
  longitude,
  flatType,
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
        <div className="flex flex-col mb-4">
          {" "}
          {/* Adjusted structure */}
          <div className="flex items-center justify-between">
            {" "}
            {/* Utilizing justify-between */}
            <h1 className="p-2 text-green-800 text-lg font-semibold">
              {title}
            </h1>
            <div className="flex items-center">
              {" "}
              {/* Moved icons to the right */}
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
          <p className="p-2 text-gray-600 text-sm">{description}</p>
        </div>

        {children}
        <div className="mb-4 rounded-lg overflow-hidden relative">
          <RenderDisplayHandler
            title={title}
            description={description}
            timeToTravel={timeToTravel}
            numberOfAmenities={numberOfAmenities}
            latitude={latitude}
            longitude={longitude}
            flatType={flatType}
          />
        </div>
      </div>
    </div>
  );
};

export default Container;
