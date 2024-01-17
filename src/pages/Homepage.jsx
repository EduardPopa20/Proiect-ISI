import { getCurrentUserById } from "../services/users";
import { getOrdersAssignedForTodayByCourierId } from "../services/orders";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Typography, List, ListItem, Button } from '@mui/material'; 

const Homepage = () => {

  const [currentUser, setCurrentUser] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);

  useEffect(() => {
    getCurrentUserById(localStorage.getItem("userId")).then((data) => {
      setCurrentUser(data);
    });
    getOrdersAssignedForTodayByCourierId(localStorage.getItem("userId")).then((orders) => {
      console.log("Ass orders" + orders);
      setAssignedOrders(orders);
    }).catch((error) => {
      console.error("Error fetching assigned orders for courier:", error.message);
    });
  }, []);

  return (
    <div>
      <Typography variant="h1">Courier Homepage</Typography>
      <Typography variant="body1">Welcome, {currentUser.firstName} {currentUser.lastName}!</Typography>

       <div>
        <Typography variant="h2">Your Assigned Orders</Typography>
        <List>
          {assignedOrders.map((order) => (
            <ListItem key={order.id}>
              Order #{order.id} - Destination: {order.locationName}
            </ListItem>
          ))}
        </List>
      </div>

      <Link to="/view-map">
        <Button variant="contained" color="primary">
          View Map
        </Button>
      </Link> 
    </div>
  )
};

export default Homepage;
