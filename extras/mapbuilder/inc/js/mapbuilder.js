var tiles = [
	"grass", "dirt", "water", "shallow", "swamp", "forest", "sand", "empty"
];

function addTiles() {
	for( var tile in tiles ) {
		if( tiles[tile] == "empty" ) $("#tiles>ul").append('<li><div class="tile" alt="'+tiles[tile]+'"></div></li>');
		else $("#tiles>ul").append('<li><div class="tile" alt="'+tiles[tile]+'" style="background-image: url(../../inc/maps/default/tile/'+
			tiles[tile]+'.png);"></div></li>');
	}
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
	console.log(map);
}

$(document).ready(function(){
	console.log("begin");
	addTiles();
	$("#canvas").dragscrollable({ preventDefault: false });
	$("#output>input").click(function(){convert();});
	
	$(".tile").draggable({
		helper: "clone",
		zIndex: 100,
	});
	$(".tile_drop").droppable({
		accept: ".tile",
		drop: function(e,ui) {
			console.log( $(this), $(ui.helper) );
			$(this).empty().append($(ui.helper).clone().css({"position":"relative","display":"block","left":"","top":"","z-index":""}));
		}
	});
});