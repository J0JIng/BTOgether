import Navbar from "../components/NavBar";

const BtoPlannerPage = () => {
    return (  
        <div className="bto-planner-page">
            <Navbar/>
            <h1>Manage Bto Planner</h1>
            <div className="planner-options">
                <h2>Planner Options</h2>
                <ul>
                    <li>Create New Plan</li>
                    <li>View Existing Plans</li>
                    <li>Edit Plan</li>
                    <li>Delete Plan</li>
                </ul>
            </div>
            <div className="planner-details">
                <h2>Plan Details</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non libero vitae ligula consectetur tristique ac id purus. Nunc sagittis fermentum justo, sit amet feugiat nunc vulputate ac. Proin euismod tincidunt nunc, nec cursus odio laoreet eget.</p>
                <p>Quisque consectetur, libero id bibendum euismod, lacus nulla aliquam arcu, eu varius magna magna eu dui. Aenean dignissim nibh justo, nec consectetur sapien suscipit nec.</p>
                <p>Donec vitae interdum risus. Mauris fringilla lacus quis turpis tristique, nec finibus est vulputate. Nullam et pulvinar velit. Sed nec urna ut magna posuere rhoncus. Sed vel risus vitae nisi pharetra posuere ut sit amet tortor.</p>
                <p>Maecenas in feugiat odio. Vestibulum commodo ex a risus pellentesque dignissim. Nam venenatis purus eget feugiat suscipit.</p>
            </div>
            <div className="planner-actions">
                <h2>Actions</h2>
                <button>Create Plan</button>
                <button>Edit Plan</button>
                <button>Delete Plan</button>
                <p>Ut rhoncus risus non fringilla luctus. Phasellus eu libero dapibus, vestibulum ex sit amet, congue ligula. Aliquam vel est mauris. Nam ac placerat odio. Suspendisse potenti.</p>
                <p>Curabitur tempus ex et magna sollicitudin congue. Morbi nec augue a risus consequat vehicula in ut odio. Praesent volutpat suscipit urna, id tristique eros efficitur ac.</p>
                <p>Integer vitae dapibus eros, id consectetur ante. Phasellus nec luctus risus. Morbi nec libero quis elit condimentum bibendum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce eget commodo libero.</p>
            </div>
        </div>
    );
}
 
export default BtoPlannerPage;
