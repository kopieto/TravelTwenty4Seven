require("dotenv").config();
require("./src/db/mongoose");

const path = require("path")
const express = require("express");
const ejs = require("ejs");
const sgMail = require('@sendgrid/mail');

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./src/routers/index");
const usersRouter = require("./src/routers/users");
const parcelsRouter = require("./src/routers/parcels");
const travelRouter = require("./src/routers/travel");


// CONFIG
app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");
sgMail.setApiKey(process.env.SG_KEY);

// app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));

app.use(parcelsRouter);
app.use(travelRouter);
app.use(usersRouter);
app.use(indexRouter);

//....................................................
app.listen(process.env.PORT, () => {
    console.log("Server is up on " + process.env.PORT);
});