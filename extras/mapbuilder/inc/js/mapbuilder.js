var trackdrag = false; var originalX; var originalY;
var _tiles = [
	"grass_plain", "grass", "boulder_grass", "rock_grass", "mountain_grass", "town_grass", "town_grass2",
	"desert_plain", "desert", "boulder_desert", "mountain_desert", "town_desert",
	"mountain_path", "water", "shallow", "swamp", "forest", "sand",
	
	"t_wall1_front", "t_wall1_front_top", "t_wall1_top", "t_wall1_left", "t_wall1_right", "t_wall1_right_top", "t_wall1_left_top", "t_wall1_top_end",
	"t_wall1_top_left_cont", "t_wall1_top_right_cont", "t_wall1_front_left_cont", "t_wall1_front_right_cont", "t_wall1_window", "t_wall1_door",
	
	"t_floor1_desk1", "t_floor1_desk2", "t_floor1_endtable", "t_bed_btm", "t_bed_top", "t_floor1_appliance", "t_floor1_pot", "t_floor1_stove",
	"t_floor1_stool", "t_floor1_stove", "t_floor1_wood", "t_floor1",
	
	"t_grass1_shadow_btm", "t_grass1_shadow", "t_grass1_shrub", "t_grass1_tree_top", "t_grass1_tree_btm", "t_grass1",
	"t_wildgrass", "t_wildgrass_btm_right", "t_wildgrass_btm_left", "t_wildgrass_top_left", "t_wildgrass_top_right", "t_grass1_well",
	"t_ground1_pot", "t_ground1_shadow_btm", "t_ground1_shadow", "t_ground1_well", "t_ground1",
	
	"t_floor1_carpet_btm", "t_floor1_carpet_top", "t_floor1_carpet_left", "t_floor1_carpet_right",
	"t_floor1_carpet_right_top", "t_floor1_carpet_right_btm", "t_floor1_carpet_left_btm", "t_floor1_carpet_left_top", "t_floor1_carpet",
	
	"t_stairs1_shadow", "t_stairs2", "t_bridge1_hor", "t_bridge1_ver",
	"t_sign_weapon", "t_sign_item", "t_sign_armor", "t_sign_inn",
	"t_stone1_door1_o", "t_stone1_door1_c", "t_stone1_front", "t_stone1_top",
	"t_stone2_door1_o", "t_stone2_door1_c", "t_stone2_front", "t_stone2_top", "t_stone2_clock",
	"t_stone2_head", "t_stone2_swords",
	
	"t_stone3_armor", "t_stone3_weapon", "t_stone3_item", "t_stone3_inn", "t_stone3_front1", "t_stone3_front2", "t_stone3_left", "t_stone3_right",
	"t_stone3_roof_left_btm", "t_stone3_roof_right_btm", "t_stone3_roof_left_top", "t_stone3_roof_right_top",
	"t_stone3_roof_top_right", "t_stone3_roof_top_left", "t_stone3_roof_btm_left", "t_stone3_roof_btm_right",
	"t_stone3_roof_top", "t_stone3_roof", "t_stone3_top_left", "t_stone3_top_right", "t_stone3_top1", "t_stone3_top2", "t_stone3_door1_c",
	"empty",
];

function addTiles() {
	for( var tile in _tiles ) {
		if( _tiles[tile] == "empty" ) $("#tiles>ul").append('<li><div class="tile original" alt="'+_tiles[tile]+'"></div></li>');
		else $("#tiles>ul").append('<li><div class="tile original" alt="'+_tiles[tile]+'" style="background-image: url(../../inc/maps/default/tile/'+
			_tiles[tile]+'.png);"></div></li>');
	}
}

function clear() {
	$("#map").empty();
	$("textarea")[0].value = '';
	$("#map").append('<nobr><div class="tile_drop"></div><div class="tile_drop"></div><div class="tile_drop"></div></nobr><br />');
	$("#map").append('<nobr><div class="tile_drop"></div><div class="tile_drop"></div><div class="tile_drop"></div></nobr><br />');
	$("#map").append('<nobr><div class="tile_drop"></div><div class="tile_drop"></div><div class="tile_drop"></div></nobr><br />');
	initDropAndDrag();
}

function rebuild() {
	var map = {};
	var temp = $("textarea")[0].value.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\t/g, '').replace(/\"/g, '').split(",\n");
	for(var i in temp) {
		var current = temp[i].substring(0, temp[i].indexOf(":"));
		var tiles = temp[i].substring(temp[i].indexOf("[")+1, temp[i].indexOf("]")).split(", ");
		map[current] = tiles;
	}
	$("#map").empty();
	for(var j in map) {
		$("#map").append('<nobr></nobr><br/>');
		for(var k in map[j]) {
			if(map[j][k] == "empty") $($("#map").children("nobr")[j]).append('<div class="tile_drop"></div>');
			else $($("#map").children("nobr")[j]).append('<div class="tile_drop"><div class="tile" alt="'+map[j][k]+
				'" style="display: block; background-image: url(../../inc/maps/default/tile/'+map[j][k]+'.png);"></div></div>');
		}
	}
	initDropAndDrag();
}

function convert() {
	var map = {};
	$("#map").children("nobr").each(function(i){
		var row = [];
		$(this).children().each(function(j){
			if($(this).children("div").length) {
				row.push($(this).children("div").attr("alt"));
			} else row.push("empty");
		});
		map[i] = row;
	});
	$("textarea")[0].value = '';
	//$("textarea")[0].value += '_maps = {\n';
	//$("textarea")[0].value +='	world: {\n';
	//$("textarea")[0].value +='		map: {\n';
	for(var i in map) {
		$("textarea")[0].value +=''+i+': [';
		for(var j in map[i]) {
			if(j != 0) $("textarea")[0].value +=', ';
			$("textarea")[0].value +='"'+map[i][j]+'"';
		}
		$("textarea")[0].value +='],\n';
	}
	//$("textarea")[0].value +='		}\n';
	//$("textarea")[0].value +='	}\n';
	//$("textarea")[0].value +='}';
}

