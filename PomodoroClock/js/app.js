$(function(){
	'use strict';

	var timerFunc; 
 	var isRunning = false; 	
 	var isBreakSession = false;

	function startTimer(duration, display) { //StartTimer function. Get the time in second and the html element where to display the time 
	   	var minutes;
	 	var seconds;
	 	
	    function timer() { // Timer Function until the duration is greater then zero let decrement time of 1s(set interval let function do this every 1 sec)
	      if (duration >= 0) {
	      	
	        minutes = parseInt(duration / 60, 10);
	        seconds = parseInt(duration % 60, 10);

	        minutes = minutes < 10 ? "0" + minutes : minutes;
	        seconds = seconds < 10 ? "0" + seconds : seconds;

	        display.text(minutes + ":" + seconds);
	       	
	        duration--; 
	        } else { // If timer goes to zero then starts the next session. It would be break session if it was work session and viceversa
	        	if(isBreakSession){	        		
	        		isBreakSession = false;
	        		duration = parseInt($('div#work-session span').text(),10) * 60;
	        		changeDisplayText($('div#work-session div.start button').text());
	        		timer();
	        		console.log(isBreakSession);
	        	} else {	        		
	        		isBreakSession = true;
	        		duration = parseInt($('div#break span').text(),10) * 60; 
	        		changeDisplayText($('div#break div.start button').text());
	        		timer();
	        		console.log(isBreakSession);	        		
	        	}
	        	
	        }
	    }
	    timer(); //Launch the function to let the timer starts before waiting an whole second
	    timerFunc = setInterval(timer,1000);
	   	
	}

	 
	$('button#countdown').click(function(){ //Start timer button. It stops the timer if is running otherwise it starts timer from the last time displayed 
		if(isRunning){			
			clearInterval(timerFunc);
			isRunning = false;
			
		}else{	
			var timerNumb = ($(this).children('#display-timer')).text();					
			startTimer(getTimeFromDisplay(timerNumb), $(this).children('#display-timer'));
			isRunning = true;	
			
		}	
		
	});

	

	$('button#plus').click(function(){ //Increment by 1 the work session or break length
		var par = ($(this).parent());		
		changeTimerLength((par.get(0).localName + '#' + par.get(0).id + ' span'), '+');
		checkTimerWhenInPause(par.get(0).id);
		
		
	});
	$('button#minus').click(function(){// Decrement by 1 the work session or break length
		var par = ($(this).parent());		
		changeTimerLength((par.get(0).localName + '#' + par.get(0).id + ' span'), '-');
		checkTimerWhenInPause(par.get(0).id);
		
	});

	$('div.start button').click(function(){	//Swaps from work session time to break time and viceversa
		if(isRunning === false){
			var grandPa = $(this).parent().parent().get(0).localName +'#' + $(this).parent().parent().get(0).id;		
			$('button#countdown div#display-timer').text(formatNumber($(grandPa + ' span').text()));//Change timer
			changeDisplayText($(this).text());			
			if($(this).parent().parent().get(0).id === 'break'){
				isBreakSession = true;
			}else {
				isBreakSession = false;
			}
		}			
		
	});

	
	$('button').mouseup(function(){//Let buttons loose the focus after click on them
			$(this).blur();
			
	});

	function checkTimerWhenInPause(idStr){//When timer in pause display time from selector
		if(isRunning === false && isBreakSession && idStr === 'break')		{
			$('button#countdown div#display-timer').text(formatNumber($('div#break span').text()));
		} else if (isRunning === false && isBreakSession === false && idStr === 'work-session'){
			$('button#countdown div#display-timer').text(formatNumber($('div#work-session span').text()));
		}
		
		
	}
	function changeDisplayText(str){//Change text of display timer button
		$('button#countdown div#display-session').text(str.slice(0, str.lastIndexOf(' ')));
	}

	function formatNumber(numb){//Format time to let them be displayed always in 4 digit format
		if(numb.length < 2){
			return '0' + numb + ':00';
		}
		return numb + ':00';
	}

	function changeTimerLength(element, operator){ //Support function for decrement and increment numbers in work session and break length

		if($(element).text() > 1 && operator === '-'){			
			return $(element).text($(element).text() - 1);
		} else if($(element).text() >= 1 && operator === '+'){
			return $(element).text(parseInt($(element).text()) + 1);
		}	
			
		
	}

	function getTimeFromDisplay(displayStr){// Get time from display and transform in seconds
		var arr = displayStr.split(':');
		var min = parseInt(arr[0], 10);
		var sec = parseInt(arr[1], 10);
		return min*60 + sec;			
	}

	

})