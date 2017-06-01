$(function(){
	'use strict';

	var userChoice = '';
	var isCompTurn = false;
	function objCell(row, col, user, comp){
			this.compMark = comp,
			this.userMark = user,
			this.indexRow = row,
			this.indexCol = col
	} 	
	$('button.choice').click(function(){
		$(this).parent().html("");
		$('div.col-sm-2').removeClass('off');
		$('div.col-sm-offset-3').addClass('shadow');
		$.each($('div.col-sm-offset-3'), function(){
			for(var i = 0; i < 3; i++){
				$(this).append('<div class="row rows-' + i + '"></div>');
			}	
			$.each($('div.col-sm-offset-3 div.row'), function(){
				for(var i = 0; i < 3; i++){
					$(this).append('<button class="col-xs-4 butt-' + i + '"></button>');
				}
			});
		});
		userChoice = $(this).text();

		$('div.row button.col-xs-4').click(function(){				
			if(isCellEmpty($(this)) && isCompTurn === false){
				$(this).text(userChoice);
				$(this).css('color', 'blue');				
				isCompTurn = true;								
				var audio = new Audio('audio/move.wav');
				audio.play();
				if(getWinner() !== 0){
					setTimeout(function(){compMove(isCompTurn);}, 500);
					var audio2 = new Audio('audio/comp-move.wav');
					setTimeout(function(){audio2.play();}, 500);
				}
								
			}else if(isCellEmpty($(this)) && isCompTurn){
				$(this).text(compMarks(userChoice));
				$(this).css('color', 'black');				
				isCompTurn = false;
			} else{
				var audio = new Audio('audio/wrong-move.wav');
				audio.play();
			}
			if(checkNoMoreCellAvailable()){
				setTimeout(function(){if(confirm('None wins!\nWould you like playing again?')){clearBoard();isCompTurn = false;}else{location.reload();};},500);
				var audio = new Audio('audio/tie.wav');
				audio.play();
				updateResult($('#tie-count'));
			}	
			if(getWinner() === 0){
				setTimeout(function(){if(confirm('You Win!\nWould you like playing again?')){clearBoard();isCompTurn = false;}else{location.reload();};},500);
				popButtonUp();
				var audio = new Audio('audio/win.wav');
				audio.play();
				updateResult($('#user-count'));
			}else if(getWinner() === 1){
				setTimeout(function(){if(confirm('You Lost!\nWould you like playing again?')){clearBoard();isCompTurn = false;}else{location.reload();};},500);
				popButtonUp();
				var audio = new Audio('audio/lost.wav');
				audio.play();
				updateResult($('#comp-count'));
			}
			
			
		});		
		
		
	});	
	
	function compMarks(choice){
		if(choice === 'X'){
			return 'O';
		} else{
			return 'X';
		}
	}

	function isCellEmpty(butt){
		if(butt.text() === ''){
			return true;
		} else{
			return false;
		}
	}
		
	function compMove(turn){
		if(turn){
			var rows = checkRow();
			var columns = checkColumn();
			var diagonal = checkDiagonal();
			var resultObj = null;			
			if(rows !== []){				
				for(var el=0; el < rows.length; el++){				
					if(rows[el].compMark === 2){
						resultObj = rows[el];
						break;						
					}
				}
			} 
			if(columns !== [] && resultObj === null){
				for(var el=0; el < columns.length; el++){				
					if(columns[el].compMark === 2){
						resultObj = columns[el];
						break;						
					}
				}
			} 
			if(diagonal !== [] && resultObj === null){
				for(var el=0; el < diagonal.length; el++){				
					if(diagonal[el].compMark === 2){
						resultObj = diagonal[el];
						break;						
					}
				}
			}
			
			if(rows !== [] && resultObj === null){
			
				for(var el=0; el < rows.length; el++){				
					if(rows[el].userMark === 2){
						resultObj = rows[el];
						break;						
					}
				}
			}
			if(columns !== [] && resultObj === null){
				for(var el=0; el < columns.length; el++){				
					if(columns[el].userMark === 2){
						resultObj = columns[el];
						break;						
					}
				}
			}
			if(diagonal !== [] && resultObj === null){
				for(var el=0; el < diagonal.length; el++){								
					if(diagonal[el].userMark === 2){
						resultObj = diagonal[el];						
						break;						
					}
				}
			}
		
			if(resultObj !== null && isCellEmpty($('div.rows-'+ resultObj.indexRow + ' button.butt-'+ resultObj.indexCol))){				
				$('div.rows-'+ resultObj.indexRow + ' button.butt-'+ resultObj.indexCol).trigger('click');
			}else{
				if(isCellEmpty($('div.rows-1 button.butt-1'))){
					$('div.rows-1 button.butt-1').trigger('click');
				} else{
					var i = 0;
					var j = 0;
					while(isCellEmpty($('div.rows-'+ j + ' button.butt-'+ i)) === false){
						i++;
						if(i > 2){
							j++;
							i = 0;
						}
					}	
					$('div.rows-'+ j + ' button.butt-'+ i).trigger('click');
				}
					
			}						
								
		}
	}

	function checkRow(){
		return checkBoard(false);	
	}
	function checkColumn(){
		return checkBoard(true);
	}
	function checkBoard(swap){
		var rowWinner = -1;
		
		var rowArray = [];
		for(var i=0; i < 3; i++){
			var obj = new objCell(-1,-1,0,0);	
			var rowIndex = i;	
			for(var j=0; j < 3; j++){
				var colIndex = j;
				if(swap){
					rowIndex = j;
					colIndex = i;					
				}
				
				if($('div.rows-'+ rowIndex + ' button.butt-'+ colIndex).text() === userChoice){
					obj.userMark++;
					if(obj.userMark === 3){
						rowWinner = i;						
					}
					
				}else if(isCellEmpty($('div.rows-'+ rowIndex + ' button.butt-'+ colIndex)) === false){
					obj.compMark++;
					if(obj.compMark === 3){
						rowWinner = i;						
					}
				}else{
					obj.indexCol = colIndex;
					obj.indexRow = rowIndex;
				}						
			
			}
			if(obj.indexCol !== - 1 && (obj.userMark > 1 || obj.compMark > 1)){					
					rowArray.push(obj);
			}else if(obj.userMark > 2 || obj.compMark > 2){				
				obj.indexRow = rowWinner;
				rowArray = [obj];
			}		
		}
		return rowArray;	
	}
	function checkDiagonal(){			
		var diagArray=[];
		var objDiag = new objCell(-1,-1,0,0);
		for(var i=0; i<3; i++){
			if($('div.rows-'+ i + ' button.butt-'+ i).text() === userChoice){
					objDiag.userMark++;
				}else if(isCellEmpty($('div.rows-'+ i + ' button.butt-'+ i)) === false){
					objDiag.compMark++;
				}else{
					objDiag.indexCol = i;
				}			
		}
		if(objDiag.indexCol !== -1 && (objDiag.compMark > 1 || objDiag.userMark > 1)){
			objDiag.indexRow = objDiag.indexCol;
			diagArray.push(objDiag);
		}else if(objDiag.compMark > 2 || objDiag.userMark > 2){
			objDiag.indexCol = 0;
			diagArray = [objDiag];
		}
		var objDiagRev = new objCell(-1,-1,0,0);
		for (var j=2, k=0; j>= 0; j--, k++){
			if($('div.rows-'+ k + ' button.butt-'+ j).text() === userChoice){
					objDiagRev.userMark++;
				}else if(isCellEmpty($('div.rows-'+ k + ' button.butt-'+ j)) === false){
					objDiagRev.compMark++;
				}else{
					objDiagRev.indexCol = j;
					objDiagRev.indexRow = k;
				}		
		}
		if(objDiagRev.indexCol !== -1 && (objDiagRev.userMark > 1 || objDiagRev.compMark > 1)){			
			diagArray.push(objDiagRev);
		}else if(objDiagRev.userMark > 2 || objDiagRev.compMark > 2){
			objDiagRev.indexCol = 2;
			diagArray = [objDiagRev];
		}
		
		return diagArray;		
	}

	function checkNoMoreCellAvailable(){
		for(var i=0; i<3;i++){
			for(var j=0; j<3; j++){
				if (isCellEmpty($('div.rows-' + i +' button.butt-' + j))){
					return false;
				}
			}
		}			
		return true;
	}

	function checkWinner(objectCell){
		if(objectCell !== undefined){
			if(objectCell.userMark === 3){
				return 0;
			}else if(objectCell.compMark === 3){
				return 1;
			}
		}
		
		return -1;
	}

	function getWinner(){
		var cols = checkColumn();
		var rows = checkRow();
		var diag = checkDiagonal();
		if(cols !== []){			
			if(checkWinner(cols[0]) === 0){
				return 0;
			}else if(checkWinner(cols[0]) === 1){
				return 1;
			}
		} if(rows !== []){
			
			if(checkWinner(rows[0]) === 0){
				return 0;
			}else if(checkWinner(rows[0]) === 1){
				return 1;
			}
		} if(diag !== []){
			
			if(checkWinner(diag[0]) === 0){
				return 0;
			}else if(checkWinner(diag[0]) === 1){
				return 1;
			}
		}
	}

	function popButtonUp(){
		var cols = checkColumn()[0];
		var rows = checkRow()[0];
		var diag = checkDiagonal()[0];
		
		if(checkWinner(cols) !== -1){
			for(var i=0; i<3;i++){
				$('div.rows-'+i+' button.butt-'+cols.indexRow).css('background-color','#FF8C00');
				$('div.rows-'+i+' button.butt-'+cols.indexRow).animateCss('flash');
			}
		}else if(checkWinner(rows) !== -1){
			for(var i=0; i<3;i++){
				$('div.rows-'+rows.indexRow+' button.butt-'+i).css('background-color','#FF8C00');
				$('div.rows-'+rows.indexRow+' button.butt-'+i).animateCss('flash');
			}
		}else if(checkWinner(diag) !== -1){
			if(diag.indexCol === 0){
				for(var i=0; i<3;i++){
					$('div.rows-'+i+' button.butt-'+i).css('background-color','#FF8C00');
					$('div.rows-'+i+' button.butt-'+i).animateCss('flash');
				}
			}else if(diag.indexCol === 2){
				for(var i=0; i<3;i++){
					$('div.rows-'+i+' button.butt-'+(diag.indexCol-i)).css('background-color','#FF8C00');
					$('div.rows-'+i+' button.butt-'+(diag.indexCol-i)).animateCss('flash');
				}
			}
			
		}

	}

	function clearBoard(){
		$('button.col-xs-4').each(function(){			
			$(this).text('');
			$(this).css('background-color','#E0FFFF');
		});
	}

	function updateResult(selector){
		var count = parseInt($(selector).text());
		count++;
		$(selector).text(count); 
	}
	$.fn.extend({ //Extends the jQuery prototype with a animateCss function that allows to add a class and then remove the same only after the animation has finished.
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    	}
	});
	
})