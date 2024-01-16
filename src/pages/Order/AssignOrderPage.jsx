import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Alert,
} from "@mui/material";

import { getUnassignedOrders, getUndeliveredOrders } from "../../services/orders";

import { getAllCouriers, assignCourierToOrder } from "../../services/couriers";

const AssignOrderPage = () => {
  const [couriers, setCouriers] = useState([]);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [undeliveredOrders, setUndeliveredOrders] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    getAllCouriers().then((data) => {
      setCouriers(data);
    });
    getUndeliveredOrders().then((data) => {
      setUndeliveredOrders(data);
    });
  }, []);

  useEffect(() => {
    getUnassignedOrders().then((data) => {
      setUnassignedOrders(data);
    });
  }, [couriers, showSuccessMessage]);

  const handleDropdownLeftChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  const handleDropdownRightChange = (event) => {
    setSelectedOrderId(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      if (selectedCourier && selectedOrderId) {
        await assignCourierToOrder(selectedCourier, selectedOrderId);
        setShowSuccessMessage(true);
        getUnassignedOrders().then((data) => {
          setUnassignedOrders(data);
        });
        setSelectedCourier("");
        setSelectedOrderId("");
      } else {
        console.error("Both courier and order must be selected.");
      }
    } catch (error) {
      console.error("Error assigning courier to order:", error.message);
    }
  };

  return (
    <Card
      variant="none"
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      {/* Left side */}
      <Box
        sx={{
          flex: 2, // Set the left side to take 2/3 of the card
          padding: 2,
        }}
      >
        <Typography variant="h6">Undelivered Orders</Typography>
        {undeliveredOrders.length === 0 ? (
          <Typography variant="h6" sx={{ alignSelf: "center", color: "#1976D2" }}>
            Loading...
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Courier Name</TableCell>
                  <TableCell>Location Name</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Assigned</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {undeliveredOrders.map((undeliveredOrder) => (
                  <TableRow key={undeliveredOrder.id}>
                    <TableCell>{undeliveredOrder.name}</TableCell>
                    <TableCell>{undeliveredOrder.courierName}</TableCell>
                    <TableCell>{undeliveredOrder.locationName}</TableCell>
                    <TableCell>{undeliveredOrder.weight}</TableCell>
                    <TableCell>{undeliveredOrder.assigned ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {/* Add any actions or buttons here */}
                      <Button variant="outlined" color="primary">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          padding: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          aligntItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ alignSelf: "center", color: "#000", marginBottom: 2 }}>
          Assign Order
        </Typography>
        {couriers.length !== 0 ? (
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#000",
              height: "fit-content",
              backgroundColor: "#fff",
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel
                      id="left-dropdown-label"
                      sx={{
                        color: "#000",
                        "&.MuiInputLabel-shrink": { color: "#000" },
                      }}
                    >
                      Couriers
                    </InputLabel>
                    <Select
                      labelId="left-dropdown-label"
                      id="left-dropdown"
                      label="Left Dropdown"
                      onChange={handleDropdownLeftChange}
                      sx={{
                        "& label": { color: "#000" },
                        "& .MuiInput-underline:before": {
                          borderBottomColor: "#000",
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: "#000",
                        },
                        "& .MuiSelect-icon": { color: "#000" },
                        "& .MuiSelect-select": { color: "#000" },
                      }}
                    >
                      {couriers.map((courier) => (
                        <MenuItem key={courier.id} value={courier.id}>
                          {courier.firstName + " " + courier.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel
                      id="right-dropdown-label"
                      sx={{
                        color: "#000",
                        "&.MuiInputLabel-shrink": { color: "#000" },
                      }}
                    >
                      Orders
                    </InputLabel>
                    <Select
                      labelId="right-dropdown-label"
                      id="right-dropdown"
                      label="Right Dropdown"
                      onChange={handleDropdownRightChange}
                      sx={{
                        "& label": { color: "#000" },
                        "& .MuiInput-underline:before": {
                          borderBottomColor: "#000",
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: "#000",
                        },
                        "& .MuiSelect-icon": { color: "#000" },
                        "& .MuiSelect-select": { color: "#000" },
                      }}
                      disabled={!selectedCourier}
                    >
                      {unassignedOrders.map((order) => (
                        <MenuItem key={order.id} value={order.id}>
                          {order.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={handleButtonClick}
                sx={{
                  backgroundColor: "#fff",
                  color: "#2196F3",
                  "&:hover": { backgroundColor: "#fff", color: "#2196F3" },
                }}
                disabled={!selectedCourier || !selectedOrderId}
              >
                Submit
              </Button>
              {showSuccessMessage && (
                <Alert severity="success" sx={{ marginTop: 2 }}>
                  Assignment successful!
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          <Typography variant="h6" sx={{ alignSelf: "center", color: "#1976D2" }}>
            Loading...
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default AssignOrderPage;
