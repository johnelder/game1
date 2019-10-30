// var cfg = require("../config/config.js");
var log = require("./log.js");
exports.Players = {	list:{} };
exports.Entities = { list:{} };



exports.Entity = function(id){
	var self = {
		id:"",
		x:250,
		y:250,
		spdX:0,
		spdY:0,
		w:10,
		h:10,
		clip:false,
		invincible: false,
		hp:100,
		maxHp:100,
		remove:false,
		// type:"default",
		dead:false,
		deadfor:0,
		u:null,
	};
	
	self.update = function(){
		self.move();
		
	};
	
	self.move = function(){
		self.x += self.spdX;
		self.y += self.spdY;
	};
	
	self.hit = function(dmg){
	    //TODO: play sound/animation
	    // if(!self.invincible) {
	    	log.debug("Hitting player "+self.id+" with "+dmg);
	    	self.health(dmg);
	    // }
	};
	
	self.health = function(amount){
	    if (!self.invincible) {
	        self.hp += amount;
	        if(self.hp <= 0) {
	            self.die();
	        }
	    }
	};
	
	self.hpLvl = function(){
		var pcnt = ((self.hp / self.maxHp)*100).toFixed(2);
		return pcnt;
	};
	
    self.die = function(){
        //play sound, play animation, etc.
        self.remove = true;
    };
    
    self.respawn = function(){
    	self.dead=false;
    	self.hp = self.maxHp;
    	self.deadfor = 0;
    };
    
    self.getPack = function(type){
		if (type === 'u') {
			return {
				id:self.id,
				x:self.x,
				y:self.y,
				hp:self.hp,
				score:self.score,
			}
		} else if (type === 'r') {
			return {
				id:self.id
			}
		} else {
			return false;
		}
	}
    
	//Add to players list
	if (id != undefined) {
		exports.Enties.list[id] = self;
	}
	return self;
};




exports.Player = function(id){
	var self = exports.Entity();
	var xc =0;
	checkId:while(xc < 100){
		xc++;
		if(id=='P'){
			var pid = 'P' + parseInt(Math.random()*500);
			if (exports.Players.list[pid]){
				console.log('dupe id')
				continue checkId;
			} else {
				id = pid;
				break checkId;
			}
		}
	}
	self.id = id;
	self.name = "P"+id;
	self.score = 0;
	// self.type = "player";
	
	//var su_die = self.die;
	self.die = function(){
	    //TODO:play seound/animation
	    log.warn('Player '+id+' has died!');
	    self.dead=true;
	    //su_die();
	};
	
	var su_respawn = self.respawn;
	self.respawn = function(){
		  	log.alert("PLAYER "+self.id+" RESPAWNED!");
		su_respawn();
	}
	
	var super_update = self.update;
	self.update = function(){
		self.updateSpd();
		super_update();
	};



	self.updateSpd = function(){
		if(self.pressingRight)
			self.spdX = self.maxSpd;
		else if(self.pressingLeft)
			self.spdX = -self.maxSpd;
		else
			self.spdX = 0;
		
		if(self.pressingUp)
			self.spdY = -self.maxSpd;
		else if(self.pressingDown)
			self.spdY = self.maxSpd;
		else
			self.spdY = 0;		
	};
	
	//Add to players list
	if (id != undefined) {
		exports.Players.list[id] = self;
	}
	return self;
};


