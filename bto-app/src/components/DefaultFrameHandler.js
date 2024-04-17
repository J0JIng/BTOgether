import { useState , useEffect} from "react";

const DefaultFrameHandler = () => {
    return (  
    <div className = "default-frame-handler"> 

    </div>
    );
}
 
export default DefaultFrameHandler;




// const defaultFrames1 = [
//   { name: "Location", description: "Woodlands Drive 16." },
//   { name: "Town", description: "Woodlands." },
//   { name: "Town Council", description: "Sembawang Town Council." },
//   {
//     name: "Historical HDB Price",
//     description: "$670,000."
//   },
//   {
//     name: "Historical BTO Price",
//     description: "$500,000"
//   },
//   { name: "Number of Rooms", description: "4 Room Flat." },
//   { name: "Estimated Date of Completion", description: "2027." },
// ];

// const defaultFrames2 = [
//   { name: "Location", description: "Marine Parade Central." },
//   { name: "Town", description: "Marine Parade." },
//   { name: "Town Council", description: "Marine Parade Town Council." },
//   { name: "Price", description: "$800,000." },
//   { name: "Square Footage", description: "1100 sqf." },
//   { name: "Number of Rooms", description: "3 Room Flat." },
//   { name: "Estimated Date of Completion", description: "2026." },
// ];

// const defaultFrames3 = [
//   { name: "Location", description: "Jurong West Street 41." },
//   { name: "Town", description: "Jurong West." },
//   { name: "Town Council", description: "Jurong West Town Council." },
//   { name: "Price", description: "$720,000." },
//   { name: "Square Footage", description: "1350 sqf." },
//   { name: "Number of Rooms", description: "5 Room Flat." },
//   { name: "Estimated Date of Completion", description: "2025." },
// ];

// // TESTING
// const testing_frame = defaultFrames1.map((frame) => ({
//   id: generateId(),
//   title: frame.name,
//   description: frame.description,
//   long_description: frame.long_description,
//   items: [],
// }));

// const STORAGE_KEY_PREFIX = "dashboard_containers_";

//   // Load containers for the active BTO from localStorage on component mount
//   useEffect(() => {
//     if (activeBTO) {
//       const storedContainers = localStorage.getItem(
//         STORAGE_KEY_PREFIX + activeBTO
//       );
//       if (storedContainers) {
//         setContainers(JSON.parse(storedContainers));
//       }
//     }
//   }, [activeBTO]);

//   // Save containers for the active BTO to localStorage whenever containers state changes
//   useEffect(() => {
//     if (activeBTO) {
//       localStorage.setItem(
//         STORAGE_KEY_PREFIX + activeBTO,
//         JSON.stringify(containers)
//       );
//     }
//   }, [containers, activeBTO]);
