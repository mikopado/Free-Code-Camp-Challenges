$(function() {
	'use strict';

	$('div#btn-quote button').on('click', function(e) {	//on click connect to forismatic API to get json file. 	
		$.getJSON('https://cors-anywhere.herokuapp.com/http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en', function(json) {			
			getQuote(json);
			
		}).fail(function() {			
			$.getJSON('https://cors-anywhere.herokuapp.com/http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en', function(json) {
				getQuote(json)
			});
		});
		$('div#btn-quote').animateCss('pulse');
	});
	
	function tweetOut(phrase, name) { //Creates a URL with quote text and author to link to tweeter
		
		$('div#random-quote').html('<p>" ' + phrase + ' "</p>' +'<br>' + '<footer class=pull-right>' + name + '</footer>');
		var tweetURL = 'https://twitter.com/intent/tweet?text=' + phrase + " - " + name;		
		$('div#random-quote').animateCss('zoomIn');
		$('.btn-twitter').attr('href', tweetURL);
	};

	function getQuote(data) {
		var quote = data.quoteText;
		var author = "Anonymous";
		if(data.quoteAuthor !== "") {
			author = data.quoteAuthor;
		}
		tweetOut(quote, author);
	};

	$.fn.extend({ //Extends the jQuery prototype with a animateCss function that allows to add a class and then remove the same only after the animation has finished.
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    	}
	});

	$('a.btn-twitter').on('click', function() {
		$('a.btn-twitter').animateCss('pulse');
	});

})