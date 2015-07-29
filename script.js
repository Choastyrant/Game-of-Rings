/*Copyright 2015 by Tony Hung
This game would not have been possible without the following 3 guides. 
	http://www.smashingmagazine.com/2012/10/design-your-own-mobile-game/
	https://robots.thoughtbot.com/pong-clone-in-javascript
	http://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/
and the many people at stack overflow!

This game was written in the span of four days entirely by me.
*/

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
var ratio=1;
var highestscore=0;
var ua = navigator.userAgent.toLowerCase();
var android = ua.indexOf('android') > -1 ? true : false;
var ios = ( ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1  ) ? 
    true : false;
var gameArea = document.getElementById('gameArea');
var spawnconstant=1;
var difficultytimer=0;
var timer=0;
var pausegame=false;
var difficultyconstant=1;
var difficultyscalar=1;

//boolean variables for timer related events
var timernote=true;
var frodostart=false;
var frododone=false;
var frodotimer=200;
var frododeathtimer=0;
var mission2start=false;
var mission2astart=false;
var mission2bstart=false;
var mission2doneb=false;
var mission2done=false;
var mission2dgtimer=0;
var mission2wwtimer=0;
var mission2wwcount=0;
var mission2dgcount=0;
var mission2dginventory=0;
var gameover=false;
var wintimer=200;
var easymode=false;

var updateHighscore=function(){
	var comment='<b>Your Highscore:</b> '+highestscore;
	document.getElementById('highestscore').innerHTML = comment;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(',');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
} 

function pushAnnouncement(content){
	document.getElementById('a5').innerHTML = document.getElementById('a4').innerHTML;
	document.getElementById('a4').innerHTML = document.getElementById('a3').innerHTML;
	document.getElementById('a3').innerHTML = document.getElementById('a2').innerHTML;
	document.getElementById('a2').innerHTML = document.getElementById('a1').innerHTML;
	document.getElementById('a1').innerHTML = content+"<hr>";
}

pauseGame=function(){
	if(pausegame==false){
		pausegame=true;
		pushAnnouncement("<b>Game paused</br>");
	} else {
		pausegame=false;
		pushAnnouncement("<b>Game unpaused</br>");
		animate(step);
	}
}

changeEasy=function(){
	difficultyconstant=0.75;
	difficultyscalar=1.2;
	easymode=true;
	pushAnnouncement("<b>Difficulty set: EASY</br>");
}

changeHard=function(){
	difficultyconstant=1;
	difficultyscalar=1;
	easymode=false;
	pushAnnouncement("<b>Difficulty set: HARD</br>");
}

window.onload = function() {
	animate(step);
	gameArea.style.height="720px";
	gameArea.style.width="1200px";
	resizeGame()
	changeEasy();
	highestscore = getCookie("hs");
	if(!isNumber(highestscore)){
		highestscore=0;
		document.cookie="hs=0, expires=Thu, 28 Dec 2017 12:00:00 UTC";
	}
	updateHighscore();
};

function resizeGame() {
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
	gameArea.style.fontSize = (newWidth / 1220) + 'em';
	
	var middleArea = document.getElementById('middlemiddle');
	if(middleArea.clientWidth/806>middleArea.clientHeight/576){
		ratio=middleArea.clientHeight/576;
		canvas.style.width=ratio*canvas.width;
		canvas.style.height=middleArea.clientHeight;
	} else {
		ratio=middleArea.clientWidth/806;
		canvas.style.height=ratio*canvas.height;
		canvas.style.width=middleArea.clientWidth;
	}
	
	var middle = document.getElementById('middle');
	offsetTop = middle.offsetTop;
	var leftmiddle=document.getElementById('leftmiddle');
	offsetLeft = gameArea.offsetLeft+leftmiddle.clientWidth;
	
	if (android || ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
     }
		
	var topArea = document.getElementById('toparea');
	var topBar = document.getElementById('topBar');
	topBar.style.height=topArea.clientHeight;
	
	window.setTimeout(function() {
			window.scrollTo(0,1);
	}, 1);
}

