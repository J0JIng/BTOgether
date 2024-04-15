import { useEffect, useState, useRef, forwardRef } from "react";
import Navbar from "../components/NavBar";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCodeCompare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

// DnD
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import axios, { all } from "axios";

// GeoJson Files
import gymgeojson from "../geojson/GymsSGGEOJSON.geojson";
import hawkergeojson from "../geojson/HawkerCentresGEOJSON.geojson";
import parksgeojson from "../geojson/Parks.geojson";
import preschoolgeojson from "../geojson/PreSchoolsLocation.geojson";
import clinicgeojson from "../geojson/CHASClinics.geojson";
import mallsgeojson from "../geojson/shopping_mall_coordinates.geojson";

// Components
import Container from "../components/Container";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { Button } from "../components/Button";
import Comparison from "../components/Comparison";
import { getAmenities } from "../components/GetAmenities";
import { fetchPublicTransport } from "../utils/fetchPublicTransport";
import { fetchTravelTime } from "../utils/fetchTravelTime";
import Gemini from "../components/GoogleGenerativeAIComponent";

export default function DashboardPage() {
  const [activeBTO, setActiveBTO] = useState(null);
  const [BTO1, setBTO1] = useState(true);
  const [BTO2, setBTO2] = useState(true);
  const [BTO3, setBTO3] = useState(true);
  const [containers, setContainers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [currentContainerId, setCurrentContainerId] = useState(null);
  const [containerName, setContainerName] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddInfoModal, setShowAddInfoModal] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showGridsAnimation, setShowGridsAnimation] = useState(true);
  const [isAddFramesHovered, setIsAddFramesHovered] = useState(false);
  const [numberOfTrueBTOs, setNumberOfTrueBTOs] = useState(0);

  const [distance, setDistance] = useState(5);
  const [addressField, setAddressField] = useState("");
  const [selected, setSelected] = useState("");
  const [optionSelected, setOptionSelected] = useState("");
  const [numberOfAmenities, setNumberOfAmenities] = useState(null);
  const [timeToTravel, setTimeToTravel] = useState(0);
  const [timeToTravelInString, setTimeToTravelInString] = useState("");

  const [homeGeoCode, setHomeGeoCode] = useState({
    latitude: 1.3526941,
    longitude: 103.6920069,
  });
  const [destGeoCode, setDestGeoCode] = useState({
    latitude: 1.3766432,
    longitude: 103.8181963,
  });

  // TODO : ATTENTION NEED TO REPLACE WITH REAL LOCATION
  const [homeaddressField, setHomeAddressField] = useState(
    "nanyang technological university Singapore"
  );

  // DEBUGGING
  // useEffect(() => {
  //   console.log("distance:", distance);
  //   console.log("addressField:", addressField);
  //   console.log("selected:", selected);
  //   console.log("optionSelected:", optionSelected);
  //   console.log("numberOfAmenities:", numberOfAmenities);
  //   console.log("timeToTravel:", timeToTravel);
  //   console.log("homeGeoCode:", homeGeoCode);
  //   console.log("destGeoCode:", destGeoCode);
  //   console.log("timeToTravelInString:", timeToTravelInString);
  // }, [
  //   distance,
  //   addressField,
  //   selected,
  //   optionSelected,
  //   numberOfAmenities,
  //   timeToTravel,
  //   homeGeoCode,
  //   destGeoCode,
  //   timeToTravelInString,
  // ]);

  const STORAGE_KEY_PREFIX = "dashboard_containers_";

  // Load containers for the active BTO from localStorage on component mount
  useEffect(() => {
    if (activeBTO) {
      const storedContainers = localStorage.getItem(
        STORAGE_KEY_PREFIX + activeBTO
      );
      if (storedContainers) {
        setContainers(JSON.parse(storedContainers));
      }
    }
  }, [activeBTO]);

  // Save containers for the active BTO to localStorage whenever containers state changes
  useEffect(() => {
    if (activeBTO) {
      localStorage.setItem(
        STORAGE_KEY_PREFIX + activeBTO,
        JSON.stringify(containers)
      );
    }
  }, [containers, activeBTO]);

  // DEBUGGING
  // useEffect(() => {
  //   // console.log("containers:", JSON.stringify(containers, null, 2));

  //   // Log the updated activeBTO state
  //   console.log("New active BTO: " + activeBTO);
  // }, [containers, activeBTO]);

  useEffect(() => {
    // Trigger alert when Unfavourite BTO
    if (isHeartClicked) {
      alert("Unfavourite BTO!");
      setIsHeartClicked(false);
    }

    //Set containers based on activeBTO
    switch (activeBTO) {
      case "BTO1":
        setContainers(testing_frame);
        break;

      case "BTO2":
        setContainers(
          defaultFrames2.map((frame) => ({
            id: generateId(),
            title: frame.name,
            description: frame.description,
            items: [],
          }))
        );
        break;

      case "BTO3":
        setContainers(
          defaultFrames3.map((frame) => ({
            id: generateId(),
            title: frame.name,
            description: frame.description,
            items: [],
          }))
        );
        break;

      default:
        setContainers([]);
    }
  }, [BTO1, BTO2, BTO3, isHeartClicked, activeBTO]);

  // Determine which BTO project is favorited initially
  useEffect(() => {
    if (BTO1) {
      setActiveBTO("BTO1");
    } else if (BTO2) {
      setActiveBTO("BTO2");
    } else if (BTO3) {
      setActiveBTO("BTO3");
    } else {
      // No favorite BTO project, alert the user
      alert(
        "No favorite projects found, please find and favorite a BTO under BTO Find"
      );
    }
    // Update the count of true BTOs
    const count = [BTO1, BTO2, BTO3].filter((bto) => bto).length;
    setNumberOfTrueBTOs(count);
  }, [BTO1, BTO2, BTO3]);

  // Function to handle button click for BTO1
  const handleBTO1Click = () => {
    setActiveBTO("BTO1");
  };

  // Function to handle button click for BTO2
  const handleBTO2Click = () => {
    setActiveBTO("BTO2");
  };

  // Function to handle button click for BTO3
  const handleBTO3Click = () => {
    setActiveBTO("BTO3");
  };

  // INSERT CODE FOR COMPARISON
  const comparisonRef = useRef(null);

  // Check for ref and Open Comparison Tab
  const handleComparison = () => {
    const tryOpenComparison = () => {
      comparisonRef.current
        ? comparisonRef.current.openComparison()
        : setTimeout(tryOpenComparison, 100);
    };
    tryOpenComparison();
  };

  const removeFavouriteBTO = () => {
    setIsHeartClicked(true);
    switch (activeBTO) {
      case "BTO1":
        setBTO1(false);
        setActiveBTO(BTO2 ? "BTO2" : BTO3 ? "BTO3" : null);
        break;
      case "BTO2":
        setBTO2(false);
        setActiveBTO(BTO1 ? "BTO1" : BTO3 ? "BTO3" : null);
        break;
      case "BTO3":
        setBTO3(false);
        setActiveBTO(BTO1 ? "BTO1" : BTO2 ? "BTO2" : null);
        break;
      default:
        break;
    }
  };

  const handleGeocode = async () => {
    if (addressField === null || addressField === "") {
      return;
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${addressField}&format=json&addressdetails=1&limit=1`
      );
      if (response.data.length > 0) {
        console.log(response.data[0]);
        const { lat, lon } = response.data[0];
        const latitude = parseFloat(lat).toFixed(5);
        const longitude = parseFloat(lon).toFixed(5);
        const road = response.data[0].address.road
          ? response.data[0].address.road
          : response.data[0].display_name;

        const singaporeBounds = {
          north: 1.5,
          south: 1.1,
          east: 104.1,
          west: 103.6,
        };

        if (
          latitude >= singaporeBounds.south &&
          latitude <= singaporeBounds.north &&
          longitude >= singaporeBounds.west &&
          longitude <= singaporeBounds.east
        ) {
          setDestGeoCode({
            latitude: latitude,
            longitude: longitude,
          });
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const resetContainerFields = () => {
    setSelected("");
    setContainerName("");
    setOptionSelected("");
    setDistance(5);
    setAddressField("");
    setNumberOfAmenities(null);
    setTimeToTravel(0);
    setTimeToTravelInString("");
    setShowAddContainerModal(false);
  };

  const getDataFromInputComponent = ({
    selected,
    optionSelected,
    distance,
    addressField,
  }) => {
    setSelected(selected);
    setContainerName(selected);
    setOptionSelected(optionSelected);
    setDistance(distance);
    setAddressField(addressField);
  };

  const handleDataFromInputComponent = () => {
    if (selected === "Transportation") {
      handleGeocode();
      switch (optionSelected) {
        case "Car":
          setTimeToTravel(
            fetchTravelTime(
              homeGeoCode.latitude,
              homeGeoCode.longitude,
              destGeoCode.latitude,
              destGeoCode.longitude,
              "car", // specify the mode of transport
              true // return time in seconds
            ).then((time) => {
              setTimeToTravel(time);
            })
          );
          break;

        case "Public Transport":
          setTimeToTravel(
            fetchPublicTransport(
              homeGeoCode.latitude,
              homeGeoCode.longitude,
              destGeoCode.latitude,
              destGeoCode.longitude,
              true // return time in seconds
            ).then((time) => {
              setTimeToTravel(time);
            })
          );
          break;

        default:
          console.log(
            "Error fetching Transportation: No option selected",
            optionSelected
          );
          break;
      }
    } else if (selected === "Amenities") {
      switch (optionSelected) {
        case "Gyms":
          getAmenities(gymgeojson, homeGeoCode, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Hawkers":
          getAmenities(hawkergeojson, homeGeoCode, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Parks":
          getAmenities(parksgeojson, homeGeoCode, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Preschools":
          getAmenities(preschoolgeojson, homeGeoCode, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Clinics":
          getAmenities(clinicgeojson, homeGeoCode, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Malls":
          getAmenities(mallsgeojson, homeGeoCode, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        default:
          console.log("Error fetching Amenities : No option selcted");
          break;
      }
    }
  };

  useEffect(() => {
    formatTime(timeToTravel);
  }, [timeToTravel]);

  function formatTime(seconds) {
    console.log();
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = "";

    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? "s" : ""}`;
    }

    if (minutes > 0) {
      result += `${result.length > 0 ? " " : ""}${minutes} minute${
        minutes !== 1 ? "s" : ""
      }`;
    }

    if (hours === 0 && minutes === 0) {
      result += `${remainingSeconds} second${
        remainingSeconds !== 1 ? "s" : ""
      }`;
    }

    setTimeToTravelInString(result);
  }

  useEffect(() => {
    handleDataFromInputComponent();
  }, [selected, optionSelected, homeGeoCode, destGeoCode, distance]);

  // Function to add a new container
  const onAddContainer = () => {
    // Reject
    if (
      containerName === "" ||
      containers.length >= 12 ||
      optionSelected === undefined
    ) {
      console.log("Invalid selection");
      resetContainerFields();
      return;
    }

    handleDataFromInputComponent();

    const id = generateId();
    let description;

    if (containerName === "Transportation") {
      if (addressField === "" || addressField === null) {
        console.log("Invalid addressfield");
        resetContainerFields();
        return;
      }
      description = `The Time to reach ${addressField} by ${optionSelected} is ${timeToTravelInString} `;
    } else if (containerName === "Amenities") {
      description = `The number of ${optionSelected} within ${distance} KM is ${numberOfAmenities}`;
    }

    const newContainer = {
      id,
      title: containerName,
      description: description,
      numberOfAmenities,
      timeToTravel,
      imageUrl: "",
    };

    setContainers((prevContainers) => [...prevContainers, newContainer]);
    resetContainerFields();
  };

  // Function to delete a container
  const onDeleteContainer = (containerId) => {
    setContainers((prevContainers) =>
      prevContainers.filter((container) => container.id !== containerId)
    );
  };

  function findValueOfItems(id, type) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
  }

  const findContainerTitle = (id) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  const findContainerDescription = (id) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.description;
  };

  const findContainerLongDescription = (id) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.long_description;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id
      );
      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    setActiveId(null);
  };

  return (
    <div>
      {/* add <Navbar/>*/}
      <Navbar />

      <div className="mx-auto max-w-7xl py-10">
        {/* Add Container Modal*/}
        <Modal
          showModal={showAddContainerModal}
          setShowModal={setShowAddContainerModal}
        >
          <div className="flex flex-col w-auto items-start gap-y-4 p-3 bg-white rounded-lg">
            <h1 className="text-green-800 text-3xl font-bold">
              Add Interactable Frame
            </h1>
            <p className="text-gray-700">
              Please select which interactable frame you would like to create
              from the dropdown box below.
            </p>
            <Input
              type="text"
              placeholder="Container Title"
              name="containername"
              value={containerName}
              onChange={getDataFromInputComponent}
            />
            <div className="my-2"></div>
            <Button
              onClick={onAddContainer}
              className="rounded-lg bg-customRed border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out font-bold relative"
              onMouseEnter={() => setIsAddFramesHovered(true)}
              onMouseLeave={() => setIsAddFramesHovered(false)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="add-text"> Add Frames</span>
            </Button>
          </div>
        </Modal>

        {/* Add Informational Modal*/}
        <Modal showModal={showAddInfoModal} setShowModal={setShowAddInfoModal}>
          <div className="flex flex-col w-full items-center justify-center gap-y-4 h-400px overflow-auto relative">
            <h1 className="text-green-800 text-3xl font-bold mb-4">
              {" "}
              {/* Added mb-4 */}
              {findContainerTitle(currentContainerId)}
            </h1>
            {/* Add Information*/}
            <div class="overflow-auto">
              <Gemini prompt={findContainerDescription(currentContainerId)} />
            </div>
          </div>
          <div className="mt-2">
            {" "}
            {/* Added mt-2 */}
            <button
              onClick={() => {
                onDeleteContainer(currentContainerId);
                setShowAddInfoModal(false);
              }}
              className="dashboard-button relative p-2 buttom-2 right-2 border-transparent shadow-md border rounded-md hover:bg-red-400 transition duration-300 "
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </Modal>

        {/* Add Header Buttons */}
        <div className="flex items-center gap-y-2">
          <div className="flex items-center">
            <h1 className="text-black-800 text-3xl font-bold mr-2">
              Dashboard
            </h1>

            {activeBTO !== null && (
              <Button
                className={` dashboard-button border-transparent px-3 py-3 relative transition duration-300 ease-in-out bg-transparent ${
                  isHeartClicked ? "text-transparent" : "text-red-500"
                }`}
                onClick={removeFavouriteBTO} // Set clicked state to true when button is clicked
                onMouseEnter={() => setIsHovered(true)} // Set hovered state to true when mouse enters button area
                onMouseLeave={() => setIsHovered(false)} // Set hovered state to false when mouse leaves button area
              >
                <FontAwesomeIcon icon={faHeart} />
                {isHovered && (
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-2 py-1 rounded-md shadow-md">
                    Click to unfavorite current BTO project
                  </span>
                )}
              </Button>
            )}
          </div>

          <div className="ml-auto">
            <div className="flex gap-x-2">
              {BTO1 && (
                <Button
                  className={`rounded-lg border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out font-bold relative ${
                    activeBTO === "BTO1"
                      ? "bg-customRed-active hover:text-black"
                      : "bg-customRed"
                  }`}
                  onClick={handleBTO1Click}
                >
                  BTO 1
                </Button>
              )}
              {BTO2 && (
                <Button
                  className={`rounded-lg border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out  font-bold relative ${
                    activeBTO === "BTO2"
                      ? "bg-customRed-active hover:text-black"
                      : "bg-customRed"
                  }`}
                  onClick={handleBTO2Click}
                >
                  BTO 2
                </Button>
              )}
              {BTO3 && (
                <Button
                  className={`rounded-lg border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out  font-bold relative ${
                    activeBTO === "BTO3"
                      ? "bg-customRed-active hover:text-black"
                      : "bg-customRed"
                  }`}
                  onClick={handleBTO3Click}
                >
                  BTO 3
                </Button>
              )}
              {activeBTO !== null && (
                <Button
                  className="rounded-lg bg-customRed border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out font-bold relative"
                  onClick={() => {
                    if (containers.length < 12) {
                      setShowAddContainerModal(true);
                    }
                  }}
                  onMouseEnter={() => setIsAddFramesHovered(true)}
                  onMouseLeave={() => setIsAddFramesHovered(false)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="add-text"> Add Frames</span>
                  {isAddFramesHovered && containers.length >= 12 && (
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-2 py-1 rounded-md shadow-md">
                      Maximum number of frames reached
                    </span>
                  )}
                </Button>
              )}
              {activeBTO !== null && numberOfTrueBTOs >= 2 && (
                <Button
                  className="rounded-lg border-transparent bg-customRed hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out font-bold relative"
                  onClick={handleComparison}
                >
                  <FontAwesomeIcon icon={faCodeCompare} />
                  <span className="compare-text"> Compare</span>
                </Button>
              )}
              <Comparison ref={comparisonRef} />
            </div>
          </div>
        </div>

        {/* Add Grid Pattern */}
        <div className="mt-10">
          {activeBTO !== null && (
            <div
              className={`grid grid-cols-4 gap-6 ${
                showGridsAnimation ? "animate-fadeIn" : ""
              }`}
            >
              {/* Grid items here */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                // onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={containers.map((i) => i.id)}>
                  {containers.map((container) => (
                    <Container
                      id={container.id}
                      title={container.title}
                      description={container.description}
                      numberOfAmenities={container.numberOfAmenities}
                      timeToTravel={container.timeToTravel}
                      key={container.id}
                      onExpand={() => {
                        setCurrentContainerId(container.id);
                        setShowAddInfoModal(true);
                      }}
                    ></Container>
                  ))}
                </SortableContext>
                <DragOverlay adjustScale={false}>
                  {/* Drag Overlay For Container */}
                  {activeId && activeId.toString().includes("container") && (
                    <Container
                      id={activeId}
                      title={findContainerTitle(activeId)}
                    ></Container>
                  )}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// const dataUtilityRef = useRef(null);
// const tryLoadUserData = () => {
//   dataUtilityRef.current
//     ? dataUtilityRef.current.loadUserData()
//     : setTimeout(tryLoadUserData, 100);
// };

const defaultFrames1 = [
  { name: "Location", description: "Woodlands Drive 16." },
  { name: "Town", description: "Woodlands." },
  { name: "Town Council", description: "Sembawang Town Council." },
  {
    name: "Historical HDB Price",
    description: "$670,000.",
    long_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    name: "Historical BTO Price",
    description: "$500,000",
    long_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  { name: "Number of Rooms", description: "4 Room Flat." },
  { name: "Estimated Date of Completion", description: "2027." },
];

const defaultFrames2 = [
  { name: "Location", description: "Marine Parade Central." },
  { name: "Town", description: "Marine Parade." },
  { name: "Town Council", description: "Marine Parade Town Council." },
  { name: "Price", description: "$800,000." },
  { name: "Square Footage", description: "1100 sqf." },
  { name: "Number of Rooms", description: "3 Room Flat." },
  { name: "Estimated Date of Completion", description: "2026." },
];

const defaultFrames3 = [
  { name: "Location", description: "Jurong West Street 41." },
  { name: "Town", description: "Jurong West." },
  { name: "Town Council", description: "Jurong West Town Council." },
  { name: "Price", description: "$720,000." },
  { name: "Square Footage", description: "1350 sqf." },
  { name: "Number of Rooms", description: "5 Room Flat." },
  { name: "Estimated Date of Completion", description: "2025." },
];

const generateId = () => `container-${uuidv4()}`;

// TESTING
const testing_frame = defaultFrames1.map((frame) => ({
  id: generateId(),
  title: frame.name,
  description: frame.description,
  long_description: frame.long_description,
  items: [],
}));
