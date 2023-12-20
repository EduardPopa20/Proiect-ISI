import { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { getCurrentUserById } from "../services/users";

const drawerWidth = 240;

const courierLinks = ["See", "About", "Services", "Contact"];
const adminLinks = ["sdadadsadasa", "cevaaaaaaa", "Add Order", "Manage Orders"];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const userData = await getCurrentUserById(userId);
          setUser(userData);
          console.log(userData);
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
      } finally {
        setLoading(false);
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
          marginTop: 64,
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            top: 60,
          },
        }}
      >
        <List>
          {links.map((text, index) => (
            <ListItem index={index} key={text}>
              <ListItemText primary={text} />
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