var step = function() {
	if(!pausegame){
		update();
		render();
		animate(step);
	}
};

function Sam(x,y,x_speed,y_speed,img,type) {
	this.dead=false;
	this.type=type;
	this.x = x;
	this.y = y;
	this.x_speed = x_speed;
	this.y_speed = y_speed;
	this.radius = 25*difficultyconstant;
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
		if(this.type=='frodo'&&frododeathtimer>0){
			context.drawImage(frodoicondead,this.deathx,this.deathy,50*ratio,50*ratio);
			frododeathtimer-=1;
		} else if(this.type=='samwise'){
			context.drawImage(samwiseicondead,this.deathx,this.deathy,50*ratio,80*ratio);
		} else if(this.type=='samwell'){
			context.drawImage(samwellicondead,this.deathx,this.deathy,50*ratio,80*ratio);
		}
	}
};

Sam.prototype.update = function() {
	if(!this.dead){
		this.x += (this.x_speed*ratio*difficultyconstant);
		this.y += (this.y_speed*ratio*difficultyconstant);
	} else {
		return;
	}
	if(this.type!='frodo'){
		  if(this.x - 5 < 0) { // hitting the left wall
			this.x = 5;
			this.x_speed = -this.x_speed;
		  } else if(this.x + 5 > 760) { // hitting the right wall
			this.x = 755;
			this.x_speed = -this.x_speed;
		  }
		  
		  if(this.y - 5 < 0) { // hitting the left wall
			this.y = 5;
			this.y_speed = -this.y_speed;
		  } else if(this.y + 5 > 530) { // hitting the right wall
			this.y = 525;
			this.y_speed = -this.y_speed;
		  }
  }
};
var Negorpos=function(num){
	if(Math.random()<.5){
		return num*-1;
	} else {
		return num;
	}
}

var samwise1=Math.floor((Math.random()*650)+1);
var samwise2=Math.floor((Math.random()*450)+1);
var samwisedir1=Negorpos((Math.random()*2)+1.25);
var samwisedir2=Negorpos((Math.random()*2)+1.25);

var samwell1=Math.floor((Math.random()*650)+1);
var samwell2=Math.floor((Math.random()*450)+1);
var samwelldir1=Negorpos((Math.random()*1.5)+.75);
var samwelldir2=Negorpos((Math.random()*1.5)+.75);

var samwise=new Sam(samwise1,samwise2,samwisedir1,samwisedir2,samwiseicon,'samwise');
var samwell=new Sam(samwell1,samwell2,samwelldir1,samwelldir2,samwellicon,'samwell');

var frodo=new Sam(150,100,.244,.152,frodoicon,'frodo');

Input={
	x: 0,
    y: 0,
    tapped :false,

    set: function(data) {
		if(!pausegame){
			this.x = (data.pageX - offsetLeft)/ratio;
			this.y = (data.pageY - offsetTop)/ratio;
			this.tapped = true; 

			context.fillStyle = 'red';
			context.beginPath();
			context.arc(this.x + 5, this.y + 5, 5, 0,  Math.PI * 2, true);
			context.closePath();
			context.fill();
		}
    }
};


