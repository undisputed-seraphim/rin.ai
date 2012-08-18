var _maps = {
	baron: {
		name: "baron",
		tileSize: {width: 40, height: 40},
		battleStep: function() { return 100000; },
		map: {
			0: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
			1: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_wall1_top_left_cont", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_top_right_cont", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
			2: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_wall1_top_left_cont", "t_wall1_front_top", "t_wall1_front_right_cont", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_top", "t_grass1", "empty", "empty", "empty", "empty", "empty", "empty"],
			3: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_wall1_top", "t_wall1_front", "t_wall1_right", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_wall1_top", "t_grass1_shadow", "t_grass1", "empty", "empty", "empty", "empty", "empty"],
			4: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_wall1_top", "empty", "empty", "t_stairs2", "empty", "empty", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_wall1_top", "t_grass1_shadow", "t_grass1", "empty", "empty", "empty", "empty", "empty"],
			5: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_wildgrass", "t_wildgrass", "t_wildgrass", "t_wildgrass", "t_wildgrass", "t_wildgrass", "t_wall1_top", "empty", "empty", "empty", "empty", "empty", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_wall1_top", "t_grass1_shadow", "t_grass1", "empty", "empty", "empty", "empty", "empty"],
			6: ["empty", "t_grass1", "t_wall1_top_left_cont", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_top_right_cont", "t_wildgrass", "t_wildgrass", "t_wildgrass", "t_wall1_front_left_cont", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_right_top", "t_ground1", "t_wall1_left_top", "t_wall1_front_right_cont", "t_grass1_shadow", "t_grass1", "empty", "empty", "empty", "empty", "empty"],
			7: ["empty", "t_grass1", "t_wall1_top", "t_wall1_front", "t_wall1_front", "t_stone3_roof_left_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_right_top", "t_wall1_front", "t_wall1_top", "t_wildgrass", "t_wall1_top_left_cont", "t_wall1_front_top", "t_wall1_left", "empty", "t_wall1_front", "empty", "t_wall1_front", "empty", "t_wall1_front", "t_wall1_right", "t_stairs1_shadow", "t_wall1_left", "t_wall1_top_end", "t_grass1_shadow", "t_grass1", "t_grass1", "t_grass1", "t_grass1_tree_top", "t_grass1_tree_top", "empty"],
			8: ["empty", "t_grass1", "t_wall1_top", "t_wall1_front", "t_wall1_front", "t_stone3_roof_left_btm", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof_right_btm", "t_wall1_front", "t_wall1_top", "t_wildgrass", "t_wall1_top", "t_wall1_front", "t_wall1_left", "empty", "t_wall1_front", "empty", "t_wall1_front", "empty", "t_wall1_front", "t_wall1_right", "t_stairs1_shadow", "t_wall1_left", "t_wall1_front_left_cont", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_top_right_cont", "t_grass1_tree_btm", "empty"],
			9: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shrub", "t_grass1_well", "t_stone3_top_left", "t_stone3_top1", "t_stone3_top2", "t_stone3_top2", "t_stone3_top1", "t_stone3_top_right", "t_grass1_shadow", "t_wall1_top", "t_wildgrass", "t_wall1_top", "t_wall1_front", "t_wall1_left", "empty", "t_wall1_front", "empty", "t_wall1_front", "empty", "t_wall1_front", "t_wall1_right", "t_ground1_shadow_btm", "t_wall1_left", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_top", "t_grass1", "empty"],
			10: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shrub", "t_grass1", "t_stone3_left", "t_stone3_front2", "t_stone3_door1_c", "t_stone3_front2", "t_stone3_front1", "t_stone3_right", "t_grass1_shadow_btm", "t_wall1_top", "t_wall1_front_top", "t_wall1_front_right_cont", "t_grass1_shadow", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_grass1", "t_ground1", "t_grass1", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_door", "t_wall1_front", "t_wall1_top", "t_grass1_shadow", "empty"],
			11: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shrub", "t_grass1", "t_grass1_shrub", "t_grass1", "t_ground1", "t_ground1", "t_ground1", "t_grass1", "t_grass1", "t_wall1_top", "t_wall1_front", "t_wall1_front", "t_grass1_shadow", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_grass1", "t_ground1", "t_ground1", "t_ground1", "t_grass1_shrub", "t_grass1_tree_top", "t_grass1", "t_grass1", "t_wall1_top", "t_grass1_shadow", "empty"],
			12: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shrub", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_ground1", "t_grass1", "t_grass1_shrub", "t_wall1_top", "t_stone3_roof_left_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_right_top", "t_grass1", "t_bridge1_hor", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_ground1", "t_grass1", "t_grass1_tree_btm", "t_grass1", "t_grass1", "t_wall1_top", "t_grass1_shadow", "empty"],
			13: ["empty", "t_grass1", "t_wall1_front_left_cont", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_right_top", "t_ground1", "t_wall1_left_top", "t_wall1_front_top", "t_wall1_front_right_cont", "t_stone3_roof_left_btm", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof_right_btm", "t_grass1", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "t_bridge1_ver", "empty", "empty", "t_grass1", "t_grass1", "t_wall1_top", "t_grass1_shadow", "empty"],
			14: ["empty", "t_grass1", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_ground1_shadow", "t_wall1_left", "t_wall1_front", "t_wall1_right", "t_stone3_top_left", "t_stone3_weapon", "t_stone3_top2", "t_stone3_armor", "t_stone3_top_right", "t_grass1_shadow", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_ground1", "t_grass1_shrub", "empty", "t_grass1", "t_grass1", "t_wall1_top", "t_grass1_shadow", "empty"],
			15: ["empty", "t_grass1", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_window", "t_wall1_right", "t_stairs1_shadow", "t_wall1_left", "t_wall1_window", "t_wall1_right", "t_stone3_left", "t_stone3_front2", "t_stone3_door1_c", "t_stone3_front2", "t_stone3_right", "t_grass1_shadow_btm", "t_grass1", "t_stone3_roof_left_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_right_top", "t_grass1", "t_grass1", "t_ground1", "t_grass1", "empty", "t_grass1", "t_grass1", "t_wall1_top", "t_grass1_shadow", "empty"],
			16: ["empty", "t_grass1", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_stairs1_shadow", "t_wall1_left", "t_wall1_front", "t_wall1_right", "t_ground1_shadow", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1_pot", "t_stone3_roof_left_btm", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof_right_btm", "t_ground1", "t_grass1", "t_ground1", "t_grass1", "empty", "t_grass1", "t_grass1_tree_top", "t_wall1_top", "t_grass1_shadow", "empty"],
			17: ["empty", "t_grass1", "t_wall1_top_end", "t_wall1_window", "t_wall1_window", "t_wall1_window", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_stairs1_shadow", "t_wall1_left", "t_wall1_front", "t_wall1_right", "t_ground1_shadow", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1_pot", "t_ground1_pot", "t_stone3_roof_left_btm", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof_right_btm", "t_ground1_shadow", "t_ground1", "t_ground1", "t_grass1_shrub", "empty", "t_grass1", "t_grass1_tree_btm", "t_wall1_top", "t_grass1_shadow", "empty"],
			18: ["empty", "t_grass1", "t_wall1_top", "t_wall1_front", "t_stone3_door1_c", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_ground1_shadow_btm", "t_wall1_left", "t_wall1_front", "t_wall1_right", "t_ground1_shadow_btm", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1_pot", "t_stone3_top_left", "t_stone3_top2", "t_stone3_top1", "t_stone3_top_right", "t_ground1_shadow", "t_ground1", "t_grass1_shrub", "t_grass1_shrub", "empty", "t_grass1", "t_grass1", "t_wall1_top", "t_grass1_shadow", "empty"],
			19: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_grass1", "t_wildgrass_top_left", "t_wildgrass_top_right", "t_ground1_pot", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_stone3_left", "t_stone3_door1_c", "t_stone3_front1", "t_stone3_right", "t_ground1_shadow_btm", "t_ground1", "t_grass1", "t_grass1", "t_bridge1_hor", "t_grass1", "t_grass1", "t_wall1_top", "t_grass1_shadow", "empty"],
			20: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_wildgrass_top_left", "t_wildgrass", "t_wildgrass", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_stone3_roof_left_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_right_top", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_grass1", "t_grass1", "empty", "t_grass1", "t_grass1_tree_top", "t_wall1_top", "t_grass1_shadow", "empty"],
			21: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_wildgrass_btm_left", "t_wildgrass", "t_wildgrass_btm_right", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_stone3_roof_left_btm", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof_right_btm", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_wall1_top_left_cont", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_right_cont", "t_grass1_shadow", "empty"],
			22: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_stone3_roof_top_left", "t_stone3_roof_top", "t_stone3_roof_top_right", "t_ground1", "t_ground1", "t_stone3_roof_left_top", "t_stone3_roof_top", "t_stone3_roof_right_top", "t_ground1", "t_ground1", "t_stone3_top_left", "t_stone3_top2", "t_stone3_top1", "t_stone3_top_right", "t_ground1_shadow", "t_ground1", "t_stone3_roof_left_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_top", "t_stone3_roof_right_top", "t_wall1_top", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_grass1_shadow", "empty"],
			23: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_stone3_roof_btm_left", "t_stone3_roof", "t_stone3_roof_btm_right", "t_ground1", "t_ground1_well", "t_stone3_roof_left_btm", "t_stone3_roof", "t_stone3_roof_right_btm", "t_ground1", "t_ground1", "t_stone3_left", "t_stone3_door1_c", "t_stone3_front1", "t_stone3_right", "t_ground1_shadow_btm", "t_ground1", "t_stone3_roof_left_btm", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof", "t_stone3_roof_right_btm", "t_wall1_top", "t_wall1_front", "empty", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_grass1_shadow_btm", "empty"],
			24: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_stone3_left", "t_stone3_front2", "t_stone3_right", "t_ground1", "t_ground1", "t_stone3_top_left", "t_stone3_item", "t_stone3_top_right", "t_ground1_shadow", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_stone3_top_left", "t_stone3_inn", "t_stone3_top2", "t_stone3_top1", "t_stone3_top1", "t_stone3_top_right", "t_wall1_top", "empty", "empty", "empty", "t_grass1", "t_grass1", "t_grass1", "empty"],
			25: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_stone3_left", "t_stone3_door1_c", "t_stone3_right", "t_ground1", "t_ground1", "t_stone3_left", "t_stone3_door1_c", "t_stone3_right", "t_ground1_shadow_btm", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_stone3_left", "t_stone3_door1_c", "t_stone3_front2", "t_stone3_front1", "t_stone3_front1", "t_stone3_right", "t_wall1_top", "empty", "empty", "empty", "empty", "empty", "t_grass1", "empty"],
			26: ["empty", "t_grass1", "t_wall1_top", "t_grass1_shadow", "t_grass1", "t_grass1", "t_grass1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1", "t_ground1_pot", "t_wall1_top", "empty", "empty", "empty", "empty", "empty", "t_grass1_shrub", "empty"],
			27: ["empty", "t_grass1", "t_wall1_front_left_cont", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_right_top", "t_ground1", "t_ground1", "t_ground1", "t_wall1_left_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_top", "t_wall1_front_right_cont", "empty", "empty", "empty", "empty", "empty", "t_grass1_shrub", "empty"],
			28: ["empty", "t_grass1", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_window", "t_wall1_window", "t_wall1_window", "t_wall1_right", "t_ground1_shadow", "t_ground1", "t_ground1", "t_wall1_left", "t_wall1_window", "t_wall1_window", "t_wall1_window", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_right", "empty", "empty", "empty", "empty", "empty", "t_grass1", "empty"],
			29: ["empty", "t_grass1", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_grass1_shadow_btm", "t_grass1", "t_grass1", "t_wall1_left", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_front", "t_wall1_right", "t_grass1", "empty", "empty", "empty", "t_grass1", "t_grass1", "empty"],
			30: ["empty", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "t_grass1", "empty"],
			31: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
		},
		tiles: {
			walkable: function(name) {
				switch( name ) {
					case "t_grass1": case "t_grass1_shadow": case "t_grass1_shadow_btm":
						case "t_ground1": case "t_ground1_shadow": case "t_ground1_shadow_btm":
						case "t_stairs1_shadow": case "t_bridge1_hor": case "t_bridge1_ver": case "t_stairs2": return true; break;
					default: return false;
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