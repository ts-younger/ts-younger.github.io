window.onload = function () {
	var startBtn = getDom('#start'),
		endBtn = getDom('#end'),
		timer = null,
		aBox = getDom('.box');

	function getDom (str) {
		if (!str || typeof str !== 'string') return;
		switch (str.charAt(0)) {
			case "." : 
				return document.getElementsByClassName(str.slice(1))
			break;
			case "#":
				return document.getElementById(str.slice(1))
			break;
		}
	}
	function getColorArray() {
		let colorArr = [];
		
		for(let i = 0; i < 3; i++) {
			let color = '#'+(Math.random()*16777216 | 0).toString(16);

			if(colorArr.findIndex(function(item) {
				return item == color
			}) > 0 || color == '#EEB422'.toLowerCase()) {
				i--;
			}else {
				colorArr.push(color)
			}		
		}		
		return colorArr;
	}

	function getRandomArr(arr) {
		let array = Array.from(arr);
		// let array = arr;
		let randomArr = [];
		for(let i = 0; i < 3; i++) {
			let index = Math.floor(Math.random()*array.length);
			randomArr.push(array[index]);
			array.splice(index, 1);
			// Array.prototype.splice(array, index, 1)
		}
		return randomArr
	}

	function resetColor(){
		for(let i = 0; i < aBox.length; i++) {
			aBox[i].style.background = '#EEB422';	
		}
	}
	function animate () {
		let boxArr = getRandomArr(aBox);
		let colorArr = getColorArray()
		resetColor()
		for(let i = 0; i < 3 ; i++) {
			boxArr[i].style.background = colorArr[i];
		}
	}

	startBtn.onclick = function () {
		if(timer) return;
		startBtn.style.background = '#EEB422';
		startBtn.style.color = '#fff';
		animate();
		life = false;
		timer = setInterval(function(){			
			animate()
		}, 1000)
	}

	endBtn.onclick = function() {
		startBtn.style.background = '#fff';
		startBtn.style.color = '#EEB422';
		endBtn.style.color = '#fff';
		endBtn.style.background = '#EEB422';
		resetColor();
		clearInterval(timer);
		setTimeout(function(){
			endBtn.style.color = '#EEB422';
			endBtn.style.background = '#fff';			
		},1000);
		timer = null;
	}
}