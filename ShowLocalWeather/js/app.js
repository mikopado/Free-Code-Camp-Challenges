$(function() {
	'use strict';

	var unit = 'C';
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			
			// Current weather
			$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + long + '&appid=5fa3bb2e711d8c5fe9d4e24c15d46173', function(data) {
				
				//background image
				$('div.container-fluid').prepend('<img class="img-responsive" id="back" src="images/' + getWallPaper(data.weather[0].icon) + '.jpg">');
				
				//City
				$('div#city').html('<h2>' + data.name + ', ' + data.sys.country + '</h2>');
				
				// Weather description and icon
				$('div#weather-description').append('<img id="icon-weather" src="' + getWeatherIconURL(data) + '">'); 				
				$('div#weather-description').append('<span>' + data.weather[0].description + '</span>');
				
				// Temperature
				$('div#temperature').html('<button type="button" class="btn btn-default"><span class="temp">' + getTemperature(data.main.temp, unit,'avg') + '</span></button>');
				
				// Humidity and Wind							
				$('div#more-parameters').append('<div class="params">Humidity: <span>' + data.main.humidity + '%</span></div>');	
				$('div#more-parameters').append('<div class="params">Wind: <div id="arrow-tile" class="enable"><div>' + Math.round(data.wind.speed) + '</div></div>m/s</div>');				
				
				// Wind Direction	
				getWindDirection(data.wind.deg, 'div#arrow-tile');
				
				// Date and Time
				$('#time').html(getDateTime(data, 'date') + '<br><small>Last update: ' + getDateTime(data, 'time') + ' local time</small>');				
				
				//Button temperature click event
				$('div#temperature button').click(function() {					
					console.log($('.temp').length);
					$('.temp').each(function() {
						$(this).html(convertCelsiusFahrenheit($(this).text()));
					});
					swapUnit(unit);
				});

			}).fail(function() {
				$('div.col-xs-offset-3.text-center').html('Local weather not available.');
			});

			// Forecast
			$.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+ lat + '&lon=' + long + '&cnt=4&appid=5fa3bb2e711d8c5fe9d4e24c15d46173', function(forecast) {
				injectForecast(forecast, '#forecast div#day-');				
				
			}).fail(function() {
				$('#forecast').html('No forecast available for your location.');
			});
			
		});
	} else {
		$('div.col-xs-offset-3.text-center').html('Geolocation is not available or supported by browser');
	}

	//FUNCTIONS ABOUT TEMPERATURE
	function swapUnit(symb) { //Swapping the current unit of temperature
		if(symb === 'C') {									
			symb = 'F';
		} else {			
			symb = 'C';
		}
		
	};
	function getTemperature(data, unitSym, kind) {//Get temperature in Celsius or Fareheneit from Kelvin
		var tempConverted = '';	

		if(unitSym === 'C') {
			if(kind === 'min') {
				tempConverted = Math.floor(data - 273.15) + '°C';
			} else if(kind === 'max') {
				tempConverted = Math.ceil((data - 273.15)) + '°C';
			} else {
				tempConverted = Math.round(data - 273.15) + '°C';
			}
		} else if(unitSym === 'F') {
			if(kind === 'min') {
				tempConverted = Math.floor(data * (9 / 5) - 459.67) + '°F';
			} else if(kind === 'max') {
				tempConverted = Math.ceil(data * (9 / 5) - 459.67) + '°F';
			} else {
				tempConverted = Math.round(data * (9 / 5) - 459.67) + '°F';
			}
		}
		return tempConverted;
		
	};
	function injectForecast(data, selector) { // Get data from forecast API and inject in html
		var description = '';
		var icon = '';
		var tempMin = '';
		var tempMax = '';				
		var date = '';

		for(var i = 1; i < data.list.length; i++) {
			description = data.list[i].weather[0].description;
			icon = '<img src="' + getWeatherIconURL(data.list[i]) + '">';
			tempMin = getTemperature(data.list[i].temp.min, unit,'min');
			tempMax = getTemperature(data.list[i].temp.max, unit, 'max');					
			date = getDateTime(data.list[i], 'date', false);			
			$(selector + i).html(date + '<br>' + icon + '<br><span>' + description + '</span><br><span class="temp">' + tempMax  + '</span>/<span class="temp">' + tempMin + '</span>')
		}
		
	};

	function convertCelsiusFahrenheit(input) {//Convert from celcius to Fahrenheit and viceversa
		var value = input.slice(0, input.length - 2);		
		var symbol = input.slice(input.length - 1);		
		if(symbol === 'C') {
			return Math.round(value * 1.8 + 32) + '°F';
		} else if (symbol === 'F') {
			return Math.round((value - 32) / 1.8) + '°C';
		}
	};
	
	//FUNCTIONS ABOUT IMAGES
	function getWeatherIconURL(input) { // Get the weather icon from icon code		
		var icon = input.weather[0].icon;		
		return 'http://openweathermap.org/img/w/'+ icon + '.png';
	};
	function getWallPaper(iconId) { // Get the wallpaper(background image) associated to weather conditions
		var code = iconId.slice(0, iconId.length - 1);
		var iconPic = "";
		switch(code) {
			case '01':
			case '02':
				iconPic += 'clear-sky';
				break;
			case '03':
			case '04':
				iconPic += 'cloudy-weather';
				break;
			case '09':
			case '10':
				iconPic += 'rain';
				break;
			case '11':
				iconPic += 'thunderstorm';
				break;
			case '13':
				iconPic += 'snowing';
				break;
			case '50':
				iconPic += 'mist';
				break;
		}
		if(iconId[iconId.length - 1] === 'd') {
			iconPic += '-d';
		} else if (iconId[iconId.length - 1] === 'n') {
			iconPic += '-n';
		}

		return iconPic;
	};
	//FUNCTION FOR DATE AND TIME
	function getDateTime(input, dataToGet, withYear) { //Get date time from API and convert in a specific format
		var time = input.dt;
		var timeObj = new Date(time * 1000);
		var optionsDate = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
		var optionsTime = {hour:'numeric', minute:'numeric'};
		if(withYear === false) {
			optionsDate = {weekday: 'short', month: 'short', day: 'numeric'};
		}
		
		if(dataToGet === 'date') {
			timeObj = timeObj.toLocaleDateString('en-GB', optionsDate);
		} else if(dataToGet === 'time') {
			timeObj = timeObj.toLocaleTimeString('en-GB', optionsTime);
		}
		return timeObj;
	};
	//FUNCTION FOR WIND DIRECTION
	function getWindDirection(originData, selector) {//Get wind direction data and rotating the element associated
		if(originData === undefined) {
			$(selector).removeClass('enable');
			$(selector).css('background-color', 'transparent');
			$(selector).css('margin-right', '0px');
			$(selector).css('margin-left', '0px');
			$(selector).css('color', 'black');	
		}	
		var dataCorrect = originData + 180;						
		$(selector).css('transform', 'rotate(' + dataCorrect + 'deg)');
		$(selector + ' div:first-child').css('transform', 'rotate(-' + dataCorrect + 'deg)');
		
	};
})

