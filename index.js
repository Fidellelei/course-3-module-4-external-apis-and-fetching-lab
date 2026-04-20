
// index.js

const weatherApi = "https://api.weather.gov/alerts/active?area=";

document.addEventListener("DOMContentLoaded", () => {
  const stateInput = document.getElementById("state-input");
  const fetchButton = document.getElementById("fetch-alerts");
  const alertsDisplay = document.getElementById("alerts-display");
  const errorMessage = document.getElementById("error-message");

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
  }

  function displayAlerts(data) {
    alertsDisplay.innerHTML = "";

    const summary = document.createElement("h2");
    summary.textContent = `${data.title}: ${data.features.length}`;
    alertsDisplay.appendChild(summary);

    const ul = document.createElement("ul");

    data.features.forEach((alert) => {
      const li = document.createElement("li");
      li.textContent = alert.properties.headline;
      ul.appendChild(li);
    });

    alertsDisplay.appendChild(ul);
  }

  function fetchWeatherAlerts(state) {
    return fetch(`${weatherApi}${state}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather alerts");
        }
        return response.json();
      })
      .then((data) => {
        clearError();
        displayAlerts(data);
        stateInput.value = "";
      })
      .catch((error) => {
        showError(error.message);
      });
  }

  fetchButton.addEventListener("click", () => {
    const state = stateInput.value.trim().toUpperCase();

    alertsDisplay.innerHTML = "";

    if (!state) {
      showError("Please enter a state abbreviation");
      return;
    }

    fetchWeatherAlerts(state);
  });
});