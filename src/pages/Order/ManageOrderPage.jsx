import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const ManageOrderPage = () => {
  const handleDropdownLeftChange = (event) => {
    // Handle left dropdown change
  };

  const handleDropdownRightChange = (event) => {
    // Handle right dropdown change
  };

  const handleButtonClick = () => {
    // Handle button click
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: "70%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="left-dropdown-label">Left Dropdown</InputLabel>
              <Select
                labelId="left-dropdown-label"
                id="left-dropdown"
                label="Left Dropdown"
                onChange={handleDropdownLeftChange}
              >
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="right-dropdown-label">Right Dropdown</InputLabel>
              <Select
                labelId="right-dropdown-label"
                id="right-dropdown"
                label="Right Dropdown"
                onChange={handleDropdownRightChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardContent sx={{ textAlign: "center" }}>
        <Button variant="contained" onClick={handleButtonClick}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManageOrderPage;
