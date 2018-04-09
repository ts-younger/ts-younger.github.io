
var obtn = document.getElementById('mine-start'),
	onum = document.getElementById('mine-flag'),
	otime = document.getElementById('mine-time-wrap');
	var timer = null;
	var aTime = otime.getElementsByTagName('span');
// keydown 左键 =>  判断是否为地雷 => 是,结束游戏 => 否,判断周边地雷数量 => 数量为0,继续寻找周边地雷 => 不为0,显示数字
//  keydown 右键 =>  次数为1: 标记地雷 => 次数为2:标记问号 => 复原
// mousemove => (判断是否为需要变换区域)恢复上一次划过地域的背景
// 	=>hover:(判断是否为可变换区域)变换格式为0背景,  

function Mine (ele, minec, canwidth, canheight) {
	this.ele = ele;
	this.PANEL_WIDTH = 20;
	this.mineCount = minec;
	this.canwidth = canwidth;
	this.canheight = canheight; 
	this.life = false;
	this.eleArr = [];
	this.openCount = 0;
	this.countTime = 0;
	this.oldpos = [];
	this.smile = obtn;
	this.flagCount = this.mineCount;
	this.mineArr = [];
	this.ele.ctx = this.ele.getContext('2d');
	this.numpic = ['./img/0.bmp', './img/1.bmp', './img/2.bmp',
	'./img/3.bmp', './img/4.bmp', './img/5.bmp', './img/6.bmp', 
	'./img/7.bmp', './img/8.bmp', './img/9.bmp'];
	this.flagpic = [
		'./img/blank.bmp', './img/flag.bmp', './img/ask.bmp',
	]
}
Mine.prototype = {
	// 坐标转化
	parseCode: function(ev) {
		let e = ev || window.event;
		let pos = [ev.layerX, ev.layerY];
		// console.log(pos)
		return pos.map(function (item) {
			return Math.floor(item / 20)
		})
	},
	flagChange: function(){
		let num = this.flagCount % 10;
		let ten = Math.floor((this.flagCount / 10) %10);
		let hun = Math.floor(this.flagCount / 100);

		let aspan = onum.getElementsByTagName('span');
		aspan[0].style.backgroundImage = "url(./img/d"+hun+".bmp)";
		aspan[1].style.backgroundImage = "url(./img/d"+ten+".bmp)";
		aspan[2].style.backgroundImage = "url(./img/d"+num+".bmp)";

	},
	checkSucces: function() {
		let isdone = true;
		let count = 0;
		for(let i = 0; i< this.mineArr.length; i++) {
			let item = this.mineArr[i];
			if(this.eleArr[item[0]][item[1]].tag != 1){
				isdone = false;
				break;
			}
		}
		return isdone
	},
	// 初始化
	init: function () {	
		this.ele.parentNode.parentNode.style.width = 20* this.canwidth + 'px';
		this.ele.parentNode.parentNode.style.height = 20* this.canheight+ 30 + 'px';

		let owidth = this.canwidth*this.PANEL_WIDTH;
		let oheight = this.canheight*this.PANEL_WIDTH;
		this.openCount = 0;
		this.countTime = 0;
		timer = null;
		this.flagCount = this.mineCount;
		this.ele.setAttribute('width', owidth);
		this.ele.setAttribute('height', oheight);
		let num = 0;
		for(let i = 0; i < this.canwidth; i++) {
			this.eleArr[i] = [];
			for(let j =0; j<this.canheight; j++) {
				this.eleArr[i][j] = {
					isopen: false,
					ismine: false,
					tag: 0,
				}
				let pos = [i, j]
				this.drawimage('./img/blank.bmp', pos)
			}
		}
		this.random();
		this.bindEvent();
		this.flagChange();

		
		for(let i = 0; i< aTime.length; i++) {
			aTime[i].style.backgroundImage = "url(./img/d0.bmp)";
		}
	},
	// 地雷生成
	random: function () {
		this.mineArr = [];
		var count = this.mineCount;
		while (count) {
			let x = Math.floor(Math.random()* this.canwidth)
			let y = Math.floor(Math.random()* this.canheight)
			if(this.eleArr[x][y].ismine) continue;
			this.eleArr[x][y].ismine = true;
			this.mineArr.push([x, y])
			count--
		}		
	},
	// 事件绑定
	bindEvent: function () {
		let that = this;
		this.ele.onmousedown = function (ev) {
			let pos = that.parseCode(ev);

			if(ev.layerX < 0 || ev.layerX >that.canwidth*20 || ev.layerY <0 || 
				ev.layerY > that.canheight*20) return;
			if(that.eleArr[pos[0]][pos[1]].isopen) return;
			that.life =  true;
			if(ev.button ==0 ){
				if(that.eleArr[pos[0]][pos[1]].isopen || 
					that.eleArr[pos[0]][pos[1]].tag != 0) return;
					
				if(that.checkMine(pos)) {
					let spaceArr = [];
					let aroundMineNum = that.checkAroundMine(pos);

					if(aroundMineNum){
						that.drawimage(that.numpic[aroundMineNum], pos);
						that.eleArr[pos[0]][pos[1]].isopen = true;
						that.openCount++;
					}else if(aroundMineNum == 0){
						that.checkAroundSpace(pos, spaceArr);
					}

					if(that.openCount + that.mineCount == 
						that.canwidth * that.canheight) {
						that.succesChange()
					}
					console.log(that.openCount)
				}else {
					that.failed(pos)
				}
			}else if( ev.button == 2) {
				if(that.eleArr[pos[0]][pos[1]].isopen) return;
				that.eleArr[pos[0]][pos[1]].tag++;

				if(that.eleArr[pos[0]][pos[1]].tag >2 ){
					that.eleArr[pos[0]][pos[1]].tag = 0;
					// that.eleArr[pos[0]][pos[1]].isopen = false
				}

				let flag = that.eleArr[pos[0]][pos[1]].tag;
				that.drawimage(that.flagpic[flag], pos)
				
				if(that.eleArr[pos[0]][pos[1]].tag == 1) {
					that.flagCount --;
				}else if(that.eleArr[pos[0]][pos[1]].tag == 2){
					that.flagCount ++;
				}

				if(that.flagCount < 0) return;
				that.flagChange();
				// 当小旗被插完之后检测是否成功
				if(that.flagCount == 0) {
					if(that.checkSucces()){
						that.succesChange()
					}else {
						alert('you flag is done but not find all of the mines');
						that.failed()
					}
				};
				
			}

			// 以第一次点击为起点,开启定时器 
			if(that.life) {
				if(timer) return;
				timer = setInterval(function(){
					that.timeChange()
				},1000)
			}
			
		}
		this.ele.onmousemove = function (ev) {
			let pos = that.parseCode(ev);
			if(that.oldpos.length) {
				if(that.eleArr[that.oldpos[0]] && 
					that.eleArr[that.oldpos[0]][that.oldpos[1]] && 
					that.eleArr[that.oldpos[0]][that.oldpos[1]].isopen== false && 
				that.eleArr[that.oldpos[0]][that.oldpos[1]].tag == 0) {
					that.drawimage('./img/blank.bmp', that.oldpos)
				}
			}

			if(that.eleArr[pos[0]][pos[1]].isopen || 
				that.eleArr[pos[0]][pos[1]].tag != 0) return;
			if(that.eleArr[pos[0]] && that.eleArr[pos[0]][pos[1]] ) {
				that.drawimage('./img/0.bmp', pos)
				that.oldpos = pos;

			}
		}
		this.ele.onmouseout = function () {
			if(that.eleArr[that.oldpos[0]][that.oldpos[1]].isopen || 
				that.eleArr[that.oldpos[0]][that.oldpos[1]].tag != 0) return;
			if(that.oldpos.length) {
				if(that.eleArr[that.oldpos[0]] && 
					that.eleArr[that.oldpos[0]][that.oldpos[1]]) {
					that.drawimage('./img/blank.bmp', that.oldpos)
				}
			}
		}
		this.smile.onclick = function () {
			that.eleArr = [];
			that.mineArr = [];
			that.life = false;
			clearInterval(timer);
			timer = null;
			that.init();
			this.className = 'start';
		}

	},
	// 时间变化
	timeChange: function() {
		if(this.countTime >= 99) {
			clearInterval(timer)
		}
		this.countTime++;
		let num = this.countTime % 10;
		let ten =Math.floor((this.countTime / 10)%10);
		let hun = Math.floor(this.countTime/100);

		aTime[0].style.backgroundImage = "url(./img/d"+hun+".bmp)";
		aTime[1].style.backgroundImage = "url(./img/d"+ten+".bmp)";
		aTime[2].style.backgroundImage = "url(./img/d"+num+".bmp)";
	},
	succesChange: function(){
		this.life = false;
		clearInterval(timer);
		alert('you win');
	},
	// 画像
	drawimage: function(url, pos){
		let that = this;
		let pwidth = this.PANEL_WIDTH;
		let img = document.createElement('img');
		img.src = url;

		img.onload = function() {
			that.ele.ctx.drawImage( img,20* pos[0] , 20*pos[1] , pwidth, pwidth)
		}
	},
	// 检查是否踩雷
	checkMine: function (pos) {		
		if(this.eleArr[pos[0]][pos[1]].ismine) {
			return false
		}
			return true
	},
	// 检查周边地雷数量
	checkAroundMine: function(pos){
		let num = 0;
		let x = pos[0];
		let y = pos[1];		
		let aroundArr = this.getAroundArr(pos)

		aroundArr.forEach( value => {
			if(this.eleArr[value[0]][value[1]].ismine) {
				num++;
			}
		})
		return num;
	},
	// 检查周边地雷书为0的空格数
	checkAroundSpace: function (pos, arr) {
		let x = pos[0];
		let y = pos[1];
		let that = this;
		// if(pos.length>2) return;
		// pos = [...pos, 0];
		if(this.eleArr[x][y].isopen) return;
		this.eleArr[x][y].isopen = true;
		this.openCount++;

		// arr.push(pos)
		let aroundArr = this.getAroundArr(pos)
		
		for(let i = 0; i< aroundArr.length; i++) {
			let left = aroundArr[i][0];
			let top = aroundArr[i][1];
			let aroundMineNum = this.checkAroundMine(aroundArr[i]) 
			if(aroundMineNum == 0 && this.eleArr[left][top].isopen == false ){		
				this.drawimage(this.numpic[0], aroundArr[i]);
				this.checkAroundSpace(aroundArr[i], arr)
			}else{
				// arr.push([...aroundArr[i], aroundMineNum]);
				if(this.eleArr[left][top].isopen) return;
				this.drawimage(this.numpic[aroundMineNum], aroundArr[i]);
				this.eleArr[left][top].isopen = true;
				this.openCount++;

			}

		}
		
	},
	// 点击 => 判定是否为雷 => 是,结束 =>非, 判定aroundMine => 0,调用space 系列方法, => 其他 
	// space系列 => 继续checkaroundMine => 是否含有space => 
	// 获取周边坐标
	getAroundArr: function (pos){
		let x = pos[0];
		let y = pos[1];
		let that = this;
		let arr = [ [x-1, y-1], [x-1, y], [x-1, y+1], [x, y-1], [x, y+1],
			 [x+1, y-1], [x+1, y],  [x+1, y+1]
		];

		arr = arr.filter(function (item) {
			return that.eleArr[item[0]] &&
			that.eleArr[item[0]][item[1]] &&
			that.eleArr[item[0]][item[1]].isopen == false
		})
		return arr
	},
	// 失败处理
	failed: function(pos) {
		this.life = false;
		clearInterval(timer);
		this.showMine(pos);
		this.smile.className = 'failed'
		alert('failed')
	},
	// 失败后显示所有地雷及错误处理
	showMine: function (pos) {
		for(let i = 0; i< this.eleArr.length; i++) {
			for(let j = 0; j < this.eleArr[i].length; j++) {
				if(this.eleArr[i][j].ismine) {
					this.drawimage('./img/mine.bmp', [i, j])
				}
				if(this.eleArr[i][j].tag == 1 && this.eleArr[i][j].ismine == false){
					this.drawimage('./img/error.bmp', [i, j])
				}
				this.eleArr[i][j].isopen = true;
			}			
		}
		this.drawimage('./img/blood.bmp', pos);
	}

}

