$(function(){
	'use strict';
	

	$('input#search').autocomplete({ //Autocomplete for jQuery UI
		source: function(request, response){ // get function with request object who holds a term property and response that is a function			
			$.ajax({
				url: 'https://en.wikipedia.org/w/api.php?',
				dataType: 'jsonp',
				data : {action: 'opensearch', format: 'json', search: request.term}  //Important use opensearch to get an array of three arrays that contain at the second index the title
			}).done(function(data){
				response(data[1]);
				$('div.ui-helper-hidden-accessible').css('display', 'none');  //Hides the result of search at the bottom of list
				$('ul.ui-menu').addClass('dropdown-menu');		//Makes the list of searching elements as a dropdown menu from Bootstrap						
			});
			
		},
		
	});
	$('button#submit').on('click', function(e){
		var item = $('input#search').val();
		
		if(item !== "") { //if the value in search box is empty it keeps the default functionality of submit button and display the error message
			e.preventDefault();
			$('#main').empty();
			$.getJSON('https://en.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts|info&inprop=url&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + item +'&callback=?', function(data){
			data.query.pages.forEach(function(el){
				var url = el.fullurl;
				var index = el.index;
				$('#main').append('<div class="art-frame" id="'+ index + '"><a href="' + url + '" target="_blank">');
				$('#main div#' + index + ' a').append('<div id="head"><h2>' + el.title + '</h2></div>');		  		
		  		$('#main div#' + index + ' a').append('<p>' + el.extract + '</p></a></div>');
		  		if(el.hasOwnProperty('thumbnail')) { // Necessary because not all elements have a image associated to them.
		  			$('#main div#' + index + ' a div#head').append('<div id="pic"><img class="img-responsive" src="' + el.thumbnail.source + '"></div>');
		  			
		  		} 			  		
		  		$('#main div.art-frame').animateCss('slideInUp');
			});
			
		}).fail(function () {
			$('#main').html('No search available');		  			  	
		   
		  });
		 }
		
	});

	$('button#random').click(function() {	
		window.open('https://en.wikipedia.org/wiki/Special:Random');
	});
	
	$('button').mouseup(function(){//Let buttons loose the focus after click on them
		$(this).blur();
		
	});
	
	$('input#search').keydown(function(event){//Makes Enter press event equal to search button click event
		if(event.which === 13) {
			event.preventDefault();
			$('button#submit').click();			
			if($('input#search').val() !== '') {//Get loose the focus on input box after pressing enter				
				$(this).blur();			
			}
		}
		
	});

	$('input#search').focus(function() {// Clear the text from input textbox when user focus in
		if($('input#search').val() !== '') {
			$('input#search').val('');
		}
	});

	$.fn.extend({ //Extends the jQuery prototype with a animateCss function that allows to add a class and then remove the same only after the animation has finished.
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    	}
	});
})