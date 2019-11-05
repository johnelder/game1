// var cfg = require("../config/config.js");
var log = require("./log.js");
var ut = require("./utilities.js");

exports.Players = {	list:{} };
exports.Entities = { list:{} };

var keyCodes = {
    68:"d",
    83:"s",
    65:"a",
	87:"w",
	16:"sh",
	'm1':'m1',
	'm2':'m2',
	'm3':'m3',
    32:"space"
  };

var entTypes = {
	rock:{
		img:"r",
		images:3,
		maxHp:120,
		clip:true,
		w:15,
		h:15,
		idKey:"r",
		maxSpwn:1000,
	},
	tree:{
		img:"t",
		images:3,
		maxHp:50,
		clip:true,
		idKey:"t",
		maxSpwn:1000
	}
}

var updateKeys = [

];
var initKeys = ["id","x","y","rt","img","w","h","hitw","hith","hp","name","score"];

exports.Entity = function(id,type,x,y,img){

	var self = {
		id:id,
		x:x || 250,
		y:y || 250,
		rt:0,
		img:img,
		spdX:0,
		spdY:0,
		w:10,
		h:10,
		clip:false,
		invincible: false,
		hp:100,
		maxHp:100,
		maxSpd:0,
		remove:false,
		type:type,
		dead:false,
		deadfor:0,
		updates:{},
	};
	if(entTypes[type]){
		var bp = entTypes[type];
		if(id === undefined){
			id = ut.createId(exports.Entities.list,entTypes[type].idKey,null,entTypes[type].maxSpwn);
		}
		if(bp.img){
			self.img = bp.img;
			if(bp.images) {
				self.img += (Math.floor(Math.random()*bp.images)+1);
			}			
		}
		self.maxHp = bp.maxHp || self.maxHp;
		self.maxSpd = bp.maxSpd || self.maxSpd;
		self.invincible = bp.invincible || self.invincible;
		self.clip = bp.clip || self.clip;
		self.id = id || self.id;
		self.w = bp.w || self.w;
		self.h = bp.h || self.h;
	}
	
	self.hp = self.maxHp;
	
	self.update = function(){
		self.move();
	};
	self.getInit = function(){
		var res = {};
		initKeys.forEach(function(key){
			res[key] = self[key];
		})
		return res;
	}
	self.getInitAll = function(){
		var res = {};
		var list = self.list;
		for(var i in list){
			var ent = list[i]
			res[i] = ent.getInit();
		}

		return res;
	}
	self.move = function(){

		// Mouse rotational control
		if(self.spdY != 0){
			self.x -= self.spdY * Math.sin(self.rt);
			self.y += self.spdY * Math.cos(self.rt);
			self.updates.x = true;
			self.updates.y = true
		}
		if(self.spdX != 0){
			self.x += self.spdX * Math.sin(self.rt + (Math.PI*0.5));
			self.y -= self.spdX * Math.cos(self.rt+ (Math.PI*0.5));
			self.updates.x = true;
			self.updates.y = true
		}

		// WASD directional control
		// if(self.spdX != 0){
		// 	self.x += self.spdX;
		// 	self.updates.x = true;
		// }
		// if(self.spdY != 0) {
		// 	self.y += self.spdY;
		// 	self.updates.y = true;
		// }
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
    
    self.getUpdatePack = function(){
		var ret = {};
		Object.keys(self.updates).forEach(function(key){
			if(self.updates[key]) {
				ret[key] = self[key];
			}
		});
		self.updates = {}

		return ret;
	}
    
	//Add to players list
	if (id != undefined) {
		exports.Entities.list[id] = self;
	}
	return self;
};




exports.Player = function(id,name){
	var self = exports.Entity();
	var xc =0;
	checkId:while(xc < 100){
		xc++;
		if(id=='P'){
			var pid = 'P' + parseInt(Math.random()*500);
			if (exports.Players.list[pid]){
				continue checkId;
			} else {
				id = pid;
				break checkId;
			}
		}
	}
	self.id = id;
	self.name = name || "P"+id;
	self.score = 0;
	self.maxSpd = 4;
	self.runFactor = 3;
	self.pressing = {
		'w':false,
		'a':false,
		's':false,
		'd':false,
		'sh':false,
		'sp':false,
		'm1':false,
		'm2':false,
		'm3':false
	}
	self.img = 'P1';
	
	self.onJoin = function(socket,name) {
		
		var	pid = ut.createId(exports.Players.list,"P",null,1000);
		
		
		socket.pid = pid;


		var player = exports.Player(pid,name);
		socket.on('io',function(data){
			if (data.hasOwnProperty('1')) {
				player.pressing[keyCodes[data['1']]] = true;
			} else if(data.hasOwnProperty(0)){
				player.pressing[keyCodes[data['0']]] = false;
			} else if(data.hasOwnProperty('rt')){
				player.rt = data['rt'];
				player.updates.rt = true;
			}
		});


		var initPack = exports.createInit();
		// console.log(initPack);
		socket.emit('init',{
			selfId:pid,
			init:initPack
			// player:Player.getAllInitPack(),
			// bullet:Bullet.getAllInitPack(),
		})
		socket.broadcast.emit('init',{
			// selfId:pid,
			init:initPack
			// player:Player.getAllInitPack(),
			// bullet:Bullet.getAllInitPack(),
		})
	}

	self.onLeave = function(socket,pid) {
		log.debug('Removing player: '+ pid);
		delete exports.Players.list[pid];
	};


	//var su_die = self.die;
	self.die = function(){
	    //TODO:play sound/animation
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
		var setSpd = self.maxSpd;
		if(self.pressing.sh){
			setSpd = self.maxSpd * self.runFactor;
		}
		if(self.pressing.d) {
			self.spdX = ut.toNum(self.spdX,setSpd);
		} else if(self.pressing.a){
			self.spdX = ut.toNum(self.spdX,-setSpd);
		} else {
			if(self.spdX != 0){
				self.spdX = ut.toNum(self.spdX,0);
			}
			
		}
		if(self.pressing.w){
			self.spdY = ut.toNum(self.spdY,-setSpd);
		} else if(self.pressing.s){
			self.spdY = ut.toNum(self.spdY,setSpd);
		} else {
			if(self.spdY != 0){
				self.spdY = ut.toNum(self.spdY,0);
			}	
		}

		
		
	};
	
	//Add to players list
	if (id != undefined) {
		exports.Players.list[id] = self;
	}
	return self;
};
// var Ent = exports.Entity;
exports.createInit = function(){
	var res = {};
	
	for(var i in exports.Entities.list){
		var ent = exports.Entities.list[i]
		res[i] = ent.getInit();
	}
	for(var i in exports.Players.list){
		var ent = exports.Players.list[i]
		res[i] = ent.getInit();
	}
		
	return res;
}