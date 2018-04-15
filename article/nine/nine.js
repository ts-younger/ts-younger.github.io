window.onload = function () {
	var colorArr = ["purple", "#EE0000", "green", "blue", "grey"],
		startBtn = getDom('#start'),
		endBtn = getDom('#end'),
		timer = null,
		aBox = getDom('.box');

	function getDom (str) {
		if (!str || typeof str !== 'string') return;
		switch (str.charAt(0)) {
			case "." : 
			console.log(str)
				return document.getElementsByClassName(str.slice(1))
			break;
			case "#":
				return document.getElementById(str.slice(1))
			break;
		}
	}

	function getRandomArr(arr) {
		let array = Array.from(arr);
		let randomArr = [];
		for(let i = 0; i < 3; i++) {
			console.log(array)
			let index = Math.floor(Math.random()*array.length);
			randomArr.push(array[index]);
			array.splice(index, 1);
		}
		return randomArr
	}

	function animate () {
		let randomColor = getRandomArr(colorArr);
		let boxArr = getRandomArr(aBox);
		console.log(randomColor)
		for(let i = 0; i < aBox.length; i++) {
			aBox[i].style.background = '#EEB422';	
		}
		for(let i = 0; i < 3 ; i++) {
				boxArr[i].style.background = randomColor[i];
		}
	}

	startBtn.onclick = function () {
		startBtn.style.background = '#EEB422';
		startBtn.style.color = '#fff';
		animate()
		timer = setInterval(function(){			
			animate()
		}, 1000)
	}

	endBtn.onclick = function() {
		startBtn.style.background = '#fff';
		startBtn.style.color = '#EEB422';
		endBtn.style.color = '#fff';
		endBtn.style.background = '#EEB422';
		for(let i = 0; i< aBox.length; i++) {
			aBox[i].style.background = '#EEB422'
		}
		clearInterval(timer);
		setTimeout(function(){
			endBtn.style.color = '#EEB422';
			endBtn.style.background = '#fff';			
		},1000)
	}
}