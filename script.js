const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");
const timeEl = document.getElementById("time-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = "";
let countdownDate = "";
let countdownTime = "";
let countdownValue = Date;
let countdownActive;
let savedCountdown;

let countdownDatewithTime;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input min with today's date
const today = new Date().toLocaleDateString().split("T")[0];
dateEl.setAttribute("min", today);

// populate countdown and complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const nowObj = new Date();
    const now = nowObj.getTime();
    let distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    //hide input
    inputContainer.hidden = true;

    // if countdown has ended, show complete
    if (distance < 0) {
        countdownEl.hidden = true;
        clearInterval(countdownActive);
        completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        completeEl.hidden = false;
    } else {
        // show the countdown in progress
        //update values for countdown
    countdownElTitle.textContent = `${countdownTitle}`;
    timeElements[0].textContent = `${days}`;
    timeElements[1].textContent = `${hours}`;
    timeElements[2].textContent = `${minutes}`;
    timeElements[3].textContent = `${seconds}`;
    completeEl.hidden = true;
    countdownEl.hidden = false;   
    }
  }, second);
}

// take values from form input
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  countdownTime = e.srcElement[2].value;
  savedCountdown = {
      title: countdownTitle,
      date: countdownDate,
      time: countdownTime,
  };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));
  // check for valid date
  if (countdownDate === "") {
    alert("Please select a date");
  } else {
    // get number version of current date, to update dom later
    countdownDatewithTime = countdownDate + "T" + countdownTime + ":00";
    countdownValue = new Date(countdownDatewithTime).getTime();
    updateDOM();
  }
}

// reset all values
function reset() {
  // hide countdowns, show input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // stop the countdown so it doesn't run in the background
  clearInterval(countdownActive);
  // reset the values for our countdown title and date
  countdownTitle = "";
  countdownDate = "";
  countdownTime = "";
  localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // get countdown from localstorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;

        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        console.log(countdownTitle);
        countdownDate = savedCountdown.date;
        countdownTime = savedCountdown.time;
        countdownDatewithTime = countdownDate + "T" + countdownTime + ":00";
        countdownValue = new Date(countdownDatewithTime).getTime();
        updateDOM();
    }
}

// event listener
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener('click', reset);

// on load, check local storage
restorePreviousCountdown();
