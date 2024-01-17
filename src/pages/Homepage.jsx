import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Typography, List, Grid, Button, Card, Box } from "@mui/material";

import { getCurrentUserById } from "../services/users";
import { getOrdersAssignedForTodayByCourierId } from "../services/orders";

const Homepage = () => {
  const [currentUser, setCurrentUser] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);

  useEffect(() => {
    getCurrentUserById(localStorage.getItem("userId")).then((data) => {
      setCurrentUser(data);
    });
    getOrdersAssignedForTodayByCourierId(localStorage.getItem("userId"))
      .then((orders) => {
        setAssignedOrders(orders);
      })
      .catch((error) => {
        console.error("Error fetching assigned orders for courier:", error.message);
      });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography variant="h3" sx={{ color: "rgb(25, 118, 210)", marginBottom: "50px" }}>
        Welcome, {currentUser.firstName} {currentUser.lastName}!
      </Typography>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          padding: "20px",
        }}
      >
        <div>
          <Typography variant="h5">Your Assigned Orders:</Typography>
          <List>
            {assignedOrders.map((order) => (
              <Grid container key={order.id} spacing={1} alignItems="center">
                <Grid item>
                  <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                    {order.name}
                  </Typography>
                </Grid>
                <Grid item> :</Grid>
                <Grid item>
                  <Typography variant="body1" component="span" sx={{ fontWeight: "bold" }}>
                    {order.locationName}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </List>
        </div>

        <Link to="/view-map">
          <Button variant="contained" color="primary">
            View Map
          </Button>
        </Link>
      </Card>
    </Box>
  );
};

export default Homepage;
