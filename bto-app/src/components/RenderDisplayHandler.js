import React from "react";
import Counter from "./Counter";
import Timer from "./Timer";
import BarChart from "./BarChart";
import { ImageDisplay } from "./PexelsImageRender";

const RenderDisplayHandler = ({ title, description, timeToTravel, numberOfAmenities , latitude , longitude ,flatType }) => {
 
  if (title === "Amenities") {
    return (
      <div className="p-4 rounded-lg flex justify-center items-center">
        <Counter value={numberOfAmenities} />
      </div>
    );
  } else if (title === "Transportation") {
    return (
      <div className="p-4 rounded-lg flex justify-center items-center">
        <Timer value={timeToTravel} />
      </div>
    );
  } else if (title === "Historical HDB Price" || title === "Historical BTO Price") {
    return (
      <div className="mb-4 rounded-lg overflow-hidden">
        <BarChart title={title}  />
      </div>
    );
  } else if (title === "Location") {
    return (
      <div className="p-4 rounded-b-lg flex justify-end object-cover h-48 w-96">
        <ImageDisplay query={"singapore"} />
      </div>
    );
  } else if (title === "Town Council") {
    return (
      <div className="p-4 rounded-b-lg flex justify-end object-cover h-48 w-96 overflow-hidden">
        <ImageDisplay query={"architecture"} />
      </div>
    );
  } else if (title === "Number of Rooms") {
    return (
      <div className="p-4 rounded-b-lg flex justify-end object-cover h-48 w-96 overflow-hidden">
        <ImageDisplay query={"common corridor of hdb flat"} />
      </div>
    );
  } else {
    return null; // No image for other titles and descriptions
  }
};

export default RenderDisplayHandler;
