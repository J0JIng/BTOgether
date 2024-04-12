import React, { useEffect, useState } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Stack
} from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import CommuteIcon from "@mui/icons-material/Commute";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { getAmenities } from "./GetAmenities";

// GeoJson Files
import gymgeojson from "../geojson/GymsSGGEOJSON.geojson";
import hawkergeojson from "../geojson/HawkerCentresGEOJSON.geojson";
import parksgeojson from "../geojson/Parks.geojson";
import preschoolgeojson from "../geojson/PreSchoolsLocation.geojson";
import clinicgeojson from "../geojson/CHASClinics.geojson";
import mallsgeojson from "../geojson/shopping_mall_coordinates.geojson";
import mrtgeojson from "../geojson/mrt_coordinates.geojson";
import mrtfuturegeojson from "../geojson/mrtfuture_coordinates.geojson";
import StationIcon from "./StationIcon";

const Panel = ({ allData, data, fieldLabels, selection, onChange }) => {
    const [parentsTime, setParentsTime] = useState(null);
    const [parentsCarTime, setParentsCarTime] = useState(null);
    const [workTime, setWorkTime] = useState(null);
    const [workCarTime, setWorkCarTime] = useState(null);
    const [amenities, setAmenities] = useState({
      Clinics: null,
      Gyms: null,
      Hawkers: null,
      Parks: null,
      Preschools: null,
      Malls: null
    });
    const [nearestStation, setNearestStation] = useState();
    const [nearestFutureStation, setNearestFutureStation] = useState();
    const [btoSaved, setBtosSaved] = useState(0);
  
    useEffect(() => {
      var cnt = 0
      if (allData) {
        if (allData.BTO1) cnt += 1
        if (allData.BTO2) cnt += 1
        if (allData.BTO3) cnt += 1
      }
      setBtosSaved(cnt)
    }, [allData])
  
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    }
    
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
  
    // Function to parse HTML content and extract attribute values
    function extractNameFromHtml(htmlContent) {
      const tableRegex = /<(table|tr|th|td)\b[^>]*>/i;
      if (tableRegex.test(htmlContent.popUp) === true) {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent.popUp;
        const thElements = tempElement.querySelectorAll("th");
        let nameElement = null;
        thElements.forEach((th) => {
          if (
            th.textContent.trim() === "NAME" ||
            th.textContent.trim() === "CENTRE_NAME" ||
            th.textContent.trim() === "HCI_NAME"
          ) {
            nameElement = th;
          }
        });
        if (nameElement) {
          const tdElement = nameElement.nextElementSibling;
          if (tdElement) {
            return tdElement.textContent.trim();
          }
        }
        return ""; // Return an empty string if "NAME" is not found
      } else {
        return htmlContent.popUp;
      }
    };
  
    function getNearest(chosenJson){
      var nearest = {obj: null, dist: null, stationCode: null};
      if (chosenJson) {
        return fetch(chosenJson)
          .then((response) => response.json())
          .then((dat) => {
            const newMarkers = dat.features
              .map((feature) => {
                const { Description, code } = feature.properties;
                const { coordinates } = feature.geometry;
                const [lng, lat] = coordinates; // Leaflet uses [lat, lng]
                return {
                  geocode: [lat, lng],
                  popUp: Description, // Assuming Description contains HTML content
                  stationCode: code
                };
              })
              // Filter markers by distance
              .filter((marker) => {
                if (!data.latitude || !data.longitude)
                  return true; // Show all if no home marker is set
                const distanceFromHome = getDistanceFromLatLonInKm(
                  data.latitude, data.longitude, marker.geocode[0], marker.geocode[1]);
                if (distanceFromHome <= nearest.dist || nearest.dist == null) {
                  nearest = {obj: marker, dist: distanceFromHome, stationCode: marker.stationCode}
                }
              });
            return nearest; // Return the count of newMarkers
          })
          .catch((error) => {
            console.error("Error fetching GeoJSON:", error);
            return 0; // Return 0 if there's an error
          });
      }
    };
  
    const fetchPublicTransport = async (endLat, endLng, setTime) => {
      try {
        const response = await axios.get(
          `https://transit.router.hereapi.com/v8/routes`,
          {
            params: {
              apiKey: "ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI",
              origin: `${data.latitude},${data.longitude}`,
              destination: `${endLat},${endLng}`,
              return: "intermediate",
            },
          }
        );
        {
          (() => {
            const totalMilliseconds = response.data.routes[0].sections.reduce(
              (total, section) => {
                const departureTime = new Date(section.departure.time);
                const arrivalTime = new Date(section.arrival.time);
                return total + (arrivalTime - departureTime);
              },
              0
            );
            const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
            const totalMinutes = Math.floor(
              (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
            );
            let totalTimeTaken = "";
            if (totalHours > 0) {
              totalTimeTaken += `${totalHours} hr `;
            }
            totalTimeTaken += `${totalMinutes} min`;
            setTime(totalTimeTaken);
          })();
        }
      } catch (error) {
        setTime("Error fetching route data:", error);
      }
    };
  
    const fetchTransport = async (endLat, endLng, setTime) => {
      try {
        const response = await axios.get(
          "https://router.hereapi.com/v8/routes?transportMode=car&origin=" +
            data.latitude +
            "," +
            data.longitude +
            "&destination=" +
            endLat +
            "," +
            endLng +
            "&return=summary&apikey=ssJnHuXxZBHgTKHCyuaMMxIj0r05GW4vC3K49sWkeZI"
        );
        (() => {
          const totalSeconds = response.data.routes[0].sections.reduce(
            (total, section) => total + section.summary.duration,
            0
          );
          const totalMinutes = Math.floor(totalSeconds / 60);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          let totalTimeTaken = "";
          if (hours > 0) {
            totalTimeTaken += `${hours} hr `;
          }
          if (minutes > 0) {
            totalTimeTaken += `${minutes} min`;
          }
          setTime(totalTimeTaken);
        })();
      } catch (error) {
        setTime("Error fetching route data:", error);
      }
    };
  
    useEffect(() => {
      if (data && selection) {
        if (data.parentsAddress && data.latitude && data.longitude) {
          fetchPublicTransport(data.parentsAddress.latitude,data.parentsAddress.longitude,setParentsTime);
          fetchTransport(data.parentsAddress.latitude,data.parentsAddress.longitude,setParentsCarTime);
        }
        if (data.workplaceLocation && data.latitude && data.longitude) {
          fetchPublicTransport(data.workplaceLocation.latitude,data.workplaceLocation.longitude,setWorkTime);
          fetchTransport(data.workplaceLocation.latitude,data.workplaceLocation.longitude,setWorkCarTime);
        }
        getNearest(mrtgeojson).then((obj) => {
          setNearestStation({name: extractNameFromHtml(obj.obj), dist: obj.dist.toFixed(2), stationCode: obj.stationCode})
        });
        getNearest(mrtfuturegeojson).then((obj) => {
          setNearestFutureStation({name: extractNameFromHtml(obj.obj), dist: obj.dist.toFixed(2), stationCode: obj.stationCode})
        });
        getAmenities(clinicgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({
          ...prevState, // Copy the previous state
          Clinics: count // Update the value of the 'preschools' field
        }));})
        getAmenities(gymgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({
          ...prevState, // Copy the previous state
          Gyms: count // Update the value of the 'preschools' field
        }));})
        getAmenities(hawkergeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({
          ...prevState, // Copy the previous state
          Hawkers: count // Update the value of the 'preschools' field
        }));})
        getAmenities(parksgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({
          ...prevState, // Copy the previous state
          Parks: count // Update the value of the 'preschools' field
        }));})
        getAmenities(preschoolgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({
          ...prevState, // Copy the previous state
          Preschools: count // Update the value of the 'preschools' field
        }));})
        getAmenities(mallsgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({
          ...prevState, // Copy the previous state
          Malls: count // Update the value of the 'preschools' field
        }));})
      }
    }, [data]);
  
    return (
      <Container
        sx={{
          border: 1,
          borderColor: "silver",
          borderRadius: 1,
          boxShadow: 4,
          p: 2,
        }}
        style={{ background: "white" }}
      >
        <FormControl fullWidth disabled={btoSaved < 2}>
          <InputLabel style={{ background: "white" }}>{btoSaved < 2 ? "" : "Choose a BTO"}
          </InputLabel>
          <Select
            label="Choose a BTO"
            onChange={onChange}
            value={selection}
            sx={{ mb: 2 }}
            style={{ background: "white" }}>
          {allData && allData.BTO1 && <MenuItem value="BTO 1">BTO 1</MenuItem>}
          {allData && allData.BTO2 && <MenuItem value="BTO 2">BTO 2</MenuItem>}
          {allData && allData.BTO3 && <MenuItem value="BTO 3">BTO 3</MenuItem>}
          </Select>
        </FormControl>
        {data && selection ? (
          <Stack spacing={2}>
            <Divider
              orientation="horizontal"
              flexItem
              style={{ background: "gray" }}
            />
            {data.salary && (
              <React.Fragment>
                <Typography variant="h7" sx={{ fontWeight: "bold" }}>
                  Salary: ${data.salary}
                </Typography>
                <Divider
                  orientation="horizontal"
                  flexItem
                  style={{ background: "gray" }}
                />
              </React.Fragment>
            )}
            <Typography variant="h7" sx={{ fontWeight: "bold" }}>
              {selection} Details:
            </Typography>
            <Stack
              divider={
                <Divider
                  orientation="horizontal"
                  flexItem
                  style={{ background: "lightgray" }}
                />
              }
              spacing={1}
            >
              {["projectname","address", "latitude", "longitude"].map((key) => (
                <React.Fragment key={key}>
                  {data && data[key] && (
                    <Stack spacing={0}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {fieldLabels[key]}:
                      </Typography>
                      <Typography>{data[key]}</Typography>
                    </Stack>
                  )}
                </React.Fragment>
              ))}
              {data && (data.numberofrooms > 0 && data.numberofrooms <= 5) && (
              <React.Fragment>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Room Type:
                </Typography>
                <Typography>
                  {(() => {
                    switch (data.numberofrooms) {
                      case 2: return "2-room";
                      case 3: return "3-room";
                      case 4: return "4-room";
                      case 5: return "5-room";
                      default: return "";
                    }
                  })()}
                </Typography>
              </React.Fragment>
              )}
            </Stack>
            <Divider
              orientation="horizontal"
              flexItem
              style={{ background: "gray" }}
            />
            <Typography variant="h7" sx={{ fontWeight: "bold" }}>
              Nearest MRT/LRT Station:
            </Typography>
            <Stack spacing={1.5}>
            {nearestStation && nearestStation.name && (
              <Stack spacing={1} direction="row" style={{display: 'flex',alignItems: 'center'}}>
                <StationIcon stationCode={nearestStation.stationCode} />
                <Typography variant="h7" > {nearestStation.name}: {nearestStation.dist}km </Typography>
              </Stack>
            )}
            {nearestFutureStation && (nearestStation.name !== nearestFutureStation.name || nearestStation.stationCode !== nearestFutureStation.stationCode) && (
              <React.Fragment>
              <Divider
              orientation="horizontal"
              flexItem
              style={{ background: "gray" }}/>
              <Typography variant="h7" sx={{ fontWeight: "bold" }}>
              Nearest Future MRT/LRT Station:
              </Typography>
              <Stack spacing={1} direction="row" style={{display: 'flex',alignItems: 'center'}}>
                <StationIcon stationCode={nearestFutureStation.stationCode} />
                <Typography variant="h7"> {nearestFutureStation.name} (U/C): {nearestFutureStation.dist}km </Typography>
              </Stack>
              </React.Fragment>
            )}
            </Stack>
            <Divider
              orientation="horizontal"
              flexItem
              style={{ background: "gray" }}
            />
            <Typography variant="h7" sx={{ fontWeight: "bold" }}>
              Amenities within 1km: {Object.values(amenities).reduce(
                (accumulator, currentValue) => accumulator + (currentValue || 0), // Use 0 if the value is null
                0
              )}
            </Typography>
            <Stack
              divider={
                <Divider
                  orientation="horizontal"
                  flexItem
                  style={{ background: "lightgray" }}
                />
              }
              spacing={1}
            >
              {Object.entries(amenities).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Stack spacing={0}>
                    <Typography>{key}: {value}</Typography>
                  </Stack>
                </React.Fragment>
              ))}
            </Stack>
            <Divider
              orientation="horizontal"
              flexItem
              style={{ background: "gray" }}
            />
            <Typography variant="h7" sx={{ fontWeight: "bold" }}>
              Parents' Address: {data.parentsAddress === undefined ? "Not specified" : ""}
            </Typography>
            {data.parentsAddress !== undefined && (<Stack
              divider={
                <Divider
                  orientation="horizontal"
                  flexItem
                  style={{ background: "lightgray" }}
                />
              }
              spacing={1}
            >
              {["address", "latitude", "longitude"].map((key) => (
                <React.Fragment key={key}>
                  {data && data.parentsAddress && (
                    <Stack spacing={0}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {fieldLabels[key]}:
                      </Typography>
                      <Typography>{data.parentsAddress[key]}</Typography>
                    </Stack>
                  )}
                </React.Fragment>
              ))}
              <Stack spacing={0}>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  <DirectionsCarIcon
                    fontSize="small"
                    style={{ verticalAlign: "top" }}
                  />
                  Travel Time via Car:
                </Typography>
                <Typography>{parentsCarTime}</Typography>
              </Stack>
              <Stack spacing={0}>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  <CommuteIcon
                    fontSize="small"
                    style={{ verticalAlign: "top" }}
                  />
                  Travel Time via Public Transport:
                </Typography>
                <Typography>{parentsTime}</Typography>
              </Stack>
            </Stack>)}
            <Divider
              orientation="horizontal"
              flexItem
              style={{ background: "gray" }}
            />
            <Typography variant="h7" sx={{ fontWeight: "bold" }}>
              Workplace Address: {data.workplaceLocation === undefined ? "Not specified" : ""}
            </Typography>
            {data.workplaceLocation !== undefined && (<Stack
              divider={
                <Divider
                  orientation="horizontal"
                  flexItem
                  style={{ background: "lightgray" }}
                />
              }
              spacing={1}
            >
              {["address", "latitude", "longitude"].map((key) => (
                <React.Fragment key={key}>
                  {data && data.workplaceLocation && (
                    <Stack spacing={0}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {fieldLabels[key]}:
                      </Typography>
                      <Typography>{data.workplaceLocation[key]}</Typography>
                    </Stack>
                  )}
                </React.Fragment>
              ))}
              <Stack spacing={0}>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  <DirectionsCarIcon
                    fontSize="small"
                    style={{ verticalAlign: "top" }}
                  />
                  Travel Time via Car:
                </Typography>
                <Typography>{workCarTime}</Typography>
              </Stack>
              <Stack spacing={0}>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  <CommuteIcon
                    fontSize="small"
                    style={{ verticalAlign: "top" }}
                  />
                  Travel Time via Public Transport:
                </Typography>
                <Typography>{workTime}</Typography>
              </Stack>
            </Stack>)}
          </Stack>
        ) : (
          <Typography variant="h7">{btoSaved < 2 ? "Insufficient BTOs to Compare": "Choose a BTO to Compare"}</Typography>
        )}
      </Container>
    );
  };

  export default Panel