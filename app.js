require("dotenv").config();
// require("./src/db/mongoose");

const express = require("express");
const ejs = require("ejs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_KEY)

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded());

app.get("/", async (req, res) => {
    res.render("templates/index");
});

app.post("/", async (req, res) => {
    console.log(req.body);
    let emailContent = "My name is " + req.body.firstName + " " + req.body.lastName +
                    ". I didnt see the checkboxes. Please call me on " + req.body.mobileNumber;

    if (req.body.passanger === "true" && req.body.parcel === "true") {
        emailContent = "Hello my name is " + req.body.firstName + " " + req.body.lastName +
            ". I wish to travel from " + req.body.currentPosition + " to " + req.body.destination +
            ". I will have extra parcel with me. Parcel weight: " + req.body.weight +
            " kg. Please call me on " + req.body.mobileNumber + "!"
    } else {
        if (req.body.passanger === "true") {
            emailContent = "Hello my name is " + req.body.firstName + " " + req.body.lastName +
                ". I wish to travel from " + req.body.currentPosition + " to " + req.body.destination +
                ". Please call me on " + req.body.mobileNumber + "!"
        };

        if (req.body.parcel === "true") {
            emailContent = "Hello my name is " + req.body.firstName + " " + req.body.lastName +
                ". I need to send a parcel from " + req.body.currentPosition + " to " + req.body.destination +
                ". Parcel weight: " + req.body.weight + " kg, Receiver: " + req.body.rName +
                ", Mobile Number: " + req.body.rNumber +
                ". Please call me on " + req.body.mobileNumber + " !"
        };
    }
    console.log("~" + emailContent);

    sgMail.send({
        to: "ceco.sirakov@gmail.com",
        from: "ceco.sirakov@gmail.com",
        subject: "Traveling",
        text: emailContent
    })

    res.render("templates/starter", {
        content: "Thank you! We will contact you soon! "
    });
})

app.get("/contacts", async (req, res) => {
    res.render("templates/contacts");
});

app.get("/books", async (req, res) => {
    res.render("templates/books");
});

app.get("/*", (req, res) => {
    res.render("templates/starter", {
        content: "404 Page doesn't exist"
    })
})

//....................................................
app.listen(process.env.PORT, () => {
    console.log("Server is up on " + process.env.PORT);
});