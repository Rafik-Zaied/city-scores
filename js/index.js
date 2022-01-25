const get = (element) => document.querySelector(element);
const getAll = (element) => document.querySelectorAll(element);
//input text
const userInput = get("#user-input");
//ul that displays the suggestions based on the input
const autocomplete = get("#autocomplete");
//form that contains the textbox
const formSearchBar = get("#searchbar");
const ErrorMessage = get("#error-message");
//Array that holds all the name's of the cities available data
const cities = [];
let city = "";

//output elements
const background = get("#background-photo");
const titleDisplay = get("#city-data-title");
const summaryDisplay = get("#city-data-summary");
const categoriesDisplay = get("#city-data-categories");
const scoreDisplay = get("#city-data-score");

function loadCities() {
  fetch(`https://api.teleport.org/api/urban_areas/`)
    .then((response) => response.json())
    .then((data) => {
      data._links["ua:item"].forEach((city) => cities.push(city.name));
    });
}

loadCities();

//on every change of the value inside the userInput text field or when it gets focuse, if there's text inside it searchs
//for the first 5 matching values and displays them inside the ul
function autocompleteUserInput() {
  if (userInput.value != "" && userInput === document.activeElement) {
    let citiesHtml = [];
    cities.forEach((city) => {
      if (city.toLowerCase().includes(userInput.value)) {
        citiesHtml.push(`<li class="autocomplete-item" id="autocomplete-item">${city}</li>`);
      }
    });
    autocomplete.innerHTML = citiesHtml.slice(0, 4).join("");
  } else autocomplete.innerHTML = "";
}

//if a suggested item is clicked, it's value it's written in the textbox, and then it's fired the function that fetches the
//data of the selected city
function handleClickOnSuggestedCities(e) {
  userInput.value = e.target.textContent;
  autocomplete.innerHTML = "";
  ErrorMessage.textContent = "";
  startSearch();
}

function onSubmit(e) {
  e.preventDefault();
  if (userInput.value === "" || userInput.value === " ") {
    ErrorMessage.textContent = "Type something to start the search!";
    console.log("submitted");
  } else {
    ErrorMessage.textContent = "";
    startSearch();
  }
}

async function startSearch() {
  let city = userInput.value
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(",", "")
    .replaceAll(".", "");

  try {
    photo = await fetchPhoto(city);
    displayPhoto(photo);
    cityData = await fetchData(city);
    displaycityData(cityData);
  } catch (error) {
    ErrorMessage.textContent =
      "City not found, if the city requested is not among the suggested ones its data is not available";
  }
}

async function fetchPhoto(city) {
  let photoUrl = new URL(`https://api.teleport.org/api/urban_areas/slug:${city}/images/`);
  try {
    let response = await fetch(photoUrl);
    let photo = await response.json();
    if (response.status != 404) return photo;
  } catch (error) {
    throw new Error("fetch");
  }
}

async function fetchData(city) {
  let cityDataUrl = new URL(`https://api.teleport.org/api/urban_areas/slug:${city}/scores/`);
  try {
    let response = await fetch(cityDataUrl);
    let cityData = response.json();
    if (response.status != 404) return cityData;
  } catch (error) {
    throw new Error("fetch");
  }
}

function displayPhoto(photo) {
  const { image: photos } = photo.photos[0];
  background.style.backgroundImage = `url(${photos.web})`;
  background.style.padding = `1em`;
}

function displaycityData(cityData) {
  const { summary, categories, teleport_city_score: cityScore } = cityData;
  titleDisplay.textContent = userInput.value;
  summaryDisplay.innerHTML = summary;
  categoriesDisplay.innerHTML = categories
    .map((category) => {
      return `<li class="city-data-categorie">${category.name}: ${Math.floor(
        category.score_out_of_10
      )}/10</li>`;
    })
    .join("");

  scoreDisplay.textContent = `Overall score ${cityScore.toFixed(2)}`;
}

userInput.addEventListener("keyup", autocompleteUserInput);
userInput.addEventListener("click", autocompleteUserInput);
document.addEventListener("click", () => (autocomplete.innerHTML = ""));
formSearchBar.addEventListener("submit", onSubmit);
autocomplete.addEventListener("click", handleClickOnSuggestedCities);
