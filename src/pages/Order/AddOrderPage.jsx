import { useState } from "react";

import { Button, TextField, Grid, Paper, Typography } from "@mui/material";

import { addLocation, addOrder } from "../../services/orders";

const AddOrderPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${locationData.name}`
      );

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const { location } = data.candidates[0];
        setLocationData((prevData) => ({
          ...prevData,
          latitude: location.y,
          longitude: location.x,
        }));
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };
  const [orderData, setOrderData] = useState({
    location_id: "",
    weight: 0,
    delivered: false,
  });

  const [locationFieldsVisible, setLocationFieldsVisible] = useState(false);

  const [locationData, setLocationData] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationChange = (e) => {
    setLocationData((prevData) => ({
      ...prevData,
      name: e.target.value,
    }));
  };

  const handleAddOrder = async () => {
    try {
      const locationId = await addLocation(locationData);

      setOrderData((prevData) => ({
        ...prevData,
        location_id: locationId,
      }));

      await addOrder(orderData, locationId);

      setOrderData({
        location_id: "",
        weight: 0,
        delivered: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid container justify="center" alignItems="center" style={{ height: "100vh" }}>
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Add Order
          </Typography>
          <form>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setLocationFieldsVisible(!locationFieldsVisible)}
              fullWidth
              style={{ marginBottom: "20px" }}
            >
              {locationFieldsVisible ? "Close Location" : "Location"}
            </Button>
            {locationFieldsVisible && (
              <>
                <TextField
                  label="Search Location"
                  name="name"
                  value={locationData.name}
                  onChange={(e) => setLocationData({ ...locationData, name: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLocationSearch}
                  fullWidth
                  style={{ marginBottom: "20px" }}
                >
                  Search
                </Button>
                <TextField
                  label="Latitude"
                  name="latitude"
                  value={locationData.latitude}
                  onChange={handleLocationChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Longitude"
                  name="longitude"
                  value={locationData.longitude}
                  onChange={handleLocationChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
            <TextField
              label="Weight"
              name="weight"
              type="number"
              value={orderData.weight}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddOrder}
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Add Order
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddOrderPage;
