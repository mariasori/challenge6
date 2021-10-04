var cities = [];

//variable declarations
var searchBtnEl = document.querySelector("#search-button");
var userInputEl = document.querySelector("#user-input");
var currentWeatherEl = document.querySelector("#current-weather");
var searchedCityEl = document.querySelector("#name-date-img");
var forecastWeatherEl = document.querySelector("#forecast-weather");
var forecastTitleEl = document.querySelector("#forecast-title");
var previousSearchesEl = document.querySelector("#previous-searches");
var currentWeatherCont = document.querySelector("#current-weather-container");

// search bar function to display current and future weather
var formSubmitHandler = function(event){
    event.preventDefault();
    var city = userInputEl.value.trim();

    if(city){
        cityWeather(city);
        fiveDayForecast(city);
        cities.unshift({city})
        userInputEl.value = "";
    }
    else {
        alert("Please enter a city.")
    }

    saveSearch();
    previousSearch(city);
}

//fetch weather info from api
var cityWeather = function(city){
    var apiKey = "c29dbdf00b06a84cdf3735b1122c2101"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });

};

//display current weather
var displayWeather = function (weather, searchCity){
    currentWeatherEl.textContent = "";
    $("#current-weather-container").removeClass("d-none");
   
    var weatherIconEl = document.createElement("span");
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
    weatherIconEl.appendChild(weatherIcon);

    searchedCityEl.textContent = searchCity + " (" + moment(weather.dt.value).format("MM/DD/YYYY") + ") ";  
    searchedCityEl.appendChild(weatherIconEl);

    var temperatureEl = document.createElement("div");
    temperatureEl.textContent = "Temp: " + weather.main.temp + " °F";
    currentWeatherEl.appendChild(temperatureEl);

    var windEl = document.createElement("div");
    windEl.textContent = "Wind: " + weather.wind.speed + " MPH";
    currentWeatherEl.appendChild(windEl);

    var humidityEl = document.createElement("div");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    currentWeatherEl.appendChild(humidityEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    uvIndex(lat,lon);
};

// get latitude/longitude information for UV index
var uvIndex = function (lat,lon){
    var apiKey = "c29dbdf00b06a84cdf3735b1122c2101"
    var apiURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}
// display UV index and color code by severity
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";

    var uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

    if (index.value > 7) {
        $(uvIndexValue).removeClass("favorable")
        $(uvIndexValue).removeClass("moderate")
        $(uvIndexValue).addClass("severe")
    }
    else if (2 < index.value <= 7){
        $(uvIndexValue).removeClass("favorable")
        $(uvIndexValue).addClass("moderate")
        $(uvIndexValue).removeClass("severe")
    }
    else {
        $(uvIndexValue).addClass("favorable")
        $(uvIndexValue).removeClass("moderate")
        $(uvIndexValue).removeClass("severe")   
     }
    
    uvIndexEl.appendChild(uvIndexValue);

    currentWeatherEl.appendChild(uvIndexEl);
}

// fetch data for 5 day forecast
var fiveDayForecast = function(city) {
    var apiKey = "c29dbdf00b06a84cdf3735b1122c2101"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
                 
            displayForecast(data, city);
        });
    });
};

//display 5 day forecast
var displayForecast = function(weather){
    forecastWeatherEl.textContent = "";
    forecastTitleEl.textContent = "5 Day Forecast";

    var forecast = weather.list;
        for(var i=0; i < forecast.length; i+= 8){

            var forecastCard = document.createElement("div");
            forecastCard.setAttribute("id", "forecastCard");
            forecastCard.classList = "card bg-primary text-light d-flex";

            var dateObject = new Date(forecast[i].dt * 1000)
            var dateFormat = dateObject.toLocaleDateString("en-US");
            var date = document.createElement("h3");
            date.textContent= dateFormat
 
            var weatherIconEl = document.createElement("div");
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${forecast[i].weather[0].icon}.png`);
            weatherIconEl.appendChild(weatherIcon);
                         
            var temp = forecast[i].main.temp;
            var tempSpan = document.createElement("div");
            tempSpan.textContent = "Temp: " + temp;            

            var wind = forecast[i].wind.speed;
            var windSpan = document.createElement("div");
            windSpan.textContent = "Wind: " + wind + " MPH";  
            
            var hum = forecast[i].main.humidity;
            var humSpan = document.createElement("div");
            humSpan.textContent = "Humidity " + hum;

            forecastCard.appendChild(date);
            forecastCard.appendChild(weatherIconEl);
            forecastCard.appendChild(tempSpan);
            forecastCard.appendChild(windSpan);
            forecastCard.appendChild(humSpan);

            forecastWeatherEl.appendChild(forecastCard);

        }
}

// save search item in localStorage cities array
var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// create button for previous search
var previousSearch = function(previousSearch){
    previousSearchBtn = document.createElement("button");
    previousSearchBtn.textContent = previousSearch;
    previousSearchBtn.classList = "d-flex btn-sm btn-block btn-secondary"
    previousSearchBtn.setAttribute("data-city", previousSearch);
    previousSearchBtn.setAttribute("type", "submit");

    previousSearchesEl.prepend(previousSearchBtn);

}

// function for previous search buttons
var previousSearchHandler = function(event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        cityWeather(city);
        fiveDayForecast(city);
    }
}

//event listeners
searchBtnEl.addEventListener("click", formSubmitHandler);
previousSearchesEl.addEventListener("click", previousSearchHandler)