console.log("Starting...");
var rnd = 0;
var list = {};
var count = 0;

var loop = setInterval(function() {
    //Genereate rnd number and check if it is in the list
    check1: while(true){
        rnd = parseInt(Math.random()*999);
        var date = new Date();
        if (list[rnd]){
            console.log('dupe:'+count);
            continue check1;
        } else {
            break check1;
        }
    }
    
    
    var time = new Date() - date;
    console.log(time);
    //Add to list
    list[rnd] = {
        'a':count
    };
    
    //Add to counter
    count++;
        
    if (count != Object.keys(list).length) { 
        console.log(count + " : "+Object.keys(list).length);
        clearInterval(loop);
    }
    
    //Stop at limit
    if(count >= 1000) {
        console.log('hit limit');
        clearInterval(loop);
    }
},35);
