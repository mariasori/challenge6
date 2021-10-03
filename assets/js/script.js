var searchBtnEl = document.querySelector("#search-button");
var userInputEl = document.querySelector("#user-input");
var currentWeatherEl = document.querySelector("#current-weather");
var searchedCityEl = document.querySelector("#name-date-img");

var formSubmitHandler = function(event){
    event.preventDefault();
    var city = userInputEl.value.trim();

    if(city){
        cityWeather(city);
        userInputEl.value = "";
    }
    else {
        alert("Please enter a city.")
    }
}

var cityWeather = function(city){
    var apiKey = "c29dbdf00b06a84cdf3735b1122c2101"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
            console.log(data);
        });
    });

};

var displayWeather = function (weather, searchCity){
    currentWeatherEl.textContent = "";
    searchedCityEl.textContent = searchCity ;
    
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

var uvIndex = function (lat,lon){
    var apiKey = "c29dbdf00b06a84cdf3735b1122c2101"
    var apiURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
            console.log(data)
        });
    });
    console.log(lat);
    console.log(lon);
}

var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: ";

    var uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

    uvIndexEl.appendChild(uvIndexValue);

    currentWeatherEl.appendChild(uvIndexEl);
}

searchBtnEl.addEventListener("click", formSubmitHandler);


