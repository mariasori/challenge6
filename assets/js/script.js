var searchBtnEl = document.querySelector("#search-button");
var userInputEl = document.querySelector("#user-input");
var currentWeatherEl = document.querySelector("#current-weather");
var searchedCityEl = document.querySelector("#name-date-img");
var forecastWeatherEl = document.querySelector("#forecast-weather");
var forecastTitleEl = document.querySelector("#forecast-title");

var formSubmitHandler = function(event){
    event.preventDefault();
    var city = userInputEl.value.trim();

    if(city){
        cityWeather(city);
        fiveDayForecast(city);
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
    if (uvIndexValue <= 2) {
        uvIndexValue.classList = "favorable"
    }
    else if (2 < uvIndexValue <=7){
        uvIndexValue.classList = "moderate"
    }
    else if (uvIndexValue > 7) {
        uvIndexValue.classList = "severe"
    }



    uvIndexEl.appendChild(uvIndexValue);

    currentWeatherEl.appendChild(uvIndexEl);
}

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
            console.log(weatherIcon)
            console.log(weatherIconEl)
                         
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

searchBtnEl.addEventListener("click", formSubmitHandler);
