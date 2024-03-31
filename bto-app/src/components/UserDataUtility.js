import React from 'react';
import { Button } from '@mui/material';

export default function UserDataUtility({ saveData, loadedData }) {

    const handleSaveData = () => {
        console.log("saving data");
        console.log("saving ", saveData);
    };

    const handleLoadData = () => {
        console.log("loading data");

        // Check if loadedData is a function before calling it
        if (typeof loadedData === 'function') {
            loadedData("i loaded this");
        } else {
            console.error("loadedData is not a function");
        }
    };

    return (
        <React.Fragment>
            <Button onClick={handleSaveData} variant="outlined" sx={{ mr: 1, boxShadow: 1 }}>Save Data</Button>
            <Button onClick={handleLoadData} variant="outlined" sx={{ mr: 1, boxShadow: 1 }}>Load Data</Button>
        </React.Fragment>
    );
}
