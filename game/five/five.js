window.onload = function () {
var canvas = document.getElementById('app');
var context = canvas.getContext('2d');
var chessBoard = [];
var cross = document.querySelectorAll('.cross')[0];
var wins = [];
var count = 0;
var myWin = [];
var computerWin = [];
var over = false;

// 绘制棋盘

	context.strokeStyle = "#bfbfbf"
	for(let i=0; i<15; i++) {
		context.moveTo(15+ i*30, 15);
		context.lineTo(15+ i*30, 435);
	// context.stroke() 描边
		context.stroke();
		context.moveTo( 15, i*30+15);
		context.lineTo( 435, 15+i*30);
		context.stroke()
	}
console.log(count)




// 旗子
var oneStep = function(i, j, me) {
	context.beginPath();
	// context.arc(x坐标, y坐标, 半径, 起始弧度, 结束弧度)
	context.arc( 15+i*30, 15+ j*30, 13, 0, 2*Math.PI);
	context.closePath()
	// context.createRadialGradient(外圆x坐标, y坐标, 半径, 内圆x坐标,y坐标, 半径)
	var gradient = context.createRadialGradient( 17+i*30, 17+j*30, 13, 13+i*30, 13+j*30, 5);
	if(me){
		// 逻辑判断 是否是黑棋
		gradient.addColorStop(0, '#0a0a0a');
		gradient.addColorStop(1, '#636766')
	}else {
		gradient.addColorStop(0, '#d1d1d1');
		gradient.addColorStop(1, '#f6f6f6')
	}
	context.fillStyle = gradient;
	// context.fillStyle() 填充
	context.fill();
}

// wins 数据结构初始化
for(let i=0; i<15; i++) {
	wins[i] =[]
	for(let j=0; j<15; j++) {
		wins[i][j] = []
	}
}
// 棋盘各方站点初始化
for(let i =0; i<15; i++) {
	chessBoard[i] = [];
	for(let j=0; j<15; j++) {
		chessBoard[i][j] =0;
	}
}
// 所有赢法
for(let i =0; i<15; i++) {
	for(let j=0; j<11; j++){
		for(let k=0; k<5; k++) {
			wins[i][j+k][count] = true;
		}
		count++
	}
}
for(let i =0; i<15; i++) {
	for(let j=0; j<11; j++){
		for(let k=0; k<5; k++) {
			wins[j+k][i][count] = true;
		}
		count++
	}
}
for(let i =0; i<11; i++) {
	for(let j=0; j<11; j++){
		for(let k=0; k<5; k++) {
			wins[i+k][j+k][count] = true;
		}
		count++
	}
}
for(let i =0; i<11; i++) {
	for(let j=14; j>3; j--){
		for(let k=0; k<5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++
	}
}
canvas.onclick = function (e) {
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y /30);

	if(over) return;
	// cross.style.display = 'none';
	if(chessBoard[i][j] == 0) {
		oneStep(i, j, true)
		chessBoard[i][j] = 1;
	}
	
	for(let k =0; k<count; k++) {
		if(wins[i][j][k]){
			myWin[k]++;
			console.log('myScore'+myWin[k])
			computerWin[k] = 6;
			if(myWin[k] == 5){
				setTimeout(reDo('你赢了,是否重新加载游戏'), 20)
				over = true;
			}
		}
	}
	if(!over) {
		computerAi();
	}
}

var reDo = function(str) {
	var con = confirm(str);
	if(con) {
		window.location.reload()
	}
	return;
}
//各种赢法的胜率清零
for(let i=0; i<count; i++) {
	myWin[i] =0;
	computerWin[i] = 0;
}

var computerAi = function () {
	var myScore=[];
	var computerScore = [];
	var u=0, v=0;
	var max = 0;

	// 各点价值初始化
	for(let i =0; i<15; i++) {
		myScore[i] =[];
		computerScore[i] = [];
		for(let j=0; j<15; j++) {
			myScore[i][j] =0;
			computerScore[i][j] =0;
		}
	}

	for(let i=0; i<15; i++) {
		for(let j=0; j<15; j++) {
			if(chessBoard[i][j] == 0) {
			// 棋盘空白点,遍历所有赢法,判断该点落子对于局势的价值
				for(let k=0; k<count; k++) {
					if(wins[i][j][k]) {
					// 遍历所有赢法,判断用户在当前点落子,对赢法的价值
						if(myWin[k] == 1) {
							myScore[i][j] += 200;
						}else if(myWin[k] == 2) {
							myScore[i][j] += 400;
						}else if(myWin[k] == 3) {
							myScore[i][j] += 2000;
						}else if(myWin[k] == 4) {
							myScore[i][j] += 10000;
						}
					// 判定在当前点落子,对计算机的胜利的价值
						if(computerWin[k] == 1) {
							computerScore[i][j] += 220;
						}else if(computerWin[k] == 2) {
							computerScore[i][j] += 420;
						}else if(computerWin[k] == 3) {
							computerScore[i][j] += 2200;
						}else if(computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] >max) {
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max) {
					if(computerScore[i][j] > computerScore[u][v]) {
						u =i;
						v = j;
					}
				}
				if(computerScore[i][j] >max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u =i;
						v = j;
					}
				}
			}
		}
	}

	oneStep(u, v, false)
	chessBoard[u][v] = 2;

	for(let i=0; i<count; i++) {
		if(wins[u][v][i]){
			computerWin[i]++;
			 
			myWin[i] = 6;
			if(computerWin[i] == 5) {
				setTimeout(reDo('计算机赢了,是否重新加载游戏'),20);
				over = true;
			}
		}		
	}
}
}