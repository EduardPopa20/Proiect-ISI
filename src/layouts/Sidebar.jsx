import { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Link } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { getCurrentUserById } from "../services/users";

const drawerWidth = 240;

const courierLinks = [
  { text: "See", url: "/see" },
  { text: "See", url: "/see" },
  { text: "About", url: "/about" },
  { text: "Services", url: "/services" },
  { text: "Contact", url: "/contact" },
];
const adminLinks = [
  { text: "sdadadsadasa", url: "/something" },
  { text: "cevaaaaaaa", url: "/ceva" },
  { text: "Add Order", url: "/add-order" },
  { text: "Manage Orders", url: "/manage-orders" },
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
      <IconButton onClick={toggleSidebar}>{open ? <ChevronLeftIcon /> : <MenuIcon />}</IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
<<<<<<< HEAD
          marginTop: 64,
=======
>>>>>>> d2a1af1bc49f56ead70a29eafe30b80f55bdf784
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
                <ListItemText primary={link.text} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ marginLeft: open ? drawerWidth : 0, transition: "margin .2s" }}>
        {/* Your page content goes here */}
      </main>
    </>
  );
};

export default Sidebar;
