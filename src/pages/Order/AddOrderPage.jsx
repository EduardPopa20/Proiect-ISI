import { useState } from "react";
import { Button, TextField, Card, Typography } from "@mui/material";
import { addLocation, addOrder } from "../../services/orders";
import SearchBarArcGis from "../../components/SearchBarArcGis";

const AddOrderPage = () => {
  const [orderData, setOrderData] = useState({
    name: "",
    location_id: "",
    weight: 0,
    delivered: false,
  });

  const handleSearch = (results) => {
    setLocationData((prevData) => ({
      ...prevData,
      name: results[0].results[0].name,
      latitude: results[0].results[0].feature.geometry.latitude,
      longitude: results[0].results[0].feature.geometry.longitude,
    }));
  };

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

  const handleAddOrder = async () => {
    try {
      const locationId = await addLocation(locationData);

      setOrderData((prevData) => ({
        ...prevData,
        location_id: locationId,
      }));

      await addOrder(orderData, locationId);

      setOrderData({
        name: "",
        location_id: "",
        weight: 0,
        delivered: false,
      });

      setLocationData({
        name: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      variant="none"
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        variant="none"
        sx={{
          width: "50%",
          padding: "15px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add Order
        </Typography>
        <form>
          <TextField
            label="Name"
            name="name"
            type="string"
            value={orderData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <SearchBarArcGis onSearch={handleSearch} />
          <TextField
            label="Location Name"
            name="locationName"
            type="string"
            value={locationData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Latitude"
            name="latitude"
            type="number"
            value={locationData.latitude}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Longitude"
            name="longitude"
            type="number"
            value={locationData.longitude}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
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
            style={{ marginTop: "20px" }}
          >
            Add Order
          </Button>
        </form>
      </Card>
    </Card>
  );
};

export default AddOrderPage;
