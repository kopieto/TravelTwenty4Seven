//require("dotenv").config();
//maybe i have to comment top line when upload to heroku

require("./src/db/mongoose");

const express = require("express");
const session = require("express-session");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const sgMail = require('@sendgrid/mail');

const app = express();


const indexRouter = require("./src/routers/index");
const usersRouter = require("./src/routers/users");
const parcelsRouter = require("./src/routers/parcels");
const travelRouter = require("./src/routers/travel");


// CONFIG
app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");
sgMail.setApiKey(process.env.SG_KEY);


//Middlewares
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//basic and recommended setup for session
app.use(session({
    name: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: Number(process.env.SESS_MAXAGE),
        sameSite: true,
        secure: process.env.NODE_ENV === "production", 
    }
}));

app.use(parcelsRouter);
app.use(travelRouter);
app.use(usersRouter);
app.use(indexRouter);

//....................................................
app.listen(process.env.PORT, () => {
    console.log("Server is up on " + process.env.PORT);
});