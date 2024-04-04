import { useState , useEffect } from 'react';
import Navbar from "../components/NavBar";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import "../css/dashboard.css";

// DnD
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  closestCorners,
  PointerSensor, 
  KeyboardSensor
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

// Components
import Container from '../components/Container';
import Items from '../components/Item';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { Button } from '../components/Button';


// need to accept JSON from Firebase 
const defaultFrames = [
  { name: 'Location', description: 'Woodlands Drive 16.' },
  { name: 'Town', description: 'Woodlands.' },
  { name: 'Town Council', description: 'Sembawang Town Council.' },
  { name: 'Price', description: '$670,000.' },
  { name: 'Square Footage', description: '1245 sqf.' },
  { name: 'Number of Rooms', description: '4 Room Flat.' },
  { name: 'Estimated Date of Completion', description: '2027.' },
];



const generateId = () => `container-${uuidv4()}`;

const defaultContainers = defaultFrames.map((frame) => ({
  id: generateId(),
  title: frame.name,
  description: frame.description, // Access description from the frame object
  items: [],
}));

// Home component
export default function DashboardPage() {
  const [BTO1, setBTO1] = useState(true);
  const [BTO2, setBTO2] = useState(true);
  const [BTO3, setBTO3] = useState(false);
  const [activeBTO, setActiveBTO] = useState(BTO1);
  const [containers, setContainers] = useState(defaultContainers);
  const [activeId, setActiveId] = useState(null);
  const [currentContainerId, setCurrentContainerId] = useState(null);
  const [containerName, setContainerName] = useState('');
  const [itemName, setItemName] = useState('');
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showGridsAnimation, setShowGridsAnimation] = useState(true);

  // Trigger alert when all BTO states are false
  useEffect(() => {
    if (!BTO1 && !BTO2 && !BTO3) {
      alert('No Favourite BTO!');
    }
  }, [BTO1, BTO2, BTO3]);

  // Trigger alert when Unfavourite BTO
  useEffect(() => {
    if (isHeartClicked) {
      alert('Unfavourite BTO!');
    }
    setIsHeartClicked(false);
  }, [isHeartClicked]);

  const removeFavouriteBTO = () => {
    setIsHeartClicked(true); // Trigger the alert
  
    // Update the individual BTO states
    if (activeBTO === 'BTO1') {
      setBTO1(false);
    } else if (activeBTO === 'BTO2') {
      setBTO2(false);
    } else if (activeBTO === 'BTO3') {
      setBTO3(false);
    }
  
    // Update the activeBTO status to another BTO if available
    if (activeBTO === 'BTO1') {
      setActiveBTO(BTO2 ? 'BTO2' : (BTO3 ? 'BTO3' : null));
    } else if (activeBTO === 'BTO2') {
      setActiveBTO(BTO1 ? 'BTO1' : (BTO3 ? 'BTO3' : null));
    } else if (activeBTO === 'BTO3') {
      setActiveBTO(BTO1 ? 'BTO1' : (BTO2 ? 'BTO2' : null));
    }
    
  };
  
  // Log the updated activeBTO state
  useEffect(() => {
    console.log('New active BTO: ' + activeBTO);
    setIsHeartClicked(false);

  }, [activeBTO]);
  
  const onAddContainer = () => {
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
    setContainerName('');
    setShowAddContainerModal(false);
  };

  const onAddItem = () => {
    if (!itemName) return;
    const id = generateId();
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    container.items.push({
      id,
      title: itemName,
    });
    setContainers([...containers]);
    setItemName('');
    setShowAddItemModal(false);
  };

 
  function findValueOfItems(id, type) {
    if (type === 'container') {
      return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
      return containers.find((container) =>
        container.items.find((item) => item.id === id)
      );
    }
  }

  const findItemTitle = (id) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.title;
  };

  const findContainerTitle = (id) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return '';
    return container.title;
  };

  const findContainerItems = (id) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return [];
    return container.items;
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

  const handleDragMove = (event) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );

        setContainers(newItems);
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      // Remove the active item from the active container and add it to the over container
      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
  };

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes('container') &&
      over?.id.toString().includes('container') &&
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

    // Handling item Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );
        setContainers(newItems);
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  }

  return (
    <div>

      {/* add <Navbar/>*/}
      <Navbar/>

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
          <Button onClick={onAddContainer} >Add container</Button>
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
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
      </Modal>

      {/* Add Header Buttons */}
      <div className="flex items-center gap-y-2">

        <div className="flex items-center">
          <h1 className="text-black-800 text-3xl font-bold mr-2">Dashboard</h1>
          
          {activeBTO !== null && (<Button
            className={`border-transparent px-3 py-3 relative transition duration-300 ease-in-out bg-transparent ${
              isHeartClicked ? 'text-transparent' : 'text-red-500'
            }`}
            onClick={removeFavouriteBTO} // Set clicked state to true when button is clicked
            onMouseEnter={() => setIsHovered(true)} // Set hovered state to true when mouse enters button area
            onMouseLeave={() => setIsHovered(false)} // Set hovered state to false when mouse leaves button area
          >
            <FontAwesomeIcon icon={faHeart} />
            {isHovered && (
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-2 py-1 rounded-md shadow-md">
                Click to 
                unfavorite current 
                BTO project
              </span>
            )}
          </Button>)}
      </div>

        <div className="ml-auto">
          <div className="flex gap-x-2">
            {BTO1 && (
              <Button
              className={`rounded-lg border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out ${
                activeBTO === 'BTO1' ? 'bg-customRed-active hover:text-black' : 'bg-customRed'
              }`}
              onClick={() => setActiveBTO('BTO1')}
            >
              BTO 1
            </Button>
            )}
            {BTO2 && (
              <Button
              className={`rounded-lg border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out ${
                activeBTO === 'BTO2' ? 'bg-customRed-active hover:text-black' : 'bg-customRed'
              }`}
              onClick={() => setActiveBTO('BTO2')}
              >
              BTO 2
            </Button>
            )}
            {BTO3 && (
              <Button
              className={`rounded-lg border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out ${
                activeBTO === 'BTO3' ? 'bg-customRed-active hover:text-black' : 'bg-customRed'
              }`}
              onClick={() => setActiveBTO('BTO3')}
            >
              BTO 3
            </Button>
            )}
            {activeBTO!=null && (
            <Button onClick={() => setShowAddContainerModal(true)} className="rounded-lg bg-customRed border-transparent hover:text-red-700 text-white px-6 py-4 transition duration-300 ease-in-out font-bold">
                Add Frames
            </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Grid Pattern */}
      <div className="mt-10">
        {activeBTO !== null &&(
        <div className={`grid grid-cols-3 gap-6 ${showGridsAnimation ? 'animate-fadeIn' : ''}`}>
          {/* Grid items here */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container) => (
                <Container
                  id={container.id}
                  title={container.title}
                  description={container.description}
                  key={container.id}
                  onAddItem={() => {
                    setShowAddItemModal(true);
                    setCurrentContainerId(container.id);
                  }}
                >
                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className="flex items-start flex-col gap-y-4">
                      {container.items.map((i) => (
                        <Items title={i.title} id={i.id} key={i.id} />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes('item') && (
                <Items id={activeId} title={findItemTitle(activeId)} />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes('container') && (
                <Container id={activeId} title={findContainerTitle(activeId)}>
                  {findContainerItems(activeId).map((i) => (
                    <Items key={i.id} title={i.title} id={i.id} />
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>)}
      </div>
    </div>
    </div>

  );
}


