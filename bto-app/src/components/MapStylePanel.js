import React, { useState } from "react";

import transit2 from "../icons/transit2.png";
import transit from "../icons/transit.png";
import satellite from "../icons/satellite.png";
import base from "../icons/base.png";

export const MapStylePanel = ({
  currentSource,
  setMapStyle,
  setCurrentSource,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); // To store the timeout ID
  const [hoveringOverSide, setHoveringOverSide] = useState(false);

  const iconSize = "50px";

  const mainPanelStyle = {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "70px",
    height: "90px",
  };

  const sidePanelStyle = {
    position: "absolute",
    display: "flex",
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "right",
    alignItems: "center",
    bottom: "10px",
    left: "90px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "290px",
    height: "90px",
    cursor: "pointer",
    transition: "opacity 0.3s ease", // Add transition for smooth hiding
    opacity: expanded ? 1 : 0, // Hide when not expanded
  };

  const handleClick = (mapStyle, type) => {
    setExpanded(false); // Collapse the panel when clicked
    clearTimeout(timeoutId); // Clear any existing timeout
    setMapStyle(mapStyle);
    setHoveringOverSide(false);

    if (type === "base") {
      setCurrentSource(base);
    } else if (type === "satellite") {
      setCurrentSource(satellite);
    } else if (type === "transit2") {
      setCurrentSource(transit2);
    } else if (type === "transit") {
      setCurrentSource(transit);
    }
  };

  const handleMainPanelHover = () => {
    clearTimeout(timeoutId); // Clear any existing timeout
    setExpanded(true); // Always expand when hovering over the main panel
  };

  const handleMainPanelLeave = () => {
    clearTimeout(timeoutId); // Clear any existing timeout
    // Set a new timeout to hide the side panel after 3 seconds
    setTimeoutId(
      setTimeout(() => {
        if (hoveringOverSide === false) {
          setExpanded(false);
        }
      }, 1000)
    );
  };

  const handleSidePanelHover = () => {
    clearTimeout(timeoutId); // Clear any existing timeout
    setExpanded(true);
    setHoveringOverSide(true);
  };

  const handleSidePanelLeave = () => {
    setHoveringOverSide(false);
    setExpanded(false);
  };

  return (
    <div>
      <div
        style={{
          ...mainPanelStyle,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="leaflet-bar leaflet-control"
        onMouseEnter={handleMainPanelHover}
        onMouseLeave={handleMainPanelLeave}
      >
        <img
          src={currentSource}
          alt="Base Map"
          style={{
            bottom: "10px",
            marginBottom: "5px",
            marginTop: "5px",
            width: iconSize,
            height: iconSize,
            border: "2px solid LightSteelBlue",
            borderRadius: "5px",
          }}
          onClick={() =>
            handleClick(
              "https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
            )
          }
        />
        <span>Layers</span>
      </div>

      {expanded && (
        <div
          style={sidePanelStyle}
          className="leaflet-bar leaflet-control"
          onMouseEnter={handleSidePanelHover}
          onMouseLeave={handleSidePanelLeave} // Still hide when leaving the side panel
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "15px",
              alignItems: "center",
            }}
            onClick={() =>
              handleClick(
                "https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
                "base"
              )
            }
          >
            <img
              src={base}
              alt="Base Map"
              style={{
                marginTop: "5px",
                marginBottom: "5px",
                width: iconSize,
                height: iconSize,
                border: "2px solid LightSteelBlue",
                borderRadius: "5px",
              }}
            />
            <span>Base</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "15px",
              alignItems: "center",
            }}
            onClick={() =>
              handleClick(
                "https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
                "satellite"
              )
            }
          >
            <img
              src={satellite}
              alt="Base Map"
              style={{
                marginTop: "5px",
                marginBottom: "5px",
                width: iconSize,
                height: iconSize,
                border: "2px solid LightSteelBlue",
                borderRadius: "5px",
              }}
            />
            <span>Satellite</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "15px",
              alignItems: "center",
            }}
            onClick={() =>
              handleClick(
                "https://mt1.google.com/vt/lyrs=m@221097413,transit&hl=en&x={x}&y={y}&z={z}",
                "transit"
              )
            }
          >
            <img
              src={transit}
              alt="Base Map"
              style={{
                marginTop: "5px",
                marginBottom: "5px",
                width: iconSize,
                height: iconSize,
                border: "2px solid LightSteelBlue",
                borderRadius: "5px",
              }}
            />
            <span>Transit</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "15px",
              alignItems: "center",
            }}
            onClick={() =>
              handleClick(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                "transit2"
              )
            }
          >
            <img
              src={transit2}
              alt="Base Map"
              style={{
                marginTop: "5px",
                marginBottom: "5px",
                width: iconSize,
                height: iconSize,
                border: "2px solid LightSteelBlue",
                borderRadius: "5px",
              }}
            />
            <span>Transit 2</span>
          </div>
        </div>
      )}
    </div>
  );
};