Touch=function(x,y){
	this.type = 'touch'; 
    this.x = x;             // the x coordinate
    this.y = y;             // the y coordinate
    this.r = 5*ratio*difficultyscalar;             // the radius
    this.opacity = 1;       // initial opacity; the dot will fade out
    this.fade = 0.05;       // amount by which to fade on each game tick
    this.remove = false;    // flag for removing this entity. update
                            // will take care of this
	this.spawncounter=0;
	
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
	this.spawncounter=35;
    this.x = Math.random() * (630*ratio)+20*ratio;
    this.y = Math.random() * (470*ratio)+20*ratio;
	this.xdir=Math.random()*4*ratio-2;
	this.ydir=Math.random()*4*ratio-2;
	while(((this.x-samwise.x)*(this.x-samwise.x)+(this.y-samwise.y)*(this.y-samwise.y)<200*ratio)
	||((this.x-samwell.x)*(this.x-samwell.x)+(this.y-samwell.y)*(this.y-samwell.y)<200*ratio)){
		this.x = Math.random() * 630*ratio+20*ratio;
		this.y = Math.random() * 470*ratio+20*ratio;
	}
	this.r = 15*ratio;                // the radius of the bubble
    this.remove = false;
	this.timer=0;
	
	if(this.type=='ringwraithfrodo'){
		this.spawncounter=60;
		while(((this.x-frodo.x)*(this.x-frodo.x)+(this.y-frodo.y)*(this.y-frodo.y)<200*ratio)
		||((this.x-samwise.x)*(this.x-samwise.x)+(this.y-samwise.y)*(this.y-samwise.y)<150*ratio)
		||((this.x-samwell.x)*(this.x-samwell.x)+(this.y-samwell.y)*(this.y-samwell.y)<150*ratio)){
			this.x = Math.random() * 630*ratio+20*ratio;
			this.y = Math.random() * 470*ratio+20*ratio;
		}
		this.r=12*ratio;
	}
    this.update = function() {
		if(this.timer>0){
			this.timer-=1;
		}
		if(this.type=='whitewalker'&&this.health==1&&this.timer<=0){
			this.health=2;
			this.spawncounter=60*difficultyscalar;
		}
		if(this.spawncounter==0){
			if(this.type=='dragonglass'){
				//nothing, don't move
			} else if(this.type=='whitewalker'){
				if(this.health==1){
					//nothing don't move
				} else if(!samwell.dead){
					this.xdir=samwell.x-this.x;
					this.ydir=samwell.y-this.y;
					if(this.xdir>.5){
						this.xdir=.5;
					}
					if(this.xdir<-.5){
						this.xdir=-.5;
					}
					if(this.ydir>.5){
						this.ydir=.5;
					}
					if(this.ydir<-.5){
						this.ydir=-.5;
					}
					this.y += (this.ydir)*difficultyconstant;
					this.x += (this.xdir)*difficultyconstant;
				} else if(!samwise.dead){
					this.xdir=samwise.x-this.x;
					this.ydir=samwise.y-this.y;
					if(this.xdir>.5){
						this.xdir=.5;
					}
					if(this.xdir<-.5){
						this.xdir=-.5;
					}
					if(this.ydir>.5){
						this.ydir=.5;
					}
					if(this.ydir<-.5){
						this.ydir=-.5;
					}
					this.y += (this.ydir)*difficultyconstant;
					this.x += (this.xdir)*difficultyconstant;
				}
			} else if(this.type=='ringwraithfrodo'){
				this.xdir=frodo.x-this.x;
				this.ydir=frodo.y-this.y;
				if(this.xdir>.8){
					this.xdir=.8;
				}
				if(this.xdir<-.8){
					this.xdir=-.8;
				}
				if(this.ydir>.8){
					this.ydir=.8;
				}
				if(this.ydir<-.8){
					this.ydir=-.8;
				}
				this.y += (this.ydir)*difficultyconstant;
				this.x += (this.xdir)*difficultyconstant;
			} else {
				if(Math.random()*1<.02){
					this.xdir=Negorpos((Math.random()*3)*ratio);
					this.ydir=Negorpos((Math.random()*3)*ratio);
				}
				// move up the screen by dir
				this.y += (this.ydir)*difficultyconstant;
				this.x += (this.xdir)*difficultyconstant;
			}
			// if off screen, flag for removal
			if (this.y < -10 || this.y>600) {
				if(this.type='whitewalker'){
					mission2wwcount-=1;
				}
				this.remove = true;
			}

			if (this.x < -10 || this.x>820) {
				if(this.type='whitewalker'){
					mission2wwcount-=1;
				}
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
		} else if(this.type=='ringwraith'||this.type=='ringwraithfrodo'){
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
		} else if(this.type=='whitewalker'){
			if(this.health==2){
				this.img=whitewalker;
			} else {
				this.img=whitewalkerdead;
			}
		} else if(this.type=='dragonglass'){
			this.img=dragonglass;
		}
	
		context.beginPath();
		context.arc(this.x, this.y, this.r, 2 * Math.PI, false);
		context.drawImage(this.img,this.x,this.y,50*ratio,50*ratio);
    };
}


Collides=function(a,b){
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

// listen for touches
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    // the event object has an array
    // named touches; we just want
    // the first touch
    Input.set(e.touches[0]);
}, false);
canvas.addEventListener('touchmove', function(e) {
    // we're not interested in this,
    // but prevent default behaviour
    // so the screen doesn't scroll
    // or zoom
    e.preventDefault();
}, false);
canvas.addEventListener('touchend', function(e) {
    // as above
    e.preventDefault();
}, false);

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

