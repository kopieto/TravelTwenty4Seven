const Travel = require("../models/travel")

const setTravelOptions = async (date, username) => {

    let travel = await Travel.findOne({
        date
    });

    if (!travel) {
        travel = await new Travel({
            date
        }).save();
    }

    let route = "Romania - UK";
    let destinations = ["Bucarest", "Budapest", "Viena", "Paris", "Praha", "London"];
    let weekday = new Date(travel.date).getDay();
    // let pickUpPoint = "home";

    if (weekday == 0) {
        route = "UK - Romania"
        destinations = destinations.reverse()
    } else if (weekday != 5) {
        route = "We are traveling only on Friday and on Sunday"
    }


    return {
        username,
        tickets: travel.ticketsLeft,
        route,
        destinations
    }
}


module.exports = setTravelOptions