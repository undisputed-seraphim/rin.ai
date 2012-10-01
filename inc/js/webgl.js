body.onload = function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
}

function goAhead() {
	/*$r.scene.add( "obj", { name: "ultimecia", range: 250, position: [-1,0,0], animation: "next",
		amap: { "idle": [1, 33], "hit1": [34, 52], "hit2": [53, 75],
		"attack1": [76, 128], "attack2": [129, 169], "next": [170, 250] } } );*/
	$r.scene.add( "dae", { name: "neptune_mk2", type: "character", position: [0, 0.5, 0] } );
	//$r.scene.add( "dae", { name: "purpleheart_v", type: "character", position: [0, 0.5, 0] } );
	//$r.scene.add( "obj", { name: "purplesister_mk2", type: "character" } );
	//$r.scene.add( "dae", { name: "noire_v", type: "character", position: [2,0.5,0] } );
	$r.scene.add( "dae", { name: "neptune_v", type: "character", position: [2,0.5,0] } );
	//var p = new $r.$Primitive( "cube" );
	//$r.scene.add( p );
	$r.start();
}