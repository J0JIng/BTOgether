import { useState, useEffect, useRef } from "react";
import Navbar from "../components/NavBar";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCodeCompare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import "../css/dashboard.css";
import Comparison from '../components/Comparison';

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

// Components
import Container from "../components/Container";
import Items from "../components/Item";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { Button } from "../components/Button";

// need to accept JSON from Firebase
//Example

const defaultFrames1 = [
  { name: "Location", description: "Woodlands Drive 16." },
  { name: "Town", description: "Woodlands." },
  { name: "Town Council", description: "Sembawang Town Council." },
  { name: "Price", description: "$670,000." },
  { name: "Square Footage", description: "1245 sqf." },
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
  items: [],
}));

export default function DashboardPage() {
  const [BTO1, setBTO1] = useState(true);
  const [BTO2, setBTO2] = useState(true);
  const [BTO3, setBTO3] = useState(true);
  const [activeBTO, setActiveBTO] = useState(null);
  const [containers, setContainers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [currentContainerId, setCurrentContainerId] = useState(null);
  const [containerName, setContainerName] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showGridsAnimation, setShowGridsAnimation] = useState(true);
  const [isAddFramesHovered, setIsAddFramesHovered] = useState(false);
  const [numberOfTrueBTOs, setNumberOfTrueBTOs] = useState(0); // New state to track count of true BTOs

  // DEBUGGING
  useEffect(() => {
    console.log("containers:", JSON.stringify(containers, null, 2));
  }, [containers]);

  useEffect(() => {
    // TODO: FUNCTIONALITY TO ACCEPT GET INFO FROM FIREBASE
    //       UPDATE BTO USESTATE IF NECESSARY

    // Trigger alert when Unfavourite BTO
    if (isHeartClicked) {
      alert("Unfavourite BTO!");
      setIsHeartClicked(false);
    }

    // Set containers based on activeBTO
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
    // Log the updated activeBTO state
    console.log("New active BTO: " + activeBTO);
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

  const handleDeleteContainer = (containerId) => {
    console.log("remove frame" + containerId);
    const updatedContainers = containers.filter(
      (container) => container.id !== containerId
    );
    setContainers(updatedContainers);
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

  const onAddContainer = () => {
    if (containers.length >= 12) {
      alert("Maximum number of frames reached");
      return;
    }
    if (!containerName) return;
    const id = `container-${uuidv4()}`;
    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        description: `Description for ${containerName}`,
        items: [],
      },
    ]);
    setContainerName("");
    setShowAddContainerModal(false);
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
          <div className="flex flex-col w-full items-start gap-y-4">
            <h1 className="text-gray-800 text-3xl font-bold">Add Container</h1>
            <Input
              type="text"
              placeholder="Container Title"
              name="containername"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
            />
            <Button onClick={onAddContainer}>Add container</Button>
          </div>
        </Modal>

        {/* Add Item Modal */}
        {/* <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
          <Input
            type="text"
            placeholder="Item Title"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button onClick={onAddItem}>Add Item</Button>
        </div>
      </Modal> */}

        {/* Add Header Buttons */}
        <div className="flex items-center gap-y-2">
          <div className="flex items-center">
            <h1 className="text-black-800 text-3xl font-bold mr-2">
              Dashboard
            </h1>

            {activeBTO !== null && (
              <Button
                className={`border-transparent px-3 py-3 relative transition duration-300 ease-in-out bg-transparent ${
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
              className={`grid grid-cols-3 gap-6 ${
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
                      key={container.id}
                      onDelete={handleDeleteContainer}
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
