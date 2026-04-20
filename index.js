// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="
// ================================
// DOM ELEMENTS
// ================================
const input = document.getElementById("state-input");
const button = document.getElementById("fetch-btn");
const alertsContainer = document.getElementById("alerts-container");
const errorDiv = document.getElementById("error-message");


// ================================
// MAIN FETCH FUNCTION
// ================================
async function fetchWeatherAlerts(state) {
  try {
    // Clear previous error before request
    clearError();

    const response = await fetch(
      `https://api.weather.gov/alerts/active?area=${state}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather alerts");
    }

    const data = await response.json();

    console.log(data); // for debugging

    displayAlerts(data);

    clearInput();
    clearError();

  } catch (error) {
    displayError(error.message);
  }
}


// ================================
// DISPLAY ALERTS IN DOM
// ================================
function displayAlerts(data) {
  alertsContainer.innerHTML = "";

  const alerts = data.features || [];

  // Summary title line
  const summary = document.createElement("h3");
  summary.textContent = `Current watches, warnings, and advisories: ${alerts.length}`;
  alertsContainer.appendChild(summary);

  // If no alerts
  if (alerts.length === 0) {
    const noData = document.createElement("p");
    noData.textContent = "No active alerts for this state.";
    alertsContainer.appendChild(noData);
    return;
  }

  // List of alerts
  const list = document.createElement("ul");

  alerts.forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert?.properties?.headline || "No headline available";
    list.appendChild(li);
  });

  alertsContainer.appendChild(list);
}


// ================================
// INPUT + UI HELPERS
// ================================
function clearInput() {
  input.value = "";
}


// ================================
// ERROR HANDLING
// ================================
function displayError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function clearError() {
  errorDiv.textContent = "";
  errorDiv.style.display = "none";
}


// ================================
// EVENT LISTENER
// ================================
button.addEventListener("click", () => {
  const state = input.value.trim().toUpperCase();

  // Input validation (2 capital letters)
  if (!/^[A-Z]{2}$/.test(state)) {
    displayError("Please enter a valid 2-letter state abbreviation.");
    return;
  }

  fetchWeatherAlerts(state);
});


// ================================
// OPTIONAL: EXPORTS (for Jest testing)
// ================================
if (typeof module !== "undefined") {
  module.exports = {
    fetchWeatherAlerts,
    displayAlerts,
    clearInput,
    displayError,
    clearError
  };
}