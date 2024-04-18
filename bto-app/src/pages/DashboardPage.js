import { useEffect, useState, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { auth } from "../utils/firebase";
import {
  getFirestore,
  collection,
  updateDoc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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
import notFound from "../assets/item-not-found.svg";


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
import UserDataUtility from "../utils/UserDataUtility";


const generateId = () => `container-${uuidv4()}`;

export default function DashboardPage() {
  const [mutex, setMutex] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);

  const [activeBTO, setActiveBTO] = useState(null);
  const [BTO1Status, setBTO1Status] = useState(false);
  const [BTO2Status, setBTO2Status] = useState(false);
  const [BTO3Status, setBTO3Status] = useState(false);

  const [containers, setContainers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [currentContainerId, setCurrentContainerId] = useState(null);
  const [containerName, setContainerName] = useState("");

  const [showImage, setShowImage] = useState(false);
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddInfoModal, setShowAddInfoModal] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showGridsAnimation, setShowGridsAnimation] = useState(true);
  const [isAddFramesHovered, setIsAddFramesHovered] = useState(false);
  const [numberOfTrueBTOs, setNumberOfTrueBTOs] = useState(0);

  const [loadedData, setLoadedData] = useState(null);
  const [distance, setDistance] = useState(5);
  const [addressField, setAddressField] = useState("");
  const [selected, setSelected] = useState("");
  const [optionSelected, setOptionSelected] = useState("");
  const [numberOfAmenities, setNumberOfAmenities] = useState(null);

  const [timeToTravel, setTimeToTravel] = useState(0);
  const [timeToTravelInString, setTimeToTravelInString] = useState("");
  const [numberofroomsinform, setNumberOfRoomsInForm] = useState();
  const [projectnameinform, setProjectNameInForm] = useState("");
  const [myhome, setMyHome] = useState({
    BTO1: {
      address: 0,
      latitude: 0,
      longitude: 0,
      historicalbtoprice:0,
      historicalhdbprice:0,
      towncounciil:"placeholder",
      projectname: "placeholder",
      numberofrooms: "placeholder",
      containers: [],
    },
    BTO2: {
      address: 0,
      latitude: 0,
      longitude: 0,
      historicalbtoprice:0,
      historicalhdbprice:0,
      towncounciil:"placeholder",
      projectname: "placeholder",
      numberofrooms: "placeholder",
      containers: [],
    },
    BTO3: {
      address: 0,
      latitude: 0,
      longitude: 0,
      historicalbtoprice:0,
      historicalhdbprice:0,
      towncounciil:"placeholder",
      projectname: "placeholder",
      numberofrooms: "placeholder",
      containers: [],
    },
  });

  const [homeLocation, setHomeLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });

  const [destGeoCode, setDestGeoCode] = useState({
    latitude: null,
    longitude: null,
  });

  // Variables to declare
  const db = getFirestore();
  const dataUtilityRef = useRef(null);
  const colRef = collection(db, "User_prefs");
  const comparisonRef = useRef(null);

  // load data from UserDataUtility
  useEffect(() => {
    const tryLoadUserData = () => {
      if (dataUtilityRef.current) {
        dataUtilityRef.current.loadUserData();
      } else {
        setTimeout(tryLoadUserData, 100);
      }
    };
    tryLoadUserData();
  }, []);

  // load data from UserDataUtility
  const handleLoadedData = (data) => {
    if (data) {
      console.log("Loaded from firestore:", data);
      setLoadedData(data);

      const { BTO1, BTO2, BTO3 } = data;

      if (BTO1) {
        setBTO1Status(true); // Set BTO1 state to true if BTO1 exists
      }
      if (BTO2) {
        setBTO2Status(true); // Set BTO2 state to true if BTO2 exists
      }
      if (BTO3) {
        setBTO3Status(true); // Set BTO2 state to true if BTO2 exists
      }
    } else {
      console.log("No data found");
    }
  };

  // Update/Save Data
  const savingInBTO = (index, deleteActiveBTO = false) => {
    setMutex(true); // block useEffect from running while data is changing.
    const currentBtoData = loadedData[activeBTO];
    const q = query(colRef, where("email", "==", auth.currentUser.email));

    getDocs(q)
      .then((snapshot) => {
        const btoKey = `BTO${index}`;
        const updatedBTOData = {
          address: currentBtoData.address,
          latitude: currentBtoData.latitude,
          longitude: currentBtoData.longitude,
          projectname: currentBtoData.projectname,
          numberofrooms: currentBtoData.numberofrooms,
          historicalbtoprice:currentBtoData.historicalbtoprice,
          historicalhdbprice:currentBtoData.historicalhdbprice,
          towncouncil:currentBtoData.towncouncil,
          containers: containers,
        };

        if (!snapshot.empty) {
          const docRef = snapshot.docs[0].ref;
          const currentDocData = snapshot.docs[0].data();

          // Check if deleteActiveBTO flag is true and the property exists

          // Delete Data
          if (deleteActiveBTO && currentDocData[activeBTO]) {
            delete currentDocData[activeBTO];
            const updatedDocData = {
              ...currentDocData,
            };
            console.log("Updating existing document [DELETE]:", updatedDocData);
            setDoc(docRef, updatedDocData) // Use setDoc to completely replace the document
              .then(() => {
                console.log("Document updated successfully!");
                dataUtilityRef.current.loadUserData().then(() => {
                  console.log("Document created successfully!");
                  updateActiveBTO();
                  setMutex(false);
                });
              })
              .catch((error) => {
                console.error("Error updating document:", error);
              });
          }
          // Save Data
          else if (!deleteActiveBTO && currentDocData[activeBTO]) {
            const updatedDocData = {
              ...currentDocData,
              [btoKey]: updatedBTOData,
            };
            console.log("Updating existing document [UPDATE]:", updatedDocData);
            updateDoc(docRef, updatedDocData)
              .then(() => {
                console.log("Document updated successfully!");
                dataUtilityRef.current.loadUserData().then(() => {
                  console.log("Document created successfully!");
                  setMutex(false);
                });
              })
              .catch((error) => {
                console.error("Error updating document:", error);
              });
          }
        } else {
          console.log("No document found, creating a new one.");
          const newHomeData = {
            email: auth.currentUser.email,
            [btoKey]: updatedBTOData,
          };

          addDoc(colRef, newHomeData)
            .then(() => {
              console.log("Document created successfully!");
              dataUtilityRef.current.loadUserData().then(() => {
                console.log("Document created successfully!");
                setMutex(false);
              });
            })
            .catch((error) => {
              console.error("Error creating new document:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  // Display Image when activeBTO is NULL
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(activeBTO === null);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeBTO]);

  // Trigger alert when Unfavourite BTO
  useEffect(() => {
    if (isHeartClicked) {
      alert("Unfavourite BTO!");
      setIsHeartClicked(false);
    }
  }, [isHeartClicked]);

  // Determine which BTO project is favorited initially
  useEffect(() => {
    if (BTO1Status) {
      setActiveBTO("BTO1");
    } else if (BTO2Status) {
      setActiveBTO("BTO2");
    } else if (BTO3Status) {
      setActiveBTO("BTO3");
    }
    // Update the count of true BTOs
    const count = [BTO1Status, BTO2Status, BTO3Status].filter(
      (bto) => bto
    ).length;
    setNumberOfTrueBTOs(count);
  }, [BTO1Status, BTO2Status, BTO3Status]);

  // Save containers for the active BTO whenever containers state changes
  useEffect(() => {
    if (activeBTO && containers) {
      setContainers(containers);
      if (activeBTO) {
        const index = parseInt(activeBTO.replace(/\D/g, ""), 10);
        savingInBTO(index);
      }
    }
  }, [containers]);

  // Load Active BTO Saved containers TODO
  useEffect(() => {
    if (mutex === false) {
      console.log("changed bto");
      dataUtilityRef.current.loadUserData().then(() => {
        console.log("Newly fetched again");
        if (loadedData && activeBTO) {
          console.log("we are at BTO", activeBTO);
          const btoData = loadedData[activeBTO]; // BTO1 BTO2 BTO3 null

          console.log(btoData.address, btoData.latitude, btoData.longitude);
          setHomeLocation({
            address: btoData.address,
            latitude: btoData.latitude,
            longitude: btoData.longitude,
          });
          // If new location set and container has not been created before
          // console.log("bto container: " + JSON.stringify(btoData.containers));

          if (
            btoData.containers === null ||
            btoData.containers === undefined ||
            (Array.isArray(btoData.containers) &&
              btoData.containers.length === 0)
          ) {
            console.log("Creating new default Containers");
            setContainers(generateDefaultFrames(activeBTO));
          } else {
            console.log("Saved Containers have been loaded");
            setContainers(btoData.containers);
          }
        } else {
          setContainers([]);
        }
      });
    } else {
      console.log("Mutex block active BTO to Save container");
    }
  }, [activeBTO]);

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

  // Check for ref and Open Comparison Tab
  const handleComparison = () => {
    const tryOpenComparison = () => {
      comparisonRef.current
        ? comparisonRef.current.openComparison()
        : setTimeout(tryOpenComparison, 100);
    };
    tryOpenComparison();
  };

  const updateActiveBTO = () => {
    if (loadedData && activeBTO !== null) {
      console.log("BTO2Status" + BTO2Status);

      switch (activeBTO) {
        // Remove BTO1
        case "BTO1":
          setBTO1Status(false);
          setActiveBTO(BTO2Status ? "BTO2" : BTO3Status ? "BTO3" : null);
          break;

        // Remove BTO2
        case "BTO2":
          setBTO2Status(false);
          setActiveBTO(BTO1Status ? "BTO1" : BTO3Status ? "BTO3" : null);
          break;

        // Remove BTO3
        case "BTO3":
          setBTO3Status(false);
          setActiveBTO(BTO1Status ? "BTO1" : BTO2Status ? "BTO2" : null);
          break;

        default:
          break;
      }
    }
  };

  // Remove BTO from UserData
  const deleteFavouriteBTO = () => {
    setIsHeartClicked(true);
    console.log("Deleteing fav BTO");
    if (loadedData) {
      const index = parseInt(activeBTO.replace(/\D/g, ""), 10);
      savingInBTO(index, true);
    }
  };

  // Reset All fields - Used after creating containers
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

  // Get data from input Form
  const getDataFromInputComponent = ({
    selected,
    optionSelected,
    distance,
    addressField,
    destGeoCode,
  }) => {
    setSelected(selected);
    setContainerName(selected);
    setOptionSelected(optionSelected);
    setDistance(distance);
    setAddressField(addressField);
    setDestGeoCode(destGeoCode);
  };

  // Handle data from input Form
  useEffect(() => {
    handleDataFromInputComponent();
  }, [selected, optionSelected, homeLocation, destGeoCode, distance]);

  const handleDataFromInputComponent = () => {
    if (selected === "Transportation") {
      //handleGeocode();
      switch (optionSelected) {
        case "Car":
          // DEBUGGING
          // console.log("Home Latitude:", homeLocation.latitude);
          // console.log("Home Longitude:", homeLocation.longitude);
          // console.log("Destination Latitude:", destGeoCode.latitude);
          // console.log("Destination Longitude:", destGeoCode.longitude);

          setTimeToTravel(
            fetchTravelTime(
              homeLocation.latitude,
              homeLocation.longitude,
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
              homeLocation.latitude,
              homeLocation.longitude,
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
          getAmenities(gymgeojson, homeLocation, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Hawkers":
          getAmenities(hawkergeojson, homeLocation, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Parks":
          getAmenities(parksgeojson, homeLocation, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Preschools":
          getAmenities(preschoolgeojson, homeLocation, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Clinics":
          getAmenities(clinicgeojson, homeLocation, distance)
            .then((count) => {
              setNumberOfAmenities(count);
            })
            .catch((error) => {
              console.error("Error fetching amenities:", error);
            });
          break;
        case "Malls":
          getAmenities(mallsgeojson, homeLocation, distance)
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

  // Used to Format time to Hours, Mins and Seconds
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


  // const fetchAmenitiesData = (activeBTO) => {
  //   if (activeBTO !== null && loadedData !== null && loadedData[activeBTO]) {
  //     const activeBTOData = loadedData[activeBTO];

  //     // Fetch HDB price data
  //     GetNearestPrice(
  //       averagepricegeojson,
  //       {
  //         latitude: activeBTOData.latitude,
  //         longitude: activeBTOData.longitude,
  //       },
  //       activeBTOData.numberofrooms,
  //       2021
  //     ).then((nearestHDB) => {
  //       if (nearestHDB && nearestHDB.obj) {
  //         const properties = nearestHDB.properties;
  //         const HDBdata = properties.resale_price.toLocaleString("en-US", {
  //           style: "currency",
  //           currency: "USD",
  //           minimumFractionDigits: 0,
  //           maximumFractionDigits: 0,
  //         });
  //         console.log("HDB price:" + HDBdata);
  //         setHDBpriceData(HDBdata);
  //       } else {
  //         console.log("Nearest HDB amenity not found or is null.");
  //       }
  //     });

  //     // Fetch BTO price data
  //     GetNearestPrice(
  //       btoaveragepricegeojson,
  //       {
  //         latitude: activeBTOData.latitude,
  //         longitude: activeBTOData.longitude,
  //       },
  //       activeBTOData.numberofrooms,
  //       2021
  //     ).then((nearestBTO) => {
  //       if (nearestBTO && nearestBTO.obj) {
  //         const properties = nearestBTO.properties;
  //         const BTOdata = properties.resale_price.toLocaleString("en-US", {
  //           style: "currency",
  //           currency: "USD",
  //           minimumFractionDigits: 0,
  //           maximumFractionDigits: 0,
  //         });
  //         console.log("BTO price:" + BTOdata);
  //         setBTOpriceData(BTOdata);
  //       } else {
  //         console.log("Nearest BTO amenity not found or is null.");
  //       }
  //     });

  //     // Fetch office data
  //     GetNearest(towncouncilgeojson, {
  //       latitude: activeBTOData.latitude,
  //       longitude: activeBTOData.longitude,
  //     })
  //       .then((nearestOffice) => {
  //         if (nearestOffice && nearestOffice.obj) {
  //           const properties = nearestOffice.properties;
  //           setOffice(properties.Description);
  //           console.log(
  //             "the inside office:" + JSON.stringify(properties.Description)
  //           );
  //         } else {
  //           console.log("Nearest amenity not found or is null.");
  //         }
  //       })
  //       .finally(() => {
  //         // Once all fetch operations are complete, set the flag to true
  //         setFetchComplete(true);
  //       });
  //   }
  // };

  // generated default frames from user Data
  const generateDefaultFrames = (currentActiveBTO) => {
    let data = [{}]; // Initialize with an empty array
    if (
      currentActiveBTO !== null &&
      loadedData !== null &&
      loadedData[currentActiveBTO]
    ) {
      const activeBTOData = loadedData[currentActiveBTO];
    
      data = [
        { name: "Location", description: activeBTOData.address },
        { name: "Town Council", description: activeBTOData.towncouncil },
        {
          name: "Historical HDB Price",
          description:
            "Historical HDB price around the location is " +
            activeBTOData.historicalhdbprice +
            " for a " +
            activeBTOData.numberofrooms +
            " Room flat",
        },
        {
          name: "Historical BTO Price",
          description:
            "Historical BTO price around the location is " +
            activeBTOData.historicalbtoprice +
            " for a " +
            activeBTOData.numberofrooms +
            " Room flat",
        },
        {
          name: "Number of Rooms",
          description: activeBTOData.numberofrooms + " Room flat",
        },
      ];

      // Map data to frames
      return data.map((frame) => ({
        id: generateId(),
        title: frame.name,
        description: frame.description,
        frametype: "default",
      }));
    }
  };

  // Function to create a new interactable Frame
  const onAddContainer = () => {
    // Reject Condition
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
      frametype: "interactable",
      description: description,
      numberOfAmenities,
      timeToTravel,
      imageUrl: "",
    };

    setContainers((prevContainers) => [...prevContainers, newContainer]);
    resetContainerFields();
  };

  // Function to delete interactable Frame
  const onDeleteContainer = (containerId) => {
    setContainers((prevContainers) =>
      prevContainers.filter((container) => container.id !== containerId)
    );
  };

  // Following Functions specific to dragging logic
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

  const findContainerType = (id) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.frametype;
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
      <UserDataUtility
        ref={dataUtilityRef}
        loadedData={handleLoadedData}
        saveData={loadedData}
      />
      <Navbar />
      <div className="mx-auto max-w-7xl py-10">
        {/* Add Frame Modal*/}
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
            {findContainerType(currentContainerId) !== "default" && (
              <button
                onClick={() => {
                  onDeleteContainer(currentContainerId);
                  setShowAddInfoModal(false);
                }}
                className="dashboard-button relative p-2 buttom-2 right-2 border-transparent shadow-md border rounded-md hover:bg-red-400 transition duration-300 "
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}
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
                onClick={deleteFavouriteBTO} // Set clicked state to true when button is clicked
                onMouseEnter={() => setIsHovered(true)} // Set hovered state to true when mouse enters button area
                onMouseLeave={() => setIsHovered(false)} // Set hovered state to false when mouse leaves button area
              >
                <FontAwesomeIcon icon={faHeart} />
                {isHovered && (
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 z-50 fond-bold bg-white text-gray-700 px-2 py-1 rounded-md shadow-md">
                    Click to unfavorite current BTO project
                  </span>
                )}
              </Button>
            )}
          </div>

          <div className="ml-auto">
            <div className="flex gap-x-2">
              {BTO1Status && (
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
              {BTO2Status && (
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
              {BTO3Status && (
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
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 z-50 bg-white text-gray-700 px-2 py-1 rounded-md shadow-md">
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

        {showImage && (
          <div className="relative flex justify-center items-center animate-slideIn">
            <img
              src={notFound}
              alt="No items found"
              className="w-[400px] h-[500px]"
            />
            <div className="flex flex-col justify-center items-center text-center">
              <h1 className="text-black font-bold relative">
                No Favourite BTO Selected
              </h1>
              <div className="inline">
                <p className="inline">Please Favourite a BTO. </p>
                <Link to="/bto-find" className="no-underline">
                  <p className="inline no-underline  ">Click Here</p>
                </Link>
              </div>
            </div>
          </div>
        )}

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
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={containers.map((i) => i.id)}>
                  {containers.map((container) => {
                    // Find corresponding BTO data for the container
                    const currentBtoData = loadedData[activeBTO];
                    // console.log(JSON.stringify(currentBtoData))
                    // console.log(JSON.stringify(currentBtoData.latitude))
                    // console.log(JSON.stringify(currentBtoData.longitude))
                    // console.log(JSON.stringify(currentBtoData.numberofrooms))
                    return (
                      <Container
                        id={container.id}
                        title={container.title}
                        description={container.description}
                        numberOfAmenities={container.numberOfAmenities}
                        timeToTravel={container.timeToTravel}
                        latitude={currentBtoData.latitude}
                        longitude={currentBtoData.longitude}
                        flatType={currentBtoData.numberofrooms}
                        key={container.id}
                        onExpand={() => {
                          setCurrentContainerId(container.id);
                          setShowAddInfoModal(true);
                        }}
                      />
                    );
                  })}
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
