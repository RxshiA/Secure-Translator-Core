import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../views/Sidebar";
import Navbar from "../../views/NavBar";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import {
  BookmarkAdd as Bookmark,
  BookmarkAdded as BookmarkAdd,
} from "@mui/icons-material";
import { addBookmark, removeBookmark, fetchDefinition, getBookmarkList } from '../../api/api';

const Definition = () => {
  const { word } = useParams();
  const [definitions, setDefinitions] = useState([]);
  const [bookmarks, setBookmarks] = useState(false);

  useEffect(() => {
    const fetchDefinitionData = async () => {
      const resp = await fetchDefinition(word);
      setDefinitions(resp.data);
    };

    fetchDefinitionData();

    const fetchBookmarkList = async () => {
      const res = await getBookmarkList(word);
      setBookmarks(res.data !== null);
    };

    fetchBookmarkList();
  }, [word]);

  return (
    <>
      <div className="relative md:ml-64 bg-blueGray-100">
        <Sidebar />
        <Navbar />
        <div className="relative bg-pink-600 md:pt-5 pb-32 pt-12"></div>
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
              color: bookmarks ? "blue" : "gray",
            },
            "& .bookmark-button:hover": {
              color: bookmarks ? "darkblue" : "darkgray",
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
                color: "blue",
              },
              "&.verb": {
                color: "green",
              },
              "&.adjective": {
                color: "red",
              },
            },
            "& .definition": {
              margin: "10px 0",
              fontSize: "16px",
              color: "gray",
            },
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{word}</Typography>
            <IconButton
              onClick={() => {
                if (bookmarks === false) {
                  addBookmark(word, definitions).then(() => setBookmarks(true));
                } else {
                  removeBookmark(word).then(() => setBookmarks(false));
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