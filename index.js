var express = require('express');
var fs = require('fs');
var app = express();
var serv = require('https').createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/techunlimitedgroup.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/techunlimitedgroup.com/fullchain.pem')
}, app);
var io = require('socket.io')(serv);
const pm2 = require('@pm2/io')

pm2.init({
    transactions: true, // will enable the transaction tracing
    http: true, // will enable metrics about the http server (optional)
    metrics: {
        network: {
            ports: true
        }
    }
})

var cfg = require('config');
var debug = cfg.get('debug');
var port = cfg.get("port");

var ent = require("./modules/entities.js");
var ut = require("./modules/utilities.js");
var log = require("./modules/log.js");
var nameGen = require("./modules/nameGen.js");


/*--------------------------------------------------------------------




*/


app.get('/',function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
app.use('/',express.static(__dirname + '/public'));
serv.listen(port);
log.update("Server started. Listening on port "+port);


var Players = ent.Player();
Players.list = ent.Players.list;
var Sockets = {list:{}};
var Entities = ent.Entity();
Entities.list = ent.Entities.list;
// ent.list= {};

io.sockets.on('connection', function(socket){
	//socket.id = Math.random();
	log.update("Socket "+socket.id+" connected.")
	Sockets.list[socket.id] = socket;
    
    socket.on('signIn',function(data){
        var username = data.username;
        if(data.username == "") {
            username = nameGen.getName();
        }

        if (ut.objFind(username,"name",Players.list) == undefined){

            log.update('Player joining: '+username)
            Players.onJoin(socket,username);
        } else {

            socket.emit('dupeName',{"name":username})
        }

        
		// socket.emit('signInResponse',{success:true});
	});
    socket.on('rndName',function(data){
        socket.emit('rndName',{"name":nameGen.getName()});
    })
	socket.on('disconnect',function(){
        Players.onLeave(socket,Sockets.list[socket.id].pid);
        
		delete Sockets.list[socket.id];
 		//Players.onDisconnect(socket);
	});
});


// Create dummy entities
for(var i = 0; i < 3; i++){
    var x = Math.floor(Math.random()*300)-150
    var y = Math.floor(Math.random()*300)-150
	var t = ent.Entity(undefined,"rock",x,y);

}


    
var frameReset = 100;
var frameCount = 0;

//Game loop
setInterval(function(){
    //Game Loop

    

    // Update players
    var players = Players.list;
    
    var updatePack = {};
    for(var i in players){
        var player = players[i];
        player.update();
        if(Object.entries(players[i].updates).length != 0) {
            updatePack[player.id] = players[i].getUpdatePack();
        }
        
    }


    //TODO: update entities


    //



    if (Object.entries(updatePack).length != 0) {
        for (i in Sockets.list){
            var socket = Sockets.list[i];
            // socket.emit('i',initPack);
            socket.emit('u',updatePack); 
            // socket.emit('r',removePack);
        }    
        updatePack = {};
    }



    
    
    
    frameCount++
    if (frameCount > frameReset) {
        frameCount = 0;
        // var eInitPack = Entities.getInitAll();
        // var pInitPack = Players.getInitAll();
        // var initPack = {...eInitPack,...pInitPack};
        // console.log({...eInitPack,...pInitPack});
         console.log(updatePack);
        //  console.log(Players.list)

    }
    
    
    
    
    
    
    
    
    
    
    
    
    
//-----------------------------------------------------------------------------
//Test loop 1 - hp, hits, deat, respawn.
    var testLoop = false;
    if(testLoop) {
        var statTicker = "";
        var players = Players.list;
        //Random;y hit players
        for(var i in players){
            if(!players[i].dead) {
              	var chance = ut.roll(1,6);
              	if(chance > 3) {
            		var dmg = -ut.roll(5,6);
            		players[i].hit(dmg);
            	}
            } else {
                players[i].deadfor++;
                if(players[i].deadfor >= 12) {
                    players[i].respawn();
                }
            }
        }
        
        //Update stats at en of frame;
        for(var i in players){
            if (players[i].dead){
                statTicker += players[i].name+": DEAD   ";
            } else {
                statTicker += players[i].name+": "+players[i].hpLvl()+"%   ";    
            }
        	
        }
        log.update(statTicker);
    }
//-----------------------------------------------------------------------------





},cfg.get("frameRate"));