function initDropAndDrag() {
	$(".tile.original").draggable({
		helper: "clone",
		zIndex: 100,
		appendTo: "body",
		start: function(e,ui) { $(ui.helper).css("border","1px solid black"); }
	});
	$(".tile").not(".original").draggable({
		revert: "invalid",
		revertDuration: 0,
		zIndex: 100,
		start: function(e,ui) { $(ui.helper).css("border","1px solid black"); }
	});
	$(".tile_drop").droppable({
		accept: ".tile",
		drop: function(e,ui) { tileDrop( $(this), ui); }
	});
}

function tileDrop(tile, ui) {
		var right = false; var left = false; var bottom = false; var top = false;
		tile.empty().append($(ui.helper).clone().css({"position":"relative","display":"block","left":"",
			"border":"","top":"","z-index":""}).attr("class","tile"));
		if($(ui.draggable).attr("id") == "selected") { tile.children().css({"width":"+=2","height":"+=2"}); }
		else if( $(ui.helper).attr("id") == "selected") { tile.children().css({"width":"+=2","height":"+=2"}); tile.children().removeAttr("id"); }
		$(ui.helper).remove();
		if( tile.index() == tile.parent().children().length-1) right = true;
		if( tile.index() == 0 ) left = true;
		if( tile.parent().index() == 0 ) top = true;
		if( tile.parent().parent().children("nobr").index(tile.parent()) == tile.parent().parent().children("nobr").length-1) bottom = true;
		if(right) { tile.parent().parent().children("nobr").each(function(){$(this).append('<div class="tile_drop"></div>');}); }
		if(left) {
			tile.parent().parent().children("nobr").each(function(){$(this).prepend('<div class="tile_drop"></div>');});
			$("#map").css("left", "-="+(parseInt(tile.width())+1));
		}
		if(top) {
			tile.parent().parent().prepend('<nobr></nobr><br/>');
			for(var i = 0; i < tile.parent().children().length; i++){
				$(tile.parent().parent().children("nobr")[0]).append('<div class="tile_drop"></div>');
			}
			$("#map").css("top", "-="+(parseInt(tile.height())+1));
		}
		if(bottom) {
			tile.parent().parent().append('<nobr></nobr><br/>');
			for(var i = 0; i < tile.parent().children().length; i++){
				tile.parent().parent().children("nobr").last().append('<div class="tile_drop"></div>');
			}
		}
		initDropAndDrag();
		$("#outer_canvas").trigger("mousedown");
}

function trackDrag(e) {
	$("#select").css({width: Math.abs(parseInt(e.pageX-originalX)) + "px"});
	$("#select").css({height: Math.abs(parseInt(e.pageY-originalY)) + "px"});
	if(e.pageX < originalX) $("#select").css({left: e.pageX+"px"});
	else $("#select").css("left", originalX+"px");
	if(e.pageY < originalY) $("#select").css({top: e.pageY+"px"});
	else $("#select").css("top", originalY+"px");
}

$(document).ready(function(){
	$(document).disableSelection();
	addTiles();
	$("#outer_canvas").dragscrollable({ preventDefault: false, acceptPropagatedEvent: false });
	$("#convert").click(function(){convert();});
	$("#rebuild").click(function(){rebuild();});
	$("#clear").click(function(){clear();});
	$("#outer_canvas").scrollLeft( ($("#canvas").width() / 2) - ($("#outer_canvas").width() / 2) );
	$("#outer_canvas").scrollTop( ($("#canvas").height() / 2) - ($("#outer_canvas").height() / 2) );
	$("#map").css({position: "absolute", "left": parseInt($("#canvas").width() / 2)-parseInt($("#map").width()/2),
		"top": parseInt($("#canvas").height() / 2)-parseInt($("#map").height()/2) });
	initDropAndDrag();
	
	$(".tile_drop").dblclick(function(e) {
		if( $(e.target).hasClass("tile_drop")) {
			trackdrag = true;
			document.addEventListener("mousemove", trackDrag);
			$("body").append('<div id="select" style="border: 2px solid red; position: absolute; left: '+e.pageX+'px; top: '+e.pageY+'px;"></div>');
			originalX = e.pageX; originalY = e.pageY;
		}
	});
	$(document).on("mouseup", function() {
		if(trackdrag) {
			$("#select").remove(); trackdrag = false; document.removeEventListener("mousemove", trackDrag);
		}
	});
	$(document).on("click", ".tile_drop", function(e){
		if( $("#selected").length ) {
			if( !$(e.target).hasClass("tile_drop") ) e.target = e.target.parentNode;
			var temp = {};
			temp.helper = document.getElementById("selected").cloneNode();
			tileDrop( $(e.target), temp);
		}
	});
	$(".tile.original").dblclick(function(e) {
		if($(e.target).attr("id")=="selected") var stop = true;
		if($("#selected").length) {
			$("#selected").parent().css("border","");
			$("#selected").css({"border":"","width":"+=2","height":"+=2"}).removeAttr("id");
			if( stop ) return;
		}
		$(e.target).parent().css("border","1px solid red");
		$(e.target).css({"border":"1px solid red","width":"-=2","height":"-=2"}).attr("id","selected");
	});
	console.log(_tiles.length);
});