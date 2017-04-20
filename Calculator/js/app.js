$(function(){
	'use strict';

	var symbols = ['AC','CE','(',')','7','8','9','&divide;', '4', '5', '6', '&times;', '1','2','3','-','0','.','+','='];
	var sign = 0;

	$('#calc .row').each(function(){//Insert Buttons in the Calculator
		var n = 0;
		while(n < 4){
			n++;
			var val = symbols[sign++];
			$(this).append('<div class="col-xs-3"><button id="' + val + '"class="btn btn-default">' + val +'</button></div>');
			
		}
	});

	var lastIndex = 0;
	var operatorIndex = 0; //mark the last index of any operator sign
	var tempResult = ""; //Keep tracking the temporary result of math expression
	var tempExpression = "";
	var trackResult = [];  // Array of objects of {lastindex, tempResult}. Useful to keep tracking tempresult when CE is pressed;

	$('button').click(function(){
		var elem = $(this).text();		
		
		if($('div#input p#tracking').text().includes('=')){ // To reset the display after pressing =.
			$('div#input p#tracking').text('');
			$('div#input p#result').text('');
		}

		if(/[0-9]/.test($(this).attr('id'))){ // Add elements to display if they are numbers			
			if(!(/[)]/.test($('div#input p#tracking').text()[$('div#input p#tracking').text().length - 1]))){
				$('div#input p#result').text(elem);
				$('div#input p#tracking').append(elem);
			}
		}else if(/[()]/.test($(this).attr('id'))){ //Add parenthesis
			if(elem === '('){
				if(/[0-9)]/.test($('div#input p#tracking').text()[$('div#input p#tracking').text().length - 1])){//If add ( when the last element displayed is a number then add also a X operator.
					$('button#×').click();	
					$('div#input p#tracking').append(elem);			
				} else if(/[^A-Za-z0-9_=]/.test($('div#input p#tracking').text()[$('div#input p#tracking').text().length - 1])){
					$('div#input p#tracking').append(elem);
				}
			} else{// Add ) only if the expression already includes (
				if($('div#input p#tracking').text().includes('(') && /[0-9)]/.test($('div#input p#tracking').text()[$('div#input p#tracking').text().length - 1])){
					$('div#input p#tracking').append(elem);
				}
			}
		}else if(/[A-Z]/.test($(this).attr('id'))){// If AC or CE are pressed

			if($(this).attr('id') === 'CE'){ // If CE then delete last element displayed				
				
				if($('div#input p#tracking').text().length === 0){ // If it's gonna delete all the math expression displayed then reset all
					$('div#input p#result').html('');
					tempResult = '';
					operatorIndex = 0;
					tempExpression = "";
				}else if(trackResult.length !== 0){	
				console.log($('div#input p#tracking').text().length - 1);
				console.log(trackResult[trackResult.length - 1].operatorIndex);				
					if($('div#input p#tracking').text().length - 1 === trackResult[trackResult.length - 1].operatorIndex){// If the math expression length -1 is equal to the index associated to the last opeartor sign where it has been claculated the temporary result
						tempResult = trackResult[trackResult.length - 1].tempResult; //tempresult will be equal to tempresult linked to the last index 
						trackResult.pop();							//then we delete the last element in the array
						$('div#input p#result').html(tempResult);
					}
				}
				$('div#input p#tracking').html($('div#input p#tracking').text().slice(0, $('div#input p#tracking').text().length - 1));
				
				
			} else{ // If AC then reset all 
				$('div#input p#result').html('');
				$('div#input p#tracking').html('');
				tempResult = '';
				operatorIndex = 0;
				tempExpression = "";
			}
		} else if(/[^A-Za-z0-9_=().]/.test($(this).attr('id'))){ //If button is any operator sign
			if(/[0-9)]/.test($('div#input p#tracking').text()[$('div#input p#tracking').text().length - 1])){//The operator will be displayed only if the last element displayed is a number or bracket.
				$('div#input p#tracking').append(elem);

				lastIndex = $('div#input p#tracking').text().length - 1;
				tempExpression = tempResult + $('div#input p#tracking').text().slice(operatorIndex,lastIndex);//math expression of the last result plus the expression from last operator(Necessary to calculate expression element by element and overcome the operation precedence)
				tempResult = getTotal(tempExpression);   //Calculate new result with new elements added
				$('div#input p#result').text(tempResult);
				operatorIndex = lastIndex;
				trackResult.push({'operatorIndex': operatorIndex, 'tempResult': tempResult});
			}
			
		} else if($(this).attr('id') === '.'){//Add the dot only if it's gonna follow a number and the number doen't not include already a dot.
			
			if(parseInt($('div#input p#tracking').text()[$('div#input p#tracking').text().length - 1], 10) && !($('div#input p#tracking').text().slice(lastIndex).includes('.'))){
				$('div#input p#tracking').append(elem);
			}
		}else {// If the equal sign is pressed
			tempExpression = tempResult + $('div#input p#tracking').text().slice(lastIndex);
			tempResult = getTotal(tempExpression);			
			$('div#input p#result').text(tempResult);
			$('div#input p#tracking').append(elem).append(tempResult); 
			tempResult = '';
			operatorIndex = 0;
			tempExpression = "";
		}
		
	});
	
	function getTotal(input){
		if(input.includes('÷')){
			input = input.replace('÷','/');
		} else if(input.includes('×')){
			input = input.replace('×','*');
		}
		return eval(input);
	}
	
	$('button').mouseup(function(){//Let buttons loose the focus after click on them
		$(this).blur();
		
	});
})