updateStreak=function(){
	var comment='<b>Current Streak:</b> '+streak+'</br><b>Highest Streak:</b> '+higheststreak;
	document.getElementById('streakbox').innerHTML = comment;
}

updateAccuracy=function(){
	var num=(totalhits/totalclicks)*100;
	var comment='<b>Current Accuracy:</b> '+num.toFixed(2)+'%';
	document.getElementById('accuracybox').innerHTML = comment;
}

updateScore=function(){
	var comment='<b>Current Score:</b> '+score;
	document.getElementById('scorebox').innerHTML = comment;
}

updateDG=function(){
	var comment='<b>Dragonglass:</b> '+mission2dginventory;
	document.getElementById('inventory').innerHTML = comment;
}

update = function() {
	if(!samwell.dead||!samwise.dead){
		timer+=1;
		difficultytimer+=1;
	}
	samwise.update();
	samwell.update();
	if(frodostart&&!frododone){
		frodo.update();
	}
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
		if ((entities[i].type === 'orc') ||
			(entities[i].type === 'ringwraith') ||
			(entities[i].type === 'gollum') ||
			(entities[i].type === 'wildling') ||
			(entities[i].type === 'mance') ||
			(entities[i].type === 'ringwraithfrodo') ||
			(entities[i].type === 'whitewalker') ||
			(entities[i].type === 'dragonglass')) {
				if(!samwise.dead&&entities[i].spawncounter==0){
					if((entities[i].type=='dragonglass') || (entities[i].type=='whitewalker'&&entities[i].health==1)){
						//do nothing
					} else {
						samwise.dead=Collides(entities[i],{x: samwise.x, y:samwise.y, r:(15*ratio)});
						if(samwise.dead&&wisedeath==true){
							samwise.deathx=samwise.x;
							samwise.deathy=samwise.y;
							samwise.x=-50;
							samwise.y=-50;
							wisedeath=false;
							var comment='<b>Samwise Gamgee has died! Poor Frodo!</b>'
							pushAnnouncement(comment);
							document.getElementById('samwiseimg').src='images/samwisedead.png';
							if(!wisedeath&&!welldeath){
								var comment='<b>Game over! Our lovable Sams have perished.</b>'
								mission2done=true;
								frododone=true;
								gameover=true;
								pushAnnouncement(comment);
								if(score>highestscore){
									pushAnnouncement("<b>You have achieved a personal highscore! Play again?</b>");
									var str="hs="+score+", expires=Thu, 28 Dec 2017 12:00:00 UTC";
									document.cookie=str;
									highestscore=score;
									updateHighscore();
								}
							}
						}
					}
				}
				if(!samwell.dead&&entities[i].spawncounter==0){
					if((entities[i].type=='dragonglass') || (entities[i].type=='whitewalker'&&entities[i].health==1)){
						//do nothing
					} else {
						samwell.dead=Collides(entities[i],{x: samwell.x, y:samwell.y, r:15});
						if(samwell.dead&&welldeath==true){
							samwell.deathx=samwell.x;
							samwell.deathy=samwell.y;
							samwell.x=-50;
							samwell.y=-50;
							welldeath=false;
							var comment='<b>Samwell Tarly has died! He has joined Jon Snow!</b>'
							pushAnnouncement(comment);
							document.getElementById('samwellimg').src='images/samwelldead.png';
							if(!wisedeath&&!welldeath){
								var comment='<b>Game over! Our lovable Sams have perished.</b>'
								mission2done=true;
								frododone=true;
								gameover=true;
								pushAnnouncement(comment);
								if(score>highestscore){
									pushAnnouncement("<b>You have achieved a personal highscore! Play again?</b>");
									var str="hs="+score+", expires=Thu, 28 Dec 2017 12:00:00 UTC";
									document.cookie=str;
									highestscore=score;
									updateHighscore();
								}
							}
						}
					}
				}
				if(frodostart&&!frododone&&!frodo.dead&&entities[i].spawncounter==0){
					frodo.dead=Collides(entities[i],{x: frodo.x, y:frodo.y, r:(10*ratio)});
					if(!frododone&&frodo.dead){
						frododone=true;
						frododeathtimer=500;
						frodo.deathx=frodo.x;
						frodo.deathy=frodo.y;
						pushAnnouncement("<b>Frodo has been captured! The quest has failed. Sauron has taken the ring.</b>");
					}
				}
				if(testenemy){
					hit = Collides(entities[i], 
										{x: Input.x, y: Input.y, r: 25});
					if(hit){
						if(entities[i].type=='whitewalker'&&entities[i].health==1&&mission2dginventory==0){

						} else{
							if(entities[i].type=='whitewalker'&&mission2dginventory>0){
								mission2dginventory-=1;
								entities[i].health=1;
								updateDG();
							} else if(entities[i].type=='dragonglass'){
								mission2dginventory+=1;
								updateDG();
							} else if(entities[i].type=='whitewalker'&&entities[i].health==2){
								entities[i].timer=100*difficultyscalar;
								score-=Math.round(Math.sqrt(streak+1)*10*difficultyconstant);
							}
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
		}
        // delete from array if remove property
        // flag is set to true
        if (entities[i].remove) {
            entities.splice(i, 1);
        }
	}	
	//timer related events
	if(timer>100&&timernote){
		pushAnnouncement("<b>Your first enemy has appeared! Click on their heads to kill them. Don't let them touch our beloved Sams! Be careful, some enemies are stronger than others!</b>");
		timernote=false;
	}
	
	if(timer>1600&&!frodostart&&!frododone){
		frodostart=true;
		pushAnnouncement("<b>Mission 1: Frodo needs your help to bring the ring to Mordor! Unfortunately the ringwraiths are after him! Protect him!</b>");
	}
	
	if(difficultytimer>2500){
		difficultytimer-=2500*difficultyscalar;
		spawnconstant-=.1;
	}
	if(frodotimer>0&&!frododone){
		frodotimer-=1;
	}
	if(wintimer>0&&mission2done&&!mission2doneb){
		wintimer-=1;
	}
	if(!frodo.dead&&frodostart&&!frododone&&frodotimer<=0){
		frodotimer=130*difficultyscalar;
		if(Math.random()<.7){
			entities.push(new Enemy('ringwraithfrodo',2));
		} else if(Math.random()<1){
			entities.push(new Enemy('ringwraithfrodo',3));
		}
	}
	if(!frodo.dead&&frodo.x>675&&frodo.y>475&&!frododone){
		frododone=true;
		frodo.dead=true;
		if(!easymode){
			pushAnnouncement("<b>Frodo has reached Mordor and destroyed the ring! Sam is elated and so should you! +2000 score.</b>");
			score+=2000;
		} else{
			pushAnnouncement("<b>Frodo has reached Mordor and destroyed the ring! Sam is elated and so should you! +1000 score.</b>");
			score+=1000;
		}
		updateScore();
	}

	if(mission2wwtimer>0&&!mission2done){
		mission2wwtimer-=1;
	}
	
	if(mission2dgtimer>0&&!mission2done){
		mission2dgtimer-=1;
	}
	
	if(mission2astart&&mission2wwtimer<=0&&mission2wwcount<10&&!gameover){
		entities.push(new Enemy('whitewalker',2));
		mission2wwcount+=1;
		mission2wwtimer=250*difficultyscalar;
	}
	
	if(mission2bstart&&mission2dgtimer<=0&&!gameover){
		entities.push(new Enemy('dragonglass',1));
		mission2dgtimer=200*difficultyconstant;
	}
	
	if(mission2wwcount>=10&&!mission2done&&!gameover){
		mission2done=true;
		if(!easymode){
			pushAnnouncement("<b>You have survived the whitewalker invasion. Now the iron throne... +3500 score.</b>");
			score+=3500;
		} else {
			pushAnnouncement("<b>You have survived the whitewalker invasion. Now the iron throne... +2000 score.</b>");
			score+=2000;
		}
		updateScore();
	}
	
	if(mission2done&&!mission2doneb&&wintimer<=0&&!gameover){
		mission2doneb=true;
		pushAnnouncement("<b>Congratulations, you have completed both missions and have saved the world. You have been bestowed the title of: <i>SAMWIN WIGGINS.</i></b>");
		if(!samwise.dead&&!samwell.dead){
			pushAnnouncement("<b>Both Sams have survived! You are the messiah of Sams! +3000 score.</b>");
			score+=3000;
		} else if(!samwise.dead&&samwell.dead){
			pushAnnouncement("<b>Samwise looks at the fallen Samwell longingly... +1000 score</b>");
			score+=1000;
		} else if(!samwell.dead&&samwise.dead){
			pushAnnouncement("<b>Samwell yells at the sky angrily, shouting the name of his fallen breathen Samwise... +1000 score</b>");
			score+=1000;
		}
	}
	
	if(timer>5100&&!mission2start&&!mission2done){
		mission2start=true;
		pushAnnouncement("<b>Samwell feels homesick. We travel to the lands of Westeros, to the northern wall.</b>");
	}
	
	if(timer>5700&&!mission2astart&&!mission2done){
		mission2astart=true;
		pushAnnouncement("<b>The legends are true...Those are white walkers! They will come back to life!</b>");
		mission2wwtimer=300;
		entities.push(new Enemy('whitewalker',2));
		mission2wwcount+=1;
	}
	
	if(timer>6700&&!mission2bstart&&!mission2done){
		mission2bstart=true;
		pushAnnouncement("<b>Mission 2: Pick up the dragonglass daggers! They will kill the whitewalkers once and for all and save Westeros!</b>");
		mission2dgtimer=200;
		entities.push(new Enemy('dragonglass',1));
		mission2dgcount+=1;
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
		nextEnemy = (( Math.random() * 100 ) + 60)*spawnconstant*difficultyscalar;
		if(!wisedeath){
			nextEnemy-=30*difficultyconstant;
		}
		if(!welldeath){
			nextEnemy-=30*difficultyconstant;
		}
		randnum=(Math.random() * 5 ) +5;
	}
};

render = function() {
	if(!mission2start){
		context.drawImage(map,0,0,canvas.width,canvas.height);
	} else {
		context.drawImage(map2,0,0,canvas.width,canvas.height);
	}
	samwise.render();
	samwell.render();
	if(frodostart){
		frodo.render();
	}
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