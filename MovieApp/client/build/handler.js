"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var express = require("express");
var pgPromise = require("pg-promise");
var axios = require("axios");
require("dotenv");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var express__default = /* @__PURE__ */ _interopDefaultLegacy(express);
var pgPromise__default = /* @__PURE__ */ _interopDefaultLegacy(pgPromise);
var axios__default = /* @__PURE__ */ _interopDefaultLegacy(axios);
var bcrypt__default = /* @__PURE__ */ _interopDefaultLegacy(bcrypt);
var jwt__default = /* @__PURE__ */ _interopDefaultLegacy(jwt);
const authToken = (req, res, next) => {
  try {
    let header = req.headers["authorization"];
    if (typeof header !== "undefined") {
      let bearer = header.split(":");
      const { username } = jwt__default["default"].verify(bearer[1], "This-is-my-secret-code#1");
      req.username = username;
      req.isExpired = false;
      next();
    }
  } catch (error) {
    req.isExpired = true;
    next();
  }
};
const generateAccessToken = (username) => jwt__default["default"].sign({ username }, "This-is-my-secret-code#1", { expiresIn: "24h" });
const app = express__default["default"]();
app.use(express__default["default"].json());
app.use(express__default["default"].urlencoded({ extended: false }));
const pgp = pgPromise__default["default"]({});
const db = pgp("postgres://pgadmin:pg123@localhost:5432/movie_app");
process.env.DATABASE_URL;
({
  connectionString: process.env.DATABASE_URL,
  max: 30,
  ssl: { rejectUnauthorized: false }
});
app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  bcrypt__default["default"].hash(password, 10, async (err, hashedPassword) => {
    await db.none(`insert into movie_user ( firstname, lastname, username, password) values($1,$2,$3,$4) on conflict do nothing`, [firstName, lastName, username, hashedPassword]);
  });
  const token = generateAccessToken(username);
  res.json({
    status: "success",
    token
  });
});
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const userHashedPassword = await db.oneOrNone(`select * from movie_user where username = $1`, [username]);
  if (userHashedPassword) {
    bcrypt__default["default"].compare(password, userHashedPassword.password, (err, results) => {
      if (err)
        return err;
      if (results) {
        const token = generateAccessToken(username);
        res.json({
          status: "success",
          isLoggedin: true,
          user: userHashedPassword,
          isFound: true,
          token
        });
      }
    });
  } else {
    res.json({
      status: "failure",
      isLoggedin: false,
      isFound: false
    });
  }
});
app.get("/api/movie/search/:searchQuery", async (req, res) => {
  const { searchQuery } = req.params;
  axios__default["default"].get(`https://api.themoviedb.org/3/search/movie?api_key=1bf9f405d83b93a51712dfe88ebd97f1&query=${searchQuery}`).then((movieApiResponse) => {
    res.json({
      status: "success",
      searchResults: movieApiResponse.data.results
    });
  });
});
app.get("/api/v1/auth", authToken, async (req, res) => {
  console.log(req.username);
  console.log(req.isExpired);
  const verifyUser = await db.one("select * from movie_user where username = $1", [req.username]);
  res.json({
    user: verifyUser,
    isExpired: req.isExpired
  });
});
app.post("/api/v1/add", async (req, res) => {
  const { movieId, movieName, moviePosterUrl } = req.body;
  await db.none("insert into User_Playlist (user_id, movie_id, movie_name, moviePosterUrl) values ($1,$2, $3, $4)", [3, movieId, movieName, moviePosterUrl]);
  res.json({
    status: "success",
    isAdded: true
  });
});
app.get("/api/v1/user/playlist", authToken, async (req, res) => {
  const { id, firstname, lastname, username } = await db.one("select * from movie_user where username = $1", [req.username]);
  console.log(id);
  const userPlaylist = await db.many("select User_Playlist.movie_id, User_Playlist.movie_name, User_Playlist.moviePosterUrl, User_Playlist.user_id from User_Playlist inner join movie_user on movie_user.id = User_Playlist.user_id where User_Playlist.user_id = $1", [id]);
  console.log(userPlaylist);
  res.json({
    status: "success",
    playlist: userPlaylist
  });
});
const handler = app;
exports.handler = handler;
