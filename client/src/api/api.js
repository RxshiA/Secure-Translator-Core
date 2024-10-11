import axios from "axios";
import BrowserStorage from "../helper/BrowserStorage";

const API_URL = "http://localhost:4500";
const token = BrowserStorage.getLocalStorage("token");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-auth-token": token,
  },
});

export const emailLogin = (email, password) => {
  return api.post("/user/email-login", { email, password });
};
export const oauthLogin = (email, googleId) => {
  return api.post("/user/oauth-login", { email, googleId });
};

export const registerEmailUser = (fname, lname, email, password) => {
  return api.post("/user/email-signup", {
    first_name: fname,
    last_name: lname,
    email: email,
    password: password,
  });
};

export const registerOauthUser = (fname, lname, email, googleId) => {
  return api.post("/user/oauth-signup", {
    first_name: fname,
    last_name: lname,
    email: email,
    googleId: googleId,
  });
};

export const initializeGame = (email) => {
  return api.post("/game", {
    email: email,
    points: 0,
  });
};

export const verifyToken = (token) => {
  return api.post(
    "/user/verify-token",
    {},
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
};

export const fetchProfile = (token) => {
  return api.post("/user/profile", { token });
};

export const fetchBookmarks = () => {
  return api.get("/bookmark/");
};

export const fetchLeaderboard = () => {
  return api.get("/game/");
};

export const createLeaderboardReport = (leaderboard) => {
  return api.post("/game/createpdf", { Game: leaderboard });
};

export const fetchLeaderboardReport = () => {
  return api.get("/game/fetchpdf", { responseType: "blob" });
};

export const addBookmark = (word, definitions) => {
  const newBookmark = { word, definitions };
  return api.post("/bookmark/add", newBookmark);
};

export const removeBookmark = (word) => {
  return api.post(`/bookmark/delete/${word}`);
};

export const fetchDefinition = (word) => {
  return axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
};

export const getBookmarkList = (word) => {
  return api.get(`/bookmark/search/${word}`);
};

export const fetchUserScore = (email) => {
  return api.get(`/game/${email}`);
};

export const checkTranslation = (text, language) => {
  return api.post("/translate", { text, language });
};

export const endGame = (email, points) => {
  return api.put(`/game/${email}`, { points });
};

export const fetchRandomWord = (email) => {
  return api.get(`/game/${email}`);
};
