// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var entities=[];

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };
 
 
 //init
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var offsetTop = canvas.offsetTop;
var offsetLeft = canvas.offsetLeft;
var nextEnemy= 100;
var randnum=(Math.random() * 5 ) +5;
var randenemy;
var hp=1;
var streak=0;
var testenemy=false;
var teststreak=false;
var higheststreak=0;
var totalclicks=0;
var totalhits=0;
var wisedeath=true;
var welldeath=true;
var score=0;
var canvaswidth;
var canvasheight;
var ratio=1;
var highestscore;

var updateHighscore=function(){
	var comment='Your Highscore:<br>'+highestscore;
	document.getElementById('highestscore').innerHTML = comment;
}

window.onload = function() {
	animate(step);
	resizeGame();
	highestscore = document.cookie;
	updateHighscore();
};

function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 5 / 4;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
	
	var middleArea = document.getElementById('middlemiddle');
	if(middleArea.clientWidth/700>middleArea.clientHeight/500){
		ratio=middleArea.clientHeight/500;
		canvas.style.width=ratio*canvas.width;
		canvas.style.height=middleArea.clientHeight;
	} else {
		ratio=middleArea.clientWidth/700;
		canvas.style.height=ratio*canvas.height;
		canvas.style.width=middleArea.clientWidth;
	}
	
	var middle = document.getElementById('middle');
	offsetTop = middle.offsetTop;
	var leftmiddle=document.getElementById('leftmiddle');
	offsetLeft = gameArea.offsetLeft+leftmiddle.clientWidth;
	
	window.setTimeout(function() {
			window.scrollTo(0,1);
	}, 1);
}

var step = function() {
  update();
  render();
  animate(step);
};

function Sam(x,y,x_speed,y_speed,img,type) {
	this.dead=false;
	this.type=type;
	this.x = x;
	this.y = y;
	this.x_speed = x_speed;
	this.y_speed = y_speed;
	this.radius = 25;
	this.img=img;
	this.deathx=0;
	this.deathy=0;
}

Sam.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
	if(!this.dead){
		context.drawImage(this.img,this.x,this.y,50*ratio,50*ratio);
	} else {
		if(this.type=='samwise'){
			context.drawImage(samwiseicondead,this.deathx,this.deathy,50*ratio,80*ratio);
		} else {
			context.drawImage(samwellicondead,this.deathx,this.deathy,50*ratio,80*ratio);
		}
	}
};

Sam.prototype.update = function() {
	if(!this.dead){
		this.x += (this.x_speed*ratio);
		this.y += (this.y_speed*ratio);
	} else {
		return;
	}
  
  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 650) { // hitting the right wall
    this.x = 645;
    this.x_speed = -this.x_speed;
  }
  
  if(this.y - 5 < 0) { // hitting the left wall
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if(this.y + 5 > 450) { // hitting the right wall
    this.y = 445;
    this.y_speed = -this.y_speed;
  }
};

var samwise1=Math.floor((Math.random()*650)+1);
var samwise2=Math.floor((Math.random()*450)+1);
var samwisedir1=(Math.random()*8)-4;
var samwisedir2=(Math.random()*8)-4;

var samwell1=Math.floor((Math.random()*650)+1);
var samwell2=Math.floor((Math.random()*450)+1);
var samwelldir1=(Math.random()*8)-4;
var samwelldir2=(Math.random()*8)-4;

var samwise=new Sam(samwise1,samwise2,samwisedir1,samwisedir2,samwiseicon,'samwise');
var samwell=new Sam(samwell1,samwell2,samwelldir1,samwelldir2,samwellicon,'samwell');

Input={
	x: 0,
    y: 0,
    tapped :false,

    set: function(data) {
        this.x = (data.pageX - offsetLeft)/ratio;
		this.y = (data.pageY - offsetTop)/ratio;
        this.tapped = true; 

		context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.x + 5, this.y + 5, 5, 0,  Math.PI * 2, true);
        context.closePath();
        context.fill();
		
		//alert(canvas.offsetLeft + " " + canvas.offsetTop);
    }
};


Touch=function(x,y){
	this.type = 'touch'; 
    this.x = x;             // the x coordinate
    this.y = y;             // the y coordinate
    this.r = 5*ratio;             // the radius
    this.opacity = 1;       // initial opacity; the dot will fade out
    this.fade = 0.05;       // amount by which to fade on each game tick
    this.remove = false;    // flag for removing this entity. POP.update
                            // will take care of this
							
	this.update = function() {
        // reduce the opacity accordingly
        this.opacity -= this.fade; 
        // if opacity if 0 or less, flag for removal
        this.remove = (this.opacity < 0) ? true : false;
    };

    this.render = function() {
		context.fillStyle = 'rgba(255,0,0,'+this.opacity+')';
        context.beginPath();
        context.arc(this.x + 5, this.y + 5, 5, 0,  Math.PI * 2, true);
        context.closePath();
        context.fill();
    };
}

