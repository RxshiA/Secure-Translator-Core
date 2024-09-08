import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../views/Sidebar";
import Navbar from "../../views/NavBar";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  Button,
  styled,
} from "@mui/material";
import {
  BookmarkAdd as Bookmark,
  BookmarkAdded as BookmarkAdd,
} from "@mui/icons-material";
import axios from "axios";

const Definition = () => {
  const { word } = useParams();
  const [definitions, setDefinitions] = useState([]);
  const [bookmarks, setBookmarks] = useState(false);
  const [bookmarkList, setBookmarkList] = useState([]);

  const addBookmark = (word, definitions) => {
    const newBookmark = { word, definitions };

    axios
      .post("http://localhost:4500/bookmark/add", newBookmark)
      .then(() => {
        console.log("bookmark added");
        setBookmarks(true);
      })
      .catch((err) => console.log(err));
  };

  const removeBookmark = (word) => {
    axios
      .post(`http://localhost:4500/bookmark/delete/${word}`)
      .then(() => {
        console.log("bookmark deleted");
        setBookmarks(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchDefinition = async () => {
      const resp = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setDefinitions(resp.data);
    };

    fetchDefinition();

    function getBookmarkList(word) {
      axios
        .get(`http://localhost:4500/bookmark/search/${word}`)
        .then((res) => {
          res.data !== null ? setBookmarks(true) : setBookmarks(false);

          console.log(res + "getBookmarkList");
        })
        .catch((error) => {
          console.error("Error fetching bookmark:", error.message);
        });
    }

    getBookmarkList(word);
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
              color: bookmarks ? "blue" : "gray", // Change color based on bookmarks state
            },
            "& .bookmark-button:hover": {
              color: bookmarks ? "darkblue" : "darkgray", // Change hover color based on bookmarks state
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{word}</Typography>
          <IconButton
            onClick={() => {
              if (bookmarks === false) {
                addBookmark(word, definitions);
              } else {
                removeBookmark(word, definitions);
              }
            }}
          >
            {bookmarks === false ? (
              <Bookmark className="bookmark-button" />
            ) : (
              <Bookmark className="bookmark-button" />
            )}
          </IconButton>
        </Stack>

        {definitions.map((def, idx) => (
          <Fragment key={idx}>
            <Divider className="divider" />
            {def.meanings.map((meaning) => (
              <Box
                key={Math.random()}
                className={`definition part-of-speech ${meaning.partOfSpeech.toLowerCase()}`}
              >
                <Typography variant="subtitle1">
                  {meaning.partOfSpeech}
                </Typography>
                {meaning.definitions.map((definition, idx) => (
                  <Typography variant="body2" key={definition.definition}>
                    {meaning.definitions.length > 1 && `${idx + 1}. `}
                    {definition.definition}
                  </Typography>
                ))}
              </Box>
            ))}
          </Fragment>
        ))}
        </Box>
    </div>
    </>
  );
};

export default Definition;