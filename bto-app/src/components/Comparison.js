import React, { useEffect, useState, useRef, forwardRef } from "react";
import { Container, Stack, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import UserDataUtility from "../utils/UserDataUtility";

import Panel from "./Panel";

const Comparison = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const dataUtilityRef = useRef(null);

  // Load User Data using UserDataUtility
  const handleClickOpen = () => {
    setOpen(true);
    const tryLoadUserData = () => {
      dataUtilityRef.current
        ? dataUtilityRef.current.loadUserData()
        : setTimeout(tryLoadUserData, 100);
    };
    tryLoadUserData();
  };

  // Forward ref handleClickOpen in Comparison.js to Dashboard.js as openComparison
  useEffect(() => {
    if (ref) {
      ref.current = {
        openComparison: handleClickOpen,
      };
    }
  }, [ref, handleClickOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  // Load Data using Utility
  const [loadedData, setLoadedData] = useState(null);
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [leftSelection, setLeftSelection] = useState("");
  const [rightSelection, setRightSelection] = useState("");

  const handleLeftSelectionChange = (event) => {
    setLeftSelection(event.target.value);
    const selectedOption = event.target.value;
    if (loadedData) {
      const { salary, parentsAddress, workplaceLocation } = loadedData;
      switch (selectedOption) {
        case "BTO 1":
          setLeftData({
            salary,
            parentsAddress,
            workplaceLocation,
            ...loadedData.BTO1,
          });
          break;
        case "BTO 2":
          setLeftData({
            salary,
            parentsAddress,
            workplaceLocation,
            ...loadedData.BTO2,
          });
          break;
        case "BTO 3":
          setLeftData({
            salary,
            parentsAddress,
            workplaceLocation,
            ...loadedData.BTO3,
          });
          break;
        default:
          break;
      }
    }
  };

  const handleRightSelectionChange = (event) => {
    setRightSelection(event.target.value);
    const selectedOption = event.target.value;
    if (loadedData) {
      const { salary, parentsAddress, workplaceLocation } = loadedData;
      switch (selectedOption) {
        case "BTO 1":
          setRightData({
            salary,
            parentsAddress,
            workplaceLocation,
            ...loadedData.BTO1,
          });
          break;
        case "BTO 2":
          setRightData({
            salary,
            parentsAddress,
            workplaceLocation,
            ...loadedData.BTO2,
          });
          break;
        case "BTO 3":
          setRightData({
            salary,
            parentsAddress,
            workplaceLocation,
            ...loadedData.BTO3,
          });
          break;
        default:
          break;
      }
    }
  };

  // To load the data into the useState above
  const handleLoadedData = (data) => {
    console.log("Loaded data:", data);
    if (data) {
      console.log("Setting data:", data);
      setLoadedData(data);
    } else {
      console.log("No data found");
    }
  };

  const fieldLabels = {
    projectname: "Project Name",
    address: "Address",
    latitude: "Latitude",
    longitude: "Longitude",
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
      >
        <UserDataUtility ref={dataUtilityRef} loadedData={handleLoadedData} />
        <Container sx={{ mb: 3, borderRadius: "100%" }}>
          <Stack
            direction={{ sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ mt: 1, mb: 1 }}
            justifyContent="space-between"
          >
            <DialogTitle variant="h" style={{ textAlign: "center" }}>
              Comparison Tab
            </DialogTitle>
            <Button
              variant="contained"
              style={{
                maxHeight: "40px",
                marginTop: "10px",
                textTransform: "none",
              }}
              sx={{
                backgroundColor: "#f7776b",
                "&:hover": { backgroundColor: "#c55f55" }, // This will apply the background color on hover
              }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Panel
                allData={loadedData}
                data={leftData}
                fieldLabels={fieldLabels}
                selection={leftSelection}
                onChange={handleLeftSelectionChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Panel
                allData={loadedData}
                data={rightData}
                fieldLabels={fieldLabels}
                selection={rightSelection}
                onChange={handleRightSelectionChange}
              />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
});

export default Comparison;