Enemy=function(type,health){
	this.type = type;
	this.health=health;
	this.img;
	this.spawncounter=30;
    this.x = Math.random() * 630+20;
    this.y = Math.random() * 470+20;
	this.xdir=Math.random()*4-2;
	this.ydir=Math.random()*4-2;
	while(((this.x-samwise.x)*(this.x-samwise.x)+(this.y-samwise.y)*(this.y-samwise.y)<200)
	||((this.x-samwell.x)*(this.x-samwell.x)+(this.y-samwell.y)*(this.y-samwell.y)<200)){
		this.x = Math.random() * 630+20;
		this.y = Math.random() * 470+20;
	}
	this.r = 15*ratio;                // the radius of the bubble
    this.remove = false;
	
    this.update = function() {
		if(this.spawncounter==0){
			if(Math.random()*1<.02){
				this.xdir=(Math.random()*4-2)*ratio;
				this.ydir=(Math.random()*4-2)*ratio;
			}
			// move up the screen by dir
			this.y -= this.ydir;
			this.x -= this.xdir;

			// if off screen, flag for removal
			if (this.y < -10) {
				this.remove = true;
			}

			if (this.x < -10 || this.x>700) {
				this.remove = true;
			}
		} else {
			this.spawncounter-=1;
		}
    };

    this.render = function() {
		if(this.type=='orc'){
			if(this.health==2){
				this.img=orc2;
			} else {
				this.img=orc1;
			}
		} else if(this.type=='wildling'){
			if(this.health==2){
				this.img=wildling2;
			} else {
				this.img=wildling1;
			}
		} else if(this.type=='ringwraith'){
			if(this.health==4){
				this.img=ringwraith4;
			} else if(this.health==3){
				this.img=ringwraith3;
			} else if(this.health==2){
				this.img=ringwraith2;
			} else {
				this.img=ringwraith1;
			}
		} else if(this.type=='mance'){
			if(this.health==5){
				this.img=mance5;
			} else if(this.health==4){
				this.img=mance4;
			} else if(this.health==3){
				this.img=mance3;
			} else if(this.health==2){
				this.img=mance2;
			} else {
				this.img=mance1;
			}
		} else if(this.type=='gollum'){
			if(this.health==5){
				this.img=gollum5;
			} else if(this.health==4){
				this.img=gollum4;
			} else if(this.health==3){
				this.img=gollum3;
			} else if(this.health==2){
				this.img=gollum2;
			} else {
				this.img=gollum1;
			}
		}
	
		context.beginPath();
		context.arc(this.x, this.y, this.r, 2 * Math.PI, false);
		context.drawImage(this.img,this.x,this.y,50*ratio,50*ratio);
    };
}


var Collides=function(a,b){
	var distance_squared = ( ((a.x - b.x) * (a.x - b.x)) + 
                                ((a.y - b.y) * (a.y - b.y)));

	var radii_squared = (a.r + b.r) * (a.r + b.r);
	if(b.x<a.x && b.y<a.y){
		if(distance_squared<.5){
			return true;
		} else {
			return false;
		}
	}
	if (distance_squared < radii_squared) {
		return true;
	} else {
		return false;
	}
};

// listen for clicks
canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
	Input.set(e);
}, false);

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

var updateStreak=function(){
	var comment='Current Streak: '+streak+'</br>Highest Streak: '+higheststreak;
	document.getElementById('streakbox').innerHTML = comment;
}

var updateAccuracy=function(){
	var num=(totalhits/totalclicks)*100;
	var comment='Current Accuracy:</br>'+num.toFixed(2)+'%';
	document.getElementById('accuracybox').innerHTML = comment;
}

var updateScore=function(){
	var comment='Current Score:<br>'+score;
	document.getElementById('scorebox').innerHTML = comment;
}

