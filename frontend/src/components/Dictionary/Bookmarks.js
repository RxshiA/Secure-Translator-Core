import Sidebar from "../../views/Sidebar";
import Navbar from "../../views/NavBar";
import { Stack, IconButton, Typography, Box, CircularProgress } from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Bookmarks = () => {
  const [bookmarkList, setBookmarkList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function fetchBookmarks() {
      axios
        .get(`http://localhost:4500/bookmark/`)
        .then((res) => {
          setBookmarkList(res.data);
          setLoading(false);
          console.log(bookmarkList + "getBookmarkList");
        })
        .catch((error) => {
          console.error("Error fetching bookmark:", error.message);
        });
    }

    fetchBookmarks();
  }, []);
  return (
    <>
    <div className="relative md:ml-64 bg-blueGray-100">
    <Sidebar />
    <Navbar />
        {/* Header */}
        <div className="relative bg-pink-600 md:pt-5 pb-32 pt-12">
        </div>
        <Box
        sx={{
          boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
          border: "1px solid #e0e0e0",
          "& .bookmark-button": {
            fontSize: "24px",
            color: "blue",
          },
          "& .bookmark-button:hover": {
            color: "darkblue",
            cursor: "pointer",
          },
          "& .divider": {
            display: "block",
            marginBottom: "20px",
            marginTop: "20px",
            borderColor: "#e0e0e0",
            borderBottomWidth: "1px",
          },
          "& .part-of-speech": {
            textTransform: "capitalize",
            fontSize: "14px",
            "&.noun": {
              color: "blue", // Change text color for nouns
            },
            "&.verb": {
              color: "green", // Change text color for verbs
            },
            "&.adjective": {
              color: "red", // Change text color for adjectives
            },
          },
          "& .definition": {
            margin: "10px 0",
            fontSize: "16px",
            color: "gray", // Default text color
          },
        }}
      >
      <Stack sx={{ mb: 2 }} direction="row" alignItems="center">
        <IconButton to="/" component={Link} sx={{ color: "black", mr: 1 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6">Bookmarks</Typography>
      </Stack>
      {loading ? (
            <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
          ) : bookmarkList.length ? (
            bookmarkList.map((b) => (
          <Box
            key={b._id}
            onClick={() => navigate(`/definition/${b.word}`)}
            // component={Link}
            sx={{
              p: 2,
              cursor: "pointer",
              backgroundColor: "white",
              borderRadius: 1,
              textTransform: "capitalize",
              mb: 2,
              fontWeight: 800,
              display: "block",
              color: "black",
              textDecoration: "none",
            }}
          >
            {b.word}
          </Box>
        ))
      ) : (
        <Typography sx={{ mt: 5 }} align="center">
          No Bookmarks
        </Typography>
      )}
      </Box>
      </div>
    </>
  );
};

export default Bookmarks;