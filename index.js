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


/*--------------------------------------------------------------------




*/


app.get('/',function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
app.use('/',express.static(__dirname + '/public'));
serv.listen(port);
console.log("Server started. Listening on port "+port);


var Players = ent.Player();
Players.list = ent.Players.list;
var Sockets = {list:{}};
ent.list= {};

io.sockets.on('connection', function(socket){
	//socket.id = Math.random();
	log.update("Socket "+socket.id+" connected.")
	Sockets.list[socket.id] = socket;
	
	socket.on('disconnect',function(){
		delete Sockets.list[socket.id];
 		//Players.onDisconnect(socket);
	});
});


// Create dummy players
for(var i = 0; i < 10; i++){
	var t = ent.Player('P');

}


    
var frameReset = 50;
var frameCount = 0;

//Game loop
setInterval(function(){
    //Game Loop

    
    var players = Players.list;
    
    
    var updatePack = {p:{}};
    for(var i in players){
        // console.log(i)
        updatePack.p[i] = players[i].getPack('u');
    }

    for (i in Sockets.list){
        var socket = Sockets.list[i];
        // socket.emit('i',initPack);
        socket.emit('u',updatePack);
        // socket.emit('r',removePack);
    }

    // console.log(Players.list)
    
    
    frameCount++
    if (frameCount > frameReset) {
        frameCount = 0;
        
        // console.log(updatePack);

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