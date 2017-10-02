$(function () {
/*
 * Create a list that holds all of your cards
 */
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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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
		case 24:
			$('#star3').removeClass('fa-star').addClass('fa-star-o');
			break;
		case 30:
			$('#star2').removeClass('fa-star').addClass('fa-star-o');
			break;
		default: break;
	}
};

function checkWinCondition() {
	for (card of cardList) {
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
	if (timerSeconds == -1) {
		timerSeconds = 0;
		timerId = setInterval(updateTimer, 1000);
	}

	if (currentCards[1]) {
		clearTimeout(animationTimerId);
		hideCards();
	}
	let currCard = $(this);
	if (!(currCard.hasClass('open') || currCard.hasClass('match'))) {
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
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