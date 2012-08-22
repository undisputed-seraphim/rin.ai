var _maps = {
	"baron inn": {
		tileSize: {width: 48, height: 48},
		battleStep: function(){ return 0; },
		map: {
0: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
1: ["empty", "empty", "empty", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "empty"],
2: ["empty", "empty", "empty", "t_stone2_top", "t_stone2_front", "empty", "t_stone2_front", "t_stone2_front", "t_stone2_clock", "t_stone2_front", "empty", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_top", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_top", "empty"],
3: ["empty", "empty", "empty", "t_stone2_top", "t_stone2_front", "t_stone2_counter_top_end", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_counter_top_end", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_bookcase_top_left", "t_bookcase_top_right", "t_stone2_top", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_top", "empty"],
4: ["empty", "empty", "empty", "t_stone2_top", "t_floor1_pot", "t_stone2_counter_top_ver", "t_stone2_counter_top_flower", "t_floor1", "t_floor1", "t_floor1", "t_stone2_counter_top_ver", "t_floor1", "t_floor1", "t_floor1_pot", "t_bookcase_btm_left", "t_bookcase_btm_right", "t_stone2_top", "i_chest1_c", "i_chest1_c", "t_floor1", "i_chest1_c", "t_stone2_top", "empty"],
5: ["empty", "empty", "empty", "t_stone2_top", "t_floor1_pot", "t_stone2_counter_top_btm_left", "t_stone2_counter_top_flower_btm", "t_stone2_counter_top_hor", "t_stone2_counter_top_hor", "t_stone2_counter_top_hor", "t_stone2_counter_top_btm_right", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1_stool", "t_stone2_top", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
6: ["empty", "empty", "empty", "t_stone2_top", "t_floor1", "t_stone2_counter_front_left", "t_stone2_counter_front_stool", "t_stone2_counter_front", "t_stone2_counter_front_stool", "t_stone2_counter_front_stool", "t_stone2_counter_front_right", "t_floor1", "t_floor1", "t_floor1", "t_floor1_stool", "t_floor1_stool_table2", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "empty"],
7: ["empty", "empty", "empty", "t_stone2_top", "t_floor1", "t_floor1_stool", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1_stool_table_btm", "t_stone2_front", "t_stone2_swords", "t_stone2_front", "t_stone2_secret_top_left", "t_stone2_secret_top_right", "t_stone2_top", "empty"],
8: ["empty", "empty", "empty", "t_stone2_top", "t_floor1_stool", "t_floor1_stool_table1", "t_floor1", "t_floor1_stool", "t_floor1_stool_table3", "t_floor1_stool", "t_floor1_stool", "t_floor1_stool_table1", "t_floor1_stool", "t_floor1", "t_floor1", "t_floor1", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_secret_btm_left", "t_stone2_secret_btm_right", "t_stone2_top", "empty"],
9: ["empty", "empty", "empty", "t_stone2_top", "t_floor1", "t_floor1_stool", "t_floor1", "t_floor1", "t_floor1_stool_table_btm", "t_floor1", "t_floor1", "t_floor1_stool_table_btm", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
10: ["empty", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
11: ["empty", "t_stone2_top", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_top", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
12: ["empty", "t_stone2_top", "t_stone2_front", "empty", "t_stone2_head", "empty", "t_stone2_front", "t_stone2_clock", "t_stone2_top", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_top", "empty", "t_stone2_front", "t_sign_inn", "t_stone2_front", "empty", "t_stone2_top", "t_stairs3", "t_stairs3", "t_stone2_top", "empty"],
13: ["empty", "t_stone2_top", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_top", "t_stone2_front", "t_bookcase_top_left", "t_bookcase_top_right", "t_stone2_top", "t_stone2_front", "t_stone2_counter_top_end", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_top", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
14: ["empty", "t_stone2_top", "t_bed_top", "t_floor1_carpet_top", "t_bed_top", "t_floor1_carpet_top", "t_bed_top", "t_floor1_endtable", "t_stone2_front", "t_floor1_pot", "t_bookcase_btm_left", "t_bookcase_btm_right", "t_stone2_front", "t_floor1", "t_stone2_counter_top_ver", "t_floor1", "t_floor1", "t_stone2_counter_top_flower", "t_stone2_front", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
15: ["empty", "t_stone2_top", "t_bed_btm", "t_floor1_carpet", "t_bed_btm", "t_floor1_carpet", "t_bed_btm", "t_floor1_carpet_right", "t_stone2_front", "t_floor1_pot", "t_floor1_pot", "t_floor1", "t_stone2_front", "t_floor1", "t_stone2_counter_top_btm_left", "t_stone2_counter_top_hor", "t_stone2_counter_top_hor", "t_stone2_counter_top_flower_btm", "t_stone2_front", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
16: ["empty", "t_stone2_top", "t_floor1_carpet_left", "t_floor1_carpet", "t_floor1_carpet", "t_floor1_carpet", "t_floor1_carpet", "t_floor1_carpet_right", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_stone2_counter_front_left", "t_stone2_counter_front", "t_stone2_counter_front", "t_stone2_counter_front", "t_stone2_poster", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
17: ["empty", "t_stone2_top", "t_bed_top", "t_floor1_carpet", "t_bed_top", "t_floor1_carpet", "t_bed_top", "t_floor1_carpet_right", "t_stone2_top", "t_floor1_wood", "t_floor1", "t_floor1", "t_stone2_top", "t_floor1_stool", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
18: ["empty", "t_stone2_top", "t_bed_btm", "t_floor1_carpet_btm", "t_bed_btm", "t_floor1_carpet_btm", "t_bed_btm", "t_floor1_carpet_right_btm", "t_stone2_top", "t_floor1_wood", "t_floor1_wood", "t_floor1_pot", "t_stone2_top", "t_floor1_stool_table2", "t_floor1_stool", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_floor1", "t_stone2_top", "empty"],
19: ["empty", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "t_stone2_top", "empty"],
20: ["empty", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "empty"],
21: ["empty", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "empty"],
22: ["empty", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_door1_c", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "t_stone2_front", "empty"],
23: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
		},
		tiles: {
			walkable: function(name) {
				switch( name ) {
					case "t_floor1": case "t_stairs3": case "t_stone2_counter_front": case "t_stone2_counter_front_stool": case "t_stone2_counter_front_right":
						case "t_stone2_counter_front_left": case "t_floor1_carpet_right_btm": case "t_floor1_carpet_right_top":
						case "t_floor1_carpet_left_top": case "t_floor1_carpet_right": case "t_floor1_carpet_left": case "t_floor1_carpet_top":
						case "t_floor1_carpet_btm": case "t_floor1_carpet": case "t_floor1_stool": case "t_floor1_stool_table_btm": return true; break;
					default: return false;
				}
			},
		},
		walkCheck: function(x, y) {
			return (x < 0 || y < 0 || x == undefined || y == undefined || this.map[y] == undefined) ? false : this.tiles.walkable(this.map[y][x]);
		},
		triggers: {
			enterBaron: function() {
				_rin.controls.disable(_rin.vars.state); _rin.vars.p.main.sprite("down_1");
				$("#html").animate({opacity:0}, 500, function(){ _rin.goto("world",{name:"baron",x:21,y:26}); });
			}
		},
		checkTriggers: function(x, y) {
			if(x == 15 && y == 18) this.triggers.enterBaron();
		}
	},
	baron: {
		name: "baron",
		tileSize: {width: 48, height: 48},
		battleStep: function() { return 0; },
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
					case "t_grass1": case "t_grass1_shadow": case "t_grass1_shadow_btm": case "t_stone3_door1_c":
						case "t_ground1": case "t_ground1_shadow": case "t_ground1_shadow_btm":
						case "t_stairs1_shadow": case "t_bridge1_hor": case "t_bridge1_ver": case "t_stairs2": return true; break;
					default: return false;
				}
			},
		},
		walkCheck: function(x, y) {
			return (x < 0 || y < 0 || x == undefined || y == undefined || this.map[y] == undefined) ? false : this.tiles.walkable(this.map[y][x]);
		},
		triggers: {
			enterBaronInn: function() {
				_rin.controls.disable(_rin.vars.state); _rin.vars.p.main.sprite("up");
				$("#html").animate({opacity:0}, 500, function(){ _rin.goto("world",{name:"baron inn",x:15,y:18}); });
			},
			exitBaron: function() {
				_rin.controls.disable(_rin.vars.state); _rin.vars.p.main.sprite("down");
				$("#html").animate({opacity:0}, 500, function(){ _rin.goto("world", {name:"world", x:8, y:6}); });
			}
		},
		checkTriggers: function(x, y) {
			if(x == 21 && y == 25) this.triggers.enterBaronInn();
			else if( (x == 17 || x == 16 || x == 18) && ( y >= 29 ) ) this.triggers.exitBaron()
		}
	},
	world: {
		name: "world",
		tileSize: {width: 48, height: 48},
		battleStep: function() { return Math.ceil(Math.max(parseInt((Math.random()*4).toString().substring(2,3)),2)*2.5); },
		movement: "grid",
		center: "character",
		map: {
			0: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
			1: ["empty", "w_grass1", "w_grass1", "w_forest1_bl", "w_forest1", "w_forest1", "w_forest1", "w_forest1_tr", "w_grass1", "w_grass1", "w_river_ver", "w_grass1", "w_coast1_br_diag", "w_coast1_btm", "w_coast1_btm", "w_coast1_tl_corner", "w_ocean1", "empty"],
			2: ["empty", "w_desert1_top", "w_desert1_tr_diag", "w_grass1", "w_forest1_bl", "w_forest1", "w_forest1", "w_forest1", "w_forest1_top", "w_forest1_tr", "w_river_bl", "w_river_hor", "w_river_outlet", "w_ocean1_rock", "w_ocean1_rock", "w_ocean1_rock", "w_ocean1", "empty"],
			3: ["empty", "w_desert1", "w_desert1_tr_corner", "w_desert1_top", "w_desert1_tr_diag", "w_forest1_bl", "w_forest1_btm", "w_forest1_btm", "w_forest1_btm", "w_forest1_br", "w_grass1", "w_grass1", "w_coast1_right_rock", "w_ocean1", "w_ocean1_rock", "w_ocean1_rock", "w_ocean1", "empty"],
			4: ["empty", "w_desert1", "w_desert1", "w_desert1", "w_desert1_tr_corner", "w_desert1_tr_diag", "w_grass1", "w_grass1", "w_castle1_tl", "w_castle1_tr", "w_grass1", "w_grass1", "w_coast1_right_rock", "w_ocean1_rock", "w_ocean1_rock", "w_ocean1", "w_ocean1", "empty"],
			5: ["empty", "w_desert1", "w_desert1", "w_desert1", "w_desert1", "w_desert1_right", "w_grass1", "w_town2", "w_castle1_bl", "w_castle1_br", "w_town1", "w_grass1", "w_coast1_right_rock", "w_ocean1_rock", "w_ocean1", "w_ocean1", "w_ocean1", "empty"],
			6: ["empty", "w_desert1", "w_desert1", "w_desert1", "w_desert1", "w_desert1_tr_corner", "w_desert1_tr_diag", "w_town1", "w_grass1", "w_grass1", "w_town2", "w_grass1", "w_coast1_tr_diag", "w_coast1_bl_corner", "w_ocean1", "w_ocean1", "w_ocean1", "empty"],
			7: ["empty", "w_desert1", "w_desert1", "w_desert1", "w_desert1", "w_desert1", "w_desert1_right", "w_grass1", "w_grass1", "w_grass1", "w_grass1", "w_grass1", "w_grass1", "w_coast1_tr_diag", "w_coast1_bl_corner", "w_ocean1", "w_ocean1", "empty"],
			8: ["empty", "w_desert1_bl_corner", "w_desert1_br_corner", "w_desert1_btm", "w_desert1_btm", "w_desert1_btm", "w_desert1_br_diag", "w_grass1", "w_grass1", "w_grass1", "w_forest1_tl", "w_forest1_top", "w_forest1_tr", "w_grass1", "w_coast1_right", "w_ocean1", "w_ocean1", "empty"],
			9: ["empty", "w_desert1_bl_diag", "w_desert1_br_diag", "w_mount1_tl", "w_mount1_top", "w_mount1_tr", "w_grass1", "w_grass1", "w_grass1", "w_forest1_tl", "w_forest1", "w_forest1", "w_forest1_right", "w_grass1", "w_coast1_right", "w_ocean1", "w_ocean1", "empty"],
			10: ["empty", "w_mount1_tr", "w_mount1_tl", "w_mount1", "w_mount1", "w_mount1_right", "w_grass1", "w_forest1_tl", "w_forest1_top", "w_forest1", "w_forest1", "w_forest1", "w_forest1_right", "w_grass1", "w_coast1_right", "w_ocean1", "w_ocean1", "empty"],
			11: ["empty", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1_tr", "w_forest1_bl", "w_forest1", "w_forest1", "w_forest1", "w_forest1", "w_forest1_br", "w_coast1_br_diag", "w_coast1_tl_corner", "w_ocean1", "w_coast1_br_corner", "empty"],
			12: ["empty", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1_tr", "w_forest1_bl", "w_forest1_btm", "w_forest1_btm", "w_forest1_br", "w_grass1", "w_coast1_tr_diag", "w_coast1_bl_corner", "w_coast1_br_corner", "w_coast1_tl_diag", "empty"],
			13: ["empty", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1_top", "w_mount1_top", "w_mount1_top", "w_mount1_tr", "w_grass1", "w_grass1", "w_coast1_tr_diag", "w_coast1_tl_diag", "w_grass2_tl_diag", "empty"],
			14: ["empty", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1", "w_mount1_tr", "w_grass1", "w_grass1", "w_grass2_tl_diag", "w_grass2_tl_corner", "empty"],
			15: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
		},
		tiles: {
			walkable: function(name) {
				switch( name ) {
					case "w_grass1": case "w_town1": case "w_town2": return true;
					default: return false; break;
				}
			},
			battle: function(name) {
				switch(name) {
					default: return "grass.png"; break;
				}
			},
			enemies: function(name) {
				switch(name) {
					default: return ["goblin"]; break;
				}
			}
		},
		walkCheck: function(x, y) {
			return (x < 0 || y < 0 || x == undefined || y == undefined || this.map[y] == undefined) ? false : this.tiles.walkable(this.map[y][x]);
		},
		triggers: {
			enterBaron: function() {
				_rin.controls.disable(_rin.vars.state);
				$("#html").animate({opacity:0}, 500, function(){ _rin.goto("world", {name:"baron", x:17, y:29}); });
			}
		},
		checkTriggers: function(x, y) {
			if(x == 7 && y == 6 || x == 7 && y == 5 || x == 10 && y == 6 || x == 10 && y == 5) this.triggers.enterBaron();
			else {
				_rin.vars.p.main.nextBattle--;
				if(_rin.vars.p.main.nextBattle == 0) _rin.goto("battle");
			}
		}
	}
}