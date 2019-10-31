var adj = ["Busy","Lazy","Careless","Clumsy","Nimble","Brave","Mighty","Meek","Clever","Dull","Afraid","Scared","Cowardly","Bashful","Proud","Fair","Greedy","Wise","Foolish","Tricky","Truthful","Loyal","Happy","Cheerful","Joyful","Carefree","Friendly","Moody","Crabby","Cranky","Awful","Gloomy","Angry","Worried","Excited","Calm","Bored","Hardworking","Silly","Wild","Crazy","Fussy","Still","Odd","Starving","Stuffed","Alert","Sleepy","Surprised","Tense","Rude","Selfish","Strict","Tough","Polite","Amusing","Kind","Gentle","Quiet","Caring","Hopeful","Rich","Thrifty","Stingy","Spoiled","Generous","Quick","Speedy","Swift","Hasty","Rapid","Good","Fantastic","Splendid","Wonderful","Hard","Difficult","Challenging","Easy","Simple","Chilly","Freezing","Icy","Steaming","Sizzling","Muggy","Cozy","Huge","Great","Vast","Sturdy","Grand","Heavy","Plump","Deep","Puny","Small","Tiny","Petite","Long","Endless","Beautiful","Adorable","Shining","Sparkling","Glowing","Fluttering","Soaring","Crawling","Creeping","Sloppy","Messy","Slimy","Grimy","Crispy","Spiky","Rusty","Smelly","Foul","Stinky","Curly","Fuzzy","Plush","Lumpy","Wrinkly","Smooth","Glassy","Snug","Stiff","Ugly","Hideous","Horrid","Dreadful","Nasty","Cruel","Creepy","Loud","Shrill","Muffled","Creaky"];
var noun = ["Chimpanzee","Kitten","Aardvark","Chinchilla","Lynx","Eagle","Gnu","Wolf","Iguana","Fox","Gorilla","Bunny","Alligator","Seal","Mongoose","Deer","Fox","Moose","Mink","Platypus","Porcupine","Newt","Gazelle","Antelope","Llama","Snowy Owl","Dugong","Springbok","Beaver","Addax","Whale","Argali","Gopher","Ewe","Donkey","Mouse","Capybara","Chicken","Bear","Bread","Sidewalk","Controller","Pencil","Soda","Sandal","Conditioner","Truck","Tissue","Clamp","Clothes","Tomato","Flag","Deodorant","Speakers","Mirror","Ice","Box","Balloon","Ring","Bookmark","Shoes","Candy","Twezzers","Nail","Toothbrush","Book","Sign","Money","Monitor","Newspaper","Shovel","Unicorn","Troll","Gnome","Elf","Wizard","Goblin","Giant","Pixie","Minator","Zombie","Skeleton","Witch","Dragon","Catdog","Vampire","Pokemon","Osolaficus","Gremlin","Munchkin","Sunflower","Pebbles","Halflinger","Paint","Pirate","Warrior","Man","Woman","Child","Weed"];
exports.getName = function(){
    var a = adj[Math.floor(Math.random()*adj.length)];
    var n = noun[Math.floor(Math.random()*noun.length)];
    return a+n;
}