import { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Link } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { getCurrentUserById } from "../services/users";

const drawerWidth = 240;

const courierLinks = [{ text: "View orders", url: "/view-map" }];
const adminLinks = [
  { text: "Add Order", url: "/add-order" },
  { text: "Assign Order", url: "/assign-order " },
  { text: "Audit Orders", url: "/audit-orders" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const userData = await getCurrentUserById(userId);

          if (userData) {
            if (userData.role === "admin") {
              setLinks(adminLinks);
            } else {
              setLinks(courierLinks);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
          marginLeft: open ? drawerWidth : 0,
          transition: "margin .2s",
        }}
      >
        <IconButton onClick={toggleSidebar}>
          {open ? <ChevronLeftIcon /> : <MenuIcon style={{ color: "#1976d2" }} />}
        </IconButton>
      </div>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          marginTop: 64,
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            top: 64,
          },
        }}
      >
        <List>
          {links.map((link, index) => (
            <ListItem key={index} sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>
              <Link
                href={link.url}
                color="inherit"
                sx={{ textDecoration: "none", "&:hover": { color: "#1976d2" } }}
              >
                <ListItemText
                  primary={link.text}
                  primaryTypographyProps={{ color: "primary", fontWeight: "bold" }}
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ marginLeft: open ? drawerWidth : 0, transition: "margin .2s" }}></main>
    </>
  );
};

export default Sidebar;
