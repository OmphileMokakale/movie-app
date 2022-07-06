import express from 'express';
import pgPromise from 'pg-promise';
import axios from 'axios';
import 'dotenv';
// import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { authToken, generateAccessToken } from './authToken';


// const API = require('./api');

const app = express();
// const bodyParser = require('body-parser')
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


// const DATABASE_URL =  'postgres://pgadmin:pg123@localhost:5432/hearts_app';
const pgp = pgPromise({});

const db = pgp('postgres://pgadmin:pg123@localhost:5432/movie_app');


// const movies = require('./movies.json');


const DATABASE_URL = process.env.DATABASE_URL;
// console.log(process.env.DATABASE_URL);
// const pgp = PgPromise({});

//for the database to show on heroku
const config = {
    connectionString: process.env.DATABASE_URL,
    max: 30,
    ssl: { rejectUnauthorized: false }
};

// API endpoint for creating a new user
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        // Store hash in your password DB.
        await db
            .none(`insert into movie_user ( firstname, lastname, username, password) values($1,$2,$3,$4) on conflict do nothing`,
                [firstName, lastName, username, hashedPassword]); // insert a new user into the database
    });

    const token = generateAccessToken(username);

    res.json({
        status: 'success',
        token
    })
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const userHashedPassword = await db.oneOrNone(`select * from movie_user where username = $1`, [username]);
    console.log(userHashedPassword);
    bcrypt.compare(password, userHashedPassword.password, (err, results) => {
        if (err) return err;
        if (results) {

            res.json({
                status: 'success',
                isLoggedin: true,
                user: userHashedPassword

            })
        }

    })

})

app.get('/api/movie/search/:searchQuery', async (req, res) => {
    const { searchQuery } = req.params; // search input from the client.
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=1bf9f405d83b93a51712dfe88ebd97f1&query=${searchQuery}`) // fetch the requested movie using the `searchQuery`.
        .then(movieApiResponse => {
            // console.log(movieApiResponse.data); // display the api response data to the console/terminal.
            res.json( // after a successful search we send the results to the user/client side.
                {
                    status: 'success',
                    searchResults: movieApiResponse.data.results
                }
            );
        });
});

app.get('/api/v1/auth', authToken, async (req, res) => {
    console.log(req.username);
    const verifyUser = await db.one('select * from movie_user where username = $1', [req.username])
    if (verifyUser) {
        res.json({
            status: 'success',
            user: verifyUser,
            isUser: true
        })
    }
    res.json({
        status: 'failure',
        isUser: false
    })

})

app.get('/api/play', function (req, res) {
    // note that this route just send JSON data to the browser
    // there is no template
    res.json({ movies });
});

// Example: http://localhost:3000/api/v1/add_to_playlist
app.post("/api/v1/add", async (req, res) => { // Add movie to plalist endpoint.
    const { movieId, movieName, moviePosterUrl } = req.body;
    // const { username } = req.username;
    // const getUser = await db.one("select * from movie_user where username = $1", [username]);
    // console.log(getUser);
    // if (getUser) {
    await db.none("insert into User_Playlist (user_id, movie_id, movie_name, moviePosterUrl) values ($1,$2, $3, $4)"
        , [1, movieId, movieName, moviePosterUrl]);
    res.json({
        status: "success",
        isAdded: true
    });
    // } else {
    // res.json({
    //     status: "failed",
    //     isAdded: false
    // });
    // }

});

export const handler = app;