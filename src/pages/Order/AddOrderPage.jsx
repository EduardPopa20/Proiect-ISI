import { useState } from "react";
import { db } from "../../services/firebase";
import { setDoc, doc, collection, addDoc } from "firebase/firestore";
import { Button, TextField, FormControlLabel, Checkbox, Grid, Paper, Typography } from '@mui/material';

const AddOrderPage = () => {
      const [orderData, setOrderData] = useState({
        location_id: '',
        weight: 0,
        delivered: false,
      });    

      const [locationFieldsVisible, setLocationFieldsVisible] = useState(false);
    
      const [locationData, setLocationData] = useState({
        name: '',
        latitude: '',
        longitude: '',
      });

      const [addedLocationId, setAddedLocationId] = useState('');

      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOrderData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value,
        }));
      };

      const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setLocationData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const addLocation = async (locationData) => {
        try {
          console.log(locationData);  
          const locationRef = await addDoc(collection(db, 'locations'), {
            name : locationData.name,
            latitude : locationData.latitude,
            longitude : locationData.longitude,
          });
          setAddedLocationId(locationRef.id);
          return locationRef.id; 
        } catch (error) {
          console.error('Error adding location:', error.message);
          throw error; 
        }
      };

      const addOrder = async (orderData) => {
        console.log(addedLocationId);
        try {
          const orderRef = await addDoc(collection(db, 'orders'),{
            location_id : addedLocationId,
            weight : orderData.weight,
            delivered : orderData.delivered
          });
          return orderRef.id; 
        } catch (error) {
          console.error('Error adding order:', error.message);
          throw error;
        }
      };


      const handleAddLocation = async () => {
        try {
            console.log(locationData);
            const locationId = await addLocation(locationData);
        
            setOrderData((prevData) => ({
              ...prevData,
              location_id: locationId,
            }));
        
            // Hide location fields after adding
            setLocationFieldsVisible(false);
          } catch (error) {
            // Handle error, show error message, etc.
          }
      };

      const handleAddOrder = async () => {
        try {
            await addOrder(orderData);
        
            // Reset form after successful addition
            setOrderData({
              location_id: '',
              weight: 0,
              delivered: false,
            });
          } catch (error) {
            // Handle error, show error message, etc.
          }
      };

      return (
        <Grid container justify="center" alignItems="center" style={{ height: '100vh' }}>
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Add Order
              </Typography>
              <form>
              <Button
              variant="contained"
              color="primary"
              onClick={() => setLocationFieldsVisible(!locationFieldsVisible)}
              fullWidth
              style={{ marginBottom: '20px' }}
            >
              {locationFieldsVisible ? 'Close Location' : 'Location'}
            </Button>
            {locationFieldsVisible && (
              <>
                <TextField
                  label="Location Name"
                  name="name"
                  value={locationData.name}
                  onChange={handleLocationChange}
                  fullWidth
                  margin="normal"
                />
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddLocation}
                  fullWidth
                  style={{ marginTop: '20px' }}
                >
                  Add Location
                </Button>
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
                <FormControlLabel
                  control={
                    <Checkbox
                      name="delivered"
                      checked={orderData.delivered}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Delivered"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddOrder}
                  fullWidth
                  style={{ marginTop: '20px' }}
                >
                  Add Order
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      );
}

export default AddOrderPage;