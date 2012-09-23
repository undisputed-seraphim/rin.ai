body.onload = function() {
	document.addEventListener( "rinLoaded", goAhead );
	$r.init( "canvas" );
}

function goAhead() {
	$r.scene.add( "obj", { name: "ultimecia", range: 33 } );
	//$r.scene.add( "obj", { name: "noire_mk2" } );
	//var p = new $r.$Primitive( "cube" );
	//$r.scene.add( p );
	$r.start();
}