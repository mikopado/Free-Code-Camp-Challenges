$(function(){
	'use strict';

	var userChoice = '';
	var isCompTurn = false;
	function objCell(row, col, user, comp){ //Create object to track empty cells and user and computer marks on cells
			this.compMark = comp,
			this.userMark = user,
			this.indexRow = row,
			this.indexCol = col
	} 
	//After choosing the mark, the page will change content and display the board game	
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

		// Handle every click on board --- Basically it handles the game itself
		// if the cell is empty and it's not computer turn let mark the cell and then give the turn to the computer 
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
			}else if(isCellEmpty($(this)) && isCompTurn){//Let computer mark the cell
				$(this).text(compMarks(userChoice));
				$(this).css('color', 'black');				
				isCompTurn = false;
			} else{//Make sound for wrong movie, when cell is not empty
				var audio = new Audio('audio/wrong-move.wav');
				audio.play();
			}
			if(checkNoMoreCellAvailable()){//If the board is completely full, stop game and add tie count
				setTimeout(function(){if(confirm('None wins!\nWould you like playing again?')){clearBoard();isCompTurn = false;}else{location.reload();};},500);
				var audio = new Audio('audio/tie.wav');
				audio.play();
				updateResult($('#tie-count'));
			}	
			if(getWinner() === 0){//If User Wins
				setTimeout(function(){if(confirm('You Win!\nWould you like playing again?')){clearBoard();isCompTurn = false;}else{location.reload();};},500);
				popButtonUp();
				var audio = new Audio('audio/win.wav');
				audio.play();
				updateResult($('#user-count'));
			}else if(getWinner() === 1){//If computer wins
				setTimeout(function(){if(confirm('You Lost!\nWould you like playing again?')){clearBoard();isCompTurn = false;}else{location.reload();};},500);
				popButtonUp();
				var audio = new Audio('audio/lost.wav');
				audio.play();
				updateResult($('#comp-count'));
			}		
			
		});		
		
	});	
	
	function compMarks(choice){//Choose the computer mark based on user choice
		if(choice === 'X'){
			return 'O';
		} else{
			return 'X';
		}
	}

	function isCellEmpty(butt){//Check if cell is empty
		if(butt.text() === ''){
			return true;
		} else{
			return false;
		}
	}
		
	function compMove(turn){//Make computer play
		if(turn){
			var rows = checkRow();
			var columns = checkColumn();
			var diagonal = checkDiagonal();
			var resultObj = null;			
			if(rows !== []){//Check first if there are two computer marks on the same row, if so saved the cell data on a resultobj variable				
				for(var el=0; el < rows.length; el++){				
					if(rows[el].compMark === 2){
						resultObj = rows[el];
						break;						
					}
				}
			} 
			if(columns !== [] && resultObj === null){//If nothing has been found along rows, do the same check along columns
				for(var el=0; el < columns.length; el++){				
					if(columns[el].compMark === 2){
						resultObj = columns[el];
						break;						
					}
				}
			} 
			if(diagonal !== [] && resultObj === null){//If nothing found previously do the same check for diagonals
				for(var el=0; el < diagonal.length; el++){				
					if(diagonal[el].compMark === 2){
						resultObj = diagonal[el];
						break;						
					}
				}
			}
			
			if(rows !== [] && resultObj === null){//If there are not two computer marks on the same row, column or diagonal, let check if user marks are			
				for(var el=0; el < rows.length; el++){//First check for each row				
					if(rows[el].userMark === 2){
						resultObj = rows[el];
						break;						
					}
				}
			}
			if(columns !== [] && resultObj === null){//Check if two user marks are on the same column
				for(var el=0; el < columns.length; el++){				
					if(columns[el].userMark === 2){
						resultObj = columns[el];
						break;						
					}
				}
			}
			if(diagonal !== [] && resultObj === null){// Check user marks along diagonals
				for(var el=0; el < diagonal.length; el++){								
					if(diagonal[el].userMark === 2){
						resultObj = diagonal[el];						
						break;						
					}
				}
			}
			//if in the previous serches something has been found and the cell is empty let trigger a click a place the computer mark on the selected cell
			if(resultObj !== null && isCellEmpty($('div.rows-'+ resultObj.indexRow + ' button.butt-'+ resultObj.indexCol))){				
				$('div.rows-'+ resultObj.indexRow + ' button.butt-'+ resultObj.indexCol).trigger('click');
			}else{//Otherwise place the computer mark wherever the cell is empty
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
	function checkBoard(swap){//Check how many user marks or computer marks are along rows or columns (swap variable swap from row to column) and store in an array of object cell 
		var rowWinner = -1;		
		var rowArray = [];
		for(var i=0; i < 3; i++){
			var obj = new objCell(-1,-1,0,0);	
			var rowIndex = i;	
			for(var j=0; j < 3; j++){
				var colIndex = j;
				if(swap){//Swap indexes if it's checking along columns
					rowIndex = j;
					colIndex = i;					
				}				
				if($('div.rows-'+ rowIndex + ' button.butt-'+ colIndex).text() === userChoice){//Count user marks along row or column
					obj.userMark++;
					if(obj.userMark === 3){//Store the index if the marks are three, needed for identify the winner row or column
						rowWinner = i;						
					}					
				}else if(isCellEmpty($('div.rows-'+ rowIndex + ' button.butt-'+ colIndex)) === false){//Count computer marks
					obj.compMark++;
					if(obj.compMark === 3){
						rowWinner = i;						
					}
				}else{//Store the column and row index for empty cell
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
	function checkDiagonal(){//Check user and computer marks for diagonals			
		var diagArray=[];
		var objDiag = new objCell(-1,-1,0,0);
		for(var i=0; i<3; i++){//Check the diagonal from 0,0 - 1,1 - 2,2
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
		for (var j=2, k=0; j>= 0; j--, k++){//Check the reverse diagonal 0,2 - 1,1 - 2,0
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

	function checkNoMoreCellAvailable(){//Check if the board is completely full of marks
		for(var i=0; i<3;i++){
			for(var j=0; j<3; j++){
				if (isCellEmpty($('div.rows-' + i +' button.butt-' + j))){
					return false;
				}
			}
		}			
		return true;
	}

	function checkWinner(objectCell){//Check if there is any object cell with three user or computer marks
		if(objectCell !== undefined){
			if(objectCell.userMark === 3){
				return 0;
			}else if(objectCell.compMark === 3){
				return 1;
			}
		}		
		return -1;
	}

	function getWinner(){//Get the winner between computer and user checking any case (columns, row and diagonal)
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

	function popButtonUp(){//Higlight the winner row diagonal or column
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

	function clearBoard(){//Empty the board when user decides to keep playing 
		$('button.col-xs-4').each(function(){			
			$(this).text('');
			$(this).css('background-color','#E0FFFF');
		});
	}

	function updateResult(selector){//Update result for each play
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