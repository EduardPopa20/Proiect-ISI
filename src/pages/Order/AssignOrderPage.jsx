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
  Fade,
} from "@mui/material";

import { getUnassignedOrders, getUndeliveredOrders } from "../../services/orders";

import {
  getAllCouriers,
  assignCourierToOrder,
  unassignCourierFromOrder,
} from "../../services/couriers";

const AssignOrderPage = () => {
  const [couriers, setCouriers] = useState([]);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [undeliveredOrders, setUndeliveredOrders] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccessButtonClick = () => {
    setShowSuccessMessage(false);
  };

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

  useEffect(() => {
    let timeoutId;

    if (showSuccessMessage) {
      timeoutId = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [showSuccessMessage]);

  const handleDropdownLeftChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  const handleDropdownRightChange = (event) => {
    setSelectedOrderId(event.target.value);
  };

  const handleUnassignClick = async (orderId, courierId) => {
    try {
      await unassignCourierFromOrder(orderId, courierId);
      setShowSuccessMessage(true);

      getUnassignedOrders().then((data) => {
        setUnassignedOrders(data);
      });

      getUndeliveredOrders().then((data) => {
        setUndeliveredOrders(data);
      });

      setSelectedCourier("");
      setSelectedOrderId("");
    } catch (error) {
      console.error("Error unassigning courier from order:", error.message);
    }
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
    } finally {
      getUndeliveredOrders().then((data) => {
        setUndeliveredOrders(data);
      });
    }
  };

  return (
    <Card
      variant="none"
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        aligntItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        variant="none"
        sx={{
          width: "80%",
          height: "95%",
          display: "flex",
          justifyContent: "space-between",
          border: "2px solid #000",
          margin: "20px 0px",
        }}
      >
        <Box
          sx={{
            flex: 2,
            padding: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "25px", textAlign: "center", color: "#1976D2" }}
          >
            Undelivered Orders
          </Typography>
          {undeliveredOrders.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ marginBottom: "25px", alignSelf: "center", color: "#1976D2" }}
            >
              Loading...
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }}>Name</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Courier Name</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Location Name</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Weight</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Assigned</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {undeliveredOrders.map((undeliveredOrder) => (
                    <TableRow key={undeliveredOrder.id}>
                      <TableCell sx={{ textAlign: "center" }}>{undeliveredOrder.name}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {undeliveredOrder.courierName}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {undeliveredOrder.locationName}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{undeliveredOrder.weight}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {undeliveredOrder.assigned ? "Yes" : "No"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {undeliveredOrder.courierName !== "Not assigned" && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              handleUnassignClick(undeliveredOrder.id, undeliveredOrder.courierId)
                            }
                          >
                            Unassign
                          </Button>
                        )}
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
            borderLeft: "1px solid #000",
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
                margin: "20px 0px",
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
              </CardContent>
            </Card>
          ) : (
            <Typography variant="h6" sx={{ alignSelf: "center", color: "#1976D2" }}>
              Loading...
            </Typography>
          )}
        </Box>
      </Card>
      {showSuccessMessage && (
        <Fade
          in={showSuccessMessage}
          timeout={{ enter: 1000, exit: 1000 }}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "auto",
            cursor: "pointer",
          }}
          onClick={handleSuccessButtonClick}
        >
          <Alert severity="success" sx={{ margin: "16px 0" }}>
            Operation was successful!
          </Alert>
        </Fade>
      )}
    </Card>
  );
};

export default AssignOrderPage;
