var clickedCard = null;
var openCards = [];
var lockedCards = [];
var moves = 0;
var mathced = false;
var stars = $(".fa-star");
var starsNo = 3;
var start;
var gameTimer;



/* Shuffle the deck when restart or play again button is clicked */

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

/* Initialize Game */

function initGame() {
    playTime();
    $(".deck").on("click", ".card", function() {
	$(this).displayCard();
	openCards.push($(this));
	if(clickedTwice(this)) {
	    openCards.pop();
	}
	clickedCard = this;
	if(openCards.length == 2) {
	    matched = checkCards();
	    if(matched){
		rightGuess();
	    } else {
		wrongGuess();
	    }
	    increaseMoves();
	    if(moves == 9 || moves == 15) {
		reduceLife();
	    }
	    displayMoves();
	}
	
	if(lockedCards.length == 16){
	    $('.displayTime').text($('.Timer').text());
	    $('.displayFinalScore').text(moves);
	    $('.livesRemain').text(starsNo);
	    clearTimeout(gameTimer);
	    $("#win").fadeIn("slow", "swing")
	}
    });
}

/* Play Again */

$(".play-again").click(function(){
    playAgain();
});

function playAgain() {
    clearInterval(gameTimer);
    lockedCards = [];
    clickedCard = null;
    resetDeck();
    resetScore();
    displayMoves();
    playTime();
    shuffleDeck();
}

$(".restart").click(function() {
    $("#restartGame").fadeIn("slow", "swing");
    $(".yes").click(function() {
	playAgain();
	$("#restartGame").css("display", "none");
    })
    $(".no").click(function() {
	$("#restartGame").css("display", "none");
    });
  
})


function reduceLife() {
    $(stars[starsNo-1]).css("color", "white");
    starsNo -= 1;
}

function increaseMoves() {
    moves += 1;
}

function displayMoves() {
    $(".movesCount").text(moves);
}

/* Add functions to jQuery library to use them directly on jQuery Objects */

$.fn.extend({
    displayCard: function() {
	$(this).addClass("open show");
    },
    addTemporaryClass: function(className, duration) {
        var elements = this;
        setTimeout(function() {
            elements.removeClass(className);
        }, duration);

        return this.each(function() {
            $(this).addClass(className);
        });
    }
});

function wrongGuess() {
    for(card of openCards) {
	$(card).addTemporaryClass("animated wobble wrongAnswer", 1000);
    }
    setTimeout(function() {
	for(card of openCards) {
	    $(card).removeClass("open show");
	}
	openCards = [];
	clickedCard = null; }, 1000);
}

function rightGuess() {
    lockedCards = lockedCards.concat(openCards);
    for(card of openCards) {
	$(card).addClass("match");
	$(card).addTemporaryClass("animated rubberBand", 1000);
    }
    
    clickedCard = null;
    openCards = [];
}

function checkCards() {
    var cardOne = $(openCards[0]).find('i').attr('class').substr('3');
    var cardTwo = $(openCards[1]).find('i').attr('class').substr('3');
    if(cardOne == cardTwo) {
	return true;
    }
    return false;
}

function clickedTwice(obj) {
    if(clickedCard == obj){
	return true;
    }
    return false;
}


function resetDeck() {
    starsNo = 3;
    $("ul.deck").children().removeClass("open show match");
    $(".end-screen").css("display", "none");
}

function resetScore() {
    $(".fa-star").css("color", "black");
    moves = 0;
    $(".movesCount").text(moves);
}


function shuffleDeck() {
    var deckCards = $('ul.deck').children();
    var shuffledCards = shuffle(deckCards);
    $('ul.deck').html('');
    for(card of shuffledCards) {
	$('ul.deck').append(card);
    }
}

function playTime() {
    start = new Date;
    
    gameTimer = setInterval(function() {
	$('.Timer').text(Math.round((new Date - start) / 1000));
    }, 1000);
}


initGame();
