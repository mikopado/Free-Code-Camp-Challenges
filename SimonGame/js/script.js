$(function(){
	'use strict';

	var buttonsDict ={
		0: 'green',
		1: 'red',
		2: 'yellow',
		3: 'blue'
	}
	var userClick = '';
	var storedSeries = [];
	var count = 1;
	var clicksToDo = 0;
	var trackingSerie = 0;	
	var idleTime;
	var idleInterval = 0;
	var stopGame = false;
	var clickSound = new Audio('audio/clickStart.wav');
	var isUser = false;
	var end = false;

	function createSeries(){//Generate random series of buttons
		var series = [];
		for(var i=0; i < 20; i++){
			series.push(Math.floor(Math.random() * 4));
		}
		return series;
	}

	$('input').change(function(){//Based on the switch is on or off allow button to be clickable or not clickable				
		if($(this).prop('checked')){			
			$('#start button').removeClass('unclickable');
			$('#strict button').removeClass('unclickable');
			$('#count section').css('color', 'red');
		} else{
			$('.btns').addClass('unclickable');
			$('#start button').addClass('unclickable');
			$('#strict button').addClass('unclickable');
			$('#count section').css('color', '#8B0000');
			$('#light').removeClass('light-on');
			clearData();
			stopGame = true;	
		}
		var switchAudio = new Audio('audio/switch.wav');
		switchAudio.play();
	});
	
	$('#start button').click(function(){//Start button, it will start over every time is pressed
		clearData();		
		startOver(500);			
		clickSound.play();				
	});

	$('.btns button').click(function(){//User clicks buttons to play.
		isUser = true;
		userClick = getPropertyNamesFromValue($(this).parent().attr('id'));				
		performClick($(this));							
		if(userClick !== storedSeries[clicksToDo]){// If user clicks wrong button, the game will start over and if it's in strict mode it will generate a new serie	
			count = 1;
			if($('#light').hasClass('light-on')){
				storedSeries = createSeries();
			}	
			clicksToDo = 0;		
			setTimeout(function(){showComputerSeries(storedSeries, count);},1000);					
		}else{// If user clicks correctly, let user goes ahead until it will click all the part of shown series correctly			
			clicksToDo++;						
		}		
		if(clicksToDo === count){//If user clicks all shown series of button correctly then the game will show one step more in the serie
			if(count === storedSeries.length){//If the serie is completed, then user wins and the game will start over
				end = true;	
				var win = new Audio('audio/win.mp3');
				win.play();
				$('.btns button').each(function(){
					performClick($(this));
				});			
				setTimeout(function(){end = false;startOver(2000);},1500);
			}else{
				count++;
				$('.btns').addClass('unclickable');				
				setTimeout(function(){showComputerSeries(storedSeries, count);},2000);
			}
			
		}	
		clearInterval(idleTime);
		idleInterval = 0;		
	});
	
	function getPropertyNamesFromValue(value){
		for(var i=0; i < Object.getOwnPropertyNames(buttonsDict).length; i++){			
			if(buttonsDict[i] === value){				
				return i;
			}
		}
		
	}
	function performClick(selector){
		$(selector).addClass('clicked');			
		setTimeout(function(){$(selector).removeClass('clicked');},300);		
		var color = selector.parent().attr('id');
		var sound = '';
		switch(color){
			case 'green':
				sound = 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3';
				break;
			case 'red':
				sound = 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3';
				break;
			case 'yellow':
				sound = 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3';
				break;
			case 'blue':
				sound = 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3';
				break;
		}
		if(userClick !== storedSeries[clicksToDo] && isUser){
			sound = 'audio/wrong.mp3';
		}
		var audio = new Audio(sound);
		if(!end){
			audio.play();
		}
		
	}
	
	function showComputerSeries(series, counter){//Show the series of button to guess
		if(!stopGame){
			isUser = false;
			updateCountDisplay($('#count section'), count);			
			if(trackingSerie < counter){//It will click buttons until all buttons in the chunk of series are clicked
				performClick($('#' + buttonsDict[series[trackingSerie]] + ' button'));
				trackingSerie++;
				setTimeout(function(){showComputerSeries(series, counter);},800);				
			}else{//If all button are clicked, therefore the chunk of series is shown to user, then let buttons clickable for user and set an interval of time that user needs to click any button
				trackingSerie = 0;
				$('.btns').removeClass('unclickable');
				idleInterval = 0;
				idleTime = setInterval(function(){idleInterval++;},1000);							
			}		
			clicksToDo = 0;		
		}
		
	}

	function clearData(){//Set variables to default every time game starts over or it's in on off mode
		count = 1;
		clicksToDo = 0;
		userClick = '';
		trackingSerie = 0;
		storedSeries = [];
		clearTimeout(idleTime);
		$('#count section').text('--');
		clearInterval(idleTime);
		idleInterval = 0;			
	}

	function updateCountDisplay(selector, number){//Update the count of buttons series that user needs to guess
		if(number.toString().length === 1){
			$(selector).text('0' + number);
		}else{
			$(selector).text(number);
		}
	}
	
	function resetSerieAfterIdleTime(){//Reset the idle time interval every ten seconds
		if(idleInterval >= 10){
			count = 1;			
			clearInterval(idleTime);
			idleInterval = 0;
			var wrong = new Audio('audio/wrong.mp3');
			wrong.play();
			setTimeout(function(){showComputerSeries(storedSeries, count);},1000);
		}
	}
	setInterval(function(){resetSerieAfterIdleTime();}, 1000);
    
	$('#strict button').click(function(){
		$('#light').toggleClass('light-on');
		clickSound.play();
	});

	function startOver(interval){
		count = 1;
		storedSeries = createSeries();
		setTimeout(function(){showComputerSeries(storedSeries, count);},interval);
	}	

	
	
})