import React, { useEffect, useState } from "react";
import { Typography, FormControl, InputLabel, Select, MenuItem, Container, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import CommuteIcon from "@mui/icons-material/Commute";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// Utility functions
import { getAmenities } from "./GetAmenities";
import { fetchTravelTime } from "../utils/fetchTravelTime";
import { fetchPublicTransport } from "../utils/fetchPublicTransport";
import { GetNearest } from "../utils/GetNearest";
import { extractNameFromHtml } from "../utils/extractNameFromHtml";

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

/**
 * This component represents the vertical panel of each Build-To-Order (BTO) displayed 
 * in the comparison tab. It provides information such as the BTO name, nearest MRT station, 
 * travel times to various locations, and amenities in the area.
 * 
 * @param {Object} props - The props object containing the following properties:
 *   - allData: An object containing all the BTO data
 *   - data: The specific data for the current BTO panel
 *   - fieldLabels: Labels for the fields displayed in the panel
 *   - selection: The selected BTO option in the comparison dropdown
 *   - onChange: A function to handle changes in selection
 * 
 * @returns JSX element representing the panel component
 */

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
    const [nearestGym, setNearestGym] = useState();
    const [nearestHawker, setNearestHawker] = useState();
    const [nearestPark, setNearestPark] = useState();
    const [nearestPreschool, setNearestPreschool] = useState();
    const [nearestClinic, setNearestClinic] = useState();
    const [nearestMall, setNearestMall] = useState();
  
    useEffect(() => {
      var cnt = 0
      if (allData) {
        if (allData.BTO1) cnt += 1
        if (allData.BTO2) cnt += 1
        if (allData.BTO3) cnt += 1
      }
      setBtosSaved(cnt)
    }, [allData]) 

    useEffect(() => {
      if (data && selection) {
        if (data.parentsAddress && data.latitude && data.longitude) {
          fetchPublicTransport(data.latitude, data.longitude, data.parentsAddress.latitude,data.parentsAddress.longitude)
          .then(time => {setParentsTime(time)})
          fetchTravelTime(data.latitude, data.longitude, data.parentsAddress.latitude,data.parentsAddress.longitude,"car")
          .then(time => {setParentsCarTime(time)})
        }
        if (data.workplaceLocation && data.latitude && data.longitude) {
          fetchPublicTransport(data.latitude, data.longitude, data.workplaceLocation.latitude,data.workplaceLocation.longitude)
          .then(time => {setWorkTime(time)})
          fetchTravelTime(data.latitude, data.longitude, data.workplaceLocation.latitude,data.workplaceLocation.longitude,"car")
          .then(time => {setWorkCarTime(time)})
        }
        GetNearest(mrtgeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestStation({name: obj.properties.Description, dist: obj.dist.toFixed(2), stationCode: obj.properties.code})
        });
        GetNearest(mrtfuturegeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestFutureStation({name: obj.properties.Description, dist: obj.dist.toFixed(2), stationCode: obj.properties.code})
        });
        GetNearest(clinicgeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestClinic({description: obj.properties.Description, dist: obj.dist.toFixed(2)})
        });
        GetNearest(gymgeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestGym({description: obj.properties.Description, dist: obj.dist.toFixed(2)})
        });
        GetNearest(hawkergeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestHawker({description: obj.properties.Description, dist: obj.dist.toFixed(2)})
        });
        GetNearest(parksgeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestPark({description: obj.properties.Description, dist: obj.dist.toFixed(2)})
        });
        GetNearest(preschoolgeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestPreschool({description: obj.properties.Description, dist: obj.dist.toFixed(2)})
        });
        GetNearest(mallsgeojson, { latitude: data.latitude, longitude: data.longitude }).then((obj) => {
          setNearestMall({description: obj.properties.Description, dist: obj.dist.toFixed(2)})
        });
        getAmenities(clinicgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({...prevState, Clinics: count }));})
        getAmenities(gymgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({...prevState, Gyms: count }));})
        getAmenities(hawkergeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({...prevState, Hawkers: count }));})
        getAmenities(parksgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({...prevState, Parks: count }));})
        getAmenities(preschoolgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({...prevState, Preschools: count }));})
        getAmenities(mallsgeojson, { latitude: data.latitude, longitude: data.longitude })
        .then((count) => {setAmenities(prevState => ({...prevState, Malls: count }));})
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
                (accumulator, currentValue) => accumulator + (currentValue || 0), 0 // Use 0 if the value is null
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
            <Typography variant="h7" sx={{ fontWeight: "bold" }}>Nearest Amenities:</Typography>

            {nearestClinic && nearestClinic.description && (
            <><Typography>{extractNameFromHtml(nearestClinic.description)}: {nearestClinic.dist}km </Typography>
            <Divider orientation="horizontal" flexItem style={{ background: "lightgray", marginTop: "10px" }}/></>)}
            {nearestGym && nearestGym.description && (
            <><Typography>{extractNameFromHtml(nearestGym.description)}: {nearestGym.dist}km </Typography>
            <Divider orientation="horizontal" flexItem style={{ background: "lightgray", marginTop: "10px" }}/></>)}
            {nearestHawker && nearestHawker.description && (
            <><Typography>{extractNameFromHtml(nearestHawker.description)}: {nearestHawker.dist}km </Typography>
            <Divider orientation="horizontal" flexItem style={{ background: "lightgray", marginTop: "10px" }}/></>)}
            {nearestPark && nearestPark.description && (
            <><Typography>{extractNameFromHtml(nearestPark.description)}: {nearestPark.dist}km </Typography>
            <Divider orientation="horizontal" flexItem style={{ background: "lightgray", marginTop: "10px" }}/></>)}
            {nearestPreschool && nearestPreschool.description && (
            <><Typography>{extractNameFromHtml(nearestPreschool.description)}: {nearestPreschool.dist}km </Typography>
            <Divider orientation="horizontal" flexItem style={{ background: "lightgray", marginTop: "10px" }}/></>)}
            {nearestMall && nearestMall.description && (
            <Typography>{extractNameFromHtml(nearestMall.description)}: {nearestMall.dist}km </Typography>)}

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