$(function () {

let cardList = $('.card');
let movesNum = $('.moves-num');
let moves = $('.moves');
let timer = $('.timer');
let timerSeconds = -1; //initial value
let timerId, animationTimerId;

function redraw() {
	cardList.removeClass('open show match differ close');
 	let shuffledCards = shuffle(cardList);
 	let deck = $('.deck');
 	deck.html('');
 	for (card of shuffledCards) {
 		deck.append(card);
 	}
};

function resetScore() {
	movesNum.text('0');
	moves.text('Moves');
	$('#star3').removeClass('fa-star-o').addClass('fa-star');
	$('#star2').removeClass('fa-star-o').addClass('fa-star');
};

function resetTimer() {
	clearInterval(timerId);
	timerSeconds = -1;
	timer.text('00:00');
}

function restart() {
	redraw();
	//reset move counter & stars
	resetScore();
	//reset timer
	resetTimer();
	//?change bg color
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let currentCards = [];

//Generate friendly looking timer string
function getStrTimer() {
	let minutes = Math.floor(timerSeconds / 60);
	let seconds = timerSeconds % 60;
	let timerString = '';
	if(minutes < 10) {
		timerString = timerString.concat('0');
	}
	timerString = timerString.concat(minutes +':');
	if(seconds < 10) {
		timerString = timerString.concat('0');
	}
	timerString = timerString.concat(seconds);
	return timerString;
};

function updateTimer() {
	timerSeconds++;
	timer.text(getStrTimer)
};

function showCard(card) {

	card.removeClass('close').addClass('open show');
};

function lookForPair() {
	if (currentCards[0].html() == currentCards[1].html())
		return true;
	return false;
};

function setMatched() {
	for(card of currentCards) {
		card.removeClass('open show').addClass('match');
	}
	currentCards.splice(0, 2);
};

function setDifferent() {
	for(card of currentCards) {
		card.removeClass('open show').addClass('differ');
	}
};

function hideCards() {
	for(card of currentCards) {
		card.removeClass('differ').addClass('close');
	}
	currentCards.splice(0, 2);
};

function updateScore() {
	//increase counter
	movesCounter = parseInt(movesNum.first().text(), 10);
	movesNum.text(++movesCounter);
	moves.text('Moves');
	switch(movesCounter) {
		case 1:
			moves.text('Move');
			break;
		//decrease stars
		case 26:
			$('#star3').removeClass('fa-star').addClass('fa-star-o');
			break;
		case 36:
			$('#star2').removeClass('fa-star').addClass('fa-star-o');
			break;
		default: break;
	}
};

function checkWinCondition() {
	for (card of cardList) {
		//If there still are cards that are not 'matched'
		// than the game is no
		if(!$(card).hasClass('match'))
			return false;
	}
	return true;
};

function showWinPopup() {
	clearInterval(timerId);
	let starCount = 0;
	$('#star_s').text('Stars');
	if ($("#star3").hasClass('fa-star')) {
		starCount = 3;
	}
	else if ($("#star2").hasClass('fa-star')) {
		starCount = 2;
	}
	else {
		starCount = 1;
		$('#star_s').text('Star');
	}
	$('.stars-num').text(starCount);
	$('.modal-container').css('display', 'block')
};

function cardClicked() {
	//Start timer only if it was at initial value
	if (timerSeconds == -1) {
		timerSeconds = 0;
		timerId = setInterval(updateTimer, 1000);
	}

	//This is needed to hide cards, if there is more
	// than two cards flipped at once; even if the
	// animation is still playing
	if (currentCards[1]) {
		clearTimeout(animationTimerId);
		hideCards();
	}

	//Get current card
	let currCard = $(this);
	//Handle click only if clicked card was not already shown
	if (!(currCard.hasClass('open') || currCard.hasClass('match'))) {
		//Function names are pretty much self-explanatory
		showCard(currCard);
		currentCards.push(currCard);
		if (currentCards[1]) {
			if (lookForPair()) {
				setMatched();
			} else {
				setDifferent();
				animationTimerId = setTimeout(hideCards,600);
			}
		}
		updateScore();
		if (checkWinCondition()) {
			showWinPopup();
		}
	}
};


$('.deck').on('click', '.card', cardClicked);


// restart listener
$('.restart').click(restart);
// generate click to shuffle cards in deck
$('.restart').click();
//for modal popup
$('.play-again-btn').click(function() {
	$('.modal-container').css('display', 'none');
	$('.restart').click();
});
});