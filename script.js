// script which changes innerHTML of the elements and display the temp to user.
// **location preferences on the system must be on.

// SELECT ELEMENTS-1
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature p");
const descElement = document.querySelector(".temp-description p");
const locationElement = document.querySelector(".location p");


// App data-2
const weather = {}; // object to store data. 

weather.temperature = {
    unit : "celsius"
}

// FOR CONVERSION-4
const KELVIN = 273;
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

// CHECKING IF BROWSER SUPPORTS GEOLOCATION-5
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError); // callbacks
}else{
    notificationElement.style.display = "block"; // set to none usually in css file, should display only in case of error
    notificationElement.innerHTML = "<p> Browser doesn't Support Geolocation </p>";
}

// SET USER'S POSITION
function setPosition(GeolocationPosition){ // takes 1 argument position 
    console.log(GeolocationPosition); 
    let latitude = GeolocationPosition.coords.latitude;
    let longitude = GeolocationPosition.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(GeolocationPositionError){ // takes 1 argument error 
    console.log(GeolocationPositionError);
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${GeolocationPositionError.message} </p>`;
}

// GET WEATHER FROM API PROVIDER-6
function getWeather(latitude, longitude){ // by geographic coordinates. to know users location
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`; 
    console.log(api)
    fetch(api)  // fetching returns a promise, so used .then with callbacks to chain the multiple async code blocks.
        .then( response => { // response is in json
            let data = response.json();
            return data;
        })
        .then( data => {  
            weather.temperature.value = Math.floor(data.main.temp - KELVIN); // converting kelvin to celsius 
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then( () => {
            displayWeather(); // updates innerHTML
        });
}

// DISPLAY WEATHER TO UI-3
function displayWeather(){ //changes innerHTML of elements
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`; // template literals allow variables in strings.
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion-4
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET-4
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return; // if no data is fetched from api, in this case it is undefined. return will prevent the below code from running.
    
    if(weather.temperature.unit == "celsius"){ // if value is in celsius.
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit); // gives integer value
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`; // changing temp element innerHTML
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});

