// element which will be clicked while opening a context menu
let clickedElement = null;

// variables for infinite scrolling conditions
let isStopped = false;

// the interval time delay between scrolling function calls (milliseconds)
const INTERVAL_DELAY = 5000;

// number of retries before it decides it's stuck
const NUMBER_OF_RETRIES = 10;

// variables for stuck checking
let elementPreviousHeight = 0;
let stuckCounter = 0;

// global variable for the main loop
let interval = null;

// store the clicked element on right-click
document.addEventListener(
  "mousedown",
  function (e) {
    e.stopPropagation();
    if (e.button == 2) {
      clickedElement = e.target;
    }
  },
  false
);

// handle received action requests from context menu
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "stop":
      isStopped = true;
      break;
    default:
      prepareScrolling(message);
      break;
  }
});

// prepare scrolling by setting some of its variables
function prepareScrolling(message) {
  reset();

  // happens when launched from extensions bar
  if (clickedElement == null) {
    clickedElement = document.body;
  }

  let closestScrollableElement = findClosestScrollableElement(clickedElement);
  let numberOfRuns = 0;

  // infinite scrolling
  if (message.isInfinite) {
    numberOfRuns = Infinity;
  }
  // finite scrolling, ask user to enter the number of runs
  else {
    numberOfRuns = +prompt(
      `How many times do you want me to scroll ${message.direction}?`,
      5
    );
  }
  if (numberOfRuns !== null && numberOfRuns !== NaN && numberOfRuns > 0) {
    scroll(message.direction, numberOfRuns, closestScrollableElement);
  }
}

// main scrolling code
function scroll(direction, numberOfRuns, element) {
  let runsCounter = 0;

  // interval to scroll again
  interval = setInterval(() => {
    // get current height
    elementPreviousHeight = element.scrollHeight;

    if (direction === "up") {
      element.scrollTop -= element.scrollHeight;
    } else {
      element.scrollTop += element.scrollHeight;
    }

    // check if this isn't getting taller
    if (element.scrollHeight == elementPreviousHeight) {
      // we are stuck
      if (++stuckCounter >= NUMBER_OF_RETRIES) {
        setAsStuck();
      }
    } else {
      // reset stuck counter if it has scrolled
      stuckCounter = 0;
    }

    runsCounter++;

    // check if we are done with iterations
    if (runsCounter >= numberOfRuns || isStopped === true) {
      reset();
    }
  }, INTERVAL_DELAY);
}

// find the closest scrollable element to a specific element recursively
function findClosestScrollableElement(element) {
  let overflowY = window.getComputedStyle(element)["overflow-y"];

  if (
    (overflowY === "scroll" || overflowY === "auto") &&
    element.scrollHeight > element.clientHeight
  ) {
    if (element === document.body) {
      return document.documentElement;
    }
    return element;
  } else if (element.parentElement) {
    return findClosestScrollableElement(element.parentElement);
  } else {
    return document.documentElement;
  }
}

// set as stuck
function setAsStuck() {
  console.log("It's stuck!");
  reset();
}

// reset variables
function reset() {
  isStopped = false;
  stuckCounter = 0;
  elementPreviousHeight = 0;
  clearInterval(interval);
  console.log("It's resetted!");
}
