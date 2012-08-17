var _maps = {
	world: {
		name: "world",
		tileSize: {width: 46, height: 46},
		battleStep: function() { return Math.ceil(Math.max(parseInt((Math.random()*4).toString().substring(2,3)),2)*2.5); },
		movement: "grid",
		center: "character",
		map: {
			0:["grass", "shallow", "water", "water", "forest", "forest", "forest", "forest", "forest", "grass", "grass", "grass"],
			1:["grass", "shallow", "water", "water", "swamp", "forest", "forest", "forest", "swamp", "grass", "grass", "grass"],
			2:["grass", "grass", "shallow", "water", "water", "swamp", "grass", "swamp", "water", "grass", "grass", "grass"],
			3:["grass", "grass", "grass", "shallow", "water", "shallow", "grass", "shallow", "water", "grass", "grass", "grass"],
			4:["grass", "grass", "grass", "shallow", "water", "shallow", "grass", "shallow", "water", "grass", "grass", "grass"],
			5:["dirt", "dirt", "grass", "grass", "shallow", "grass", "grass", "grass", "shallow", "grass", "grass", "grass"],
			6:["grass", "dirt", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass", "grass"]
		},
		tiles: {
			walkable: function(name) {
				switch( name ) {
					case "water": return false; break;
					case "empty": return false; break;
					default: return name == undefined ? false : true; break;
				}
			},
			battle: function(name) {
				switch(name) {
					case "grass": return "grass.png"; break;
					case "shallow": return "shallow.png"; break;
					case "dirt": return "dirt.png"; break;
					case "swamp": return "swamp.png"; break;
					case "forest": return "forest.png"; break;
					default: return "grass.png"; break;
				}
			},
			enemies: function(name) {
				switch(name) {
					case "grass": return ["goblin"]; break;
					default: return ["goblin"]; break;
				}
			}
		},
		walkCheck: function(x, y) {
			return (x < 0 || y < 0 || x == undefined || y == undefined || this.map[y] == undefined) ? false : this.tiles.walkable(this.map[y][x]);
		},
		triggers: {
			enterForest: function() {
				_rin.controls.disable(_rin.vars.state);
				$("#html").animate({opacity:0}, 500, function(){ _rin.goto("world",{name:"forest",x:0,y:0}); });
			}
		},
		checkTriggers: function(x, y) {
			if(x == 6 && y == 1) this.triggers.enterForest();
			else {
				_rin.vars.p.main.nextBattle--;
				if(_rin.vars.p.main.nextBattle == 0) _rin.goto("battle");
			}
		}
	},
	forest: {
		name: "forest",
		tileSize: {width: 46, height: 46},
		battleStep: function() { return Math.ceil(Math.max(parseInt((Math.random()*4).toString().substring(2,3)),2)*2.5); },
		movement: "grid",
		center: "character",
		map: {
			0:["forest", "forest", "forest", "water", "water", "shallow", "forest", "forest", "forest", "forest", "forest", "forest"],
			1:["forest", "forest", "water", "water", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
			2:["grass", "grass", "shallow", "water", "water", "swamp", "grass", "swamp", "water", "grass", "grass", "grass"],
			3:["grass", "grass", "grass", "shallow", "water", "shallow", "grass", "shallow", "water", "grass", "grass", "grass"],
		},
		tiles: {
			walkable: function(name) {
				switch( name ) {
					default: return name == undefined ? false : true; break;
				}
			},
			battle: function(name) {
				switch(name) {
					case "forest": return "forest.png"; break;
					default: return "grass.png"; break;
				}
			},
			enemies: function(name) {
				switch(name) {
					case "forest": return ["goblin"]; break;
					default: return ["goblin"]; break;
				}
			}
		},
		walkCheck: function(x, y) {
			return (x < 0 || y < 0 || x == undefined || y == undefined || this.map[y] == undefined) ? false : this.tiles.walkable(this.map[y][x]);
		},
		triggers: {
			enterForest: function() {
				console.log("entering forest...");
			}
		},
		checkTriggers: function(x, y) {
			if(x == 6 && y == 1) this.triggers.enterForest();
			else {
				_rin.vars.p.main.nextBattle--;
				if(_rin.vars.p.main.nextBattle == 0) _rin.goto("battle");
			}
		}
	}
}