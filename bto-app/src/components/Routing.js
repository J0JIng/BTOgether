import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from "@mui/material";

const Routing = ({ startLat, startLng, endLat, endLng, apiKey, mapRef }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const routeDrawnRef = useRef(false);
  const [routeData, setRouteData] = useState();

  useEffect(() => {
    if (
      startLat == null ||
      startLng == null ||
      endLat == null ||
      endLng == null
    ) {
      if (mapRef.current) {
        mapRef.current.eachLayer((layer) => {
          if (
            layer instanceof L.Polyline &&
            layer.options.className === "publictransport"
          ) {
            mapRef.current.removeLayer(layer);
          }
        });
      }
      routeDrawnRef.current = false;
      setRouteData(null);
    }
  }, [startLat, startLng, endLat, endLng]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://transit.router.hereapi.com/v8/routes`,
          {
            params: {
              apiKey: apiKey,
              origin: `${startLat},${startLng}`,
              destination: `${endLat},${endLng}`,
              return: "intermediate",
            },
          }
        );
        drawRoute(response.data.routes[0]);
        setRouteData(response.data.routes[0]);
        console.log(response.data.routes[0])
      } catch (error) {
        setErrorMessage("Error fetching route data");
        console.error("Error fetching route data:", error);
      }
    };

    if (startLat && startLng && endLat && endLng) {
      fetchData();
    }
  }, [startLat, startLng, endLat, endLng, apiKey]);

  const drawRoute = (routeData) => {
    // Remove previous public transport polylines and markers
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (
          layer instanceof L.Polyline &&
          layer.options.className === "publictransport"
        ) {
          mapRef.current.removeLayer(layer);
        }
      });
    }

    // Define color mapping for different transport modes and longNames
    const colorMapping = {
      pedestrian: "#BCCEFB",
      bus: "#55DD33",
      busRapid: "#55DD33",
      subway: {
        "North South Line": "#D62821",
        "East West Line": "#189E4A",
        "North East Line": "#844184",
        "Circle Line": "#F2AD27",
        "Downtown Line": "#0354A6",
        "Thomson East Coast Line": "#9D5A25",
      },
    };

    const trainBorder = {
      "North South Line": "#832D2A",
      "East West Line": "#1E6037",
      "North East Line": "#553455",
      "Circle Line": "#A07625",
      "Downtown Line": "#133B63",
      "Thomson East Coast Line": "#684326",
    };

    // Draw new polylines with colors based on transport mode and longName
    routeData.sections.forEach((section) => {
      const coordinates = [
        [
          section.departure.place.location.lat,
          section.departure.place.location.lng,
        ],
      ];

      // Add intermediate stops as points
      if (section.intermediateStops) {
        section.intermediateStops.forEach((stop) => {
          coordinates.push([
            stop.departure.place.location.lat,
            stop.departure.place.location.lng,
          ]);
        });
      }

      coordinates.push([
        section.arrival.place.location.lat,
        section.arrival.place.location.lng,
      ]);

      const color =
        colorMapping[section.transport.mode] &&
        section.transport.mode === "subway" &&
        colorMapping[section.transport.mode][section.transport.longName]
          ? colorMapping[section.transport.mode][section.transport.longName]
          : colorMapping[section.transport.mode] || "#A8A8A8"; // Default color

      // Check if this is the section where you want dotted lines
      if (section.transport.mode === "pedestrian") {
        L.polyline(coordinates, {
          color: "rgb(110, 134, 217)",
          weight: 8,
          className: "publictransport",
        }).addTo(mapRef.current);
        L.polyline(coordinates, {
          color: color,
          weight: 4,
          className: "publictransport",
        }).addTo(mapRef.current);
        L.polyline(coordinates, {
          color: "#0F53FF",
          weight: 4,
          className: "publictransport",
          dashArray: "2, 10",
        }).addTo(mapRef.current);
      } else if (
        section.transport.mode === "bus" ||
        section.transport.mode === "busRapid"
      ) {
        L.polyline(coordinates, {
          color: "#428F2F",
          weight: 8,
          className: "publictransport",
        }).addTo(mapRef.current);
        L.polyline(coordinates, {
          color: color,
          weight: 4,
          className: "publictransport",
        }).addTo(mapRef.current);
      } else {
        L.polyline(coordinates, {
          color: trainBorder[section.transport.longName],
          weight: 8,
          className: "publictransport",
        }).addTo(mapRef.current);
        L.polyline(coordinates, {
          color: color,
          weight: 4,
          className: "publictransport",
        }).addTo(mapRef.current);
      }

      // Add markers for intermediate stops
      if (section.intermediateStops) {
        section.intermediateStops.forEach((stop) => {
          L.marker([
            stop.departure.place.location.lat,
            stop.departure.place.location.lng,
          ]).addTo(mapRef.current);
        });
      }
    });

    // Fit map bounds to the new polylines
    const bounds = L.latLngBounds(
      routeData.sections
        .map((section) => [
          section.departure.place.location.lat,
          section.departure.place.location.lng,
        ])
        .concat(
          routeData.sections.map((section) => [
            section.arrival.place.location.lat,
            section.arrival.place.location.lng,
          ])
        )
    );
    mapRef.current.fitBounds(bounds);

    routeDrawnRef.current = true;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {routeDrawnRef.current && (
        <TableContainer component={Paper} sx={{boxShadow: 1, p: 1, mr: 1, border: "2px lightgray solid", borderRadius: 2}}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} sx={{textAlign: "center"}}><Typography>Public Transport Route</Typography></TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={{backgroundColor: "#f7776b", color: "white", borderTopLeftRadius: "5px"}}>Waypoints</TableCell>
                <TableCell align="left" sx={{backgroundColor: "#f7776b", color: "white"}}>Transport Mode</TableCell>
                <TableCell align="left" sx={{backgroundColor: "#f7776b", color: "white", borderTopRightRadius: "5px"}}>Time Taken</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routeData.sections.map((section, index) => {
                const departureTime = new Date(section.departure.time);
                const arrivalTime = new Date(section.arrival.time);
                const diff = arrivalTime - departureTime;
                const hours = Math.floor(diff / (1000 * 60 * 60)); // Convert milliseconds to hours
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
                let timeTaken = "";
                if (hours > 0) {
                  timeTaken += `${hours} hr `;
                }
                timeTaken += `${minutes} min`;
                return (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" sx={{ backgroundColor: "#ffeae9" }}>
                      {section.arrival.place.name}
                    </TableCell>
                    <TableCell align="left" sx={{ backgroundColor: "#ffeae9" }}>
                      {section.transport.name
                        ? section.transport.mode === "bus"
                          ? "Bus " + section.transport.name
                          : section.transport.name
                        : "Walk"}
                    </TableCell>
                    <TableCell align="left" sx={{ backgroundColor: "#ffeae9" }}>
                      {timeTaken}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Routing;
