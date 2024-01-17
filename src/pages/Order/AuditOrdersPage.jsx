import { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";

import { getDeliveredOrders } from "../../services/orders";

const AuditOrderPage = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    getDeliveredOrders().then((data) => {
      setDeliveredOrders(data);
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
      <Box
        sx={{
          width: "80%",
          flex: 2,
          padding: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ marginBottom: "25px", textAlign: "center", color: "#1976D2" }}
        >
          Delivered Orders
        </Typography>
        {deliveredOrders.length === 0 ? (
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
                  <TableCell sx={{ textAlign: "center" }}>Location Name</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Weight</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Delivered by</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveredOrders.map((deliveredOrder) => (
                  <TableRow key={deliveredOrder.id}>
                    <TableCell sx={{ textAlign: "center" }}>{deliveredOrder.name}</TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      {deliveredOrder.locationName}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{deliveredOrder.weight}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{deliveredOrder.courierName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default AuditOrderPage;