var update = function() {
	samwise.update();
	samwell.update();
	if (Input.tapped) {
		entities.push(new Touch(Input.x, Input.y));
		// set tapped back to false
		// to avoid spawning a new touch
		// in the next cycle
		Input.tapped = false;
		testenemy=true;
		teststreak=false;
		totalclicks+=1;
	}
	// cycle through all entities and update as necessary
	var i;
    for (i = 0; i < entities.length; i += 1) {
        entities[i].update();
		if (((entities[i].type === 'orc') ||
			(entities[i].type === 'ringwraith') ||
			(entities[i].type === 'gollum') ||
			(entities[i].type === 'wildling') ||
			(entities[i].type === 'mance'))&&entities[i].spawncounter==0 ) {
				if(!samwise.dead){
					samwise.dead=Collides(entities[i],{x: samwise.x, y:samwise.y, r:(15*ratio)});
					if(samwise.dead&&wisedeath==true){
						samwise.deathx=samwise.x;
						samwise.deathy=samwise.y;
						samwise.x=-50;
						samwise.y=-50;
						wisedeath=false;
						var comment='<b>Samwise Gamgee has died! Poor Frodo!</b>'
						document.getElementById('announcement').innerHTML = comment;
						document.getElementById('samwellimg').src='images/samwelldead.png';
						if(!wisedeath&&!welldeath){
							var comment='<b>Game over! Our lovable Sams have perished.</b>'
							document.getElementById('announcement').innerHTML = comment;
							if(score>highestscore){
								document.cookie=score;
								highestscore=score;
								updateHighscore();
							}
						}
					}
				}
				if(!samwell.dead){
					samwell.dead=Collides(entities[i],{x: samwell.x, y:samwell.y, r:15});
					if(samwell.dead&&welldeath==true){
						samwell.deathx=samwell.x;
						samwell.deathy=samwell.y;
						samwell.x=-50;
						samwell.y=-50;
						welldeath=false;
						var comment='<b>Samwell Tarly has died! He has joined Jon Snow!</b>'
						document.getElementById('announcement').innerHTML = comment;
						document.getElementById('samwiseimg').src='images/samwisedead.png';
						if(!wisedeath&&!welldeath){
							var comment='<b>Game over! Our lovable Sams have perished.</b>'
							document.getElementById('announcement').innerHTML = comment;
						}
					}
				}
				if(testenemy){
					hit = Collides(entities[i], 
										{x: Input.x, y: Input.y, r: 25});
					if(hit){
						totalhits+=1;
						streak+=1;
						score+=Math.round(Math.sqrt(streak)*10);
						if(streak>higheststreak){
							higheststreak=streak;
						}
						updateStreak();
						updateAccuracy();
						updateScore();
						teststreak=true;
						entities[i].health -= 1;
						if(entities[i].health==0){
							entities[i].remove=true;
							
							for (var n = 0; n < 5; n +=1 ) {
							entities.push(new Particle(entities[i].x, entities[i].y, 
									2, 
									// random opacity to spice it up a bit
									'rgba(255,0,0,'+Math.random()*1+')'
								)); 
							}
						}
					}
				}
		}
        // delete from array if remove property
        // flag is set to true
        if (entities[i].remove) {
            entities.splice(i, 1);
        }
    }
	if((testenemy)&&!(teststreak)){
		if(higheststreak<streak){
			higheststreak=streak;
		}
		streak=0;
		updateStreak();
		updateAccuracy();
	}
	testenemy=false;
	if(wisedeath || welldeath){
		nextEnemy-=1;
	}
	if (nextEnemy < 0) {
    // put a new instance of enemy into our entities array
		randnum=Math.random() * 6;
		if(randnum<2){
			randenemy='orc';
			if(randnum<1.3){
				hp=1;
			} else {
				hp=2;
			}
		}else if(randnum<4){
			randenemy='wildling';
			if(randnum<3.3){
				hp=1;
			} else {
				hp=2;
			}
		}else if(randnum<5){
			randenemy='ringwraith';
			if(randnum<4.7){
				hp=3;
			} else {
				hp=4;
			}
		}else if(randnum<5.5){
			randenemy='mance';
			if(randnum<5.4){
				hp=4;
			} else {
				hp=5;
			}
		}else {
			randenemy='gollum';
			if(randnum<5.9){
				hp=4;
			} else {
				hp=5;
			}
		}
		entities.push(new Enemy(randenemy,hp));
    // reset the counter with a random value
		nextEnemy = ( Math.random() * 100 ) + 60;
		if(!wisedeath){
			nextEnemy-=30;
		}
		if(!welldeath){
			nextEnemy-=30;
		}
		randnum=(Math.random() * 5 ) +5;
	}
};

var render = function() {
	context.drawImage(map,0,0,canvas.width,canvas.height);
	samwise.render();
	samwell.render();
	var i;
    // cycle through all entities and render to canvas
    for (i = 0; i < entities.length; i += 1) {
        entities[i].render();
    }
};

Particle = function(x, y,r, col) {

    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;

    // determines whether particle will
    // travel to the right of left
    // 50% chance of either happening
    this.dir = (Math.random() * 2 > 1) ? 1 : -1;

    // random values so particles do not
    // travel at the same speeds
    this.vx = ~~(Math.random() * 4) * this.dir;
    this.vy = ~~(Math.random() * 7);

    this.remove = false;

    this.update = function() {

        // update coordinates
        this.x += this.vx;
        this.y += this.vy;

        // increase velocity so particle
        // accelerates off screen
        this.vx *= 0.99;
        this.vy *= 0.99;

        // adding this negative amount to the
        // y velocity exerts an upward pull on
        // the particle, as if drawn to the
        // surface
        this.vy -= 0.25;

        // off screen
        if (this.y < 0) {
            this.remove = true;
        }

    };

    this.render = function() {
		context.fillStyle = this.col;
        context.beginPath();
        context.arc(this.x + 5, this.y + 5, this.r, 0,  Math.PI * 2, true);
        context.closePath();
        context.fill();
    };

};