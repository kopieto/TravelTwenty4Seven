const datePicker = document.querySelector("#datepicker")
const dateElement = document.querySelector("#date");
const monthElement = document.querySelector("#month");
const prevMonth = document.querySelector("#prev-month");
const nextMonth = document.querySelector("#next-month");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"]
let date = new Date()
let day = date.getDate(); //1-31
let weekday = date.getDay(); //0-6
let month = date.getMonth(); //0-11
let year = date.getFullYear();

dateElement.textContent = displayDate(day, month, year);
monthElement.textContent = months[month] + " " + year;
populate();

prevMonth.addEventListener("click", showPrevMonth);
nextMonth.addEventListener("click", showNextMonth);



function populate() {
	const daysContainer = datePicker.appendChild(document.createElement("div"));
	daysContainer.classList.add("days-container");
	daysContainer.setAttribute("id", "days-container");

	if (weekday === 0) {
		weekday === 7
	}

	let startingDate = new Date(year, month, 1).getDay()
	let counter = 0;

	for (i = 1; i < startingDate; i++) {
		const dayElement = daysContainer.appendChild(document.createElement("div"));
		dayElement.classList.add("day");
		dayElement.textContent = "";
		counter++;
	}

	for (i = 1; i <= daysIn(month); i++) {
		const dayElement = daysContainer.appendChild(document.createElement("div"));
		dayElement.classList.add("day");
		dayElement.textContent = i;
		counter++;

		if (i === day && month === date.getMonth() && year === date.getFullYear()) {
			dayElement.classList.add("selected-date");
		}

		if ((counter - 5) % 7 === 0 || counter % 7 === 0) {
			
			if (year < date.getFullYear()) {
			} else if (year === date.getFullYear() && month < date.getMonth()) {
			} else if (year === date.getFullYear() && month === date.getMonth() && i < day) {
			} else {
				dayElement.classList.add("travel-dates");
				dayElement.addEventListener("click", pickDate);
			}
		}
	}
}

function displayDate(day, month, year) {
	return day + " / " + months[month] + " / " + year
}

function showPrevMonth(e) {
	month--;
	if (month < 0) {
		month = 11
		year--;
	}
	monthElement.textContent = months[month] + " " + year
	document.querySelector("#days-container").remove();
	populate();
}

function showNextMonth(e) {
	month++;
	if (month > 11) {
		month = 0
		year++;
	}
	monthElement.textContent = months[month] + " " + year
	document.querySelector("#days-container").remove();
	populate();
}

function daysIn(month) {
	let days = 31;
	if (month === 1) {
		if (year % 4 !== 0) {
			days = 28
		} else if (year % 100 !== 0) {
			days = 29;
		} else if (year % 400 === 0) {
			days = 29;
		} else {
			days = 28;
		}
	} else if (month === 3 || month === 5 || month === 8 || month === 10) {
		days = 30
	}
	return days;
}

function pickDate(e) {
	document.querySelector(".selected-date").classList.remove("selected-date");
	this.classList.add("selected-date");

	let reqDate = new Date(year, month, this.textContent);

	fetch(`${location.origin}/travels?date=${reqDate}`)
		.then(data => data.json())			
		.then(response => {
			const {
				tickets,
				username,
				route,
				destinations
			} = response
			console.log(response);
			console.log(tickets);


			document.querySelector("form").classList.remove("hidden");
			document.querySelector("#date-input").value = reqDate;
			dateElement.textContent = displayDate(this.textContent, month, year);

			document.querySelector("#ticket-date").textContent = dateElement.textContent;
			document.querySelector("#destination").innerHTML = "";
			document.querySelector("#tickets").innerHTML = "";

			if (tickets !== 0) {
				document.querySelector("#tickets-left").textContent = "Tickets left: " + tickets;
				document.querySelector("#ticket-username").textContent = username;
				document.querySelector("#ticket-route").textContent = route;
				document.querySelector("#request-btn").removeAttribute("disabled");


				for (i = 0; i < destinations.length; i++) {
					const option = document.querySelector("#destination").appendChild(document.createElement("option"));
					option.textContent = destinations[i];
					option.value = destinations[i];
				}

				for (i = 1; i <= tickets; i++) {
					const option = document.querySelector("#tickets").appendChild(document.createElement("option"));
					option.textContent = i;
					option.value = i;
				}
			} else {
				document.querySelector("#tickets-left").textContent = "Sold out";
				document.querySelector("#ticket-route").textContent = route;
				document.querySelector("#ticket-username").textContent = "";
				document.querySelector("#request-btn").setAttribute("disabled","disabled");
			}
		});
}